import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiBody, 
  ApiBearerAuth, 
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SignUpDto, LoginDto } from './dto/auth.dto';
import { AUTH_CONSTANTS } from '../../common/constants/auth.constants';

export function SwaggerSignUp() {
  return applyDecorators(
    ApiTags('Authentication'),
    ApiOperation({ 
      summary: 'Register a new user',
      description: 'Create a new user account. Admin role can only be assigned by existing admins.',
    }),
    ApiBody({ 
      type: SignUpDto,
      description: 'User registration details',
    }),
    ApiResponse({ 
      status: 201, 
      description: AUTH_CONSTANTS.USER_CREATED,
      schema: {
        example: {
          success: true,
          message: AUTH_CONSTANTS.USER_CREATED,
          statusCode: 201,
          data: {
            id: 'uuid-string',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            isActive: true,
            lastLoginAt: null,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiBadRequestResponse({ 
      description: AUTH_CONSTANTS.BAD_REQUEST,
      schema: {
        example: {
          success: false,
          message: 'Validation failed',
          statusCode: 400,
          error: 'Please provide a valid email address',
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiConflictResponse({ 
      description: AUTH_CONSTANTS.USER_ALREADY_EXISTS,
      schema: {
        example: {
          success: false,
          message: AUTH_CONSTANTS.USER_ALREADY_EXISTS,
          statusCode: 409,
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiResponse({ 
      status: 500, 
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          message: 'Internal server error',
          statusCode: 500,
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
  );
}

export function SwaggerLogin() {
  return applyDecorators(
    ApiTags('Authentication'),
    ApiOperation({ 
      summary: 'User login',
      description: 'Authenticate user and return JWT token',
    }),
    ApiBody({ 
      type: LoginDto,
      description: 'User login credentials',
    }),
    ApiResponse({ 
      status: 200, 
      description: AUTH_CONSTANTS.LOGIN_SUCCESS,
      schema: {
        example: {
          success: true,
          message: AUTH_CONSTANTS.LOGIN_SUCCESS,
          statusCode: 200,
          data: {
            accessToken: 'jwt-token-string',
            user: {
              id: 'uuid-string',
              email: 'john.doe@example.com',
              firstName: 'John',
              lastName: 'Doe',
              role: 'user',
              isActive: true,
              lastLoginAt: '2024-01-01T00:00:00.000Z',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            }
          },
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiBadRequestResponse({ 
      description: AUTH_CONSTANTS.BAD_REQUEST,
      schema: {
        example: {
          success: false,
          message: 'Validation failed',
          statusCode: 400,
          error: 'Email is required',
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiUnauthorizedResponse({ 
      description: AUTH_CONSTANTS.INVALID_CREDENTIALS,
      schema: {
        example: {
          success: false,
          message: AUTH_CONSTANTS.INVALID_CREDENTIALS,
          statusCode: 401,
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiResponse({ 
      status: 500, 
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          message: 'Internal server error',
          statusCode: 500,
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
  );
}

export function SwaggerGetProfile() {
  return applyDecorators(
    ApiTags('Authentication'),
    ApiBearerAuth('access-token'),
    ApiOperation({ 
      summary: 'Get user profile',
      description: 'Retrieve the current authenticated user profile',
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Profile retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Profile retrieved successfully',
          statusCode: 200,
          data: {
            id: 'uuid-string',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            isActive: true,
            lastLoginAt: '2024-01-01T00:00:00.000Z',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiUnauthorizedResponse({ 
      description: AUTH_CONSTANTS.UNAUTHORIZED,
      schema: {
        example: {
          success: false,
          message: AUTH_CONSTANTS.UNAUTHORIZED,
          statusCode: 401,
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiResponse({ 
      status: 404, 
      description: AUTH_CONSTANTS.USER_NOT_FOUND,
      schema: {
        example: {
          success: false,
          message: AUTH_CONSTANTS.USER_NOT_FOUND,
          statusCode: 404,
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
    ApiResponse({ 
      status: 500, 
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          message: 'Internal server error',
          statusCode: 500,
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    }),
  );
}
