const CartModel = require("../Models/Cartmodel");
const {
	createSchema,
	getSchemas,
	removefromSchema,
} = require("../utils/splitFeatures");

exports.AddtoCart = createSchema(CartModel);

exports.getCart = getSchemas(CartModel, (checkcart = true));
exports.removeCart = removefromSchema(CartModel);
