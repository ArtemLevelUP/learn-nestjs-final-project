import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {AuthService} from "./auth.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt-strategy.service";
import {PassportModule} from "@nestjs/passport";

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.SECRETKEY,
          signOptions: {
            expiresIn: Date.now() + process.env.EXPIRESIN,
            algorithm: 'HS256'
          },
        }),
        PassportModule
      ],
      controllers: [AuthController],
      providers: [
          AuthService,
          { provide: getRepositoryToken(User), useValue: {} },
          { provide: JwtStrategy, useValue: {} },
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
