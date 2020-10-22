import { PartialType } from '@nestjs/swagger';
import {CreateKeyNoteDto} from "./create-keyNote.dto";

export class UpdateKeyNoteDto extends PartialType(CreateKeyNoteDto){}
