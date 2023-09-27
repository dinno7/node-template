// >> 3-party-modules
const express = require('express');

const bootstrapMiddlewares = require('./middlewares');
const bootstrapRoutes = require('./modules/v1');

const app = express();

bootstrapMiddlewares(app); // - Middlewares registration
bootstrapRoutes(app); // - Routes registration

module.exports = app;
