import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from "./videos.controller";
import {VideosService} from "./videos.service";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {Video} from "./entities/video.entity";

describe('VideosController', () => {
  let controller: VideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [
          VideosService,
          { provide: getRepositoryToken(Video), useValue: {} },
      ]
    }).compile();

    controller = module.get<VideosController>(VideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
