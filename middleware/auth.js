// packages & imports
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config.json');
const User = require('../models/user');

// logged in check
const loggedInCheck = (req, res, next) => {
    const token = req.cookies.jwt;

    // sjekk om jwt er gyldig
    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                // ugyldig token
                console.error(err);
                res.cookie('jwt', '', { maxAge: 1 });
                res.locals.loggedIn = false;
                next();
            } else {
                // logget inn
                const user = await User.findOne({ _id: decodedToken.id });

                if (user) {
                    res.locals.username = user.username;
                    res.locals.loggedIn = true;
                } else {
                    // brukeren eksisterer ikke
                    res.cookie('jwt', '', { maxAge: 1 });
                    res.locals.loggedIn = false;
                };
                next();
            };
        });
    } else {
        // brukeren er ikke logget inn
        res.locals.loggedIn = false;
        next();
    };
};

const userHomeCheck = async (req, res, next) => {
    const username = req.params.username;
    const token = req.cookies.jwt;

    // sjekk om bruker har token
    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                // ugyldig token
                console.error(err);
                res.cookie('jwt', '', { maxAge: 1 });
                res.redirect('/sign-in');
            } else {
                // bruker er logget inn
                const dbUser = await User.findOne({ _id: decodedToken.id });
                if (username === dbUser.username) {
                    next();
                } else {
                    res.redirect(`/home/${dbUser.username}`);
                };
            };
        });
    } else {
        // bruker er ikke logget inn, redirect til logg inn side
        res.redirect('/sign-in');
    };
};

const userPageCheck = async (req, res, next) => {
    const username = req.params.username;

    // sjekk om brukeren eksisterer
    const userExists = await User.findOne({ username });

    if (userExists) {
        next();
    } else {
        // hvis brukeren ikke eksisterer
        res.redirect(`/nouser/${username}`);
    };
};

// export functions
module.exports = { loggedInCheck, userHomeCheck, userPageCheck };