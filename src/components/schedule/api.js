const express = require('express');

const { validateSchema, ajv } = require('../../../lib/validation');
const passport = require('../../../lib/passport');
const Auth = require('../../../middleware/auth');
const scheduleCtr = require('./service');

const scheduleUpdateSchema = require('./validate/schedule-update');
const scheduleCreateSchema = require('./validate/schedule');

ajv.addSchema(scheduleUpdateSchema, 'scheduleUpdate');
ajv.addSchema(scheduleCreateSchema, 'schedule');

const scheduleRouter = express.Router();

scheduleRouter.use(passport.authenticate('jwt', { session: false }), Auth.authorizeRequest('admin'));

scheduleRouter.post('/class/:classId/users/:userId', validateSchema('schedule'), scheduleCtr.schedule);

scheduleRouter.get('/', scheduleCtr.getSchedule);

scheduleRouter.get('/:id', scheduleCtr.getOneSchedule);
scheduleRouter.put('/:id', validateSchema('scheduleUpdate'), scheduleCtr.updateSchedule);
scheduleRouter.delete('/:id', scheduleCtr.delete);

module.exports = scheduleRouter;
