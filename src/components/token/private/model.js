const { Model } = require('objection');

class TokensModel extends Model {
  static get tableName() {
    return 'tokens';
  }

  $beforeUpdate() {
    if (!this.deleted_at) {
      this.updated_at = new Date();
    }
  }

  static get relationMappings() {
    return {
    };
  }
}

module.exports = {
  TokensModel,
};
