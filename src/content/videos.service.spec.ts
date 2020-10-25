import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from './videos.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Video} from "./entities/video.entity";

describe('VideosService', () => {
  let service: VideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          VideosService,
          { provide: getRepositoryToken(Video), useValue: {} },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
