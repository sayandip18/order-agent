import { Order, OrderLineItem, OrderStatus } from './order.entity';

export class OrderResponseDto {
  id: string;
  items: OrderLineItem[];
  orderDate: Date;
  status: OrderStatus;
  userId: string;
  total: number;

  static from(order: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = order.id;
    dto.items = order.items;
    dto.orderDate = order.orderDate;
    dto.status = order.status;
    dto.userId = order.userId;
    dto.total = order.items.reduce((sum, i) => sum + i.cost * i.quantity, 0);
    return dto;
  }
}
