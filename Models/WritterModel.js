const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const WritterSchema = new mongoose.Schema(
	{
		Item_Name: {
			type: String,
			required: [true, "Every writter must have a name"],
			unique: [true, "Name Already Exist"],
		},
		slug: String,
		description: {
			type: String,
			required: [true, "Every writter have some info"],
		},
		sold: Number,
		couponCode: Number,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("WritterModel", WritterSchema)