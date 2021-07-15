const response = require('../../../helpers/http/response');
const { checkWeekday } = require('../../../utils');
const { memberAttr } = require('./private/model');
const classDAO = require('../class/private/dao');
const userDAO = require('../users/private/dao');
const scheduleDAO = require('./private/dao');

exports.schedule = async (req, res, next) => {
  try {
    const { start_date: startDate, end_date: endDate } = req.body;
    const { classId, userId } = req.params;
    const isWeekDay = checkWeekday(startDate) && checkWeekday(endDate);

    const classData = await classDAO.fetchOne({ id: classId });
    const user = await userDAO.fetchOne({ id: userId, role: 'teacher' });

    if (!user) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Wrong userId',
        code: status,
      });
      return res.status(status).json(data);
    }

    if (!classData) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Wrong classId',
        code: status,
      });
      return res.status(status).json(data);
    }

    if (!isWeekDay) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Please choose a weekday',
        code: status,
      });
      return res.status(status).json(data);
    }

    const values = {
      start_date: startDate,
      end_date: endDate,
      class_id: classId,
      user_id: userId,
    };

    const isScheduled = await scheduleDAO.checkSchedule(values);

    if (isScheduled.length) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'You can\'t schedule in this time',
        code: status,
      });
      return res.status(status).json(data);
    }

    const insertedData = await scheduleDAO.insert(values);

    delete insertedData.deleted_at;
    delete insertedData.user_id;
    delete insertedData.class_id;

    insertedData.user = user;
    insertedData.class = classData;

    const status = response.status.CREATED;
    const data = response.dispatch({
      data: insertedData,
      code: status,
    });
    return res.status(status).json(data);
  } catch (e) {
    return next(e);
  }
};

exports.getSchedule = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const classes = await scheduleDAO.fetchMany({ limit, offset })
      .select(memberAttr)
      .eager('[user, class]');
    const data = response.dispatch({ data: classes });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getOneSchedule = async (req, res, next) => {
  try {
    const schedule = await scheduleDAO.fetchById(req.params.id)
      .select(memberAttr)
      .whereNull('deleted_at')
      .eager('[user, class]');
    if (!schedule) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'No scheduled data',
        code: status,
      });
      return res.status(status).json(data);
    }
    const data = response.dispatch({
      data: schedule,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await scheduleDAO.fetchById(id)
      .whereNull('deleted_at');

    if (!schedule) {
      const status = response.status.NOT_FOUND;
      const data = response.dispatch({
        error: 'No scheduled data',
        code: status,
      });
      return res.status(status).json(data);
    }

    await scheduleDAO.update(id, req.body);
    const updatedSchedule = await scheduleDAO.fetchById(id)
      .select(memberAttr)
      .eager('[user, class]');

    const data = response.dispatch({
      data: updatedSchedule,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    await scheduleDAO.remove(id);

    const status = response.status.NO_CONTENT;
    const data = response.dispatch({
      data: 'DELETED',
      code: status,
    });
    return res.status(status).json(data);
  } catch (e) {
    return next(e);
  }
};
