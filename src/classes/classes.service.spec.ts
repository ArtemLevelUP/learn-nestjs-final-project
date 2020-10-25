import { Connection, Repository } from 'typeorm';
import {ClassService} from "./classes.service";
import {Class} from "./entities/class.entity";
import {User} from "../users/entities/user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {NotFoundException} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {Lesson} from "../lessons/entities/lesson.entity";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
});

describe('ClassService', () => {
    let service: ClassService;
    let classRepository: MockRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClassService,
                { provide: Connection, useValue: {} },
                {
                    provide: getRepositoryToken(User),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(Class),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(Lesson),
                    useValue: createMockRepository(),
                },
            ],
        }).compile();

        service = module.get<ClassService>(ClassService);
        classRepository = module.get<MockRepository>(getRepositoryToken(Class));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        describe('when coffee with ID exists', () => {
            it('should return the coffee object', async () => {
                const classId = '1';
                const expectedClass = {};

                classRepository.findOne.mockReturnValue(expectedClass);
                const classEntity = await service.findOne(classId);
                expect(classEntity).toEqual(expectedClass);
            });
        });
        describe('otherwise', () => {
            it('should throw the "NotFoundException"', async (done) => {
                const classHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
                classRepository.findOne.mockReturnValue(undefined);

                try {
                    await service.findOne(classHash);
                } catch (err) {
                    expect(err).toBeInstanceOf(NotFoundException);
                    expect(err.message).toEqual(`Class with hash: ${classHash} not found`);
                }
                done();
            });
        });
    });
});

