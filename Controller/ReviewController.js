const ReviewModel = require("../Models/ReviewModel");
const { CorrectMessage } = require("../utils/MessageSender");
const { createSchema } = require("../utils/splitFeatures");

const _ = require("lodash");

exports.createReview = createSchema(ReviewModel);

exports.IncreaseLike = async (req, res, next) => {
	try {
		let LikeId = req.user._id;
		

		let findId = false;
		const findReviewId = await ReviewModel.findOne({
			like: req.user._id,
		}).exec();

		if (findReviewId) findId = true;
		if (!findId) {
			const data = await ReviewModel.findByIdAndUpdate(
				{ _id: req.body._id },
				{ $push: { like: LikeId } },
				{
					upsert: true,
					new: true,
				}
			);
			CorrectMessage(201, data, res);
			return;
		}
		CorrectMessage(201, "Already Liked", res);
	} catch (error) {
		console.log(error);
	}
};

exports.IncreaseDislike = async (req, res, next) => {
	try {
		let DisLike = req.user._id;
		console.log(req.body._id);
		let findId = false;
		let check = false;

		const findReview = await ReviewModel.findById({
			_id: req.body._id,
		}).exec();
		console.log(findReview);
		const liked = findReview.like.map((e, k) => {
			if (e.toString() === DisLike.toString()) {
				findReview.like.splice(k, 1);
				check = true;
				return;
			}
		});

		const dislikes = findReview.dislike.map((e, k) => {
			if (e.toString() === DisLike.toString()) {
				findReview.dislike.splice(k, 1);

				return;
			}
		});
		let dis = "dislike";
		if (check) {
			findReview.dis.push(DisLike);
		}
		console.log("like data", liked);
		const finaldata = await ReviewModel.findByIdAndUpdate(
			{ _id: req.body._id },
			{ like: findReview.like, dislike: findReview.dislike },
			{ new: true }
		);

		//perfect
		// const findReviewIdfromdislike = await ReviewModel.findOne({
		// 	dislike: req.user._id,
		// }).exec();
		// if (findReviewIdfromdislike) findId = true;
		// if (!findId) {
		// 	const data = await ReviewModel.findByIdAndUpdate(
		// 		{ _id: req.body._id },
		// 		{ $push: { dislike: DisLike } },
		// 		{ upsert: true, new: true }
		// 	);
		// 	CorrectMessage(201, data, res);
		// }

		// CorrectMessage(201, "Already Disliked", res);
		console.log("find review : ", finaldata);
		CorrectMessage(201, finaldata, res);
	} catch (err) {
		console.log(err);
	}
};
