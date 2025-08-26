import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { UserRole } from '../interface/user.interface';
import { BorrowedBook } from '../../books/schema/borrowed-book.entity';

@Entity('users')
@Index('idx_user_email', ['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ 
    type: 'varchar', 
    enum: [UserRole.USER, UserRole.ADMIN], 
    default: UserRole.USER 
  })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => BorrowedBook, borrowedBook => borrowedBook.user)
  borrowedBooks: BorrowedBook[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
