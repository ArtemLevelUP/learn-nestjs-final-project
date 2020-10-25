import {Column, PrimaryGeneratedColumn} from 'typeorm';
import {ApiHideProperty, ApiProperty} from "@nestjs/swagger";
import "reflect-metadata";

export abstract class AbstractContentEntity {
    @ApiHideProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiHideProperty()
    @Column({ unique: true })
    @PrimaryGeneratedColumn("uuid")
    hash: string;

    @ApiProperty({ example: 'Node.js introduction' })
    @Column()
    title: string;

    @ApiProperty({ example: '1' })
    @Column()
    order: number;
}
