import {IsString, IsEnum, IsEmail, IsNotEmpty, IsOptional, Validate} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { UserRole, UserSex } from "../entities/user.entity";
import { Validator } from "../validators/user-unique-validator";
import { User } from "../entities/user.entity";

export class CreateUserDto {
    @ApiProperty({ description: 'example: John Doe' })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ description: 'example: jdoe@example.com' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Validate(Validator, [User, 'email'])
    readonly email: string;

    @ApiProperty({ description: 'example: +380662332377' })
    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @ApiProperty({ description: 'example: ab12345Cd' })
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ description: 'example: m' })
    @IsEnum(UserSex)
    @IsNotEmpty()
    readonly sex: UserSex;

    @ApiProperty({ description: 'example: newbie' })
    @IsEnum(UserRole)
    @IsOptional()
    readonly role: UserRole;
}

