const { raw } = require('objection');

const BaseDAO = require('../../core/base-dao');
const { UsersModel } = require('./model');

class UsersDAO extends BaseDAO {
  constructor() {
    super(UsersModel);
  }

  fetchMany(opts = {}, trx) {
    return this.model
      .query(trx)
      .skipUndefined()
      .select(raw('COUNT(*) OVER() AS count, *'))
      .whereNull(`${this.tableName}.deleted_at`)
      .orderBy(`${this.tableName}.id`, 'desc')
      .limit(opts.limit)
      .offset(opts.offset);
  }

  deactivate(id, trx) {
    return this.model
      .query(trx)
      .whereNull(`${this.tableName}.deleted_at`);
  }
}

module.exports = new UsersDAO();
