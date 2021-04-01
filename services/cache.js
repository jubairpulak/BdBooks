// const mongoose = require("mongoose");
// const util = require("util");
// const redis = require("redis");
// const ip = require("ip");
// const { JsonWebTokenError } = require("jsonwebtoken");
// const redisUrl = "redis://127.0.0.1:6379";
// const client = redis.createClient(redisUrl);

// client.get = util.promisify(client.get);
// const exec = mongoose.Query.prototype.exec;

// mongoose.Query.prototype.exec = async function () {
// 	const ipaddress = ip.address().split(".").join("");
// 	const key = JSON.stringify(
// 		Object.assign(
// 			{},
// 			{ _id: ipaddress },
// 			{
// 				collection: this.mongooseCollection.name,
// 			}
// 		)
// 	);
// 	// see if we have a value for ke
// 	const cacheValue = await client.get(key);
// 	// if we do, return that
// 	if (cacheValue) {
// 		const doc = JSON.parse(cacheValue);

// 		return Array.isArray(doc)
// 			? doc.map((d) => new this.model(d))
// 			: new this.model(doc);
// 	}

// 	//otherwise issue new query and store it into redis
// 	const result = await exec.apply(this, arguments);
// 	console.log("result : ", result);
// 	client.set(key, JSON.stringify(result));
// 	return result;
// };
