import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query, Session, UseGuards
} from "@nestjs/common";
import { SignUpDto } from "./dtos/sign-up.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "../decorators/current-user.decorator";
import { User } from "./user.entity";
import { AuthGuard } from "../guards/auth.guard";

@Controller("users")
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findMany(@Query("email") email: string) {
    return await this.usersService.find(email);
  }

  @Get('test')
  @UseGuards(AuthGuard)
  async test(@CurrentUser() user: User) {
    console.log(user);
    return user;
  }

  @Post("/sign-up")
  async signUp(@Body() body: SignUpDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post("/sign-in")
  async signIn(@Body() body: SignUpDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post("/sign-out")
  async signOut(@Session() session: any) {
    session.userId = null;
  }

  @Patch("/:id")
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(parseInt(id), body);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return await this.usersService.remove(parseInt(id));
  }

  @Get("/:id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
