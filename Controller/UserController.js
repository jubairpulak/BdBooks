const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const UserModel = require("../Models/Usermodel");
const Usermodel = require("../Models/Usermodel");
const AppError = require("../utils/appError");
const { CorrectMessage } = require("../utils/MessageSender");
const sendEmail = require("../utils/email");
const sendData = (users, statuscode, res) => {
	res.status(statuscode).json({
		status: "success",
		length: users.length,
		data: {
			users,
		},
	});
};
//filter obj
const filterdata = (obj, ...allowedfield) => {
	let newobj = {};
	Object.keys(obj).forEach((key) => {
		if (allowedfield.includes(key)) newobj[key] = obj[key];
	});
	return newobj;
};

exports.getallusers = async (req, res) => {
	const getallusers = await UserModel.find({}).exec();
	sendData(getallusers, 401, res);
};

exports.getsingleUser = async (req, res) => {
	sendData(req.user, 401, res);
};

exports.updateme = async (req, res) => {
	const updatefield = filterdata(req.body, "name", "email");

	const id = req.user._id;
	const updateUser = await UserModel.findByIdAndUpdate(id, updatefield, {
		new: true,
		runValidators: true,
	}).exec();

	sendData(updateUser, 401, res);
};
