const Bookmodel = require("../Models/Bookmodel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { CorrectMessage } = require("../utils/MessageSender");
const { createSchema, getSchemas, findbyslug, Updatedata } = require("../utils/splitFeatures");
const slugify = (name) => name.split(" ").join("-").toLowerCase();

const sendMessage = (books, statuscode, res) => {
	res.status(statuscode).json({
		status: "success",
		Total: books.length,
		data: {
			books,
		},
	});
};

exports.CreateBook = createSchema(Bookmodel);

exports.getBooks = getSchemas(Bookmodel);

exports.getbook = findbyslug(Bookmodel);

exports.updateBook = Updatedata(Bookmodel)


class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		//get from query
		let queryObj = { ...this.queryString };
		const excludeFields = ["sort", "page", "fields", "limit"];
		//delete exclude fields from queryobj
		excludeFields.forEach((el) => delete queryObj[el]);
		//1 search
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`
		);
		this.query.find(JSON.parse(queryStr));
		return this;
	}

	sort() {
		if (this.queryString.sort) {
			console.log(this.queryString.sort);
			this.query = this.query.sort(this.queryString.sort);
		} else {
			this.query = this.query.sort("-createdAt");
		}

		return this;
	}

	pagination() {
		//select data by fields
		if (this.queryString.fields) {
			let fields = this.queryString.fields.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}

		const page = this.queryString.page * 1 || 1;
		const limit = 2 || this.queryString.limit;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

exports.searchBookByFields = async (req, res) => {
	try {
		const features = new APIFeatures(Bookmodel.find(), req.query)
			.filter()
			.sort()
			.pagination();
		let finddata = await features.query.populate({
			path: "Category",
			select: "categoryName -_id",
		});

		sendMessage(finddata, 201, res);
	} catch (error) {
		res.status(404).json({
			status: "failed",
			message: error,
		});
	}
};

exports.selectedData = (req, res, next) => {
	(req.query.limit = "3"),
		(req.query.fields = "language publisher updatedAt");
	req.query.sort = "-price";
	next();
};
