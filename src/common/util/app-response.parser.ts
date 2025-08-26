import { ApiResponse } from '../interface/main.interface';

export class AppResponse {
  static success<T>(message: string, statusCode: number = 200, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      statusCode,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, statusCode: number = 400, error?: string): ApiResponse {
    return {
      success: false,
      message,
      statusCode,
      error,
      timestamp: new Date().toISOString(),
    };
  }
}
