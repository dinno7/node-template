const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

function bootstrapMiddlewares(app) {
  try {
    // Helmet, Set http headers
    app.use(helmet());

    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }
    // Rate limiting
    app.use(
      '/api',
      rateLimit({
        max: 100,
        windowMx: 1000 * 60 * 60,
        message: {
          ok: false,
          status: 'fail',
          message: 'Too many attempt, please try again in an hour!',
        },
      }),
    );

    // Body parser, insert data to req.body
    app.use(bodyParser.json({ limit: '10kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        parameterLimit: 100000,
        limit: '10kb',
      }),
    );
    // Cookie parser
    app.use(cookieParser());
    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());
    // Prevent XSS attacks
    app.use(xss());
    // Preventing parameters pollution
    app.use(hpp());
    // app.use('/api/v1/tours', hpp({ whitelist: ['duration', 'price] }));
    app.use(express.static(path.join(__dirname, '..', '..', 'public')));

    return true;
  } catch (err) {
    console.error(
      '❌ ~ ERROR  ~ in natours: src/middlewares/index.js at line 11 ~> ❗️',
      err,
    );
    return err;
  }
}

module.exports = bootstrapMiddlewares;
