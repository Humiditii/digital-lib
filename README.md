# Digital Library API

A comprehensive digital library management system built with NestJS, featuring user authentication, book management, and external book search integration.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/User)
- User registration and login
- Protected routes with role restrictions

### Book Management
- Complete CRUD operations for books
- Pagination and search functionality
- Book borrowing system with due date tracking
- Inventory management (track available copies)
- Admin-only book management operations

### External Integration
- OpenLibrary API integration for external book search
- Search for books not in the local catalog
- Rich book metadata retrieval

### Additional Features
- SQLite database with TypeORM
- Comprehensive API documentation with Swagger
- Input validation and error handling
- Automated database seeding
- Comprehensive test suite (Unit + E2E)

## 📋 Requirements

- Node.js 18.x or higher
- npm 9.x or higher

## 🛠️ Installation & Setup

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-library-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**  
   The `.env` file is already configured with default values:
   ```env
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   DB_PATH=./database.sqlite
   NODE_ENV=development
   
   # External API Configuration
   OPENLIBRARY_API_BASE_URL=https://openlibrary.org
   
   # Default Admin User
   ADMIN_EMAIL=admin@library.com
   ADMIN_PASSWORD=admin123
   ```

4. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

5. **Access the application**
   - API Base: http://localhost:3000/api/v1
   - API Documentation: http://localhost:3000/api/docs
   - Health Check: http://localhost:3000/api/v1

## 📊 Database

The application uses SQLite for simplicity and portability. On first startup, the database will be automatically created and seeded with:

### Default Admin User
- **Email**: admin@library.com
- **Password**: admin123
- **Role**: Administrator

### Sample Books
- Classic literature (The Great Gatsby, To Kill a Mockingbird, 1984, etc.)
- Technical books (JavaScript guides, Clean Code, etc.)
- Various genres with proper metadata

## 🔐 Authentication

### Getting Started

1. **Register a new user** (optional, for regular users)
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "firstName": "John",
       "lastName": "Doe",
       "password": "securepassword123"
     }'
   ```

2. **Login to get access token**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@library.com",
       "password": "admin123"
     }'
   ```

3. **Use the access token for protected routes**
   ```bash
   curl -X GET http://localhost:3000/api/v1/auth/profile \
     -H "Authorization: Bearer <your-jwt-token>"
   ```

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/signup` | Register new user | Public |
| POST | `/api/v1/auth/login` | User login | Public |
| GET | `/api/v1/auth/profile` | Get user profile | Authenticated |

### Books Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/books` | List all books (with pagination) | Public |
| GET | `/api/v1/books/search` | Search external book database | Public |
| GET | `/api/v1/books/:id` | Get book by ID | Public |
| POST | `/api/v1/books` | Add new book | Admin only |
| PUT | `/api/v1/books/:id` | Update book | Admin only |
| DELETE | `/api/v1/books/:id` | Delete book (soft delete) | Admin only |
| POST | `/api/v1/books/:id/borrow` | Borrow a book | Authenticated |

### User Books
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/me/borrowed-books` | Get user's borrowed books | Authenticated |

### Query Parameters

#### GET /api/v1/books
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Search by title or author
- `sortBy`: Sort field (title, author, publishedYear, createdAt)
- `sortOrder`: ASC or DESC (default: DESC)

Example:
```bash
GET /api/v1/books?page=1&limit=10&search=gatsby&sortBy=title&sortOrder=ASC
```

#### GET /api/v1/books/search
- `q`: Search query (required)
- `limit`: Max results (default: 10, max: 50)

Example:
```bash
GET /api/v1/books/search?q=javascript&limit=20
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Results
- ✅ **Unit Tests**: 8/8 passing
- ✅ **E2E Tests**: 11/11 passing
- ✅ **Test Coverage**: 21.96% overall, 88.88% on critical auth service

### Test Structure

