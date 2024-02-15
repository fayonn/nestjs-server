import { Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity";
import { Report } from "./reports/report.entity";
import * as process from "process";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.ENV}`,
    }),
    // TypeOrmModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: false,
          entities: [User, Report],
          migrations: ["migrations/*.js"]
        }
      }
    }),
    // TypeOrmModule.forRoot({
    //   // database: process.env.ENV === 'DEV'
    //   //   ? 'sqlite.db'
    //   //   : process.env.ENV === 'TEST'
    //   //     ? 'sqlite-dev.db'
    //   //     : 'sqlite.db',
    //   database: 'sqlite.db',
    //   type: 'sqlite',
    //   synchronize: true,
    //   entities: [User, Report],
    // }),
    ReportsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
