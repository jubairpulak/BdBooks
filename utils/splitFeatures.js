const AppError = require("./appError");
const catchAsync = require("./catchAsync");
const { erorMessage, CorrectMessage } = require("./MessageSender");
const { slugify } = require("./slugify");
const ReviewModel = require("../Models/ReviewModel");
const BookModel = require("../Models/Bookmodel");
const WritterModel = require("../Models/WritterModel");
const redis = require("redis");
const ip = require("ip");
const CartModel = require("../Models/Cartmodel");
const _ = require("lodash");
const { update } = require("../Models/Cartmodel");
const Bookmodel = require("../Models/Bookmodel");

//find each data using slug or id
const finddatausingslug = (slug, Model) => Model.findOne({ slug }).exec();

exports.createSchema = (Model) =>
	catchAsync(async (req, res, next) => {
		if (req.body.Item_Name) {
			const { Item_Name } = req.body;
			req.body.slug = slugify(Item_Name);
			req.body.NewPrice = req.body.Price;
		}
		if (req.body.review || req.body.rating) {
			req.body.user = req.user._id;
			req.body.book = req.params.bookId;
			console.log(req.params.bookId);
		}

		if (req.body.CartBookId) {
			req.body.UserId = req.user._id;
			//book id is available at cart or not
			console.log(req.user.id);

			const checkBookId = await Model.find({
				UserId: req.user.id,
				CartBookId: req.body.CartBookId,
			}).exec();
			console.log("check", checkBookId.length);
			if (checkBookId.length) {
				return next(new AppError("Allready Added", 201));
			}
			const BookData = await BookModel.findOne({
				_id: req.body.CartBookId,
			}).exec();

			const price =
				BookData.NewPrice > 0 ? BookData.NewPrice : BookData.Price;

			req.body.Price = price;
			req.body.WritterId = BookData.writter._id;

			// console.log("WritterId : ",BookData.writter._id, "Price :", price)
		}
		//order

		if (req.body.Carts) {
			let product = [];
			let BookData = [];
			// CartId = req.body
			// const {total}= req.body.Carts.total
			let arr = [];
			const getallfrombody = req.body.Carts.map((e) => arr.push(e.total));
			console.log("all data : ", arr);

			for (let i = 0; i < arr.length; i++) {
				let obj = {};

				let findSingleCart = await CartModel.find({
					_id: req.body.Carts[i].CartId,
				});

				let latestPrice = 0;

				findSingleCart.map((e) => {
					obj.Book = e.CartBookId;
					obj.totalOrder = req.body.Carts[i].total;
					latestPrice = e.Price * obj.totalOrder;
				});

				findSingleCart.aftermulitiplywithcount = latestPrice;
				product.push(findSingleCart);
				BookData.push(obj);

				//reduce every from mongoose
				findSingleCart.map(async (e) => {
					const findbook = await BookModel.findById({
						_id: e.CartBookId._id,
					});

					let val = arr[i];
					const updatebooktotal = val;
					console.log("Updatebooklist", updatebooktotal);

					const updateinfo = await BookModel.findOneAndUpdate(
						{ _id: e.CartBookId._id },
						{ $inc: { available: -updatebooktotal } }
					).exec();
					const updatewritterinfo = await WritterModel.findOneAndUpdate(
						{ _id: findbook.writter._id },
						{ $inc: { sold: +updatebooktotal } }
					).exec();
				});
				let dataremove = await CartModel.findByIdAndRemove({
					_id: req.body.Carts[i].CartId,
				}).exec();
			}
			const TotalPrice = _.sumBy(
				product,
				(e) => e.aftermulitiplywithcount
			);
			req.body.Carts = undefined;
			console.log("Product : ", BookData);
			console.log("Total Price : ", TotalPrice);
			req.body.Books = BookData;
			req.body.OrderBy = req.user.id;
			req.body.totalPrice = TotalPrice + req.body.DeliveryCharge;

			console.log("Full info : ", req.body);
		}

		let data = await Model(req.body).save();
		console.log("new info", data);

		CorrectMessage(201, data, res);
	});

