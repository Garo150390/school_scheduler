const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const TokenDAO = require('../private/dao');
const conf = require('../../../../config');

const secret = conf.get('JWT_SECRET') || conf.get('jwt:secret');

module.exports.generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: conf.get('jwt:tokens:access:type'),
  };
  const options = { expiresIn: conf.get('jwt:tokens:access:expiresIn') };
  return jwt.sign(payload, secret, options);
};

module.exports.generateRefreshToken = () => {
  const payload = {
    id: uuidv4(),
    type: conf.get('jwt:tokens:refresh:type'),
  };
  const options = { expiresIn: conf.get('jwt:tokens:refresh:expiresIn') };
  return {
    id: payload.id,
    token: jwt.sign(payload, secret),
  };
};

module.exports.replaceDbRefreshToken = async (tokenId, userId) => {
  try {
    await TokenDAO.removeToken(userId);
    return await TokenDAO.insert({ token_id: tokenId, user_id: userId });
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
