import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO } from './dto';
import { User } from './models/user.model';
import { hash } from 'bcrypt';
import { AppError } from 'src/commons/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return hash(password, 5);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { email },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    // try {
    const existUser = await this.findUserByEmail(dto.email);
    if (existUser) throw new BadRequestException(AppError.USER_EXIST);
    dto.password = await this.hashPassword(dto.password);
    const user = await this.userRepository.create({
      firstName: dto.firstName,
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });
    return user;
    // } catch (err) {
    //   throw new Error(err);
    // }
  }
}
