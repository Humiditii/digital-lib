import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/core/users/schema/user.entity';
import { Book } from '../src/core/books/schema/book.entity';
import { BorrowedBook } from '../src/core/books/schema/borrowed-book.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Book, BorrowedBook],
          synchronize: true,
          logging: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply same configurations as main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/v1/auth/signup (POST)', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.email).toBe('test@example.com');
          expect(res.body.data).not.toHaveProperty('password');
        });
    });

    it('should return 409 for duplicate email', async () => {
      // First create a user
      await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        });

      // Try to create the same user again
      return request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: 'test@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          password: 'password456',
        })
        .expect(409);
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: 'invalid-email',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        })
        .expect(400);
    });

    it('should return 400 for short password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('/api/v1/auth/login (POST)', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        });
    });

    it('should login successfully', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('user');
          expect(res.body.data.user).not.toHaveProperty('password');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should return 401 for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });

  describe('/api/v1/auth/profile (GET)', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Create and login user to get token
      await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        });

      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it('should get user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.email).toBe('test@example.com');
          expect(res.body.data).not.toHaveProperty('password');
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
