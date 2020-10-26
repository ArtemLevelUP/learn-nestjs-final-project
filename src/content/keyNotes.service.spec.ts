import {Connection, Repository} from 'typeorm';
import {KeyNotesService} from "./keyNotes.service";
import {KeyNote} from "./entities/keyNote.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {NotFoundException} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
});

describe('KeyNotesService', () => {
  let service: KeyNotesService;
  let keyNoteRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyNotesService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(KeyNote),
          useValue: createMockRepository(),
        }
      ],
    }).compile();

    service = module.get<KeyNotesService>(KeyNotesService);
    keyNoteRepository = module.get<MockRepository>(getRepositoryToken(KeyNote));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when keyNote with hash exists', () => {
      it('should return the keyNote object', async () => {
        const keyNoteHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
        const expectedKeyNote = {};

        keyNoteRepository.findOne.mockReturnValue(expectedKeyNote);
        const keyNote = await service.findOne(keyNoteHash);
        expect(keyNote).toEqual(expectedKeyNote);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async (done) => {
        const keyNoteHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
        keyNoteRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(keyNoteHash);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Content with hash: ${keyNoteHash} not found`);
        }
        done();
      });
    });
  });

  describe('create', () => {
    it('should return the keyNote object', async () => {
      const expectedKeyNote = {
        title: "Test keyNote title",
        order: 1,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
      };
      keyNoteRepository.save.mockReturnValue(expectedKeyNote);
      const keyNote = await service.create(expectedKeyNote);
      expect(keyNote).toEqual(expectedKeyNote);
    });
  });

  describe('update', () => {
    it('should return changed keyNote object', async () => {
      const initialKeyNote = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Test keyNote title #1",
        order: 1,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
      };
      const expectedKeyNote = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Test keyNote title #2",
        order: 2,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
      };

      keyNoteRepository.findOne.mockReturnValue(initialKeyNote);
      keyNoteRepository.save.mockReturnValue(expectedKeyNote);
      const keyNote = await service.update(initialKeyNote.hash, {
        title: "Test keyNote title #2",
        order: 2
      });
      expect(keyNote).toEqual(expectedKeyNote);
    });
  });
});

