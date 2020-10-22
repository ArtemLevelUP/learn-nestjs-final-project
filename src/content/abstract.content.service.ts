import { NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

export abstract class AbstractContentService {
    public readonly repository;

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.repository.find({
            skip: page,
            take: limit,
        });
    }

    async findOne(hash: string) {
        const content = await this.repository.findOne({hash: hash});
        if (!content) {
            throw new NotFoundException(`Content with hash: ${hash} not found`);
        }
        return content;
    }

    async remove(hash: string) {
        const content = await this.findOne(hash);
        return this.repository.remove(content);
    }
}
