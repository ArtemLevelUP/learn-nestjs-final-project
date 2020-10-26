import {Connection, Repository} from 'typeorm';
import {LessonsService} from "./lessons.service";
import {Lesson, LesssonAvailability} from "./entities/lesson.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {NotFoundException} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {Video} from "../content/entities/video.entity";
import {KeyNote} from "../content/entities/keyNote.entity";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
});

describe('LessonsService', () => {
  let service: LessonsService;
  let lessonRepository: MockRepository;
  let videoRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Lesson),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Video),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(KeyNote),
          useValue: createMockRepository(),
        }
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    lessonRepository = module.get<MockRepository>(getRepositoryToken(Lesson));
    videoRepository = module.get<MockRepository>(getRepositoryToken(Video));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when lesson with hash exists', () => {
      it('should return the lesson object', async () => {
        const lessonHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
        const expectedLesson = {};

        lessonRepository.findOne.mockReturnValue(expectedLesson);
        const lesson = await service.findOne(lessonHash);
        expect(lesson).toEqual(expectedLesson);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async (done) => {
        const lessonHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
        lessonRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(lessonHash);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Lesson with hash: ${lessonHash} not found`);
        }
        done();
      });
    });
  });

  describe('create', () => {
    it('should return the lesson object', async () => {
      const expectedLesson = {
        title: "Test lesson title",
        order: 1,
        description: "Test lesson description",
        availability: LesssonAvailability.PREMIUM
      };
      lessonRepository.save.mockReturnValue(expectedLesson);
      const lesson = await service.create(expectedLesson);
      expect(lesson).toEqual(expectedLesson);
    });
  });

  describe('update', () => {
    it('should return changed lesson object', async () => {
      const initialLesson = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Test lesson title #1",
        order: 1,
        description: "Test lesson description",
        availability: LesssonAvailability.PREMIUM
      };
      const expectedLesson = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Test lesson title #2",
        order: 2,
        description: "Test lesson description",
        availability: LesssonAvailability.STANDARD
      };

      lessonRepository.findOne.mockReturnValue(initialLesson);
      lessonRepository.save.mockReturnValue(expectedLesson);
      const lesson = await service.update(initialLesson.hash, {
        title: "Test lesson title #2",
        order: 2,
        availability: LesssonAvailability.STANDARD
      });
      expect(lesson).toEqual(expectedLesson);
    });
  });

  describe('addVideo', () => {
    it('should return the lesson object with video', async () => {
      const initialLesson = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Test lesson title #1",
        order: 1,
        description: "Test lesson description",
        availability: LesssonAvailability.PREMIUM,
        contentVideos: []
      };
      const expectedLesson = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Test lesson title",
        order: 1,
        description: "Test lesson description",
        availability: LesssonAvailability.PREMIUM,
        contentVideos: [{
          hash: "f72b3131-ce90-4a44-aec6-b2a3ecfbeb1d",
          title: "Test video title #1",
          order: 1,
          uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
        }]
      };
      const videoToAdd = {
        hash: "f72b3131-ce90-4a44-aec6-b2a3ecfbeb1d",
        title: "Test video title #1",
        order: 1,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
      };
      lessonRepository.findOne.mockReturnValue(initialLesson);
      videoRepository.findOne.mockReturnValue(videoToAdd);
      lessonRepository.save.mockReturnValue(expectedLesson);
      const lesson = await service.addVideo('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'f72b3131-ce90-4a44-aec6-b2a3ecfbeb1d');
      expect(lesson).toEqual(expectedLesson);
    });
  });
});

