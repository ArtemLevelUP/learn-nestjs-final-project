import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import {User} from "../../users/entities/user.entity";
import {ApiHideProperty, ApiProperty} from "@nestjs/swagger";

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    @ApiHideProperty()
    id: number;

    @Column({ unique: true })
    @PrimaryGeneratedColumn("uuid")
    @ApiHideProperty()
    hash: string;

    @Column()
    @ApiProperty({ example: 'Backend' })
    title: string;

    @Column()
    @ApiProperty({ example: 'Backend Online Course' })
    description: string;

    @Column()
    @ApiProperty({ example: '2' })
    order: number;

    @Column({ type: 'json' })
    // @ApiProperty({ example: '{stared: 2019-06-19T07:44:06.353Z, closed: 2019-06-22T07:44:06.353Z}'})
    @ApiProperty({
        anyOf: [
            {
                type: 'string(\$date-time)',
                description: 'started',
                example: '2019-06-19T07:44:06.353Z',
            },
            {
                type: 'Date',
                description: 'closed',
                example: '2019-06-22T07:44:06.353Z',
            }
        ]
    })
    duration: string[];

    @JoinTable({name: 'students_to_classes'})
    @ManyToMany(
        type => User,
        user => user.classes,
    )
    @ApiHideProperty()
    students: User[];

    // @JoinTable({name: 'lessons_to_classes'})
    // @ManyToMany(
    //     type => User,
    //     user => user.classes,
    // )
    // lessons: Lesso[];
}
