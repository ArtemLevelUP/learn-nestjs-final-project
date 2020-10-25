import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import {LessonsService} from "./lessons.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Lesson} from "./entities/lesson.entity";
import {Video} from "../content/entities/video.entity";
import {KeyNote} from "../content/entities/keyNote.entity";

describe('LessonsController', () => {
  let controller: LessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [
          LessonsService,
          { provide: getRepositoryToken(Lesson), useValue: {} },
          { provide: getRepositoryToken(Video), useValue: {} },
          { provide: getRepositoryToken(KeyNote), useValue: {} }
      ]
    }).compile();

    controller = module.get<LessonsController>(LessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
