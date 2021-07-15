const express = require('express');

const RS = require('../../../middleware/request');
const passport = require('../../../lib/passport');
const Auth = require('../../../middleware/auth');
const usersCtr = require('./service');
const {
  validateSchema, ajv,
} = require('../../../lib/validation');

const usersUpdateSchema = require('./validate/users-update');
const usersCreateSchema = require('./validate/users');
const passwordSchema = require('./validate/password');
const loginSchema = require('./validate/login');

ajv.addSchema(usersUpdateSchema, 'usersUpdate');
ajv.addSchema(usersCreateSchema, 'users');
ajv.addSchema(passwordSchema, 'password');
ajv.addSchema(loginSchema, 'login');

const usersRouter = express.Router();

usersRouter.post('/', validateSchema('users'), usersCtr.createUsers);
usersRouter.post('/login', validateSchema('login'), usersCtr.login);

usersRouter.use(passport.authenticate('jwt', { session: false }));

usersRouter.get('/', Auth.authorizeRequest('admin'), usersCtr.getUsers);
usersRouter.post('/logout', usersCtr.logOut);

usersRouter.get('/:id', RS.equalById('id'), usersCtr.getOneUser);
usersRouter.put('/:id', RS.equalById('id'), validateSchema('usersUpdate'), usersCtr.updateUsers);
usersRouter.delete('/:id', RS.equalById('id'), usersCtr.removeUsers);

module.exports = usersRouter;
