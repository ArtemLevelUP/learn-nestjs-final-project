const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('../configs');

const verifyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    audience: 'inspector.com',
    algorithms: ['HS256']
};

passport.use(
    new JwtStrategy(verifyOptions, (payload, done) => done(null, payload))
);

exports.createJwt = payload =>
    jwt.sign(payload, JWT_SECRET, {
        algorithm: 'HS256',
        audience: verifyOptions.audience,
        expiresIn: '30 days'
    });

exports.authenticate = (req, res) =>
    new Promise((resolve, reject) => {
        passport.authenticate('jwt', (err, payload) => {
            if (err) reject(err);
            resolve(payload);
        })(req, res);
    });