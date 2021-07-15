const { raw } = require('objection');

const BaseDAO = require('../../core/base-dao');
const { ScheduleModel } = require('./model');
const knex = require('../../../../lib/db_connect');

class ScheduleDAO extends BaseDAO {
  constructor() {
    super(ScheduleModel);
  }

  fetchMany(opts = {}, trx) {
    return this.model
      .query(trx)
      .skipUndefined()
      .select(raw('COUNT(*) OVER() AS count'))
      .whereNull(`${this.tableName}.deleted_at`)
      .orderBy(`${this.tableName}.${this.query.orderColumn}`, this.query.order)
      .limit(opts.limit)
      .offset(opts.offset);
  }

  async checkSchedule(scheduleData) {
    const q = await knex.raw(`select * from schedule
    where (
            user_id = ${scheduleData.user_id}
            AND (
                (start_date BETWEEN '${scheduleData.start_date}' AND '${scheduleData.end_date}')
                OR (start_date <= '${scheduleData.start_date}' AND end_date >= '${scheduleData.end_date}')
            )
          )
          OR (
            class_id = ${scheduleData.class_id}
            AND (
                (start_date BETWEEN '${scheduleData.start_date}' AND '${scheduleData.end_date}')
                OR (start_date < '${scheduleData.start_date}' AND end_date > '${scheduleData.end_date}')
            )
          )
    `);

    return q.rows;
  }
}

module.exports = new ScheduleDAO();
