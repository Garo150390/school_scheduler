const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;

const passportJwt = require('../passport/strategies/passport-jwt.js');

passport.use(new JwtStrategy(passportJwt.opts, passportJwt));

module.exports = passport;
