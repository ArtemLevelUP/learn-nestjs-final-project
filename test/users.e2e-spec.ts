import {ExecutionContext, HttpServer, HttpStatus, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {UserRole, UserSex} from "../src/users/entities/user.entity";
import * as request from 'supertest';
import {UpdateUserDto} from "../src/users/dto/update-user.dto";
import {JwtAuthGuard} from "../src/auth/jwt-auth-guard.service";
import {TestModule} from "./test.module";
import {CreateUserDto} from "../src/users/dto/create-user.dto";

describe('[Feature] Users - /users', () => {
    const user = {
        name: 'Test name',
        email: 'test1000@test.com',
        phone: '+380500000000',
        password: 'pass123',
        sex: UserSex.MALE,
        role: UserRole.NEWBIE,
    };
    const expectedPartialClass = jasmine.objectContaining({
        ...user,
    });
    let app: INestApplication;
    let httpServer: HttpServer;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({imports: [TestModule]})
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    return true
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }),
        );

        await app.init();
        httpServer = app.getHttpServer();
    });

    let userHash = '';
    it('Create [POST /users]', () => {
        return request(httpServer)
            .post('/users')
            .send(user as CreateUserDto)
            .expect(HttpStatus.CREATED)
            .then(({ body }) => {
                userHash = body.hash;
                expect(body).toEqual(expectedPartialClass);
            });
    });
    it('Get all [GET /users/]', () => {
        return request(httpServer)
            .get('/users')
            .query({limit: 10, page: 0})
            .then(({ body }) => {
                expect(body.length).toBeGreaterThan(0);
                expect(body[0]).toEqual(expectedPartialClass);
            });
    });

    it('Get one [GET /users/:userHash]', () => {
        return request(httpServer)
            .get('/users/' + userHash)
            .then(({ body }) => {
                expect(body).toEqual(expectedPartialClass);
            });
    });

    it('Update one [PUT /users/:userHash]', () => {
        const updateUserDto: UpdateUserDto = {
            ...user,
            name: 'New Test name'
        }
        return request(httpServer)
            .put('/users/' + userHash)
            .send(updateUserDto)
            .then(({ body }) => {
                expect(body.name).toEqual(updateUserDto.name);

                return request(httpServer)
                    .get('/users/' + userHash)
                    .then(({ body }) => {
                        expect(body.name).toEqual(updateUserDto.name);
                    });
            });
    });

    it('Delete one [DELETE /users/:userHash]', () => {
        return request(httpServer)
            .delete('/users/' + userHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/users/' + userHash)
                    .expect(HttpStatus.NOT_FOUND);
            })
    });

    afterAll(async () => {
        await app.close();
    });
});