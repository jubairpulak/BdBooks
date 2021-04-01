const Usermodel = require("../Models/Usermodel");
const UserModel = require("../Models/Usermodel");
const JWT = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { CorrectMessage } = require("../utils/MessageSender");
const crypto = require("crypto");
const { slugify } = require("../utils/slugify");
const validateEmail = (email) => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

const SendEmailFromAuth =async  (user, message, res) =>  {
	try {
		console.log(message)
		await sendEmail({
			email: user.email,
			subject: "Your Password reset token (valid for 10 min)",
			message,
		});
		res.status(200).json({
			status: "success",
			message: "Token sent to email!",
		});
	} catch (error) {
		user.oneTimePasswordToken = undefined;
		user.resetOneTimepasswordExpires = undefined;
		user.passwordResetToken = undefined;
		user.passswordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		console.log(error);
		res.status(200).json({
			status: "failed",
			message: "There was an error sending the email, Try again leter!"
		});
		
	}
};

const TokenFunction = (req) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		return (token = req.headers.authorization.split(" ")[1]);
	}
};

const signToken = (userId) => {
	

	return JWT.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};
const sendToken = (user, statuscode, res) => {
	console.log("u id", user._id);
	const token = signToken(user._id);
	const cookieOptions = {
		expires : new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 *60 *1000
		),
		
		httpOnly : true
	}
	if(process.env.NODE_ENV === 'production') cookieOptions.secure = true
	user.password = undefined
	res.cookie('jwt', token, cookieOptions )
	res.status(statuscode).json({
		status: "successs",
		token,
		data: {
			user,
		},
	});
};

const createHasToken = (token) =>
	crypto.createHash("sha256").update(token).digest("hex");

exports.registration = async (req, res) => {
	const { Item_Name, email, password, role } = req.body;
	console.log(Item_Name, email, password, role);
	req.body.slug = slugify(Item_Name);

	const userdata = await UserModel.findOne({ email });

	if (userdata) {
		console.log("Email is  found");
		res.status(401).send("Email is existed");
	} else {
		req.body.password = await UserModel.modifaipass(password);
		console.log(req.body.password);
		const emailvalidationcheck = validateEmail(email);
		if (!emailvalidationcheck) {
			res.status(401).send("Email is not valid");
		}

		const data = await UserModel(req.body).save();
		console.log("registration Complete");
		sendToken(data, 201, res);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		console.log(email, password);
		if (!email || !password) {
			res.status(401).send("Email or password is empty");
		}

		const finduserbyemail = await UserModel.findOne({ email });
		console.log(finduserbyemail);
		if (!finduserbyemail) {
			res.status(401).send("Email is not valid");
		}
		const verifypassword = await Usermodel.comparepassword(
			finduserbyemail.password,
			password
		);
		if (!verifypassword) {
			res.status(401).send("Password is not correct");
		}
		//Important for future
		//oneTimePassword
		// const resetToken = finduserbyemail.CreateOTP();
		//  console.log("resetToken", resetToken)

		// await finduserbyemail.save({ validateBeforeSave: false });
		// const message = `For Login : Use This ${resetToken} token as OTP within 10 minutes`;
		// SendEmailFromAuth(finduserbyemail, message, res, next);
//end here
		sendToken(finduserbyemail, 201, res)
	} catch (error) {
		console.log(error);
	}
};

exports.logincomplete =async (req, res, next) => {
    
    
        const oneTimePasswordToken = createHasToken(req.body.otp);
        console.log("hashedOTp",oneTimePasswordToken)
        slug = "jubair-pulak"
    const user = await Usermodel.findOne({oneTimePasswordToken})
    // const user = await UserModel.findOne({
	// 	// oneTimePasswordToken: hashedOtp
    //     slug:"jubair-pulak"
	// 	// resetOneTimepasswordExpires: { $gt: Date.now() },
	// });
    console.log("user", user)

   	//2) IF TOKEN HAS  EXPIRED SET PASS
	if (!user) {
		return next(new AppError("OTP is invalid or has expired", 400));
	}
	
    user.oneTimePasswordToken = undefined;
    user.resetOneTimepasswordExpires = undefined;
	user.passwordResetToken = undefined;
	user.passswordResetExpires = undefined;
	await user.save();
	// 5 LOGGD THE USER IN
	sendToken(user, 201, res);
 
	

};

exports.protect = async (req, res, next) => {
	const getToken = TokenFunction(req);

	const decodetoken = await JWT.verify(getToken, process.env.JWT_SECRET);

	const finduser = await UserModel.findById({
		_id: decodetoken.userId,
	}).exec();
	const verifyresetToken = await Usermodel.resetToken(decodetoken.iat);
	if (verifyresetToken) {
		res.status(401).send("Invalid Token, log in again please");
	}
	req.user = finduser;

	next();
};

exports.update_password = async (req, res) => {
	const { newpassword, confirmpassword, currentpassword } = req.body;
	const id = req.user._id;
	const checkpass = await Usermodel.comparepassword(
		req.user.password,
		currentpassword
	);
	if (!checkpass) {
		res.status(401).send("Password is not correct");
	}

	if (newpassword !== confirmpassword) {
		res.status(401).send("Your given password are not matched");
	}
	const modifaipass = await UserModel.modifaipass(newpassword);
	console.log(modifaipass);
	const UpdatePass = await UserModel.findByIdAndUpdate(
		id,
		{ password: modifaipass, passwordChangedAt: Date.now() },
		{ runValidators: true }
	);
	if (!UpdatePass) {
		res.status(401).send("Sorry, your password is not update");
	}

	sendToken(UpdatePass, 201, res);
};

exports.restrictedTo = (...role) => {
	return (req, res, next) => {
		if (!role.includes(req.user.role)) {
			return next(res.status(401).send("Only admin can do this work"));
		}

		next();
	};
};

exports.forgotPassword = async (req, res, next) => {
	const user = await Usermodel.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError("There is no user with email address", 404));
	}

	const resetToken = user.createPasswordResetToken();
	console.log("reset Token: ", resetToken);
	await user.save({ validateBeforeSave: false });

	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/resetPassword/${resetToken}`;

	const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to : ${resetUrl}.`;

	console.log(message , "message")
	SendEmailFromAuth(user, message, res);
};
exports.resetPassword = catchAsync(async (req, res, next) => {
	//1) GET USER BASED ON THE TOKEN

	const hasedToken = createHasToken(req.params.slug);

	const user = await UserModel.findOne({
		passwordResetToken: hasedToken,
		passswordResetExpires: { $gt: Date.now() },
	});
	//2) IF TOKEN HAS NOT EXPIRED SET PASS
	if (!user) {
		return next(new AppError("Token is invalid or has expired", 400));
	}
	//3 UPDATE CHANGED PASSWORDaT
	user.password = await UserModel.modifaipass(req.body.password);
	//4 RESET OTHERS

	user.passwordResetToken = undefined;
	user.passswordResetExpires = undefined;
	await user.save();
	//5 LOGGD THE USER IN
	const token = signToken(user._id);
	CorrectMessage(201, token, res);
});
