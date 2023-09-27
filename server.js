process.on('uncaughtException', (err) => {
  console.error('❗️ Uncaught Exception ❗', err.name, err.message);
  console.error('📝', err);
  console.log('----------------');
  process.exit(1);
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./src/app');

// - Inject environment variables
dotenv.config({ path: './.env' });

let DB;
if (process.env.NODE_ENV === 'development') {
DB = process.env.DB_URL_LOCAL;
} else {
  DB = process.env.DB_URL.replace(
    /<USERNAME>/,
    process.env.DB_USERNAME
  ).replace(/<PASSWORD>/, process.env.DB_PASSWORD);
}

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('✨', 'Mogodb connected successful.'))
  .catch((err) =>
    console.log('❌ ~ ERROR  ~ in natours: server.js ~> ❗', err),
  );

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log('✨ Listening on port ', PORT);
});

process.on('unhandledRejection', (err) => {
  console.error('❗️ Unhandled Rejection ❗', err.name, err.message);
  console.error('📝', err);
  console.log('----------------');
  server.close(() => {
    process.exit(1);
  });
});
