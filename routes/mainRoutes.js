// imports
const { Router } = require('express');
const mainController = require('../controllers/mainController');
const { loggedInCheck, userHomeCheck, userPageCheck } = require('../middleware/auth');

const router = Router();

// routes
router.get('/', loggedInCheck, mainController.home_get);
router.get('/sign-in', loggedInCheck, mainController.login_get);
router.get('/sign-up', loggedInCheck, mainController.createUser_get);

// user pages
router.get('/user/:username', loggedInCheck, userPageCheck, mainController.userPage_get);
router.get('/nouser/:username', loggedInCheck, mainController.nouser_get);

// user homepages
router.get('/home', loggedInCheck, userHomeCheck, mainController.userHome_get);
router.get('/home/:username', loggedInCheck, userHomeCheck, mainController.userHome_get);

// guide
router.get('/guide', loggedInCheck, mainController.guide_get);

module.exports = router;