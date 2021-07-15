const response = require('../../../helpers/http/response');
const { memberAttr } = require('./private/model');
const classDAO = require('./private/dao');

exports.createClass = async (req, res, next) => {
  try {
    const values = req.body;

    const insertedClass = await classDAO.insert(values);

    const {
      deleted_at: deletedAt,
      ...parsedClass
    } = insertedClass;

    const status = response.status.CREATED;
    const data = response.dispatch({
      data: parsedClass,
      code: status,
    });
    return res.status(status).json(data);
  } catch (e) {
    return next(e);
  }
};

exports.getClasses = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const selectAttr = req.user.role === 'admin' ? 'class.*' : memberAttr;
    const classes = await classDAO.fetchMany({ limit, offset })
      .select(selectAttr);
    const data = response.dispatch({ data: classes });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getOneClass = async (req, res, next) => {
  try {
    const selectAttr = req.user.role === 'admin' ? 'class.*' : memberAttr;
    const classData = await classDAO.fetchById(req.params.id)
      .select(selectAttr)
      .whereNull('deleted_at')
      .eager('schedules.user');
    if (!classData) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'No such class',
        code: status,
      });
      return res.status(status).json(data);
    }
    const data = response.dispatch({
      data: classData,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const classData = await classDAO.fetchById(id)
      .whereNull('deleted_at');

    if (!classData) {
      const status = response.status.NOT_FOUND;
      const data = response.dispatch({
        error: 'No such class',
        code: status,
      });
      return res.status(status).json(data);
    }

    const updatedClass = await classDAO.update(id, req.body);

    const data = response.dispatch({
      data: updatedClass,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    await classDAO.remove(id);

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
