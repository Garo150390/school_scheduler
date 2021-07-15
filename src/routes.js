const usersRouter = require('./components/users/api');
const tokenRouter = require('./components/token/api');
const classRouter = require('./components/class/api');
const scheuleRouter = require('./components/schedule/api');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/refresh', tokenRouter);
  app.use('/class', classRouter);
  app.use('/schedule', scheuleRouter);
};
