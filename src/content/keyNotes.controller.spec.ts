import { Test, TestingModule } from '@nestjs/testing';
import { KeyNotesController } from "./keyNotes.controller";
import {KeyNotesService} from "./keyNotes.service";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {KeyNote} from "./entities/keyNote.entity";
import {Lesson} from "../lessons/entities/lesson.entity";

describe('KeyNotesController', () => {
  let controller: KeyNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyNotesController],
      providers: [
          KeyNotesService,
          { provide: getRepositoryToken(KeyNote), useValue: {} },
      ]
    }).compile();

    controller = module.get<KeyNotesController>(KeyNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
