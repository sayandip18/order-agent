export interface CartItem {
  itemId: string;
  name: string;
  cost: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

declare module 'express-session' {
  interface SessionData {
    cart: Cart;
    userId: string;
  }
}
