import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { NotFoundException } from "@nestjs/common";

describe('UsersController', () => {
  const userEmail = "s@gmail.com";
  const userPassword = "1";

  let controller: UsersController;
  let usersServiceMock: Partial<UsersService>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    usersServiceMock = {
      find: (email: string) => Promise.resolve([{id: 1, email: email, password: userPassword}]),
      findOne: (id: number) => Promise.resolve({id: id, email: userEmail, password: userPassword}),
      remove: (id: number) => Promise.resolve({id: id, email: userEmail, password: userPassword}),
      // update: (id: number, attrs: Partial<User>) => {},
    }

    authServiceMock = {
      signUp: (email: string, password: string) => Promise.resolve({id: 1, email: email, password: password}),
      signIn: (email: string, password: string) => Promise.resolve({id: 1, email: email, password: password}),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("find all users success", async () => {
    const users = await controller.findMany(userEmail);

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(userEmail);
  });

  it("find one user success", async () => {
    const user = await controller.findOne('1');

    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it("find one user error user not found", async () => {
    usersServiceMock.findOne = (id: number) => null;

    await expect(controller.findOne('1'))
      .rejects.toThrow(NotFoundException);
  });

  it('sign in success', async () => {
    const session = {userId: -10};
    const user = await controller.signIn({
      email: userEmail,
      password: userPassword,
    }, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });


});
