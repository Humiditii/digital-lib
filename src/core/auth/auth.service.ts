import { Injectable, ConflictException, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schema/user.entity';
import { SignUpDto, LoginDto } from './dto/auth.dto';
import { JwtPayload, LoginResponse, UserResponse, UserRole } from '../users/interface/user.interface';
import { AUTH_CONSTANTS } from '../../common/constants/auth.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UserResponse> {
    const { email, firstName, lastName, password, role = UserRole.USER } = signUpDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (existingUser) {
      throw new ConflictException(AUTH_CONSTANTS.USER_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create new user
    const user = this.usersRepository.create({
      email: email.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.usersRepository.save(user);

    this.logger.log(`New user created: ${savedUser.email} with role: ${savedUser.role}`);

    return this.mapToUserResponse(savedUser);
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersRepository.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      throw new UnauthorizedException(AUTH_CONSTANTS.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new UnauthorizedException(AUTH_CONSTANTS.USER_INACTIVE);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_CONSTANTS.INVALID_CREDENTIALS);
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN,
    });

    this.logger.log(`User logged in: ${user.email}`);

    return {
      accessToken,
      user: this.mapToUserResponse(user),
    };
  }

  async validateUser(userId: string): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({ 
      where: { id: userId, isActive: true } 
    });

    if (!user) {
      throw new NotFoundException(AUTH_CONSTANTS.USER_NOT_FOUND);
    }

    return this.mapToUserResponse(user);
  }

  async getProfile(userId: string): Promise<UserResponse> {
    return this.validateUser(userId);
  }

  private mapToUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
