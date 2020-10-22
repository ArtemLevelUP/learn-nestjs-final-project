import {IsNotEmpty, IsNumber, IsString, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export abstract class AbstractContentDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(9999)
    readonly order: number;

    @IsString()
    @IsNotEmpty()
    readonly uri: string;
}