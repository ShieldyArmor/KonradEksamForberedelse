// imports
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { jwtSecret } = require('../config.json');

// jwt
const maxAge = 60 * 60 * 24 * 3;
const createToken = id => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: maxAge
    });
};

// controller
module.exports.user_create = async (req, res) => {
    let user = req.body.user;

    // sjekk at brukeren har fylt ut alle feltene
    if (user.email.length < 3) {
        res.status(400).send({
            status: 'Emailen din må være minst 3 tegn',
            code: 'userErr'
        });
    } else if (user.username.length < 3) {
        res.status(400).send({
            status: 'Brukernavnet ditt må være minst 3 tegn',
            code: 'userErr'
        });
    } else if (user.password.length < 3) {
        res.status(400).send({
            status: 'Passordet ditt må være minst 3 tegn',
            code: 'userErr'
        });
    } else {
        // sjekk om brukeren eksisterer
        const emailExists = await User.findOne({ email: user.email });
        const usernameExists = await User.findOne({ username: user.username });

        if (emailExists) {
            console.log(emailExists._id.toString());
            res.status(400).send({
                status: `Emailen "${user.email}" er allerede i bruk!`,
                code: 'userErr'
            });
        } else if (usernameExists) {
            console.log(usernameExists);
            res.status(400).send({
                status: `Brukernavnet "${user.username}" er allerede i bruk!`,
                code: 'userErr'
            });
        } else {
            // hash passord
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);

            try {
                // lagre dokumentet
                const document = await User.create(user);

                // logg brukeren inn
                const token = createToken(document._id.toString());

                res.cookie('jwt', token, {
                    sameSite: 'strict',
                    httpOnly: true,
                    expiresIn: maxAge * 1000
                });

                res.status(200).send({
                    status: 'Brukeren din ble laget!',
                    code: 'ok'
                });
            } catch(err) {
                console.error(err);
                res.status(400).send({
                    status: 'Kunne ikke lagre brukeren, prøv igjen senere',
                    code: 'serverErr',
                    err
                });
            };
        };
    };
};

module.exports.user_login = async (req, res) => {
    const user = req.body.user;

    // finn brukeren
    const dbUser = await User.findOne({ email: user.email });

    if (dbUser) {
        const auth = await bcrypt.compare(user.password, dbUser.password);

        if (auth) {
            const token = createToken(dbUser._id.toString());

            res.cookie('jwt', token, {
                sameSite: 'strict',
                httpOnly: true,
                maxAge: maxAge * 1000
            });

            res.status(200).send({
                status: 'Du har logget inn',
                code: 'ok'
            });
        } else {
            res.status(400).send({
                status: 'Feil passord',
                code: 'userErr'
            });
        }
    } else {
        res.status(400).send({
            status: `Kunne ikke finne en bruker med mailen "${user.email}"`,
            code: 'userErr'
        });
    };
};

module.exports.user_logout = (req, res) => {
    res.cookie('jwt', "", {maxAge: 1});
    res.redirect("/");
};