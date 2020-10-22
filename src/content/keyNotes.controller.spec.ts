import { Test, TestingModule } from '@nestjs/testing';
import { KeyNotesController } from "./keyNotes.controller";

describe('KeyNotesController', () => {
  let controller: KeyNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyNotesController],
    }).compile();

    controller = module.get<KeyNotesController>(KeyNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
