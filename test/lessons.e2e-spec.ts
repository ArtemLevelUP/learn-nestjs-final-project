import {ExecutionContext, HttpServer, HttpStatus, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import * as request from 'supertest';
import {TestModule} from "./test.module";
import {JwtAuthGuard} from "../src/auth/jwt-auth-guard.service";
import {CreateLessonDto} from "../src/lessons/dto/create-lesson.dto";
import {UpdateLessonDto} from "../src/lessons/dto/update-lesson.dto";
import {LesssonAvailability} from "../src/lessons/entities/lesson.entity";
import {CreateVideoDto} from "../src/content/dto/create-video.dto";
import {CreateKeyNoteDto} from "../src/content/dto/create-keyNote.dto";

describe('[Feature] Lessons - /lessons', () => {
    const lesson = {
        title: 'Test lesson title',
        order: 2,
        description: 'Test lesson description',
        availability: LesssonAvailability.STANDARD,
    };
    const video = {
        title: "Test video title",
        order: 1,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
    };
    const keyNote = {
        title: "Test key note title",
        order: 4,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
    };


    const expectedPartialLesson = jasmine.objectContaining({
        ...lesson,
    });
    const expectedPartialVideo = jasmine.objectContaining({
        ...video,
    });
    const expectedPartialKeyNote = jasmine.objectContaining({
        ...keyNote,
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
    let lessonsHash = '';
    it('Create [POST /]', () => {
        return request(httpServer)
            .post('/lessons')
            .send(lesson as CreateLessonDto)
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                lessonsHash = body.hash;
                expect(body).toEqual(expectedPartialLesson);
            });
    });
    it('Get all [GET /lessons/]', () => {
        return request(httpServer)
            .get('/lessons')
            .query({limit: 10, page: 0})
            .then(({body}) => {
                expect(body.length).toBeGreaterThan(0);
                expect(body[0]).toEqual(expectedPartialLesson);
            });
    });
    it('Get one [GET /lessons/:lessonsHash]', () => {
        return request(httpServer)
            .get('/lessons/' + lessonsHash)
            .then(({body}) => {
                expect(body).toEqual(expectedPartialLesson);
            });
    });
    it('Update one [PUT /lessons/:lessonsHash]', () => {
        const updateLessonDto: UpdateLessonDto = {
            ...lesson,
            title: 'Test lesson title - edited'
        }
        return request(httpServer)
            .put('/lessons/' + lessonsHash)
            .send(updateLessonDto)
            .then(({body}) => {
                expect(body.title).toEqual(updateLessonDto.title);

                return request(httpServer)
                    .get('/lessons/' + lessonsHash)
                    .then(({body}) => {
                        expect(body.title).toEqual(updateLessonDto.title);
                    });
            });
    });


    // Videos
    let videosHash = '';
    it('Create video [POST /videos]', () => {
        return request(httpServer)
            .post('/videos')
            .send(video as CreateVideoDto)
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                videosHash = body.hash;
                expect(body).toEqual(expectedPartialVideo);
            });
    });
    it('Add video to lesson [POST /lessons/:lessonsHash/videos]', () => {
        return request(httpServer)
            .post('/lessons/' + lessonsHash + '/videos')
            .send({'videoHash': videosHash})
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                expect(body.contentVideos[0]).toEqual(expectedPartialVideo);
            });
    });
    it('Find video in lesson [POST /lessons/:lessonsHash/videos/:videosHash]', () => {
        return request(httpServer)
            .get('/lessons/' + lessonsHash + '/videos/' + videosHash)
            .expect(HttpStatus.OK)
            .then(({body}) => {
                expect(body).toEqual(expectedPartialVideo);
            });
    });
    it('Remove video from lesson [DELETE /lessons/:lessonsHash/videos/:videosHash]', () => {
        return request(httpServer)
            .delete('/lessons/' + lessonsHash + '/videos/' + videosHash)
            .expect(HttpStatus.OK)
            .then(({body}) => {
                expect(body.contentVideos).toEqual([]);
            });
    });


    // KeyNotes
    let keyNoteHash = '';
    it('Create keyNote [POST /keynotes]', () => {
        return request(httpServer)
            .post('/keynotes')
            .send(keyNote as CreateKeyNoteDto)
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                keyNoteHash = body.hash;
                expect(body).toEqual(expectedPartialKeyNote);
            });
    });
    it('Add keyNote to lesson [POST /lessons/:lessonsHash/keynotes]', () => {
        return request(httpServer)
            .post('/lessons/' + lessonsHash + '/keynotes')
            .send({'keyNoteHash': keyNoteHash})
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                expect(body.contentKeyNotes[0]).toEqual(expectedPartialKeyNote);
            });
    });
    it('Find keyNote in lesson [POST /lessons/:lessonsHash/keynotes/:keyNoteHash]', () => {
        return request(httpServer)
            .get('/lessons/' + lessonsHash + '/keynotes/' + keyNoteHash)
            .expect(HttpStatus.OK)
            .then(({body}) => {
                expect(body).toEqual(expectedPartialKeyNote);
            });
    });
    it('Remove keyNote from lesson [DELETE /lessons/:lessonsHash/keynotes/:videosHash]', () => {
        return request(httpServer)
            .delete('/lessons/' + lessonsHash + '/keynotes/' + keyNoteHash)
            .expect(HttpStatus.OK)
            .then(({body}) => {
                expect(body.contentKeyNotes).toEqual([]);
            });
    });


    // Clear all
    it('Delete [DELETE /lessons/:lessonsHash]', () => {
        return request(httpServer)
            .delete('/lessons/' + lessonsHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/lessons/' + lessonsHash)
                    .expect(HttpStatus.NOT_FOUND);
            })
    });
    it('Delete Video [DELETE /videos/:videosHash]', () => {
        return request(httpServer)
            .delete('/videos/' + videosHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/videos/' + videosHash)
                    .expect(HttpStatus.NOT_FOUND);
            })
    });
    it('Delete Keynote [DELETE /keynotes/:keyNoteHash]', () => {
        return request(httpServer)
            .delete('/keynotes/' + keyNoteHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/keynotes/' + keyNoteHash)
                    .expect(HttpStatus.NOT_FOUND);
            })
    });

    afterAll(async () => {
        await app.close();
    });
});
