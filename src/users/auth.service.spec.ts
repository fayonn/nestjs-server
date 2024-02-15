import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

describe("AuthService", () => {
  const userEmail = "s@gmail.com";
  const userPassword = "1";

  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;

  beforeEach(async () => {
    usersServiceMock = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) => Promise.resolve({
        id: 1,
        email: email,
        password: password
      })
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock
        }
      ]
    }).compile();

    service = module.get(AuthService);
  });

  it("should be defined", async () => {
    expect(service).toBeDefined();
  });

  it("signUp success", async () => {
    const user = await service.signUp(userEmail, userPassword);
    expect(user.password).not.toEqual(userPassword);
  });

  it("signUp error user already exists", async () => {
    usersServiceMock.find = (email: string) => Promise.resolve([
      { id: 1, email: email, password: "xxx" }
    ]);

    await expect(service.signUp(userEmail, userPassword))
      .rejects.toThrow(BadRequestException);
  });

  it('signIn error user not found', async () => {
    await expect(service.signIn(userEmail, userPassword))
      .rejects.toThrow(NotFoundException);
  });

  it('signIn error wrong password', async () => {
    usersServiceMock.find = () => Promise.resolve([
      {id: 1, email: userEmail, password: 'another password'}
    ]);

    jest.spyOn(bcrypt, 'compare')
      .mockImplementation((password: string, hash: string) => false);

    await expect(service.signIn(userEmail, userPassword))
      .rejects.toThrow(BadRequestException);
  });

  it('signIn success', async () => {
    usersServiceMock.find = () => Promise.resolve([
      {id: 1, email: userEmail, password: userPassword}
    ]);

    jest.spyOn(bcrypt, 'compare')
      .mockImplementation((password: string, hash: string) => true);

    const user = await service.signIn(userEmail, userPassword);

    expect(user).toBeDefined();
  });
});

