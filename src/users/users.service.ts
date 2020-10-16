import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.userRepository.find({
            skip: page,
            take: limit,
        });
    }

    async findOne(userHash: string) {
        const user = await this.userRepository.findOne({hash: userHash});
        if (!user) {
            throw new NotFoundException(`User with hash: ${userHash} not found`);
        }
        return user;
    }

    create(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async update(userHash: string, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({hash: userHash});
        if (!user) {
            throw new NotFoundException(`User with hash: ${userHash} not found`);
        }
        const userPreload = await this.userRepository.preload({
            id: user.id,
            ...updateUserDto,
        });

        return this.userRepository.save(userPreload);
    }

    async remove(userHash: string) {
        const coffee = await this.findOne(userHash);
        return this.userRepository.remove(coffee);
    }
}
