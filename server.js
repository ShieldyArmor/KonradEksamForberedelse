// packages
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// environment variables
const { dbUser, dbPass } = require('./config.json');
const PORT = 80;
const DB_URI = `mongodb+srv://${dbUser}:${dbPass}@konradchinpokomon.ycwmazi.mongodb.net/chinpokomon`;

// routes
const MAIN_ROUTES = require('./routes/mainRoutes');
const USER_ROUTES = require('./routes/userRoutes');
const CHINPOKOMON_ROUTES = require('./routes/chinpokomonRoutes');

// server
const server = express();

// middleware
server.use(express.static('public'));
server.use(express.json({ limit: '6mb' }));
server.use(express.urlencoded({ limit: '6mb', extended: true }));
server.use(cookieParser());

// view engine
server.set('view engine', 'ejs');

// DB connection
mongoose.connect(DB_URI, { useNewUrlParser : true, useUnifiedTopology : true })
    .then((result) => server.listen(PORT, () => console.log('Listening for requests at port', PORT)))
    .catch(err => console.error(err));

// routes
server.use(MAIN_ROUTES);
server.use(USER_ROUTES);
server.use(CHINPOKOMON_ROUTES);

// 404
server.use((req, res) => res.status(404).render('404', { title: 'Page not found' }));