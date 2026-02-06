import { Controller, Get, Post, Body } from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';

@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Post()
  create(@Body() createWorkshopDto: CreateWorkshopDto) {
    return this.workshopsService.create(createWorkshopDto);
  }

  @Get()
  findAll() {
    return this.workshopsService.findAll();
  }
}
