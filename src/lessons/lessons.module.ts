import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from "./entities/lesson.entity";
import { LessonsController } from "./lessons.controller";
import { LessonsService } from "./lessons.service";
import {Video} from "../content/entities/video.entity";
import {KeyNote} from "../content/entities/keyNote.entity";
import {ContentModule} from "../content/content.module";

@Module({
    imports: [
        LessonsModule,
        ContentModule,
        TypeOrmModule.forFeature([Lesson, Video, KeyNote]),
    ],
    controllers: [LessonsController],
    providers: [LessonsService],
    exports: [TypeOrmModule, LessonsService]
})
export class LessonsModule {}
