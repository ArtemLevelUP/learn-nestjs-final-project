import {IsString, IsEnum, IsEmail, IsNotEmpty, IsOptional, Validate} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { UserRole, UserSex } from "../entities/user.entity";
import { User } from "../entities/user.entity";
import { Unique } from "../../unique";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    // @Validate(Unique, [User, 'email'])
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @ApiProperty({ example: 'ab12345Cd' })
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @IsEnum(UserSex)
    @IsNotEmpty()
    readonly sex: UserSex;

    @IsEnum(UserRole)
    @IsOptional()
    readonly role: UserRole;
}

