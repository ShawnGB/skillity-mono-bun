import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workshop } from './entities/workshop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly WorkshopRepositoty: Repository<Workshop>,
  ) {}

  async create(createWorkshopDto: CreateWorkshopDto, hostId: string) {
    const workshopToCreate = this.WorkshopRepositoty.create({
      ...createWorkshopDto,
      hostId,
    });

    if (!workshopToCreate)
      throw new ConflictException('Could not create Workshop');

    return await this.WorkshopRepositoty.save(workshopToCreate);
  }

  findAll() {
    return this.WorkshopRepositoty.find();
  }
}
