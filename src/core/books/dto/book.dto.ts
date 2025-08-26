import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsInt, 
  Min, 
  Max, 
  IsUrl, 
  IsBoolean,
  IsNumber,
  IsEnum,
  Length,
  IsUUID,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({
    description: 'Book title',
    example: 'The Great Gatsby',
    maxLength: 500,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Length(1, 500, { message: 'Title must be between 1 and 500 characters' })
  title: string;

  @ApiProperty({
    description: 'Book author',
    example: 'F. Scott Fitzgerald',
    maxLength: 255,
  })
  @IsString({ message: 'Author must be a string' })
  @IsNotEmpty({ message: 'Author is required' })
  @Length(1, 255, { message: 'Author must be between 1 and 255 characters' })
  author: string;

  @ApiPropertyOptional({
    description: 'ISBN number',
    example: '978-0-7432-7356-5',
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'ISBN must be a string' })
  @Length(1, 20, { message: 'ISBN must be between 1 and 20 characters' })
  isbn?: string;

  @ApiPropertyOptional({
    description: 'Book description',
    example: 'A classic American novel set in the Jazz Age',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Book genre',
    example: 'Fiction',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Genre must be a string' })
  @Length(1, 100, { message: 'Genre must be between 1 and 100 characters' })
  genre?: string;

  @ApiPropertyOptional({
    description: 'Publication year',
    example: 1925,
    minimum: 1000,
    maximum: 2024,
  })
  @IsOptional()
  @IsInt({ message: 'Published year must be an integer' })
  @Min(1000, { message: 'Published year must be at least 1000' })
  @Max(2024, { message: 'Published year cannot be in the future' })
  publishedYear?: number;

  @ApiPropertyOptional({
    description: 'Publisher name',
    example: 'Scribner',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Publisher must be a string' })
  @Length(1, 255, { message: 'Publisher must be between 1 and 255 characters' })
  publisher?: string;

  @ApiPropertyOptional({
    description: 'Total number of copies',
    example: 5,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Total copies must be an integer' })
  @Min(1, { message: 'Total copies must be at least 1' })
  totalCopies?: number;

  @ApiPropertyOptional({
    description: 'Book cover image URL',
    example: 'https://example.com/cover.jpg',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Cover image URL must be a valid URL' })
  @Length(1, 500, { message: 'Cover image URL must be between 1 and 500 characters' })
  coverImageUrl?: string;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiPropertyOptional({
    description: 'Whether the book is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

export class BorrowBookDto {
  @ApiPropertyOptional({
    description: 'Notes for borrowing',
    example: 'Needed for research project',
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}

export class BookQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for title, author, or ISBN',
    example: 'gatsby',
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'title',
    enum: ['title', 'author', 'publishedYear', 'createdAt'],
  })
  @IsOptional()
  @IsString({ message: 'Sort by must be a string' })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class ExternalBookSearchDto {
  @ApiProperty({
    description: 'Search query for external book API',
    example: 'The Great Gatsby',
  })
  @IsString({ message: 'Query must be a string' })
  @IsNotEmpty({ message: 'Query is required' })
  @Length(2, 100, { message: 'Query must be between 2 and 100 characters' })
  q: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    example: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(50, { message: 'Limit cannot exceed 50' })
  limit?: number = 10;
}
