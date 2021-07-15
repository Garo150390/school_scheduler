const { raw } = require('objection');

class BaseDAO {
  constructor(model) {
    this.model = model;
    this.tableName = model.tableName;
  }

  fetchMany(opts, trx) {
    const q = this.model
      .query(trx)
      .skipUndefined()
      .select(raw(`COUNT(${this.tableName}.*) OVER() AS count, ${this.tableName}.*`))
      .orderBy(`${this.tableName}.${this.query.orderColumn}`, this.query.order)
      .limit(opts.limit)
      .offset(opts.offset);

    if (this.query.created_from && this.query.created_to) q.whereBetween(`${this.tableName}.created_at`, [this.query.created_from, this.query.created_to]);
    if (this.query.updated_from && this.query.updated_to) q.whereBetween(`${this.tableName}.updated_at`, [this.query.updated_from, this.query.updated_to]);
    if (this.query.deleted_from && this.query.deleted_to) {
      q.whereBetween(`${this.tableName}.deleted_at`, [this.query.deleted_from, this.query.deleted_to]);
    } else {
      q.whereNull(`${this.tableName}.deleted_at`);
    }

    if (this.query.id) q.where(`${this.tableName}.id`, this.query.id);

    return q;
  }

  fetchOne(options, trx) {
    return this.model
      .query(trx)
      .whereNull('deleted_at')
      .findOne(options);
  }

  fetchById(id, trx) {
    return this.model
      .query(trx)
      .skipUndefined()
      .findById(id);
  }

  insert(values, trx) {
    return this.model
      .query(trx)
      .insert(values)
      .returning('*');
  }

  update(id, update, trx) {
    return this.model
      .query(trx)
      .patchAndFetchById(id, update);
  }

  patchMany(update, where, trx) {
    return this.model
      .query(trx)
      .patch(update)
      .where(where)
      .returning('*');
  }

  remove(id, trx) {
    return this.model
      .query(trx)
      .patch({ deleted_at: new Date() })
      .whereNull('deleted_at')
      .where({ id })
      .returning('*');
  }

  removeById(id, trx) {
    return this.model
      .query(trx)
      .deleteById(id);
  }
}

module.exports = BaseDAO;
