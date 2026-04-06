const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./services/logger.service');
const v1Routes = require('./routes/v1');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================
// SECURITY & MIDDLEWARES
// ==================
app.use(helmet({
  contentSecurityPolicy: false, // For simplicity in local dev with inline scripts
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'ceramica_default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

// ==================
// STATIC FILES (Rule 1)
// ==================
app.use(express.static(path.join(__dirname, '../web')));

// ==================
// API ROUTES (Rule 7)
// ==================
app.use('/api/v1', v1Routes);

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// ==================
// ERROR HANDLING (Rule 8)
// ==================
app.use(errorHandler);

// ==================
// SERVER START
// ==================
app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
