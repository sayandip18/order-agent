import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
  private readonly items: Item[] = [
    { id: '1', name: 'Widget A', stock: 100, cost: 9.99 },
    { id: '2', name: 'Widget B', stock: 50, cost: 24.99 },
    { id: '3', name: 'Gadget X', stock: 20, cost: 49.99 },
  ];

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: string): Item {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`Item with id "${id}" not found`);
    }
    return item;
  }
}
