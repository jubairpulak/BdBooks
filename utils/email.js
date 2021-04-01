const nodemailer = require("nodemailer");

const sendEmail = async (Options) => {
	//create a transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	// define the email options
	const mailOptions = {
		from: "Jubair Pulak <jubair@gmail.com>",
		to: Options.email,
		subject: Options.subject,
		text: Options.message,
	};
	//send the email
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
