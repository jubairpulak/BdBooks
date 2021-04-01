const {
	createSchema,
	getSchemas,
	Updatedata,
	getDashboardInfoforAdmin,
	getCustomerOrder,
} = require("../utils/splitFeatures");
const OrderModel = require("../Models/Ordermodel");

exports.CreateOrder = createSchema(OrderModel);
exports.getOrders = getSchemas(OrderModel);
exports.updateOrders = Updatedata(OrderModel);

exports.getOrderInformation = getDashboardInfoforAdmin(OrderModel);
exports.getSelfOrder = getCustomerOrder(OrderModel);
