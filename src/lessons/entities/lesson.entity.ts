import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Video} from "../../content/entities/video.entity";
import {KeyNote} from "../../content/entities/keyNote.entity";
import {Class} from "../../classes/entities/class.entity";
import {ApiHideProperty} from "@nestjs/swagger";

export enum LesssonAvailability {
    STANDARD = 'standard',
    SELECT = 'select',
    PREMIUM = 'premium'
}

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @PrimaryGeneratedColumn("uuid")
    hash: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    order: number;

    @Column({
        type: "enum",
        enum: LesssonAvailability,
    })
    availability: LesssonAvailability;

    @JoinTable({name: 'videos_to_lessons'})
    @ManyToMany(
        type => Video,
        (video: Video) => video.lessons
    )
    contentVideos: Video[];

    @JoinTable({name: 'keynotes_to_lessons'})
    @ManyToMany(
        type => KeyNote,
        (keynote: KeyNote) => keynote.lessons,
    )
    contentKeyNotes: KeyNote[];

    @ApiHideProperty()
    @ManyToMany(
        type => Class,
        classEntity => classEntity.lessons,
    )
    classes: Class[];
}