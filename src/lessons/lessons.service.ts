import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Lesson} from "./entities/lesson.entity";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {UpdateLessonDto} from "./dto/update-lesson.dto";
import {Video} from "../content/entities/video.entity";
import {KeyNote} from "../content/entities/keyNote.entity";

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson)
        private readonly lessonsRepository: Repository<Lesson>,
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>,
        @InjectRepository(KeyNote)
        private readonly keyNoteRepository: Repository<KeyNote>,
    ) {}

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.lessonsRepository.find({
            skip: page,
            take: limit,
        });
    }

    async findOne(hash: string) {
        const lesson = await this.lessonsRepository.findOne({hash: hash}, {relations: ['contentVideos', 'contentKeyNotes']});
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
            hash: lesson.hash,
            ...updateLessonDto,
        });

        return this.lessonsRepository.save(lessonPreload);
    }

    async remove(hash: string) {
        const lesson = await this.findOne(hash);
        return this.lessonsRepository.remove(lesson);
    }

    async findVideo(hash: string, videoHash: string) {
        const lesson = await this.lessonsRepository.findOne({hash: hash}, { relations: ['contentVideos'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${hash} not found`);
        }

        const video = await this.videoRepository.findOne({'hash': videoHash});
        if (!video) {
            throw new NotFoundException(`Video with hash: ${videoHash} not found`);
        }

        const videoExists = lesson.contentVideos.find(video => video.hash === videoHash);
        if (!videoExists) {
            throw new BadRequestException(`Not found video with hash: ${videoHash} in lesson with hash: ${hash}`);
        }

        return video;
    }

    async addVideo(hash: string, videoHash: string) {
        const lesson = await this.lessonsRepository.findOne({hash: hash}, { relations: ['contentVideos'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${hash} not found`);
        }

        const video = await this.videoRepository.findOne({'hash': videoHash});
        if (!video) {
            throw new NotFoundException(`Video with hash: ${videoHash} not found`);
        }

        const videoExists = lesson.contentVideos.find(video => video.hash === videoHash);
        if (videoExists) {
            throw new BadRequestException(`Video with hash: ${videoHash} is already exists in lesson with hash: ${hash}`);

        }
        lesson.contentVideos.push(video);

        return this.lessonsRepository.save(lesson);
    }

    async removeVideo(hash: string, videoHash: string) {
        const lesson = await this.lessonsRepository.findOne({hash: hash}, { relations: ['contentVideos'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${hash} not found`);
        }

        const video = await this.videoRepository.findOne({'hash': videoHash});
        if (!video) {
            throw new NotFoundException(`Video with hash: ${videoHash} not found`);
        }

        const videoExists = lesson.contentVideos.find(video => video.hash === videoHash);
        if (!videoExists) {
            throw new BadRequestException(`Not found video with hash: ${videoHash} in lesson with hash: ${hash}`);
        }
        lesson.contentVideos.splice(lesson.contentVideos.indexOf(video), 1);

        return this.lessonsRepository.save(lesson);
    }

    async findKeyNote(hash: string, keyNoteHash: string) {
        const lesson = await this.lessonsRepository.findOne({hash: hash}, { relations: ['contentKeyNotes'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${hash} not found`);
        }

        const keyNote = await this.keyNoteRepository.findOne({'hash': keyNoteHash});
        if (!keyNote) {
            throw new NotFoundException(`KeyNote with hash: ${keyNoteHash} not found`);
        }

        const keyNoteExists = lesson.contentKeyNotes.find(keyNote => keyNote.hash === keyNoteHash);
        if (!keyNoteExists) {
            throw new BadRequestException(`Not found keyNote with hash: ${keyNoteHash} in lesson with hash: ${hash}`);
        }

        return keyNote;
    }

    async addKeyNote(hash: string, keyNoteHash: string) {
        const lesson = await this.lessonsRepository.findOne({hash: hash}, { relations: ['contentKeyNotes'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${hash} not found`);
        }

        const keyNote = await this.keyNoteRepository.findOne({'hash': keyNoteHash});
        if (!keyNote) {
            throw new NotFoundException(`KeyNote with hash: ${keyNoteHash} not found`);
        }

        const keyNoteExists = lesson.contentKeyNotes.find(keyNote => keyNote.hash === keyNoteHash);
        if (keyNoteExists) {
            throw new BadRequestException(`KeyNote with hash: ${keyNoteHash} is already exists in lesson with hash: ${hash}`);

        }
        lesson.contentKeyNotes.push(keyNote);

        return this.lessonsRepository.save(lesson);
    }

    async removeKeyNote(hash: string, keyNoteHash: string) {
        const lesson = await this.lessonsRepository.findOne({hash: hash}, { relations: ['contentKeyNotes'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${hash} not found`);
        }

        const keyNote = await this.keyNoteRepository.findOne({'hash': keyNoteHash});
        if (!keyNote) {
            throw new NotFoundException(`KeyNote with hash: ${keyNoteHash} not found`);
        }

        const keyNoteExists = lesson.contentKeyNotes.find(keyNote => keyNote.hash === keyNoteHash);
        if (!keyNoteExists) {
            throw new BadRequestException(`Not found keyNote with hash: ${keyNoteHash} in lesson with hash: ${hash}`);
        }
        lesson.contentKeyNotes.splice(lesson.contentKeyNotes.indexOf(keyNote), 1);

        return this.lessonsRepository.save(lesson);
    }
}
