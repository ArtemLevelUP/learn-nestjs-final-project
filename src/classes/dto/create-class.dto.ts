import {
    IsNumber,
    IsString,
    Max,
    Min, Validate,
} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsDateDuration} from "../../utils/validators/data-duration";

export class CreateClassDto {
    @IsString()
    readonly title: string;

    @IsString()
    readonly description: string;

    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(9999)
    readonly order: number;

    @Validate(IsDateDuration)
    readonly duration: string[];
}
