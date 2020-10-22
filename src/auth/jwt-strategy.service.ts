import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService,) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRETKEY,
            passReqToCallback: true
        });
    }

    async validate(request: Request, payload: any) {
        const cookies = request.headers.cookie.split(';')
            .map(v => v.split('='))
            .reduce((acc, v) => {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});

        const authorization = request.headers['authorization'];
        if (!cookies['accessToken'] || !authorization || authorization.replace('Bearer ', '') !== cookies['accessToken']) {
            return false;
        }

        return { hash: payload.hash, password: payload.password };
    }
}