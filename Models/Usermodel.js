const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const JWT = require("jsonwebtoken")
const crypto = require("crypto");
const UserSchema = new mongoose.Schema(
	{
		Item_Name: {
			type: String,
			required: [true, "Each user must have a name"],
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordChangedAt: Date,
		password: {
			type: String,
			required: true,
		},
		passwordResetToken: String,
		passswordResetExpires: Date,
		slug: String,
		oneTimePasswordToken: String,
		resetOneTimepasswordExpires: Date,
		role: {
			type: String,
			default: "subscriber",
		},
	},
	{ timestamps: true }
);

UserSchema.statics.modifaipass = (password)=>{
    return bcryptjs.hash(password, 12)
}

UserSchema.statics.comparepassword = (storedpass, newpass)=>{
    return bcryptjs.compare(newpass, storedpass)
}

UserSchema.statics.resetToken = function(JwtToken){
    if(this.passwordChangedAt){
      const newpasswordToken = parseInt(this.passwordChangedAt.getTime() /100 , 10)
      return JwtToken < newpasswordToken
    }

    return false
    
}
const cryptoMaker = () => {
	const resetToken = crypto.randomBytes(32).toString("hex");
	const CryptoToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	const resetExpire = Date.now() + 10 * 60 * 1000;
	return { resetToken, CryptoToken, resetExpire };
};

UserSchema.methods.createPasswordResetToken = function () {
	const { resetToken, CryptoToken, resetExpire } = cryptoMaker();

	this.passwordResetToken = CryptoToken;
	console.log(resetToken, this.passwordResetToken);
	this.passswordResetExpires = resetExpire;
	return resetToken;
};
UserSchema.methods.CreateOTP = function () {
	const { resetToken, CryptoToken, resetExpire } = cryptoMaker();
	console.log(resetToken, CryptoToken, resetExpire);
	this.oneTimePasswordToken = CryptoToken;
	console.log(
		"Token info: ",
		resetToken,
		this.oneTimePasswordToken,
		resetExpire
	);
	this.resetOneTimepasswordExpires = resetExpire;
	return resetToken;
};

module.exports = mongoose.model("UserModel", UserSchema)