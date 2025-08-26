export const BOOK_CONSTANTS = {
  // Success messages
  BOOK_CREATED: 'Book added successfully',
  BOOK_UPDATED: 'Book updated successfully',
  BOOK_DELETED: 'Book deleted successfully',
  BOOK_BORROWED: 'Book borrowed successfully',
  BOOK_RETURNED: 'Book returned successfully',
  BOOKS_RETRIEVED: 'Books retrieved successfully',
  BORROWED_BOOKS_RETRIEVED: 'Borrowed books retrieved successfully',
  
  // Error messages
  BOOK_NOT_FOUND: 'Book not found',
  BOOK_NOT_AVAILABLE: 'Book is not available for borrowing',
  BOOK_ALREADY_BORROWED: 'You have already borrowed this book',
  ISBN_ALREADY_EXISTS: 'Book with this ISBN already exists',
  INSUFFICIENT_COPIES: 'Not enough copies available',
  BORROW_RECORD_NOT_FOUND: 'Borrow record not found',
  BOOK_NOT_BORROWED_BY_USER: 'This book is not borrowed by the current user',
  BOOK_ALREADY_RETURNED: 'This book has already been returned',
  
  // Default values
  DEFAULT_BORROW_DURATION_DAYS: 14,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_TOTAL_COPIES: 1,
  
  // Search
  MIN_SEARCH_LENGTH: 2,
};
