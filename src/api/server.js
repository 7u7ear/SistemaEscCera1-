const express = require('express');
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
const rateLimit = require('express-rate-limit');
const xssClean = require('./middlewares/xssClean');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // Limit each IP to 150 requests per `window`
    message: 'Demasiadas peticiones desde esta IP, por favor intente nuevamente en 15 minutos.'
});

app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use('/api/v1', apiLimiter);
app.use(xssClean);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Removed express-session per basic rules (Only JWT is allowed)

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
