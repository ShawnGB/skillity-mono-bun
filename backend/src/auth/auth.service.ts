import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      !user.deletedAt &&
      (await bcrypt.compare(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    await this.usersService.create(createUserDto);
    const user = await this.usersService.findByEmail(createUserDto.email);
    if (!user) throw new ConflictException('User creation failed');
    this.eventEmitter.emit('user.registered', { userId: user.id, email: user.email });
    return this.generateTokens(user);
  }

  async refresh(refreshTokenValue: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenValue, isRevoked: false },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return this.generateAccessToken(refreshToken.user);
  }

  async logout(refreshTokenValue: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenValue },
    });

    if (refreshToken) {
      refreshToken.isRevoked = true;
      await this.refreshTokenRepository.save(refreshToken);
    }
  }

  private userPayload(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      bio: user.bio,
      tagline: user.tagline,
      profession: user.profession,
      city: user.city,
      conductorType: user.conductorType,
      companyName: user.companyName,
      vatNumber: user.vatNumber,
      avatarUrl: user.avatarUrl,
    };
  }

  private generateAccessToken(user: User) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );
    return { accessToken, user: this.userPayload(user) };
  }

  private async generateTokens(user: User) {
    const refreshTokenValue = uuidv4();
    const refreshToken = this.refreshTokenRepository.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    await this.refreshTokenRepository.save(refreshToken);

    return {
      ...this.generateAccessToken(user),
      refreshToken: refreshTokenValue,
    };
  }
}
