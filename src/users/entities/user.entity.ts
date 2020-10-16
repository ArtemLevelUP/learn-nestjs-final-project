import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

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
    id: number;

    @Column({ default: generateUuid(), unique: true })
    hash: string;

    @Column()
    name: string;

    @Index()
    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @Column('enum', { enum: UserSex })
    sex: UserSex;

    @Column('enum', { enum: UserRole, nullable: true })
    role: UserRole;
}

function generateUuid() {
    // uuidv4(), npm install uuid
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}