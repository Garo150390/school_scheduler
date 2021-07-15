const response = require('../../../helpers/http/response');
const { updateToken } = require('../token/authToken');
const { memberAttr } = require('./private/model');
const TokenDAO = require('../token/private/dao');
const userDAO = require('./private/dao');

exports.createUsers = async (req, res, next) => {
  try {
    const values = req.body;

    const user = await userDAO.fetchOne({ email: req.body.email });

    if (user) {
      const status = response.status.UNPROCESSABLE_ENTITY;
      const data = response.dispatch({
        error: 'User is registered, please enter other phone number or email',
        code: status,
      });
      return res.status(status).json(data);
    }

    const insertedUser = await userDAO.insert(values);

    const {
      hash,
      role,
      deleted_at: deletedAt,
      ...parsedUser
    } = insertedUser;

    const tokens = await updateToken(insertedUser.id);

    const status = response.status.CREATED;
    const data = response.dispatch({
      data: { user: parsedUser, tokens },
      code: status,
    });
    return res.status(status).json(data);
  } catch (e) {
    if (e.name === 'UniqueViolationError') {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'User is registered, please enter other email',
        code: status,
      });
      return res.status(status).json(data);
    }
    return next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const values = req.body;
    const user = await userDAO.fetchOne({ email: values.email });
    if (!user) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Such user not found',
        code: status,
      });
      return res.status(status).json(data);
    }

    if (!user.checkPassword(req.body.password)) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Wrong password',
        code: status,
      });
      return res.status(status).json(data);
    }

    const {
      hash,
      role,
      deleted_at: deletedAt,
      ...parsedUser
    } = user;

    const tokens = await updateToken(user.id);
    const data = response.dispatch({
      data: { tokens, user: parsedUser },
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    const { id } = req.user;

    await TokenDAO.removeToken(id);
    const data = response.dispatch({});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getUsers = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const users = await userDAO.fetchMany({ limit, offset });
    const data = response.dispatch({ data: users });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    const selectAttr = req.user.role === 'admin' ? 'users.*' : memberAttr;
    const user = await userDAO.fetchById(req.params.id)
      .select(selectAttr)
      .whereNull('deleted_at')
      .eager('schedules.class')
      .modifyEager('schedules', (builder) => {
        builder.select(['end_date', 'start_date']);
      });
    if (!user) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'No such user',
        code: status,
      });
      return res.status(status).json(data);
    }
    const data = response.dispatch({
      data: user,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.updateUsers = async (req, res, next) => {
  try {
    if ('role' in req.body && req.user.role !== 'admin') {
      const status = response.status.FORBIDDEN;
      const data = response.dispatch({
        error: 'permission denied, role is invariable',
        code: status,
      });
      return res.status(status).json(data);
    }

    let { user } = req;
    if (user.role !== 'member') user = await userDAO.fetchById(req.params.id);

    if (!user) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Such user not found',
        code: status,
      });
      return res.status(status).json(data);
    }

    const selectAttr = req.user.role === 'admin' ? 'users.*' : memberAttr;
    const [updateData] = await userDAO.patchMany(req.body, { id: req.params.id })
      .returning(selectAttr);
    const data = response.dispatch({
      data: updateData,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.removeUsers = async (req, res, next) => {
  try {
    await userDAO.deactivate(req.params.id);
    await TokenDAO.removeToken(req.params.id);
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
