import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
  constructor(
    private usersService: UsersService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler){
    const request = context.switchToHttp().getRequest();
    const {userId} = request.session || {};

    if (userId) {
      request.user = await this.usersService.findOne(userId);
    }

    return next.handle();
  }


}