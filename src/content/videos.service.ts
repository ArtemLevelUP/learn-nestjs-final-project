import {AbstractContentService} from "./abstract.content.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Video} from "./entities/video.entity";
import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateVideoDto} from "./dto/create-video.dto";
import {UpdateVideoDto} from "./dto/update-video.dto";

@Injectable()
export class VideosService extends AbstractContentService {
    constructor(
        @InjectRepository(Video)
        public readonly repository: Repository<Video>,
    ) {
        super();
    }

    create(createVideoDto: CreateVideoDto) {
        const video = this.repository.create(createVideoDto);
        return this.repository.save(video);
    }

    async update(hash: string, updateVideoDto: UpdateVideoDto) {
        const video = await this.repository.findOne({hash: hash});
        if (!video) {
            throw new NotFoundException(`Video with hash: ${hash} not found`);
        }

        const videoPreload = await this.repository.preload({
            id: video.id,
            hash: video.hash,
            ...updateVideoDto,
        });

        return this.repository.save(videoPreload);
    }
}