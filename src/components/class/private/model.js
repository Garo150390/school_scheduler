const path = require('path');
const { Model } = require('objection');

const memberAttr = [
  'class.id',
  'class.name',
  'class.start_date',
  'class.end_date',
  'class.number_of_seats',
];

class ClassModel extends Model {
  static get tableName() {
    return 'class';
  }

  $beforeUpdate() {
    if (!this.deleted_at) {
      this.updated_at = new Date();
    }
  }

  static get relationMappings() {
    return {
      schedules: {
        relation: Model.HasManyRelation,
        modelClass: path.resolve(__dirname, '../../schedule/private/model'),
        join: {
          from: 'class.id',
          to: 'schedule.class_id',
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
  ClassModel,
  memberAttr,
};
