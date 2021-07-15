const path = require('path');
const morgan = require('morgan');
const express = require('express');
const engine = require('ejs-mate');
const { format } = require('date-fns');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const response = require('./helpers/http/response');
const RS = require('./middleware/request');
const routes = require('./src/routes');
require('./lib/db_connect');

const app = express();

morgan.token('user', req => req.user && req.user.name);
morgan.token('date', () => format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
app.use(morgan(':date => :method :url :status :response-time ms :user'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use(RS.parseQuery);
app.use(RS.baseFilter);

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

routes(app);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const status = response.status.NOT_FOUND;
  const data = response.dispatch({
    error: 'Page not Found',
    code: status,
  });
  return res.status(status).json(data);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log('error => ', err);
  const status = err.status || response.status.INTERNAL_SERVER_ERROR;
  const data = response.dispatch({
    error: err.message || err,
    code: status,
  });
  res.status(status).json(data);
});

module.exports = app;
