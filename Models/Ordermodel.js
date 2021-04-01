const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const OrderModel = new mongoose.Schema(
	{
		Books: [
			{
				Book: {
					type: ObjectId,
					ref: "BookModel",
				},

				totalOrder: Number,
			},
		],
		OrderBy: {
			type: ObjectId,
			ref: "UserModel",
		},

		orderStatus: {
			type: String,
			default: "Not Processed",
			enum: [
				"Not Processed",
				"Cash on Delivery",
				"Processing",
				"Dispatched",
				"Cancelled",
				"Completed",
			],
		},
		totalPrice: Number,
		DeliveryLocation: String,
		DeliveryCharge: Number,
		PhoneNumber: Number,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("OrderSchema", OrderModel);
