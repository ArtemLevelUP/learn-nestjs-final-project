import {Injectable} from "@nestjs/common";

const { authenticate, createJwt } = require('../lib/passport');
const { ON_HTTPS } = require('../configs');

const ONE_MINUTE = 1000 * 60;
const ONE_DAY = ONE_MINUTE * 60 * 24;
const ONE_MONTH = ONE_DAY * 30;

class Auth {
    constructor({ req, res }) {
        this.req = req;
        this.res = res;
        this.isReady = false;
        this.hasSignedIn = false;
        this.accessTokenName = 'ip_at';
    }

    async authenticate() {
        const { req, res } = this;

        // The token is very likely to be in cookies
        if (!req.headers.authorization) {
            const cookie = req.cookies[this.accessTokenName];
            if (cookie) req.headers.authorization = `bearer ${cookie}`;
        }

        const payload = await authenticate(req, res);

        if (payload) {
            this.payload = payload;
            this.hasSignedIn = true;
        }
    }

    signInWithJWT(user) {
        const token = createJwt({ uid: user.id });

        this.res.cookie(this.accessTokenName, token, {
            secure: ON_HTTPS,
            httpOnly: true,
            expires: new Date(Date.now() + ONE_MONTH)
        });
    }

    logout() {
        this.res.clearCookie(this.accessTokenName);
    }

    getUserId() {
        return this.payload.uid;
    }
}

module.exports = Auth;