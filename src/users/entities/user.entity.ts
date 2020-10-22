import {Column, Entity, PrimaryGeneratedColumn, Index, JoinTable, ManyToMany} from 'typeorm';
import {Class} from "../../classes/entities/class.entity";
import {ApiHideProperty, ApiProperty} from "@nestjs/swagger";

export enum UserSex {
    MALE = 'm',
    FEMALE = 'f'
}
export enum UserRole {
    NEWBIE = 'newbie',
    STUDENT = 'student',
    TEACHER = 'teacher'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiHideProperty()
    id: number;

    @Column({ unique: true })
    @PrimaryGeneratedColumn("uuid")
    @ApiHideProperty()
    hash: string;

    @Column()
    @ApiProperty({ example: 'John Doe' })
    name: string;

    @Index()
    @Column({ unique: true })
    @ApiProperty({ example: 'jdoe@example.com' })
    email: string;

    @Column()
    @ApiProperty({ example: '+380662332377' })
    phone: string;

    @Column()
    @ApiProperty({ example: 'ab12345Cd' })
    password: string;

    @Column({
        type: "enum",
        enum: UserSex,
    })
    @ApiProperty({ example: 'm' })
    sex: UserSex;

    @Column({
        type: "enum",
        enum: UserRole,
        nullable: true
    })
    @ApiProperty({ example: 'newbie' })
    role: UserRole;

    @ApiHideProperty()
    @ManyToMany(
        type => Class,
        classEntity => classEntity.students,
    )
    classes: Class[];
}
