module.exports.redisClient = require("redis").createClient({
	url: process.env.REDIS_CONNECT,
});
