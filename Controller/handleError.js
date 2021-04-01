const AppError = require("../utils/appError");
const handleDuplicateError = (error) => {
	// console.log( "message : ", error.message)
	const value = error.sendMessage.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
	console.log(value);
	const msg = `Duplicate Field value : ${value}, Use Other value`;
	console.log("message : ", msg);
	return new AppError(msg, 400);
};
const handleValidationError = (error) => {
	console.log("error found : ", "jubair pulak");
	const errors = Object.values(error.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(". ")}`;
	console.log("jubair");
	return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};
const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message || err.sendMessage,
		});
	} else {
		res.status(500).json({
			status: "error",

			message: "Something error",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		error.sendMessage = err.message;

		if (error.isOperational === true) {
			sendErrorProd(error, res);
		} else {
			console.log("error", error);
			if (error.code === 11000) {
				error = handleDuplicateError(error);
				sendErrorProd(error, res);
			}
			if (error.errors.Item_Name.name === "ValidatorError") {
				error = handleValidationError(error);
				sendErrorProd(error, res);
			}
		}
	}
};
