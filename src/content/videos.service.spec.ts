import {Connection, Repository} from 'typeorm';
import {VideosService} from "./videos.service";
import {Video} from "./entities/video.entity";
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

describe('VideosService', () => {
  let service: VideosService;
  let videoRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Video),
          useValue: createMockRepository(),
        }
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    videoRepository = module.get<MockRepository>(getRepositoryToken(Video));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when video with hash exists', () => {
      it('should return the video object', async () => {
        const videoHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
        const expectedVideo = {};

        videoRepository.findOne.mockReturnValue(expectedVideo);
        const video = await service.findOne(videoHash);
        expect(video).toEqual(expectedVideo);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async (done) => {
        const videoHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
        videoRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(videoHash);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Content with hash: ${videoHash} not found`);
        }
        done();
      });
    });
  });

  describe('create', () => {
    it('should return the video object', async () => {
      const expectedVideo = {
        title: "Test video title",
        order: 1,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
      };
      videoRepository.save.mockReturnValue(expectedVideo);
      const video = await service.create(expectedVideo);
      expect(video).toEqual(expectedVideo);
    });
  });

  describe('update', () => {
    it('should return changed video object', async () => {
      const initialVideo = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Test video title #1",
        order: 1,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
      };
      const expectedVideo = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Test video title #2",
        order: 2,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
      };

      videoRepository.findOne.mockReturnValue(initialVideo);
      videoRepository.save.mockReturnValue(expectedVideo);
      const video = await service.update(initialVideo.hash, {
        title: "Test video title #2",
        order: 2
      });
      expect(video).toEqual(expectedVideo);
    });
  });
});

