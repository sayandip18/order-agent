import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { UpdateOrderStatusDto } from './update-order-status.dto';
import { CartService } from '../cart/cart.service';
import { Session } from 'express-session';
import { Cart } from '../cart/cart.types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly cartService: CartService,
  ) {}

  async createFromCart(
    session: Session & { cart?: Cart; userId?: string },
  ): Promise<Order> {
    const userId = session.userId;
    if (!userId) throw new BadRequestException('Not authenticated');

    const cart = this.cartService.getCart(session);
    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

    const order = this.ordersRepository.create({
      items: cart.items.map((i) => ({
        itemId: i.itemId,
        name: i.name,
        cost: i.cost,
        quantity: i.quantity,
      })),
      status: OrderStatus.PROCESSING,
      userId,
    });

    const saved = await this.ordersRepository.save(order);
    this.cartService.clearCart(session);
    return saved;
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ order: { orderDate: 'DESC' } });
  }

  findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      order: { orderDate: 'DESC' },
    });
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = OrderStatus.CANCELED;
    return this.ordersRepository.save(order);
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new NotFoundException(`Order "${id}" not found`);
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = dto.status;
    return this.ordersRepository.save(order);
  }
}
