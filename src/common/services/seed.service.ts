import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../../core/users/schema/user.entity';
import { Book } from '../../core/books/schema/book.entity';
import { UserRole } from '../../core/users/interface/user.interface';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedInitialData();
  }

  private async seedInitialData() {
    try {
      await this.createAdminUser();
      await this.createSampleBooks();
      this.logger.log('Initial data seeding completed successfully');
    } catch (error) {
      this.logger.error('Failed to seed initial data:', error);
    }
  }

  private async createAdminUser() {
    const adminEmail = this.configService.get('ADMIN_EMAIL', 'admin@library.com');
    const adminPassword = this.configService.get('ADMIN_PASSWORD', 'admin123');

    const existingAdmin = await this.usersRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      const admin = this.usersRepository.create({
        email: adminEmail,
        firstName: 'System',
        lastName: 'Administrator',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.usersRepository.save(admin);
      this.logger.log(`Admin user created with email: ${adminEmail}`);
    } else {
      this.logger.log('Admin user already exists');
    }
  }

  private async createSampleBooks() {
    const existingBooks = await this.booksRepository.count();
    
    if (existingBooks === 0) {
      const sampleBooks = [
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          isbn: '978-0-7432-7356-5',
          description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, idealism, and moral decay.',
          genre: 'Fiction',
          publishedYear: 1925,
          publisher: 'Scribner',
          totalCopies: 3,
          availableCopies: 3,
        },
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          isbn: '978-0-06-112008-4',
          description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
          genre: 'Fiction',
          publishedYear: 1960,
          publisher: 'J.B. Lippincott & Co.',
          totalCopies: 2,
          availableCopies: 2,
        },
        {
          title: '1984',
          author: 'George Orwell',
          isbn: '978-0-452-28423-4',
          description: 'A dystopian social science fiction novel about totalitarian control and surveillance.',
          genre: 'Science Fiction',
          publishedYear: 1949,
          publisher: 'Secker & Warburg',
          totalCopies: 4,
          availableCopies: 4,
        },
        {
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          isbn: '978-0-14-143951-8',
          description: 'A romantic novel that critiques the British class system of the 19th century.',
          genre: 'Romance',
          publishedYear: 1813,
          publisher: 'T. Egerton',
          totalCopies: 2,
          availableCopies: 2,
        },
        {
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          isbn: '978-0-316-76948-0',
          description: 'A coming-of-age story about teenage rebellion and angst.',
          genre: 'Fiction',
          publishedYear: 1951,
          publisher: 'Little, Brown and Company',
          totalCopies: 3,
          availableCopies: 3,
        },
        {
          title: 'JavaScript: The Definitive Guide',
          author: 'David Flanagan',
          isbn: '978-1-491-95202-3',
          description: 'A comprehensive guide to JavaScript programming language.',
          genre: 'Technology',
          publishedYear: 2020,
          publisher: "O'Reilly Media",
          totalCopies: 5,
          availableCopies: 5,
        },
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          isbn: '978-0-13-235088-4',
          description: 'A handbook of agile software craftsmanship.',
          genre: 'Technology',
          publishedYear: 2008,
          publisher: 'Prentice Hall',
          totalCopies: 4,
          availableCopies: 4,
        },
        {
          title: 'The Art of War',
          author: 'Sun Tzu',
          isbn: '978-1-59030-963-7',
          description: 'An ancient Chinese military treatise on strategy and tactics.',
          genre: 'Philosophy',
          publishedYear: -500,
          publisher: 'Various',
          totalCopies: 2,
          availableCopies: 2,
        }
      ];

      for (const bookData of sampleBooks) {
        const book = this.booksRepository.create(bookData);
        await this.booksRepository.save(book);
      }

      this.logger.log(`Created ${sampleBooks.length} sample books`);
    } else {
      this.logger.log('Sample books already exist');
    }
  }
}
