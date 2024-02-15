import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { setupApp } from "../src/setup-app";

describe('Auth system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  it('signUp', async () => {
    const userEmail = "test2@gmail.com";
    const userPassword = "1";

    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send({email: userEmail, password: userPassword})
      .expect(201)
      .then((res) => {
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(userEmail);
      });
  });
});
