import {Get, Param, Delete, Query, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {JwtAuthGuard} from "../auth/jwt-auth-guard.service";
import {ApiBearerAuth} from "@nestjs/swagger";

@ApiBearerAuth()
export abstract class AbstractContentController {
    public readonly service;

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.service.findAll(paginationQuery);
    }

    @Get(':hash')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('hash') userHash: string) {
        return this.service.findOne(userHash);
    }

    @Delete(':hash')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('hash') hash: string) {
        return this.service.remove(hash);
    }
}
