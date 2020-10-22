import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Lesson} from "./entities/lesson.entity";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {UpdateLessonDto} from "./dto/update-lesson.dto";

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson)
        private readonly lessonsRepository: Repository<Lesson>,
    ) {}

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.lessonsRepository.find({
            skip: page,
            take: limit,
        });
    }

    async findOne(hash: string) {
        const lesson = await this.lessonsRepository.findOne({hash: hash}, {relations: ['videos', 'keyNotes']});
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${hash} not found`);
        }
        return lesson;
    }

    create(createLessonDto: CreateLessonDto) {
        const lesson = this.lessonsRepository.create(createLessonDto);
        return this.lessonsRepository.save(lesson);
    }

    async update(hash: string, updateLessonDto: UpdateLessonDto) {
        const lesson = await this.lessonsRepository.findOne({hash: hash});
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${hash} not found`);
        }
        const lessonPreload = await this.lessonsRepository.preload({
            id: lesson.id,
            ...updateLessonDto,
        });

        return this.lessonsRepository.save(lessonPreload);
    }

    async remove(hash: string) {
        const lesson = await this.findOne(hash);
        return this.lessonsRepository.remove(lesson);
    }
}
