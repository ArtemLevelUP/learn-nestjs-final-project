import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {LessonsService} from "./lessons.service";
import {JwtAuthGuard} from "../auth/jwt-auth-guard.service";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {UpdateLessonDto} from "./dto/update-lesson.dto";

@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.lessonsService.findAll(paginationQuery);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createLessonDto: CreateLessonDto) {
        return this.lessonsService.create(createLessonDto);
    }

    @Get(':lessonHash')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('lessonHash') lessonHash: string) {
        return this.lessonsService.findOne(lessonHash);
    }

    @Put(':lessonHash')
    @UseGuards(JwtAuthGuard)
    update(@Param('lessonHash') lessonHash: string, @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonsService.update(lessonHash, updateLessonDto);
    }

    @Delete(':lessonHash')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('lessonHash') lessonHash: string) {
        return this.lessonsService.remove(lessonHash);
    }
}
