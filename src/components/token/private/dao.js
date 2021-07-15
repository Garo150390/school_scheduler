const BaseDAO = require('../../core/base-dao');
const { TokensModel } = require('./model');

class TokenDAO extends BaseDAO {
  constructor() {
    super(TokensModel);
  }

  removeToken(userId, trx) {
    return this.model
      .query(trx)
      .delete()
      .where({ user_id: userId });
  }
}

module.exports = new TokenDAO();
