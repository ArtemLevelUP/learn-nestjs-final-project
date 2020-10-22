import {Module, ValidationPipe} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {LessonsController} from './lessons/lessons.controller';
import {AuthController} from './auth/auth.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersModule} from './users/users.module';
import {APP_PIPE} from "@nestjs/core";
import {DatabaseModule} from "./database/database.module";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./auth/auth.module";
import {AuthService} from "./auth/auth.service";
import {ClassModule} from "./classes/classes.module";
import {ContentModule} from "./content/content.module";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ClassModule,
    ContentModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController, LessonsController, AuthController],
  providers: [AppService, AuthService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }
  ],
})
export class AppModule {}
