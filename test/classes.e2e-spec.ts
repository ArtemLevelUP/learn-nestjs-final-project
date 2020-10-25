import {ExecutionContext, HttpServer, HttpStatus, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {UserRole, UserSex} from "../src/users/entities/user.entity";
import * as request from 'supertest';
import {CreateClassDto} from "../src/classes/dto/create-class.dto";
import {UpdateClassDto} from "../src/classes/dto/update-class.dto";
import {TestModule} from "./test.module";
import {JwtAuthGuard} from "../src/auth/jwt-auth-guard.service";
import {CreateUserDto} from "../src/users/dto/create-user.dto";
import {CreateLessonDto} from "../src/lessons/dto/create-lesson.dto";
import {LesssonAvailability} from "../src/lessons/entities/lesson.entity";

describe('[Feature] Classes - /classes', () => {
    const classData = {
        title: 'test class',
        description: 'test description',
        order: 1,
        duration: {'started': '2020-10-21T08:26:06.519Z', 'closed': '2020-10-28T08:26:06.519Z'},
    };
    const student = {
        name: 'Test name',
        email: 'test1001@test.com',
        phone: '+380500000000',
        password: 'pass123',
        sex: UserSex.MALE,
        role: UserRole.NEWBIE,
    };
    const lesson = {
        title: 'Test lesson title',
        order: 1,
        description: 'Test lesson description',
        availability: LesssonAvailability.PREMIUM,
    };

    const expectedPartialClass = jasmine.objectContaining({
        ...classData,
    });
    const expectedPartialStudent = jasmine.objectContaining({
        ...student,
    });
    const expectedPartialLesson = jasmine.objectContaining({
        ...lesson,
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


    // CRUD
    let classHash = '';
    it('Create [POST /classes]', () => {
        return request(httpServer)
            .post('/classes')
            .send(classData as CreateClassDto)
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                classHash = body.hash;
                expect(body).toEqual(expectedPartialClass);
            });
    });
    it('Get all [GET /classes]', () => {
        return request(httpServer)
            .get('/classes')
            .query({limit: 10, page: 0})
            .then(({body}) => {
                expect(body.length).toBeGreaterThan(0);
                expect(body[0]).toEqual(expectedPartialClass);
            });
    });
    it('Get one [GET /classes/:classHash]', () => {
        return request(httpServer)
            .get('/classes/' + classHash)
            .then(({body}) => {
                expect(body).toEqual(expectedPartialClass);
            });
    });
    it('Update one [PUT /classes/:classHash]', () => {
        const updateClassDto: UpdateClassDto = {
            ...classData,
            title: 'New and Improved Shipwreck Roast'
        }
        return request(httpServer)
            .put('/classes/' + classHash)
            .send(updateClassDto)
            .then(({body}) => {
                expect(body.title).toEqual(updateClassDto.title);

                return request(httpServer)
                    .get('/classes/' + classHash)
                    .then(({body}) => {
                        expect(body.title).toEqual(updateClassDto.title);
                    });
            });
    });


    // Students
    let studentHash = '';
    it('Create student [POST /users]', () => {
        return request(httpServer)
            .post('/users')
            .send(student as CreateUserDto)
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                studentHash = body.hash;
                expect(body).toEqual(expectedPartialStudent);
            });
    });
    it('Enrol student [POST /classes/:classHash/enroll]', () => {
        return request(httpServer)
            .post('/classes/' + classHash + '/enroll')
            .send({'userHash': studentHash})
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                expect(body.students[0]).toEqual(expectedPartialStudent);
            });
    });
    it('Expel student [DELETE /classes/:classHash/expel/:userHash]', () => {
        return request(httpServer)
            .delete('/classes/' + classHash + '/expel/' + studentHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/classes/' + classHash)
                    .then(({body}) => {
                        expect(body.students).toEqual([]);
                    });
            });
    });


    // Lessons
    let lessonHash = '';
    it('Create lesson [POST /lessons/]', () => {
        return request(httpServer)
            .post('/lessons')
            .send(lesson as CreateLessonDto)
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                lessonHash = body.hash;
                expect(body).toEqual(expectedPartialLesson);
            });
    });
    it('Add lesson to class [POST /classes/:classHash/lessons]', () => {
        return request(httpServer)
            .post('/classes/' + classHash + '/lessons')
            .send({'lessonHash': lessonHash})
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                expect(body.lessons[0]).toEqual(expectedPartialLesson);
            });
    });
    it('Remove lesson from class[DELETE /classes/:classHash/lessons/:lessonHash]', () => {
        return request(httpServer)
            .delete('/classes/' + classHash + '/lessons/' + lessonHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/classes/' + classHash)
                    .then(({body}) => {
                        expect(body.lessons).toEqual([]);
                    });
            });
    });


    // Clear all
    it('Delete student [DELETE /users/:userHash]', () => {
        return request(httpServer)
            .delete('/users/' + studentHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/users/' + studentHash)
                    .expect(HttpStatus.NOT_FOUND);
            })
    });
    it('Delete lesson [DELETE /lessons/:lessonHash]', () => {
        return request(httpServer)
            .delete('/lessons/' + lessonHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/lessons/' + lessonHash)
                    .expect(HttpStatus.NOT_FOUND);
            })
    });
    it('Delete class [DELETE /classes/:classHash]', () => {
        return request(httpServer)
            .delete('/classes/' + classHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/classes/' + classHash)
                    .expect(HttpStatus.NOT_FOUND);
            })
    });

    afterAll(async () => {
        await app.close();
    });
});
