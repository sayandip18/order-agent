import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Session,
} from '@nestjs/common';
import type { Session as ExpressSession } from 'express-session';
import { CartService } from './cart.service';
import { AddToCartDto } from './add-to-cart.dto';
import type { Cart } from './cart.types';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Session() session: ExpressSession): Cart {
    return this.cartService.getCart(session);
  }

  @Post()
  addItem(
    @Session() session: ExpressSession,
    @Body() dto: AddToCartDto,
  ): Promise<Cart> {
    return this.cartService.addItem(session, dto.itemId, dto.quantity);
  }

  @Delete(':itemId')
  removeItem(
    @Session() session: ExpressSession,
    @Param('itemId') itemId: string,
  ): Cart {
    return this.cartService.removeItem(session, itemId);
  }

  @Delete()
  clearCart(@Session() session: ExpressSession): { message: string } {
    this.cartService.clearCart(session);
    return { message: 'Cart cleared' };
  }
}
