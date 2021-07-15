const nconf = require('../config');
const response = require('../helpers/http/response');
const BaseDAO = require('../src/components/core/base-dao');
const { parseDateTo, parseDateFrom } = require('../utils');

const query = nconf.get('query');

class RequestService {
  static parseQuery(req, res, next) {
    const limit = parseInt(req.query.limit, 10);
    req.limit = (limit >= query.limit_min && limit <= query.limit_max)
      ? limit : query.limit_default;

    const offset = parseInt(req.query.page, 10) - 1;
    req.offset = (offset >= query.offset_min)
      ? offset * req.limit : query.offset_default * req.limit;
    next();
  }

  static equalById(paramsId) {
    return (req, res, next) => {
      if (req.user.id !== parseInt(req.params[paramsId], 10) && req.user.role !== 'admin') {
        const status = response.status.FORBIDDEN;
        const data = response.dispatch({
          error: 'Permission denied',
          code: status,
        });
        return res.status(status).json(data);
      }
      return next();
    };
  }

  static baseFilter(req, res, next) {
    const filter = req.query;

    const q = {
      ...filter,
      orderColumn: filter.orderColumn || 'id',
      order: filter.order || 'desc',
    };

    if (filter.created_from || filter.created_to) {
      q.created_from = parseDateFrom(filter.created_from);
      q.created_to = parseDateTo(filter.created_to);
    }

    if (filter.updated_from || filter.updated_to) {
      q.updated_from = parseDateFrom(filter.updated_from);
      q.updated_to = parseDateTo(filter.updated_to);
    }

    if (filter.deleted_from || filter.deleted_to) {
      q.deleted_from = parseDateFrom(filter.deleted_from);
      q.deleted_to = parseDateTo(filter.deleted_to);
    }

    BaseDAO.prototype.query = q;
    next();
  }
}

module.exports = RequestService;
