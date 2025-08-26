import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { BorrowedBook } from './borrowed-book.entity';

@Entity('books')
@Index('idx_book_title', ['title'])
@Index('idx_book_author', ['author'])
@Index('idx_book_isbn', ['isbn'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  author: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  isbn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  genre: string;

  @Column({ type: 'int', nullable: true })
  publishedYear: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher: string;

  @Column({ type: 'int', default: 1 })
  totalCopies: number;

  @Column({ type: 'int', default: 1 })
  availableCopies: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => BorrowedBook, borrowedBook => borrowedBook.book)
  borrowedBooks: BorrowedBook[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property to check if book is available
  get isAvailable(): boolean {
    return this.availableCopies > 0 && this.isActive;
  }
}
