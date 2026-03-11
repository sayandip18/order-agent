import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import type { Session as ExpressSession } from 'express-session';
import { OrdersService } from './orders.service';
import { OrderResponseDto } from './order-response.dto';
import { UpdateOrderStatusDto } from './update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Session() session: ExpressSession,
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.createFromCart(session as any);
    return OrderResponseDto.from(order);
  }

  @Get()
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findAll();
    return orders.map(OrderResponseDto.from);
  }

  @Get('mine')
  async findMine(
    @Session() session: ExpressSession & { userId?: string },
  ): Promise<OrderResponseDto[]> {
    if (!session.userId) return [];
    const orders = await this.ordersService.findByUser(session.userId);
    return orders.map(OrderResponseDto.from);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.ordersService.findOne(id);
    return OrderResponseDto.from(order);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.updateStatus(id, dto);
    return OrderResponseDto.from(order);
  }
}
