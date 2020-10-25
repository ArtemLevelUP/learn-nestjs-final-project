import {ExecutionContext, HttpServer, HttpStatus, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {UserRole, UserSex} from "../src/users/entities/user.entity";
import * as request from 'supertest';
import {UpdateUserDto} from "../src/users/dto/update-user.dto";
import {JwtAuthGuard} from "../src/auth/jwt-auth-guard.service";
import {TestModule} from "./test.module";
import {CreateUserDto} from "../src/users/dto/create-user.dto";

describe('[Feature] Auth - /', () => {
    const user = {
        name: 'Test name',
        email: 'test1003@test.com',
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
    it('Create user [POST /users/]', () => {
        return request(httpServer)
            .post('/users')
            .send(user as CreateUserDto)
            .expect(HttpStatus.CREATED)
            .then(({ body }) => {
                userHash = body.hash;
                expect(body).toEqual(expectedPartialClass);
            });
    });

    // let base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
    // let encodedCredentials = base64.encode(user.email + ':' + user.password);

    it('Login Incorrect [POST /login]', () => {
        return request(httpServer)
            .post('/login')
            .send({'auth': Buffer.from(user.email + ':123').toString('base64')})
            .expect(HttpStatus.BAD_REQUEST);
    });

    it('Login Correct [POST /login]', () => {
        return request(httpServer)
            .post('/login')
            .send({'auth': Buffer.from(user.email + ':' + user.password).toString('base64')})
            .expect(HttpStatus.NO_CONTENT);
    });

    it('Logout [POST /logout]', () => {
        return request(httpServer)
            .post('/logout')
            .expect(HttpStatus.NO_CONTENT);
    });

    it('Delete user [DELETE /users/:userHash]', () => {
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
