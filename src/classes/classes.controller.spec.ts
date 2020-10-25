import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from './classes.controller';
import {ClassService} from "./classes.service";
import {ConfigModule} from "@nestjs/config";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {Class} from "./entities/class.entity";
import {User} from "../users/entities/user.entity";
import {Lesson} from "../lessons/entities/lesson.entity";

describe('ClassesController', () => {
  let controller: ClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassController],
      providers: [
          ClassService,
          { provide: getRepositoryToken(Class), useValue: {} },
          { provide: getRepositoryToken(User), useValue: {} },
          { provide: getRepositoryToken(Lesson), useValue: {} },
      ]
    }).compile();

    controller = module.get<ClassController>(ClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
