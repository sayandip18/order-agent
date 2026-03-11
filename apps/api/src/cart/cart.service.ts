import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Session } from 'express-session';
import { ItemsService } from '../items/items.service';
import { Cart, CartItem } from './cart.types';

@Injectable()
export class CartService {
  constructor(private readonly itemsService: ItemsService) {}

  getCart(session: Session & { cart?: Cart }): Cart {
    if (!session.cart) {
      session.cart = { items: [] };
    }
    return session.cart;
  }

  async addItem(
    session: Session & { cart?: Cart },
    itemId: string,
    quantity: number,
  ): Promise<Cart> {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const item = await this.itemsService.findOne(itemId);
    const cart = this.getCart(session);

    const existing = cart.items.find((i) => i.itemId === itemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      const cartItem: CartItem = {
        itemId: item.id,
        name: item.name,
        cost: Number(item.cost),
        quantity,
      };
      cart.items.push(cartItem);
    }

    return cart;
  }

  removeItem(session: Session & { cart?: Cart }, itemId: string): Cart {
    const cart = this.getCart(session);
    const index = cart.items.findIndex((i) => i.itemId === itemId);
    if (index === -1) {
      throw new NotFoundException(`Item "${itemId}" is not in the cart`);
    }
    cart.items.splice(index, 1);
    return cart;
  }

  clearCart(session: Session & { cart?: Cart }): void {
    session.cart = { items: [] };
  }
}
