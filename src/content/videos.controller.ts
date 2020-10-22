import {AbstractContentController} from "./abstract.content.controller";
import {ApiTags} from "@nestjs/swagger";
import {Body, Controller, HttpCode, HttpStatus, Param, Post, Put, UseGuards} from "@nestjs/common";
import {VideosService} from "./videos.service";
import {JwtAuthGuard} from "../auth/jwt-auth-guard.service";
import {CreateVideoDto} from "./dto/create-video.dto";
import {UpdateVideoDto} from "./dto/update-video.dto";

@ApiTags('Videos')
@Controller('videos')
export class VideosController extends AbstractContentController {
    constructor(public readonly service: VideosService) {
        super();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createVideoDto: CreateVideoDto) {
        return this.service.create(createVideoDto);
    }

    @Put(':hash')
    @UseGuards(JwtAuthGuard)
    update(@Param('hash') hash: string, @Body() updateVideoDto: UpdateVideoDto) {
        return this.service.update(hash, updateVideoDto);
    }
}