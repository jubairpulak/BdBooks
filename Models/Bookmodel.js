const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const BookSchema = new mongoose.Schema(
	{
		Item_Name: {
			type: String,
			unique: true,
			required: [true, " Data is missing"],
		},
		Category: {
			type: ObjectId,
			required: [true, "Data is missing"],
			ref: "categoryModel",
		},
		subCategory: {
			type: ObjectId,
			required: [true, "Data is missing"],
			ref: "subModel",
		},
		available: {
            type : Number,
            required: true
        },
		sold: Number,
		Price: {
			type: Number,
			required: [true, " Data is missing"],
		},
		NewPrice: {
			type: Number,
			default: 0,
		},
		slug: String,

		numberofpages: {
			type: Number,
			required: [true, " Data is missing"],
		},
		Country: {
			type: String,
			required: [true, " Data is missing"],
		},
		language: {
			type: String,
			required: [true, " Data is missing"],
		},
		publisher: {
			type: ObjectId,
			required: [true, " Data is missing"],
			ref: "Publishermodel",
		},
		writter: {
			type: ObjectId,
			required: [true, "Data is missing"],
			ref: "WritterModel",
		},
	},
	{ timestamps: true }
);



BookSchema.pre(/^find/, function (next) {
	this.populate({
		path: "Category",
		select: "Item_Name -_id",
	});
	this.populate({ path: "subCategory", select: "Item_Name -_id" });
	this.populate({ path: "publisher", select: "Item_Name -_id" });
	this.populate({ path: "writter", select: "Item_Name _id" });

	next();
});

module.exports = mongoose.model("BookModel", BookSchema)