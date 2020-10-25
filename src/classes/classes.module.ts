import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ClassService} from "./classes.service";
import {ClassController} from "./classes.controller";
import {Class} from "./entities/class.entity";
import {User} from "../users/entities/user.entity";
import {Lesson} from "../lessons/entities/lesson.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Class, User, Lesson]),
    ],
    controllers: [ClassController],
    providers: [ClassService],
})
export class ClassModule {}
