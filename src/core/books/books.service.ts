import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Book } from './schema/book.entity';
import { BorrowedBook } from './schema/borrowed-book.entity';
import { User } from '../users/schema/user.entity';
import { 
  CreateBookDto, 
  UpdateBookDto, 
  BorrowBookDto, 
  BookQueryDto, 
  ExternalBookSearchDto 
} from './dto/book.dto';
import { 
  BookResponse, 
  BorrowedBookResponse, 
  PaginatedResponse, 
  BorrowStatus 
} from './interface/book.interface';
import { BOOK_CONSTANTS } from '../../common/constants/book.constants';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(BorrowedBook)
    private borrowedBooksRepository: Repository<BorrowedBook>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<BookResponse> {
    const { isbn, totalCopies = BOOK_CONSTANTS.DEFAULT_TOTAL_COPIES, ...bookData } = createBookDto;

    // Check if book with same ISBN already exists
    if (isbn) {
      const existingBook = await this.booksRepository.findOne({ where: { isbn } });
      if (existingBook) {
        throw new ConflictException(BOOK_CONSTANTS.ISBN_ALREADY_EXISTS);
      }
    }

    const book = this.booksRepository.create({
      ...bookData,
      isbn,
      totalCopies,
      availableCopies: totalCopies,
    });

    const savedBook = await this.booksRepository.save(book);
    this.logger.log(`New book created: ${savedBook.title} by ${savedBook.author}`);

    return this.mapToBookResponse(savedBook);
  }

  async findAllBooks(query: BookQueryDto): Promise<PaginatedResponse<BookResponse>> {
    const { 
      page = 1, 
      limit = BOOK_CONSTANTS.DEFAULT_PAGE_SIZE, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC' 
    } = query;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, BOOK_CONSTANTS.MAX_PAGE_SIZE);

    // Build where clause
    const where: FindOptionsWhere<Book> = { isActive: true };
    
    if (search && search.length >= BOOK_CONSTANTS.MIN_SEARCH_LENGTH) {
      where.title = ILike(`%${search}%`);
    }

    const [books, total] = await this.booksRepository.findAndCount({
      where,
      skip,
      take,
      order: { [sortBy]: sortOrder },
    });

    // If no results with title search, try author search
    if (books.length === 0 && search) {
      const [authorBooks, authorTotal] = await this.booksRepository.findAndCount({
        where: { ...where, author: ILike(`%${search}%`) },
        skip,
        take,
        order: { [sortBy]: sortOrder },
      });
      
      return {
        data: authorBooks.map(book => this.mapToBookResponse(book)),
        total: authorTotal,
        page,
        limit: take,
        totalPages: Math.ceil(authorTotal / take),
      };
    }

    return {
      data: books.map(book => this.mapToBookResponse(book)),
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findBookById(id: string): Promise<BookResponse> {
    const book = await this.booksRepository.findOne({ 
      where: { id, isActive: true } 
    });

    if (!book) {
      throw new NotFoundException(BOOK_CONSTANTS.BOOK_NOT_FOUND);
    }

    return this.mapToBookResponse(book);
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<BookResponse> {
    const book = await this.booksRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(BOOK_CONSTANTS.BOOK_NOT_FOUND);
    }

    // Check ISBN uniqueness if updating
    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingBook = await this.booksRepository.findOne({ 
        where: { isbn: updateBookDto.isbn } 
      });
      if (existingBook) {
        throw new ConflictException(BOOK_CONSTANTS.ISBN_ALREADY_EXISTS);
      }
    }

    // Update available copies if total copies changed
    if (updateBookDto.totalCopies && updateBookDto.totalCopies !== book.totalCopies) {
      const borrowedCount = book.totalCopies - book.availableCopies;
      const newAvailableCopies = updateBookDto.totalCopies - borrowedCount;
      
      if (newAvailableCopies < 0) {
        throw new BadRequestException(BOOK_CONSTANTS.INSUFFICIENT_COPIES);
      }
      
      updateBookDto['availableCopies'] = newAvailableCopies;
    }

    Object.assign(book, updateBookDto);
    const updatedBook = await this.booksRepository.save(book);

    this.logger.log(`Book updated: ${updatedBook.title}`);
    return this.mapToBookResponse(updatedBook);
  }

  async deleteBook(id: string): Promise<void> {
    const book = await this.booksRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(BOOK_CONSTANTS.BOOK_NOT_FOUND);
    }

    // Soft delete by setting isActive to false
    book.isActive = false;
    await this.booksRepository.save(book);

    this.logger.log(`Book soft deleted: ${book.title}`);
  }

  async borrowBook(bookId: string, userId: string, borrowBookDto: BorrowBookDto): Promise<BorrowedBookResponse> {
    const book = await this.booksRepository.findOne({ 
      where: { id: bookId, isActive: true } 
    });

    if (!book) {
      throw new NotFoundException(BOOK_CONSTANTS.BOOK_NOT_FOUND);
    }

    if (!book.isAvailable) {
      throw new BadRequestException(BOOK_CONSTANTS.BOOK_NOT_AVAILABLE);
    }

    // Check if user already borrowed this book and hasn't returned it
    const existingBorrow = await this.borrowedBooksRepository.findOne({
      where: { 
        bookId, 
        userId, 
        status: BorrowStatus.BORROWED 
      },
    });

    if (existingBorrow) {
      throw new ConflictException(BOOK_CONSTANTS.BOOK_ALREADY_BORROWED);
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + BOOK_CONSTANTS.DEFAULT_BORROW_DURATION_DAYS);

    // Create borrow record
    const borrowRecord = this.borrowedBooksRepository.create({
      bookId,
      userId,
      borrowedAt: new Date(),
      dueDate,
      notes: borrowBookDto.notes,
    });

    // Update book available copies
    book.availableCopies -= 1;

    // Save both records in a transaction would be better, but for simplicity:
    await this.booksRepository.save(book);
    const savedBorrowRecord = await this.borrowedBooksRepository.save(borrowRecord);

    this.logger.log(`Book borrowed: ${book.title} by user ${userId}`);

    return this.mapToBorrowedBookResponse(savedBorrowRecord, book);
  }

  async getBorrowedBooks(userId: string): Promise<BorrowedBookResponse[]> {
    const borrowedBooks = await this.borrowedBooksRepository.find({
      where: { userId, status: BorrowStatus.BORROWED },
      relations: ['book'],
      order: { borrowedAt: 'DESC' },
    });

    return borrowedBooks.map(borrowRecord => 
      this.mapToBorrowedBookResponse(borrowRecord, borrowRecord.book)
    );
  }

  async returnBook(borrowId: string, userId: string): Promise<BorrowedBookResponse> {
    const borrowRecord = await this.borrowedBooksRepository.findOne({
      where: { id: borrowId, userId },
      relations: ['book'],
    });

    if (!borrowRecord) {
      throw new NotFoundException(BOOK_CONSTANTS.BORROW_RECORD_NOT_FOUND);
    }

    if (borrowRecord.status === BorrowStatus.RETURNED) {
      throw new BadRequestException(BOOK_CONSTANTS.BOOK_ALREADY_RETURNED);
    }

    // Update borrow record
    borrowRecord.status = BorrowStatus.RETURNED;
    borrowRecord.returnedAt = new Date();

    // Update book available copies
    const book = borrowRecord.book;
    book.availableCopies += 1;

    await this.booksRepository.save(book);
    const updatedBorrowRecord = await this.borrowedBooksRepository.save(borrowRecord);

    this.logger.log(`Book returned: ${book.title} by user ${userId}`);

    return this.mapToBorrowedBookResponse(updatedBorrowRecord, book);
  }

  async searchExternalBooks(searchDto: ExternalBookSearchDto): Promise<any> {
    const { q, limit = 10 } = searchDto;
    const baseUrl = this.configService.get('OPENLIBRARY_API_BASE_URL');
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/search.json`, {
          params: {
            q,
            limit,
            fields: 'title,author_name,isbn,first_publish_year,publisher,cover_i,key',
          },
        })
      );

      const books = response.data.docs.map((book: any) => ({
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        isbn: book.isbn?.[0],
        publishedYear: book.first_publish_year,
        publisher: book.publisher?.[0],
        coverImageUrl: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` 
          : null,
        externalId: book.key,
      }));

      return {
        books,
        total: response.data.numFound,
        query: q,
      };
    } catch (error) {
      this.logger.error(`External book search failed: ${error.message}`);
      throw new BadRequestException('External book search service unavailable');
    }
  }

  private mapToBookResponse(book: Book): BookResponse {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description,
      genre: book.genre,
      publishedYear: book.publishedYear,
      publisher: book.publisher,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      coverImageUrl: book.coverImageUrl,
      isActive: book.isActive,
      isAvailable: book.isAvailable,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };
  }

  private mapToBorrowedBookResponse(borrowRecord: BorrowedBook, book: Book): BorrowedBookResponse {
    return {
      id: borrowRecord.id,
      book: this.mapToBookResponse(book),
      borrowedAt: borrowRecord.borrowedAt,
      dueDate: borrowRecord.dueDate,
      returnedAt: borrowRecord.returnedAt,
      status: borrowRecord.status,
      notes: borrowRecord.notes,
      isOverdue: borrowRecord.isOverdue,
      createdAt: borrowRecord.createdAt,
      updatedAt: borrowRecord.updatedAt,
    };
  }
}
