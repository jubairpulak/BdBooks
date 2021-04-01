const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CartSchema = new mongoose.Schema(
	{
		UserId: {
			type: ObjectId,
			ref: "UserModel",
		},
		CartBookId: {
			type: ObjectId,

			ref: "BookModel",
		},
		Price: Number,
		WritterId: {
			type: ObjectId,
			ref: "WritterModel",
		},
	},
	{ timestamps: true }
);

CartSchema.pre(/^find/, function (next) {
	this.populate({
		path: "CartBookId",
		select: "Item_Name Price NewPrice Category_id",
	});

	next();
});
module.exports = mongoose.model("CartSchema", CartSchema);
