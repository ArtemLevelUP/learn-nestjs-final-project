import {Controller, Get, Post, Param, Body, Put, Delete, Query, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth-guard.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.usersService.findAll(paginationQuery);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get(':userHash')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('userHash') userHash: string) {
        return this.usersService.findOne(userHash);
    }

    @Put(':userHash')
    @UseGuards(JwtAuthGuard)
    update(@Param('userHash') userHash: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(userHash, updateUserDto);
    }

    @Delete(':userHash')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('userHash') userHash: string) {
        return this.usersService.remove(userHash);
    }
}
