

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../app/models/user');

module.exports = function (passport) {
    // Local signup strategy
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return done(null, false, req.flash('signupMessage', 'Email is already taken.'));
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({ email, password: hashedPassword });
                await newUser.save();

                return done(null, newUser);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Local login strategy
    passport.use('local-login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Serialize and deserialize user
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
