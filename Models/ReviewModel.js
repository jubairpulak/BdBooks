const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
	{
		review: String,

		createdAt: {
			type: Date,
			default: Date.now(),
		},
		like: [
			{
				type: ObjectId,			
				ref: "UserModel",
			},
		],
		dislike: [
			{
				type: ObjectId,				
				ref: "UserModel",
			},
		],
		book: {
			type: ObjectId,
			ref: "BookModel",
			required: [true, "Each review must be under a book"],
		},
		user: {
			type: ObjectId,
			ref: "UserModel",
			required: [true, "Each review must have a user"],
		},
	},
	{
		timestamps: true,
	}
);

reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: "user",
		select: "Item_Name -_id",
	});
	next();
});

module.exports = mongoose.model("ReviewModel", reviewSchema);
