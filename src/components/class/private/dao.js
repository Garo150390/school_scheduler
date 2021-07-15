const { raw } = require('objection');

const BaseDAO = require('../../core/base-dao');
const { ClassModel } = require('./model');

class ClassDAO extends BaseDAO {
  constructor() {
    super(ClassModel);
  }

  fetchMany(opts = {}, trx) {
    return this.model
      .query(trx)
      .skipUndefined()
      .select(raw('COUNT(*) OVER() AS count'))
      .whereNull(`${this.tableName}.deleted_at`)
      .orderBy(`${this.tableName}.id`, 'desc')
      .limit(opts.limit)
      .offset(opts.offset);
  }
}

module.exports = new ClassDAO();
