import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>
  ) {}

  async create(email: string, password: string) {
    const user = this.usersRepo.create({email, password});

    return await this.usersRepo.save(user);
  }

  async findOne(id: number) {
    if (!id) return null;
    return await this.usersRepo.findOneBy({id});
  }

  async find(email: string) {
    return await this.usersRepo.find({where: {email}});
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`User not found`);
    Object.assign(user, attrs);
    return await this.usersRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`User not found`);
    return await this.usersRepo.remove(user);
  }
}
