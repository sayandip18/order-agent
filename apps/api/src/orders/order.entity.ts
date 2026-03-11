import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum OrderStatus {
  PROCESSING = 'processing',
  ON_THE_WAY = 'on_the_way',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

export interface OrderLineItem {
  itemId: string;
  name: string;
  cost: number;
  quantity: number;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  items: OrderLineItem[];

  @CreateDateColumn()
  orderDate: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;
}
