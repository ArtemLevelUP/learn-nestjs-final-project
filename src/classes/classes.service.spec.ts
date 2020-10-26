import {Connection, Repository} from 'typeorm';
import {getRepositoryToken} from "@nestjs/typeorm";
import {NotFoundException} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {ClassService} from "./classes.service";
import {User, UserRole, UserSex} from "../users/entities/user.entity";
import {Class} from "./entities/class.entity";
import {Lesson} from "../lessons/entities/lesson.entity";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
});

describe('ClassService', () => {
    let service: ClassService;
    let classRepository: MockRepository;
    let userRepository: MockRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClassService,
                { provide: Connection, useValue: {} },
                {
                    provide: getRepositoryToken(Class),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(User),
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
        userRepository = module.get<MockRepository>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        describe('when class with hash exists', () => {
            it('should return the class object', async () => {
                const classHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
                const expectedClass = {};

                classRepository.findOne.mockReturnValue(expectedClass);
                const classEntity = await service.findOne(classHash);
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

    describe('create', () => {
        it('should return the class object', async () => {
            const expectedClass = {
                title: 'test class',
                description: 'test description',
                order: 1,
                duration: {
                    started: '2020-10-21T08:26:06.519Z',
                    closed: '2020-10-28T08:26:06.519Z'
                }
            };
            classRepository.save.mockReturnValue(expectedClass);
            const classEntity = await service.create(expectedClass);
            expect(classEntity).toEqual(expectedClass);
        });
    });

    describe('update', () => {
        it('should return changed class object', async () => {
            const initialClass = {
                hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                title: 'test class',
                description: 'test description',
                order: 1,
                duration: {
                    started: '2020-10-21T08:26:06.519Z',
                    closed: '2020-10-28T08:26:06.519Z'
                }
            };
            const expectedClass = {
                hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                title: 'test class #2',
                description: 'test description',
                order: 2,
                duration: {
                    started: '2020-10-21T08:26:06.519Z',
                    closed: '2020-10-28T08:26:06.519Z'
                }
            };

            classRepository.findOne.mockReturnValue(initialClass);
            classRepository.save.mockReturnValue(expectedClass);
            const classEntity = await service.update(initialClass.hash, {
                title: "test class #2",
                order: 2,
            });
            expect(classEntity).toEqual(expectedClass);
        });
    });

    describe('enrollStudent', () => {
        it('should return the class object with student (user)', async () => {
            const initialClass = {
                hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                title: 'test class',
                description: 'test description',
                order: 1,
                duration: {
                    started: '2020-10-21T08:26:06.519Z',
                    closed: '2020-10-28T08:26:06.519Z'
                },
                students: []
            };
            const expectedClass = {
                hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                title: 'test class #2',
                description: 'test description',
                order: 2,
                duration: {
                    started: '2020-10-21T08:26:06.519Z',
                    closed: '2020-10-28T08:26:06.519Z'
                }
            };
            const userToAdd = {
                hash: 'f72b3131-ce90-4a44-aec6-b2a3ecfbeb1d',
                name: "Test name",
                email: "test23@test.com",
                phone: "0500000000",
                password: "pass123",
                sex: UserSex.MALE,
                role: UserRole.NEWBIE
            };
            classRepository.findOne.mockReturnValue(initialClass);
            userRepository.findOne.mockReturnValue(userToAdd);
            classRepository.save.mockReturnValue(expectedClass);
            const classEntity = await service.enrollStudent('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'f72b3131-ce90-4a44-aec6-b2a3ecfbeb1d');
            expect(classEntity).toEqual(expectedClass);
        });
    });
});

