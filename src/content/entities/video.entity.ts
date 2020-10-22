import {Column, Entity, ManyToMany} from "typeorm";
import {AbstractContentEntity} from "./abstract.content.entity";
import {ApiProperty} from "@nestjs/swagger";
import {Lesson} from "../../lessons/entities/lesson.entity";

@Entity()
export class Video extends AbstractContentEntity {
    @Column()
    @ApiProperty({ example: 'https://lectrum.io/videos/lesson-1' })
    uri: string;

    @ManyToMany(
        type => Lesson,
        lesson => lesson.contentVideos,
    )
    lessons: Lesson[];
}
