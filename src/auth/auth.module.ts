import { Module } from '@nestjs/common';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User} from "../users/entities/user.entity";
import { PassportModule} from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule} from "@nestjs/config";
import { JwtStrategy} from "./jwt-strategy.service";
import {UsersService} from "../users/users.service";


@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            defaultStrategy: 'jwt',
            session: true
        }),
        JwtModule.register({
            secret: process.env.SECRETKEY,
            signOptions: {
                expiresIn: Date.now() + process.env.EXPIRESIN,
                algorithm: 'HS256'
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [
        PassportModule,
        JwtModule
    ],
})
export class AuthModule {}
