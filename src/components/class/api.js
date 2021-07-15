const express = require('express');

const { validateSchema, ajv } = require('../../../lib/validation');
const passport = require('../../../lib/passport');
const Auth = require('../../../middleware/auth');
const classCtr = require('./service');

const classUpdateSchema = require('./validate/class-update');
const classCreateSchema = require('./validate/class');

ajv.addSchema(classUpdateSchema, 'classUpdate');
ajv.addSchema(classCreateSchema, 'class');

const classRouter = express.Router();

classRouter.use(passport.authenticate('jwt', { session: false }));

classRouter.post('/', validateSchema('class'), classCtr.createClass);

classRouter.get('/', classCtr.getClasses);

classRouter.get('/:id', classCtr.getOneClass);
classRouter.put('/:id', Auth.authorizeRequest('admin'), validateSchema('classUpdate'), classCtr.updateClass);
classRouter.delete('/:id', Auth.authorizeRequest('admin'), classCtr.delete);

module.exports = classRouter;
