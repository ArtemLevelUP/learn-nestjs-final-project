import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth-guard.service";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {ClassService} from "./classes.service";
import {CreateClassDto} from "./dto/create-class.dto";
import {UpdateClassDto} from "./dto/update-class.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags('Classes')
@ApiBearerAuth()
@Controller('classes')
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.classService.findAll(paginationQuery);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createClassDto: CreateClassDto) {
        return this.classService.create(createClassDto);
    }

    @Get(':classHash')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('classHash') classHash: string) {
        return this.classService.findOne(classHash);
    }

    @Put(':classHash')
    @UseGuards(JwtAuthGuard)
    update(@Param('classHash') classHash: string, @Body() updateClassDto: UpdateClassDto) {
        return this.classService.update(classHash, updateClassDto);
    }

    @Delete(':classHash')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('classHash') classHash: string) {
        return this.classService.remove(classHash);
    }

    @Post(':classHash/lessons')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    addLesson(@Param('classHash') classHash: string, @Body('lessonHash') lessonHash: string) {
        if (!lessonHash) {
            throw new BadRequestException(`Missed parameter: lessonHash`);
        }
        return this.classService.addLesson(classHash, lessonHash);
    }

    @Delete(':classHash/lessons/:lessonHash')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    removeLesson(@Param('classHash') classHash: string, @Param('lessonHash') lessonHash: string) {
        return this.classService.removeLesson(classHash, lessonHash);
    }

    @Post(':classHash/enroll')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    enrollStudent(@Param('classHash') classHash: string, @Body('userHash') userHash: string) {
        if (!userHash) {
            throw new BadRequestException(`Missed parameter: userHash`);
        }
        return this.classService.enrollStudent(classHash, userHash);
    }

    @Delete(':classHash/expel/:userHash')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    expelStudent(@Param('classHash') classHash: string, @Param('userHash') userHash: string) {
        return this.classService.expelStudent(classHash, userHash);
    }
}
