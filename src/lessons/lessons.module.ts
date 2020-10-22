import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from "./entities/lesson.entity";
import { LessonsController } from "./lessons.controller";
import { LessonsService } from "./lessons.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Lesson]),
    ],
    controllers: [LessonsController],
    providers: [LessonsService],
    exports: [TypeOrmModule]
})
export class LessonsModule {}
