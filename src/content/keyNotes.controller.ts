import {AbstractContentController} from "./abstract.content.controller";
import {ApiTags} from "@nestjs/swagger";
import {Body, Controller, HttpCode, HttpStatus, Param, Post, Put, UseGuards} from "@nestjs/common";
import {KeyNotesService} from "./keyNotes.service";
import {JwtAuthGuard} from "../auth/jwt-auth-guard.service";
import {CreateKeyNoteDto} from "./dto/create-keyNote.dto";
import {UpdateKeyNoteDto} from "./dto/update-keyNote.dto";

@ApiTags('Keynotes')
@Controller('keynotes')
export class KeyNotesController extends AbstractContentController {
    constructor(public readonly service: KeyNotesService) {
        super();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createKeyNoteDto: CreateKeyNoteDto) {
        return this.service.create(createKeyNoteDto);
    }

    @Put(':hash')
    @UseGuards(JwtAuthGuard)
    update(@Param('hash') hash: string, @Body() updateKeyNoteDto: UpdateKeyNoteDto) {
        return this.service.update(hash, updateKeyNoteDto);
    }
}