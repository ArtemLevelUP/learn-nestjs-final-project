import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Class} from "./entities/class.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateClassDto} from "./dto/create-class.dto";
import {UpdateClassDto} from "./dto/update-class.dto";
import {User} from "../users/entities/user.entity";

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class)
        private readonly classRepository: Repository<Class>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
        const classEntity = await this.classRepository.findOne({hash: classHash});
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

        // temporary
        classEntity.title = updateClassDto.title;
        classEntity.description = updateClassDto.description;
        classEntity.order = updateClassDto.order;
        classEntity.duration = updateClassDto.duration;

        // does not works, error: Given object does not have a primary column, cannot transform it to database entity
        // const classPreload = await this.classRepository.preload({
        //     id: classEntity.id,
        //     ...updateClassDto,
        // });
        //
        // return this.classRepository.save(classPreload);

        return this.classRepository.save(classEntity);
    }

    async remove(classHash: string) {
        const classEntity = await this.findOne(classHash);
        return this.classRepository.remove(classEntity);
    }

    async enroll(classHash: string, userHash: string) {
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

    async expel(classHash: string, userHash: string) {
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