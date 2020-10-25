import { Module } from '@nestjs/common';
import { VideosController} from "./videos.controller";
import { KeyNotesController} from "./keyNotes.controller";
import { VideosService} from "./videos.service";
import { KeyNotesService} from "./keyNotes.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from "./entities/video.entity";
import { KeyNote } from "./entities/keyNote.entity";
import {Lesson} from "../lessons/entities/lesson.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Video, KeyNote, Lesson]),
    ],
    controllers: [VideosController, KeyNotesController],
    providers: [VideosService, KeyNotesService],
    exports: [TypeOrmModule]
})
export class ContentModule {}
