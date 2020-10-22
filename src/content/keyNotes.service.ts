import {AbstractContentService} from "./abstract.content.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Injectable, NotFoundException} from "@nestjs/common";
import {KeyNote} from "./entities/keyNote.entity";
import {CreateKeyNoteDto} from "./dto/create-keyNote.dto";
import {UpdateKeyNoteDto} from "./dto/update-keyNote.dto";

@Injectable()
export class KeyNotesService extends AbstractContentService {
    constructor(
        @InjectRepository(KeyNote)
        public readonly repository: Repository<KeyNote>,
    ) {
        super();
    }

    create(createKeyNoteDto: CreateKeyNoteDto) {
        const keyNote = this.repository.create(createKeyNoteDto);
        return this.repository.save(keyNote);
    }

    async update(hash: string, updateKeyNoteDto: UpdateKeyNoteDto) {
        const keyNote = await this.repository.findOne({hash: hash});
        if (!keyNote) {
            throw new NotFoundException(`KeyNote with hash: ${hash} not found`);
        }
        // const videoPreload = await this.repository.preload({
        //     id: keyNote.id,
        //     ...updateKeyNoteDto,
        // });
        //
        // return this.repository.save(videoPreload);

        keyNote.title = updateKeyNoteDto.title;
        keyNote.order = updateKeyNoteDto.order;
        keyNote.uri = updateKeyNoteDto.uri;

        return this.repository.save(keyNote);
    }
}