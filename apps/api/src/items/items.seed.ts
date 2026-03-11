import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

const SEED_ITEMS = [
  { name: 'Apple', stock: 100, cost: 0.99 },
  { name: 'Banana', stock: 150, cost: 0.49 },
  { name: 'Orange', stock: 80, cost: 1.29 },
  { name: 'Milk (1L)', stock: 50, cost: 1.99 },
  { name: 'Bread', stock: 40, cost: 2.49 },
  { name: 'Eggs (12)', stock: 60, cost: 3.99 },
  { name: 'Cheese', stock: 30, cost: 4.99 },
  { name: 'Butter', stock: 25, cost: 3.49 },
];

@Injectable()
export class ItemsSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.itemsRepository.count();
    if (count === 0) {
      await this.itemsRepository.save(SEED_ITEMS);
    }
  }
}
