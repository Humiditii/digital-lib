import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppResponse } from '../util/app-response.parser';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any)?.message || 'An error occurred';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      
      // Log unexpected errors
      this.logger.error({
        message: 'Unexpected error occurred',
        error: exception,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      });
    }

    const errorResponse = AppResponse.error(
      message,
      status,
      process.env.NODE_ENV === 'development' ? String(exception) : undefined,
    );

    response.status(status).json(errorResponse);
  }
}
