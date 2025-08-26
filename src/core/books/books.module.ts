import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BooksService } from './books.service';
import { BooksController, UserBooksController } from './books.controller';
import { Book } from './schema/book.entity';
import { BorrowedBook } from './schema/borrowed-book.entity';
import { User } from '../users/schema/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, BorrowedBook, User]),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [BooksController, UserBooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
