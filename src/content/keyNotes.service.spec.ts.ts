import { Test, TestingModule } from '@nestjs/testing';
import { KeyNotesService } from "./keyNotes.service";

describe('KeyNotesService', () => {
  let service: KeyNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyNotesService],
    }).compile();

    service = module.get<KeyNotesService>(KeyNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
