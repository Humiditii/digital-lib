export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  statusCode: number;
}

export interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}
