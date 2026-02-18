import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async toggle(userId: string, workshopId: string): Promise<{ saved: boolean }> {
    const existing = await this.wishlistRepository.findOne({
      where: { userId, workshopId },
    });

    if (existing) {
      await this.wishlistRepository.remove(existing);
      return { saved: false };
    }

    const item = this.wishlistRepository.create({ userId, workshopId });
    await this.wishlistRepository.save(item);
    return { saved: true };
  }

  async findByUser(userId: string) {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['workshop', 'workshop.host'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: string, workshopId: string) {
    await this.wishlistRepository.delete({ userId, workshopId });
  }

  async checkBatch(userId: string, workshopIds: string[]): Promise<Record<string, boolean>> {
    if (workshopIds.length === 0) return {};

    const items = await this.wishlistRepository.find({
      where: { userId, workshopId: In(workshopIds) },
      select: ['workshopId'],
    });

    const savedSet = new Set(items.map((i) => i.workshopId));
    const result: Record<string, boolean> = {};
    for (const id of workshopIds) {
      result[id] = savedSet.has(id);
    }
    return result;
  }
}
