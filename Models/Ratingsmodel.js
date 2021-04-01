const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const RatingsSchema = new mongoose.Schema({
	rating: {
		type: Number,
		min: [1, "Ratings should not be less then 1"],
		max: [5, "Ratins must be less then or equal 5"],
	},
	

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
});

module.exports = mongoose.model("RatingsModel", RatingsSchema);
