import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { compare, hash } from "bcryptjs";
import * as process from "process";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length)
      throw new BadRequestException('User already exists');

    const hashedPassword = await hash(password, parseInt(process.env.SALT));

    const user = await this.usersService.create(email, hashedPassword);

    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');

    if (!await compare(password, user.password))
      throw new BadRequestException('Wrong password');

    return user;
  }
}