exports.getSchemas = (Model, checkcart) =>
	catchAsync(async (req, res) => {
		let getallbooks;
		if (checkcart) {
			console.log(checkcart);
			console.log(req.user.id);
			getallbooks = await Model.find({ UserId: req.user.id }).sort(
				"-createdAt"
			);

			console.log(getallbooks);
		} else {
			getallbooks = await Model.find().select("-__v").sort("-createdAt");
		}

		CorrectMessage(201, getallbooks, res);
	});

exports.findbyslug = (Model) =>
	catchAsync(async (req, res, next) => {
		const data = await Model.findOne({ slug: req.params.slug })
			.select("-__v")
			.sort("-createdAt");
		const review = await ReviewModel.find({ book: data._id })
			.select("-__v -book -updatedAt -id")
			.sort("-createdAt");

		// review.like.foreach(el => console.log(el))

		console.log("data : ", data._id);
		console.log(review);
		let count = [];
		const countlike = review.map((el) => el.like.map((e) => count.push(e)));

		if (review.length > 0) {
			const TotalLikeandDislike = { like: count.length };

			return CorrectMessage(
				201,
				{ data, review, TotalLikeandDislike },
				res
			);
		}
		if (!data) return next(new AppError("Not Found", 404));
		CorrectMessage(201, data, res);
	});

exports.Updatedata = (Model) =>
	catchAsync(async (req, res, next) => {
		console.log("jubair pulak");
		console.log(req.params.slug);
		console.log(req.body);

		if (req.params.slug && req.body.Item_Name)
			req.body.slug = slugify(req.body.Item_Name);

		if (req.body.couponCode) {
			const findWritter = await finddatausingslug(req.params.slug, Model);
			const percentage = (100 - req.body.couponCode) / 100;
			console.log("total percent :", percentage);
			const getallbooksofWritter = await BookModel.updateMany(
				{ writter: findWritter._id },
				{ $mul: { NewPrice: percentage } }
			).exec();
		}
		let UpdateData;
		if (req.body._id) {
			UpdateData = await Model.findOneAndUpdate(
				{ _id: req.body._id },
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);
		} else {
			UpdateData = await Model.findOneAndUpdate(
				{ slug: req.params.slug },
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);
		}

		if (!UpdateData) {
			return next(new AppError("Not Updated", 500));
		}
		CorrectMessage(201, UpdateData, res);
	});

exports.removefromSchema = (Model) =>
	catchAsync(async (req, res, next) => {
		const RemoveCart = await Model.deleteOne({ _id: req.params.CartId });
		if (!RemoveCart) {
			return next(new AppError("Not Found", 404));
		}

		CorrectMessage(201, "Deleted", res);
	});

exports.getDashboardInfoforAdmin = (Model) =>
	catchAsync(async (req, res, next) => {
    const getAllOrders = await Model.find().exec()

    let processedobj= {}

  
    // "Not Processed",
    // "Cash on Delivery",
    // "Processing",
    // "Dispatched",
    // "Cancelled",
    // "Completed", conuntdeliveryStatus(getAllOrders, 'Processing')
    let Processing  = Notprocessed= cashonDelivery  =  Dispatched  =  Cancelled  = Completed  =0 
	 
	const checkstatus = getAllOrders.map(e =>{
		if(e.orderStatus === 'Processing'){
			processedobj = e
			Processing += 1;
		}else if( e.orderStatus === "Cash on Delivery"){
			cashonDelivery +=1
		}
		if(e.orderStatus === 'Not Processed'){
			Notprocessed += 1;
		}else if( e.orderStatus === "Dispatched"){
			Dispatched +=1
		}
		else if( e.orderStatus === "Cancelled"){
			Cancelled +=1
		}
		else if( e.orderStatus === "Completed"){
			Completed +=1
		}

	})

	console.log("processedObj", processedobj)
	let newobj ={}
    newobj.processing = Processing
	newobj.cashonDelivery = cashonDelivery
	newobj.Notprocessed = Notprocessed
	
	
    console.log("count result :", Processing, Notprocessed , getAllOrders.length)
    CorrectMessage(201, {getAllOrders, newobj}, res)
  });


exports.getCustomerOrder =(Model)=>
     catchAsync(async (req, res,next)=> {
		 const Selforderdata = await Model.find({OrderBy : req.user.id }).exec()
		 if(!Selforderdata){
			 return next (new AppError("You have no order Yet!", 401))
		 }
		console.log(Selforderdata.length)
		 CorrectMessage(201, Selforderdata, res)
	 })