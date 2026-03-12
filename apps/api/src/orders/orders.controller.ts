import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
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
  async create(@Session() session: ExpressSession): Promise<OrderResponseDto> {
    const order = await this.ordersService.createFromCart(session as any);
    return OrderResponseDto.from(order);
  }

  @Get()
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findAll();
    return orders.map((order) => OrderResponseDto.from(order));
  }

  @Get('mine')
  async findMine(
    @Session() session: ExpressSession & { userId?: string },
  ): Promise<OrderResponseDto[]> {
    if (!session.userId) return [];
    const orders = await this.ordersService.findByUser(session.userId);
    return orders.map((order) => OrderResponseDto.from(order));
  }

  @Get('by-user')
  async findByUser(
    @Query('userId') userId: string,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findByUser(userId);
    return orders.map((order) => OrderResponseDto.from(order));
  }

  @Post('cancel')
  async cancelOrder(
    @Body('orderId') orderId: string,
  ): Promise<OrderResponseDto> {
    console.log(orderId);
    const order = await this.ordersService.cancelOrder(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    return OrderResponseDto.from(order);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.ordersService.findOne(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return OrderResponseDto.from(order);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.updateStatus(id, dto);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return OrderResponseDto.from(order);
  }
}
