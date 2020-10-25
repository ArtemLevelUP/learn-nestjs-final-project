import {ExecutionContext, HttpServer, HttpStatus, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import * as request from 'supertest';
import {TestModule} from "./test.module";
import {JwtAuthGuard} from "../src/auth/jwt-auth-guard.service";
import {CreateKeyNoteDto} from "../src/content/dto/create-keyNote.dto";
import {UpdateKeyNoteDto} from "../src/content/dto/update-keyNote.dto";

describe('[Feature] KeyNotes - /keynotes', () => {
    const keyNote = {
        title: "Test key note title",
        order: 2,
        uri: "https://education-nestjs-final-project-docs-mzzz.dev.alldigitalads.com/school/docs/#/"
    };

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
    let keyNotesHash = '';
    it('Create [POST /keynotes]', () => {
        return request(httpServer)
            .post('/keynotes')
            .send(keyNote as CreateKeyNoteDto)
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                keyNotesHash = body.hash;
                expect(body).toEqual(expectedPartialKeyNote);
            });
    });
    it('Get all [GET /keynotes]', () => {
        return request(httpServer)
            .get('/keynotes')
            .query({limit: 10, page: 0})
            .then(({body}) => {
                expect(body.length).toBeGreaterThan(0);
                expect(body[0]).toEqual(expectedPartialKeyNote);
            });
    });
    it('Get one [GET /:keyNotesHash]', () => {
        return request(httpServer)
            .get('/keynotes/' + keyNotesHash)
            .then(({body}) => {
                expect(body).toEqual(expectedPartialKeyNote);
            });
    });
    it('Update one [PUT /keynotes/:keyNotesHash]', () => {
        const updateKeyNoteDto: UpdateKeyNoteDto = {
            ...keyNote,
            title: 'Test keyNote title - edited'
        }
        return request(httpServer)
            .put('/keynotes/' + keyNotesHash)
            .send(updateKeyNoteDto)
            .then(({body}) => {
                expect(body.title).toEqual(updateKeyNoteDto.title);

                return request(httpServer)
                    .get('/keynotes/' + keyNotesHash)
                    .then(({body}) => {
                        expect(body.title).toEqual(updateKeyNoteDto.title);
                    });
            });
    });

    it('Delete [DELETE /keynotes/:keyNotesHash]', () => {
        return request(httpServer)
            .delete('/keynotes/' + keyNotesHash)
            .expect(HttpStatus.NO_CONTENT)
            .then(() => {
                return request(httpServer)
                    .get('/keynotes/' + keyNotesHash)
                    .expect(HttpStatus.NOT_FOUND);
            })
    });

    afterAll(async () => {
        await app.close();
    });
});
