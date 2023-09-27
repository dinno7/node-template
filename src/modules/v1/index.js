// !! ATTENTION:
// >> Don not change this file, just add routes to /src/modules/v*/routes.js
// - Your declared routes in ./routes.js, added here automatically.

const { AppError } = require('../../utils');
const errorController = require('./global/error.controller');
const allRoutes = require('./routes');

function bootstrapRoutes(app) {
  try {
    const apiVersion = __dirname.split('/').at(-1);
    Object.keys(allRoutes).forEach((route) => {
      app.use(`/api/${apiVersion}/${route}`, allRoutes[route]);
    });

    // >> Handle 404 routes on service
    app.all('*', (req, res, next) =>
      next(
        new AppError(`Can't find (${req.originalUrl}) on this service.`, 400),
      ),
    );

    // >> Global error handler
    app.use(errorController);

    return true;
  } catch (err) {
    console.error(
      '❌ ~ ERROR  ~ in natours: src/modules/v1/index.js at line 7 ~> ❗',
      err,
    );
    return err;
  }
}

module.exports = bootstrapRoutes;
