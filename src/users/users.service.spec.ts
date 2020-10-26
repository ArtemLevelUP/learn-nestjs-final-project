import {Connection, Repository} from 'typeorm';
import {UsersService} from "./users.service";
import {User, UserRole, UserSex} from "./entities/user.entity";
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

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when user with hash exists', () => {
      it('should return the user object', async () => {
        const userHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
        const expectedUser = {};

        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.findOne(userHash);
        expect(user).toEqual(expectedUser);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async (done) => {
        const userHash = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
        userRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(userHash);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with hash: ${userHash} not found`);
        }
        done();
      });
    });
  });

  describe('create', () => {
    it('should return the user object', async () => {
      const expectedUser = {
        name: "Test name",
        email: "test23@test.com",
        phone: "0500000000",
        password: "pass123",
        sex: UserSex.FEMALE,
        role: UserRole.NEWBIE
      };
      userRepository.save.mockReturnValue(expectedUser);
      const user = await service.create(expectedUser);
      expect(user).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('should return changed user object', async () => {
      const initialUser = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: "Test name",
        email: "test24@test.com",
        phone: "0500000000",
        password: "pass123",
        sex: UserSex.FEMALE,
        role: UserRole.NEWBIE
      };
      const expectedUser = {
        hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: "Test name",
        email: "test25@test.com",
        phone: "0500000000",
        password: "pass123",
        sex: UserSex.MALE,
        role: UserRole.STUDENT
      };

      userRepository.findOne.mockReturnValue(initialUser);
      userRepository.save.mockReturnValue(expectedUser);
      const user = await service.update(initialUser.hash, {
        email: "test25@test.com",
        sex: UserSex.MALE,
        role: UserRole.STUDENT
      });
      expect(user).toEqual(expectedUser);
    });
  });
});

