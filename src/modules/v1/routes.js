const tourRoutes = require('./tour/tour.routes');
const userRoutes = require('./user/user.routes');
const reviewRoutes = require('./review/review.routes');

const routes = {
  tours: tourRoutes,
  users: userRoutes,
  reviews: reviewRoutes
  // - just add new route here...
};

module.exports = routes;
