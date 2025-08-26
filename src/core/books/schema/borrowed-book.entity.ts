import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Book } from './book.entity';
import { User } from '../../users/schema/user.entity';
import { BorrowStatus } from '../interface/book.interface';

@Entity('borrowed_books')
@Index('idx_borrowed_book_user', ['userId'])
@Index('idx_borrowed_book_book', ['bookId'])
@Index('idx_borrowed_book_status', ['status'])
export class BorrowedBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  bookId: string;

  @Column({ 
    type: 'varchar', 
    enum: [BorrowStatus.BORROWED, BorrowStatus.RETURNED, BorrowStatus.OVERDUE], 
    default: BorrowStatus.BORROWED 
  })
  status: BorrowStatus;

  @Column({ type: 'datetime', nullable: false })
  borrowedAt: Date;

  @Column({ type: 'datetime', nullable: false })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  returnedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, user => user.borrowedBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, book => book.borrowedBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property to check if book is overdue
  get isOverdue(): boolean {
    return this.status === BorrowStatus.BORROWED && new Date() > this.dueDate;
  }
}
