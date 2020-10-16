import {Controller, Get, Post, Param, Body, Put, Delete, Query, HttpCode, HttpStatus} from '@nestjs/common';
import {UsersService} from "./users.service";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
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
    findOne(@Param('userHash') userHash: string) {
        return this.usersService.findOne(userHash);
    }

    @Put(':userHash')
    update(@Param('userHash') userHash: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(userHash, updateUserDto);
    }

    @Delete(':hash')
    remove(@Param('userHash') userHash: string) {
        return this.usersService.remove(userHash);
    }
}
