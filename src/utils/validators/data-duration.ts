import { ValidatorConstraint } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DateDurationValidator} from "./date-duration-validator";

@ValidatorConstraint({ name: 'IsDateDuration', async: true })
@Injectable()
export class IsDateDuration extends DateDurationValidator {}