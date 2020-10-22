import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {Video} from "../../content/entities/video.entity";
import {KeyNote} from "../../content/entities/keyNote.entity";

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
    role: LesssonAvailability;

    @JoinTable({name: 'videos_to_lessons'})
    @ManyToMany(
        type => Video,
        video => video.lessons,
    )
    contentVideos: Video[];

    @JoinTable({name: 'keynotes_to_lessons'})
    @ManyToMany(
        type => KeyNote,
        keynote => keynote.lessons,
    )
    contentKeyNotes: KeyNote[];
}