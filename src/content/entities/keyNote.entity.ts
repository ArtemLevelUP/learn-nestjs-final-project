import {AbstractContentEntity} from "./abstract.content.entity";
import {Column, Entity, JoinTable, ManyToMany} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Lesson} from "../../lessons/entities/lesson.entity";
import "reflect-metadata";

@Entity()
export class KeyNote extends AbstractContentEntity {
    @Column()
    @ApiProperty({ example: 'https://lectrum.io/keynotes/lesson-1' })
    uri: string;

    @ManyToMany(
        type => Lesson,
        lesson => lesson.contentKeyNotes,
    )
    lessons: Lesson[];
}
