// imports
const User = require('../models/user');

// controller
module.exports.home_get = (req, res) => {
    res.render('index', { title: 'Home' });
};

module.exports.login_get = (req, res) => {
    if (res.locals.loggedIn === false) {
        res.render('login', { title: 'Logg inn' });
    } else {
        // hvis bruker er logget inn, redirect til hjemmeside
        res.redirect('/');
    };
};

module.exports.createUser_get = (req, res) => {
    if (res.locals.loggedIn === false) {
        res.render('createUser', { title: 'Opprett bruker' });
    } else {
        // hvis bruker er logget inn, redirect tl hjemmeside
        res.redirect('/');
    };
};

module.exports.userHome_get = (req, res) => {
    const username = req.params.username;
    res.render('userHome', { title: 'Brukerpanel', username });
};

module.exports.userPage_get = (req, res) => {
    const username = req.params.username;
    res.render('userPage', { title: username });
};

module.exports.nouser_get = async (req, res) => {
    const username = req.params.username;

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.redirect(`/user/${username}`);
    } else {
        res.render('nouser', { title: 'Ugyldig bruker', username });
    };
};

module.exports.guide_get = async (req, res) => {
    res.render('guide', { title: 'Guide'});
};