const nconf = require('./config');

const config = nconf.get('db');

module.exports = config;
