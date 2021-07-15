const path = require('path');
const crypto = require('crypto');
const { raw } = require('objection');
const { Model } = require('objection');

const nconf = require('../../../../config');

const salt = nconf.get('salt');

const memberAttr = [
  'users.id',
  'users.name',
  'users.surname',
  'users.phone',
  'users.email',
  'users.gender',
];

class UsersModel extends Model {
  static get tableName() {
    return 'users';
  }

  $beforeUpdate() {
    if (this.password) {
      this.hash = this.getHash(this.password);
      delete this.password;
    }

    if (!this.deleted_at) {
      this.updated_at = new Date();
    } else {
      const date = new Date().toISOString();
      this.phone = raw(`CONCAT(??, '_deleted_${date}')`, 'phone');
      this.email = raw(`CONCAT(??, '_deleted_${date}')`, 'email');
    }
  }

  $beforeInsert() {
    if (this.password) {
      this.hash = this.getHash(this.password);
      delete this.password;
    }
  }

  getHash(password) {
    let c = crypto.createHmac('sha1', salt);
    c = c.update(password);
    return c.digest('hex');
  }

  checkPassword(data) {
    return this.getHash(data) === this.hash;
  }

  static get relationMappings() {
    return {
      schedules: {
        relation: Model.HasManyRelation,
        modelClass: path.resolve(__dirname, '../../schedule/private/model'),
        join: {
          from: 'users.id',
          to: 'schedule.user_id',
        },
        modify: (builder) => {
          builder
            .select(['end_date', 'start_date'])
            .whereNull('deleted_at');
        },
      },
    };
  }
}

module.exports = {
  UsersModel,
  memberAttr,
};
