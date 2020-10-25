import {Module} from "@nestjs/common";
import {DatabaseModule} from "../src/database/database.module";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "../src/auth/auth.module";
import {UsersModule} from "../src/users/users.module";
import {ClassModule} from "../src/classes/classes.module";
import {LessonsModule} from "../src/lessons/lessons.module";
import {ContentModule} from "../src/content/content.module";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot(),
        AuthModule,
        UsersModule,
        ClassModule,
        LessonsModule,
        ContentModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.TEST_DATABASE_HOST,
            port: +process.env.TEST_DATABASE_PORT,
            username: process.env.TEST_DATABASE_USER,
            password: process.env.TEST_DATABASE_PASSWORD,
            database: process.env.TEST_DATABASE_NAME,
            autoLoadEntities: true,
            synchronize: true,
        }),
    ],
})
export class TestModule {}