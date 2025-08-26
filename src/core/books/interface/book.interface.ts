export enum BorrowStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
  OVERDUE = 'overdue'
}

export interface BookResponse {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  genre?: string;
  publishedYear?: number;
  publisher?: string;
  totalCopies: number;
  availableCopies: number;
  coverImageUrl?: string;
  isActive: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  genre?: string;
  publishedYear?: number;
  publisher?: string;
  totalCopies?: number;
  coverImageUrl?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  description?: string;
  genre?: string;
  publishedYear?: number;
  publisher?: string;
  totalCopies?: number;
  coverImageUrl?: string;
  isActive?: boolean;
}

export interface BorrowBookRequest {
  notes?: string;
}

export interface BorrowedBookResponse {
  id: string;
  book: BookResponse;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt?: Date;
  status: BorrowStatus;
  notes?: string;
  isOverdue: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OpenLibrarySearchResult {
  title: string;
  author_name?: string[];
  isbn?: string[];
  first_publish_year?: number;
  publisher?: string[];
  cover_i?: number;
  key?: string;
}

export interface ExternalBookSearchResponse {
  docs: OpenLibrarySearchResult[];
  numFound: number;
  start: number;
}
