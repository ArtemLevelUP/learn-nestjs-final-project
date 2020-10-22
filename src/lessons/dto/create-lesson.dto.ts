import {IsString, IsEnum, IsNotEmpty, IsNumber, Min, Max} from 'class-validator';
import {Type} from "class-transformer";
import {LesssonAvailability} from "../entities/lesson.entity";

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(9999)
    readonly order: number;

    @IsEnum(LesssonAvailability)
    @IsNotEmpty()
    readonly availability: LesssonAvailability;


}

