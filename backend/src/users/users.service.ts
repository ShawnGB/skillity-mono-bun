import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserResponseDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UsersRepository: Repository<User>,
  ) {}

  // TODO: find right exceotion for this
  async create(createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    const user = this.UsersRepository.create(createUserDto);
    if (!user) throw new NotFoundException('User could not be created');

    user.password = bcrypt.hash(user.password, 10);

    await this.UsersRepository.save(user);

    return new UserResponseDTO(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