- **Unit Tests**: Located in `src/**/*.spec.ts`
- **E2E Tests**: Located in `test/**/*.e2e-spec.ts`
- **Coverage Reports**: Generated in `coverage/` directory

## 📈 Monitoring & Health Checks

### Health Check Endpoint
```bash
# Simple health check
curl http://localhost:3000/api/v1/

# Docker health check is automatically configured
docker ps # Shows health status
```

### Logging
- Application logs are written to console
- Error tracking and request logging included
- Different log levels for development vs production

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Application port | 3000 | No |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `DB_PATH` | SQLite database path | ./database.sqlite | No |
| `NODE_ENV` | Environment mode | development | No |
| `OPENLIBRARY_API_BASE_URL` | External API URL | https://openlibrary.org | No |
| `ADMIN_EMAIL` | Default admin email | admin@library.com | No |
| `ADMIN_PASSWORD` | Default admin password | admin123 | No |

### Database Configuration
- **Type**: SQLite
- **Auto-sync**: Enabled in development
- **Migrations**: Auto-generated in development
- **Seeding**: Automatic on startup

## 📖 API Documentation

### Swagger/OpenAPI
Visit http://localhost:3000/api/docs for interactive API documentation.

The Swagger documentation includes:
- Complete endpoint documentation
- Request/response schemas
- Authentication examples
- Try-it-out functionality
- Model definitions

### Postman Collection
A Postman collection is available in the `docs/` directory (if created).

## 🔒 Security Features

### Authentication & Authorization
- JWT tokens with configurable expiration
- Role-based access control
- Password hashing with bcrypt
- Protected routes with guards

### Input Validation
- Comprehensive input validation using class-validator
- Request sanitization
- Type-safe DTOs
- Custom validation pipes

### Security Headers
- CORS enabled with configurable origins
- Input length limitations

## 🚀 Production Deployment

### Build and Deploy

1. **Build the application**
   ```bash
   npm ci --only=production
   npm run build
   ```

2. **Run in production mode**
   ```bash
   npm run start:prod
   ```

3. **Run with PM2** (recommended for production)
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name digital-library-api
   pm2 startup
   pm2 save
   ```

### Environment Variables for Production
- Set a strong `JWT_SECRET`
- Update `NODE_ENV=production`
- Configure database path as needed
- Update admin credentials

## 📁 Project Structure

```
src/
├── common/                 # Shared utilities and common functionality
│   ├── constants/         # Application constants
│   ├── filters/          # Exception filters
│   ├── guard/           # Authentication and authorization guards
│   ├── interface/       # Common interfaces
│   ├── services/        # Shared services (seed service)
│   └── util/           # Utility functions
├── core/                  # Core business logic modules
│   ├── auth/             # Authentication module
│   │   ├── dto/         # Data transfer objects
│   │   ├── interface/   # Interfaces
│   │   └── *.swagger.ts # Swagger documentation
│   ├── books/            # Books management module
│   │   ├── dto/
│   │   ├── interface/
│   │   ├── schema/      # Database entities
│   │   └── repository/  # Data access (if needed)
│   └── users/            # User management
│       ├── interface/
│       └── schema/
├── app.module.ts         # Root application module
└── main.ts               # Application entry point

test/                     # End-to-end tests
docs/                     # Additional documentation
docker-compose*.yml       # Docker orchestration
Dockerfile*              # Docker configurations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

2. **Database locked**
   ```bash
   # Remove database file and restart
   rm database.sqlite
   npm run start:dev
   ```

3. **JWT Secret not set**
   - Ensure `JWT_SECRET` is set in your `.env` file
   - Use a strong, unique secret for production

4. **External API not responding**
   - Check internet connection
   - Verify `OPENLIBRARY_API_BASE_URL` is correct
   - API might be temporarily unavailable


## 📞 Support

- Create an issue on GitHub for bug reports
- Check existing issues before creating new ones
- Provide detailed information about your environment
- Include error messages and logs when reporting issues

---

**Built with ❤️ using NestJS and TypeScript**
