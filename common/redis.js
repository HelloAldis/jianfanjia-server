var config = require('../config');
var Redis = require('ioredis');

var client = new Redis({
  port: config.redis_port,
  host: config.redis_host,
  db: config.redis_db,
  password: config.redis_pass,
});

exports = module.exports = client;
