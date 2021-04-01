const express = require("express")

const router = express.Router()

const {
	registration,
	login,
	protect,
	update_password,
	restrictedTo,
	forgotPassword,
	resetPassword,
	logincomplete,
} = require("../Controller/AuthController");
const {
	getallusers,
	getsingleUser,
	updateme,
} = require("../Controller/UserController");


router.route("/registration").post(registration)
router.route("/login").post(login)
router.route("/complete-login").patch(logincomplete);
router.route("/userdata").get( protect,getallusers)
router.route("/user-me").get( protect,getsingleUser)
router.route("/update-me").patch( protect,updateme)
router.route("/update-pass").patch( protect,update_password)


//forget password
router.post("/forgotpassword", forgotPassword)
router.patch("/resetPassword/:slug", resetPassword)

module.exports = router