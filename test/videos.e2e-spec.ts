import {ExecutionContext, HttpServer, HttpStatus, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import * as request from 'supertest';
import {TestModule} from "./test.module";
import {JwtAuthGuard} from "../src/auth/jwt-auth-guard.service";
import {CreateVideoDto} from "../src/content/dto/create-video.dto";
import {UpdateVideoDto} from "../src/content/dto/update-video.dto";

describe('[Feature] Videos - /videos', () => {
    const video = {
        title: "Test video title",
        order: 1,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
    };

    const expectedPartialVideo = jasmine.objectContaining({
        ...video,
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
    let videosHash = '';
    it('Create [POST /videos]', () => {
        return request(httpServer)
            .post('/videos')
            .send(video as CreateVideoDto)
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                videosHash = body.hash;
                expect(body).toEqual(expectedPartialVideo);
            });
    });
    it('Get all [GET /videos]', () => {
        return request(httpServer)
            .get('/videos')
            .query({limit: 10, page: 0})
            .then(({body}) => {
                expect(body.length).toBeGreaterThan(0);
                expect(body[0]).toEqual(expectedPartialVideo);
            });
    });
    it('Get one [GET /videos/:videosHash]', () => {
        return request(httpServer)
            .get('/videos/' + videosHash)
            .then(({body}) => {
                expect(body).toEqual(expectedPartialVideo);
            });
    });
    it('Update one [PUT /videos/:videosHash]', () => {
        const updateVideoDto: UpdateVideoDto = {
            ...video,
            title: 'Test video title - edited'
        }
        return request(httpServer)
            .put('/videos/' + videosHash)
            .send(updateVideoDto)
            .then(({body}) => {
                expect(body.title).toEqual(updateVideoDto.title);

                return request(httpServer)
                    .get('/videos/' + videosHash)
                    .then(({body}) => {
                        expect(body.title).toEqual(updateVideoDto.title);
                    });
            });
    });

    it('Delete [DELETE /videos/:videosHash]', () => {
        return request(httpServer)
            .delete('/videos/' + videosHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/videos/' + videosHash)
                    .expect(HttpStatus.NOT_FOUND);
            })
    });

    afterAll(async () => {
        await app.close();
    });
});
