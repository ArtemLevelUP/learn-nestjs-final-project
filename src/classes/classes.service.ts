import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Class} from "./entities/class.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateClassDto} from "./dto/create-class.dto";
import {UpdateClassDto} from "./dto/update-class.dto";
import {User} from "../users/entities/user.entity";
import {Lesson} from "../lessons/entities/lesson.entity";

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class)
        private readonly classRepository: Repository<Class>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>,
    ) {

    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.classRepository.find({
            skip: page,
            take: limit,
        });
    }

    async findOne(classHash: string) {
        const classEntity = await this.classRepository.findOne({hash: classHash}, {relations: ['students', 'lessons']});
        if (!classEntity) {
            throw new NotFoundException(`Class with hash: ${classHash} not found`);
        }
        return classEntity;
    }

    create(createClassDto: CreateClassDto) {
        const classEntity = this.classRepository.create(createClassDto);
        return this.classRepository.save(classEntity);
    }

    async update(classHash: string, updateClassDto: UpdateClassDto) {
        const classEntity = await this.classRepository.findOne({hash: classHash});
        if (!classEntity) {
            throw new NotFoundException(`Class with hash: ${classHash} not found`);
        }

        const classPreload = await this.classRepository.preload({
            id: classEntity.id,
            hash: classEntity.hash,
            ...updateClassDto,
        });

        return this.classRepository.save(classPreload);
    }

    async remove(classHash: string) {
        const classEntity = await this.findOne(classHash);
        return this.classRepository.remove(classEntity);
    }

    async addLesson(classHash: string, lessonHash: string) {
        const classEntity = await this.classRepository.findOne({hash: classHash}, { relations: ['lessons'] });
        if (!classEntity) {
            throw new BadRequestException(`Class with hash: ${classHash} not found`);

        }

        const lesson = await this.lessonRepository.findOne({hash: lessonHash});
        if (!lesson) {
            throw new BadRequestException(`Lesson with hash: ${lessonHash} not found`);

        }

        const lessonExists = classEntity.lessons.find(lesson => lesson.hash === lessonHash);
        if (lessonExists) {
            throw new BadRequestException(`Lesson with hash: ${lessonHash} already exists in class with hash: ${classHash}`);

        }
        classEntity.lessons.push(lesson);

        return this.classRepository.save(classEntity);
    }

    async removeLesson(classHash: string, lessonHash: string) {
        const classEntity = await this.classRepository.findOne({hash: classHash}, { relations: ['lessons'] });
        if (!classEntity) {
            throw new BadRequestException(`Class with hash: ${classHash} not found`);

        }

        const lesson = await this.lessonRepository.findOne({hash: lessonHash});
        if (!lesson) {
            throw new BadRequestException(`Lesson with hash: ${lessonHash} not found`);

        }

        const lessonExists = classEntity.lessons.find(lesson => lesson.hash === lessonHash);
        if (!lessonExists) {
            throw new BadRequestException(`Lesson with hash: ${lessonHash} does not exist in class with hash: ${classHash}`);

        }
        classEntity.lessons.splice(classEntity.lessons.indexOf(lesson), 1);


        return this.classRepository.save(classEntity);
    }

    async enrollStudent(classHash: string, userHash: string) {
        const classEntity = await this.classRepository.findOne({hash: classHash}, { relations: ['students'] });
        if (!classEntity) {
            throw new BadRequestException(`Class with hash: ${classHash} not found`);

        }

        const student = await this.userRepository.findOne({hash: userHash});
        if (!student) {
            throw new BadRequestException(`Student (user) with hash: ${userHash} not found`);

        }

        const studentExists = classEntity.students.find(student => student.hash === userHash);
        if (studentExists) {
            throw new BadRequestException(`Student (user) with hash: ${userHash} is already enrolled in class with hash: ${classHash}`);

        }
        classEntity.students.push(student);

        return this.classRepository.save(classEntity);
    }

    async expelStudent(classHash: string, userHash: string) {
        const classEntity = await this.classRepository.findOne({hash: classHash}, { relations: ['students'] });
        if (!classEntity) {
            throw new BadRequestException(`Class with hash: ${classHash} not found`);

        }

        const student = await this.userRepository.findOne({hash: userHash});
        if (!student) {
            throw new BadRequestException(`Student (user) with hash: ${userHash} not found`);

        }

        const studentExists = classEntity.students.find(student => student.hash === userHash);
        if (!studentExists) {
            throw new BadRequestException(`Student (user) with hash: ${userHash} is not enrolled in class with hash: ${classHash}`);

        }
        classEntity.students.splice(classEntity.students.indexOf(student), 1);

        return this.classRepository.save(classEntity);
    }
}