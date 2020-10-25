import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {LessonsService} from "./lessons.service";
import {JwtAuthGuard} from "../auth/jwt-auth-guard.service";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {UpdateLessonDto} from "./dto/update-lesson.dto";
import {ApiTags} from "@nestjs/swagger";

@Controller('lessons')
@ApiTags('Lessons')
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
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    remove(@Param('lessonHash') lessonHash: string) {
        return this.lessonsService.remove(lessonHash);
    }

    @Post(':lessonHash/videos')
    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthGuard)
    addVideo(@Param('lessonHash') lessonHash: string, @Body('videoHash') videoHash: string) {
        return this.lessonsService.addVideo(lessonHash, videoHash);
    }

    @Post(':lessonHash/keynotes')
    @UseGuards(JwtAuthGuard)
    addKeyNote(@Param('lessonHash') lessonHash: string, @Body('keyNoteHash') keyNoteHash: string) {
        return this.lessonsService.addKeyNote(lessonHash, keyNoteHash);
    }

    @Get(':lessonHash/videos/:videoHash')
    @UseGuards(JwtAuthGuard)
    findVideo(@Param('lessonHash') lessonHash: string, @Param('videoHash') videoHash: string) {
        return this.lessonsService.findVideo(lessonHash, videoHash);
    }

    @Delete(':lessonHash/videos/:videoHash')
    @UseGuards(JwtAuthGuard)
    removeVideo(@Param('lessonHash') lessonHash: string, @Param('videoHash') videoHash: string) {
        return this.lessonsService.removeVideo(lessonHash, videoHash);
    }

    @Get(':lessonHash/keynotes/:keyNoteHash')
    @UseGuards(JwtAuthGuard)
    findKeyNote(@Param('lessonHash') lessonHash: string, @Param('keyNoteHash') keyNoteHash: string) {
        return this.lessonsService.findKeyNote(lessonHash, keyNoteHash);
    }

    @Delete(':lessonHash/keynotes/:keyNoteHash')
    @UseGuards(JwtAuthGuard)
    removeKeyNote(@Param('lessonHash') lessonHash: string, @Param('keyNoteHash') keyNoteHash: string) {
        return this.lessonsService.removeKeyNote(lessonHash, keyNoteHash);
    }
}
