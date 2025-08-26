import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { BooksService } from './books.service';
import { 
  CreateBookDto, 
  UpdateBookDto, 
  BorrowBookDto, 
  BookQueryDto, 
  ExternalBookSearchDto 
} from './dto/book.dto';
import { AppResponse } from '../../common/util/app-response.parser';
import { Roles } from '../../common/guard/decorator/roles.decorator';
import { Public } from '../../common/guard/decorator/public.decorator';
import { UserRole } from '../users/interface/user.interface';
import { BOOK_CONSTANTS } from '../../common/constants/book.constants';
import {
  SwaggerCreateBook,
  SwaggerGetAllBooks,
  SwaggerGetBookById,
  SwaggerUpdateBook,
  SwaggerDeleteBook,
  SwaggerBorrowBook,
  SwaggerGetBorrowedBooks,
  SwaggerSearchExternalBooks,
} from './books.swagger';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Roles(UserRole.ADMIN)
  @SwaggerCreateBook()
  @Post()
  async createBook(
    @Res() res: Response,
    @Body() createBookDto: CreateBookDto,
  ): Promise<Response> {
    const data = await this.booksService.createBook(createBookDto);

    return res
      .status(HttpStatus.CREATED)
      .json(AppResponse.success(BOOK_CONSTANTS.BOOK_CREATED, HttpStatus.CREATED, data));
  }

  @Public()
  @SwaggerGetAllBooks()
  @Get()
  async findAllBooks(
    @Res() res: Response,
    @Query() query: BookQueryDto,
  ): Promise<Response> {
    const data = await this.booksService.findAllBooks(query);

    return res
      .status(HttpStatus.OK)
      .json(AppResponse.success(BOOK_CONSTANTS.BOOKS_RETRIEVED, HttpStatus.OK, data));
  }

  @Public()
  @SwaggerSearchExternalBooks()
  @Get('search')
  async searchExternalBooks(
    @Res() res: Response,
    @Query() searchDto: ExternalBookSearchDto,
  ): Promise<Response> {
    const data = await this.booksService.searchExternalBooks(searchDto);

    return res
      .status(HttpStatus.OK)
      .json(AppResponse.success('External books retrieved successfully', HttpStatus.OK, data));
  }

  @Public()
  @SwaggerGetBookById()
  @Get(':id')
  async findBookById(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Response> {
    const data = await this.booksService.findBookById(id);

    return res
      .status(HttpStatus.OK)
      .json(AppResponse.success(BOOK_CONSTANTS.BOOKS_RETRIEVED, HttpStatus.OK, data));
  }

  @Roles(UserRole.ADMIN)
  @SwaggerUpdateBook()
  @Put(':id')
  async updateBook(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Response> {
    const data = await this.booksService.updateBook(id, updateBookDto);

    return res
      .status(HttpStatus.OK)
      .json(AppResponse.success(BOOK_CONSTANTS.BOOK_UPDATED, HttpStatus.OK, data));
  }

  @Roles(UserRole.ADMIN)
  @SwaggerDeleteBook()
  @Delete(':id')
  async deleteBook(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Response> {
    await this.booksService.deleteBook(id);

    return res
      .status(HttpStatus.OK)
      .json(AppResponse.success(BOOK_CONSTANTS.BOOK_DELETED, HttpStatus.OK));
  }

  @SwaggerBorrowBook()
  @Post(':id/borrow')
  async borrowBook(
    @Res() res: Response,
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() borrowBookDto: BorrowBookDto,
  ): Promise<Response> {
    const data = await this.booksService.borrowBook(id, req.user.sub, borrowBookDto);

    return res
      .status(HttpStatus.CREATED)
      .json(AppResponse.success(BOOK_CONSTANTS.BOOK_BORROWED, HttpStatus.CREATED, data));
  }
}

@Controller('me')
export class UserBooksController {
  constructor(private readonly booksService: BooksService) {}

  @SwaggerGetBorrowedBooks()
  @Get('borrowed-books')
  async getBorrowedBooks(
    @Res() res: Response,
    @Req() req: any,
  ): Promise<Response> {
    const data = await this.booksService.getBorrowedBooks(req.user.sub);

    return res
      .status(HttpStatus.OK)
      .json(AppResponse.success(BOOK_CONSTANTS.BORROWED_BOOKS_RETRIEVED, HttpStatus.OK, data));
  }
}
