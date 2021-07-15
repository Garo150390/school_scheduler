const path = require('path');
const { Model } = require('objection');
const { memberAttr: userMemberAttr } = require('../../users/private/model');
const { memberAttr: classMemberAttr } = require('../../class/private/model');

const memberAttr = [
  'schedule.id',
  'schedule.start_date',
  'schedule.end_date',
];

class ScheduleModel extends Model {
  static get tableName() {
    return 'schedule';
  }

  $beforeUpdate() {
    if (!this.deleted_at) {
      this.updated_at = new Date();
    }
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.resolve(__dirname, '../../users/private/model'),
        join: {
          from: 'schedule.user_id',
          to: 'users.id',
        },
        modify: (builder) => {
          builder
            .select(userMemberAttr)
            .whereNull('deleted_at');
        },
      },

      class: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.resolve(__dirname, '../../class/private/model'),
        join: {
          from: 'schedule.class_id',
          to: 'class.id',
        },
        modify: (builder) => {
          builder
            .select(classMemberAttr)
            .whereNull('deleted_at');
        },
      },
    };
  }
}

module.exports = {
  ScheduleModel,
  memberAttr,
};
