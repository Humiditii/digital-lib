import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { 
  CreateBookDto, 
  UpdateBookDto, 
  BorrowBookDto, 
  BookQueryDto, 
  ExternalBookSearchDto 
} from './dto/book.dto';
import { BOOK_CONSTANTS } from '../../common/constants/book.constants';
import { AUTH_CONSTANTS } from '../../common/constants/auth.constants';

export function SwaggerCreateBook() {
  return applyDecorators(
    ApiTags('Books'),
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create a new book (Admin only)',
      description: 'Add a new book to the library catalog. Only administrators can perform this action.',
    }),
    ApiBody({
      type: CreateBookDto,
      description: 'Book details to create',
    }),
    ApiResponse({
      status: 201,
      description: BOOK_CONSTANTS.BOOK_CREATED,
      schema: {
        example: {
          success: true,
          message: BOOK_CONSTANTS.BOOK_CREATED,
          statusCode: 201,
          data: {
            id: 'uuid-string',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            isbn: '978-0-7432-7356-5',
            description: 'A classic American novel',
            genre: 'Fiction',
            publishedYear: 1925,
            publisher: 'Scribner',
            totalCopies: 5,
            availableCopies: 5,
            coverImageUrl: 'https://example.com/cover.jpg',
            isActive: true,
            isAvailable: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiBadRequestResponse({ description: AUTH_CONSTANTS.BAD_REQUEST }),
    ApiUnauthorizedResponse({ description: AUTH_CONSTANTS.UNAUTHORIZED }),
    ApiForbiddenResponse({ description: AUTH_CONSTANTS.FORBIDDEN }),
    ApiConflictResponse({ description: BOOK_CONSTANTS.ISBN_ALREADY_EXISTS }),
  );
}

export function SwaggerGetAllBooks() {
  return applyDecorators(
    ApiTags('Books'),
    ApiOperation({
      summary: 'Get all books with pagination and search',
      description: 'Retrieve a paginated list of books with optional search functionality.',
    }),
    ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' }),
    ApiQuery({ name: 'search', required: false, description: 'Search books by title or author' }),
    ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by (default: createdAt)' }),
    ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order: ASC or DESC (default: DESC)' }),
    ApiResponse({
      status: 200,
      description: BOOK_CONSTANTS.BOOKS_RETRIEVED,
      schema: {
        example: {
          success: true,
          message: BOOK_CONSTANTS.BOOKS_RETRIEVED,
          statusCode: 200,
          data: {
            data: [
              {
                id: 'uuid-string',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '978-0-7432-7356-5',
                description: 'A classic American novel',
                genre: 'Fiction',
                publishedYear: 1925,
                publisher: 'Scribner',
                totalCopies: 5,
                availableCopies: 3,
                coverImageUrl: 'https://example.com/cover.jpg',
                isActive: true,
                isAvailable: true,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
              }
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
          },
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiBadRequestResponse({ description: AUTH_CONSTANTS.BAD_REQUEST }),
  );
}

export function SwaggerGetBookById() {
  return applyDecorators(
    ApiTags('Books'),
    ApiOperation({
      summary: 'Get book by ID',
      description: 'Retrieve a specific book by its unique identifier.',
    }),
    ApiParam({ name: 'id', description: 'Book UUID' }),
    ApiResponse({
      status: 200,
      description: BOOK_CONSTANTS.BOOKS_RETRIEVED,
      schema: {
        example: {
          success: true,
          message: BOOK_CONSTANTS.BOOKS_RETRIEVED,
          statusCode: 200,
          data: {
            id: 'uuid-string',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            isbn: '978-0-7432-7356-5',
            description: 'A classic American novel',
            genre: 'Fiction',
            publishedYear: 1925,
            publisher: 'Scribner',
            totalCopies: 5,
            availableCopies: 3,
            coverImageUrl: 'https://example.com/cover.jpg',
            isActive: true,
            isAvailable: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiBadRequestResponse({ description: 'Invalid UUID format' }),
    ApiNotFoundResponse({ description: BOOK_CONSTANTS.BOOK_NOT_FOUND }),
  );
}

export function SwaggerUpdateBook() {
  return applyDecorators(
    ApiTags('Books'),
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update book (Admin only)',
      description: 'Update book information. Only administrators can perform this action.',
    }),
    ApiParam({ name: 'id', description: 'Book UUID' }),
    ApiBody({
      type: UpdateBookDto,
      description: 'Book fields to update',
    }),
    ApiResponse({
      status: 200,
      description: BOOK_CONSTANTS.BOOK_UPDATED,
    }),
    ApiBadRequestResponse({ description: AUTH_CONSTANTS.BAD_REQUEST }),
    ApiUnauthorizedResponse({ description: AUTH_CONSTANTS.UNAUTHORIZED }),
    ApiForbiddenResponse({ description: AUTH_CONSTANTS.FORBIDDEN }),
    ApiNotFoundResponse({ description: BOOK_CONSTANTS.BOOK_NOT_FOUND }),
    ApiConflictResponse({ description: BOOK_CONSTANTS.ISBN_ALREADY_EXISTS }),
  );
}

export function SwaggerDeleteBook() {
  return applyDecorators(
    ApiTags('Books'),
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Delete book (Admin only)',
      description: 'Soft delete a book from the catalog. Only administrators can perform this action.',
    }),
    ApiParam({ name: 'id', description: 'Book UUID' }),
    ApiResponse({
      status: 200,
      description: BOOK_CONSTANTS.BOOK_DELETED,
    }),
    ApiBadRequestResponse({ description: 'Invalid UUID format' }),
    ApiUnauthorizedResponse({ description: AUTH_CONSTANTS.UNAUTHORIZED }),
    ApiForbiddenResponse({ description: AUTH_CONSTANTS.FORBIDDEN }),
    ApiNotFoundResponse({ description: BOOK_CONSTANTS.BOOK_NOT_FOUND }),
  );
}

export function SwaggerBorrowBook() {
  return applyDecorators(
    ApiTags('Books'),
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Borrow a book',
      description: 'Borrow a book from the library. Authenticated users only.',
    }),
    ApiParam({ name: 'id', description: 'Book UUID to borrow' }),
    ApiBody({
      type: BorrowBookDto,
      description: 'Borrow details (optional notes)',
    }),
    ApiResponse({
      status: 201,
      description: BOOK_CONSTANTS.BOOK_BORROWED,
      schema: {
        example: {
          success: true,
          message: BOOK_CONSTANTS.BOOK_BORROWED,
          statusCode: 201,
          data: {
            id: 'borrow-record-uuid',
            book: {
              id: 'book-uuid',
              title: 'The Great Gatsby',
              author: 'F. Scott Fitzgerald'
            },
            borrowedAt: '2024-01-01T00:00:00.000Z',
            dueDate: '2024-01-15T00:00:00.000Z',
            returnedAt: null,
            status: 'borrowed',
            notes: 'Needed for research project',
            isOverdue: false,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiBadRequestResponse({ 
      description: BOOK_CONSTANTS.BOOK_NOT_AVAILABLE,
    }),
    ApiUnauthorizedResponse({ description: AUTH_CONSTANTS.UNAUTHORIZED }),
    ApiNotFoundResponse({ description: BOOK_CONSTANTS.BOOK_NOT_FOUND }),
    ApiConflictResponse({ description: BOOK_CONSTANTS.BOOK_ALREADY_BORROWED }),
  );
}

export function SwaggerGetBorrowedBooks() {
  return applyDecorators(
    ApiTags('User Books'),
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get user borrowed books',
      description: 'Retrieve all books currently borrowed by the authenticated user.',
    }),
    ApiResponse({
      status: 200,
      description: BOOK_CONSTANTS.BORROWED_BOOKS_RETRIEVED,
      schema: {
        example: {
          success: true,
          message: BOOK_CONSTANTS.BORROWED_BOOKS_RETRIEVED,
          statusCode: 200,
          data: [
            {
              id: 'borrow-record-uuid',
              book: {
                id: 'book-uuid',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '978-0-7432-7356-5',
                coverImageUrl: 'https://example.com/cover.jpg'
              },
              borrowedAt: '2024-01-01T00:00:00.000Z',
              dueDate: '2024-01-15T00:00:00.000Z',
              returnedAt: null,
              status: 'borrowed',
              notes: 'Needed for research project',
              isOverdue: false,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            }
          ],
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiUnauthorizedResponse({ description: AUTH_CONSTANTS.UNAUTHORIZED }),
  );
}

export function SwaggerSearchExternalBooks() {
  return applyDecorators(
    ApiTags('Books'),
    ApiOperation({
      summary: 'Search external book database',
      description: 'Search for books using the OpenLibrary API to find books not in our catalog.',
    }),
    ApiQuery({ name: 'q', description: 'Search query for books' }),
    ApiQuery({ name: 'limit', required: false, description: 'Maximum results to return (default: 10, max: 50)' }),
    ApiResponse({
      status: 200,
      description: 'External books retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'External books retrieved successfully',
          statusCode: 200,
          data: {
            books: [
              {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '978-0-7432-7356-5',
                publishedYear: 1925,
                publisher: 'Scribner',
                coverImageUrl: 'https://covers.openlibrary.org/b/id/123456-L.jpg',
                externalId: '/works/OL123456W'
              }
            ],
            total: 1,
            query: 'Great Gatsby'
          },
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiBadRequestResponse({ description: 'Invalid search parameters or external service unavailable' }),
  );
}
