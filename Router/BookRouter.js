const express = require("express")
const {registration, login, protect, update_password, restrictedTo} = require("../Controller/AuthController")
const {CreateBook, getBooks, getbook, updateBook, searchBookByFields, selectedData} = require("../Controller/BookController")

//category controller
const {createCategory, getCategorylist, getSingleCategory, updateCategory, deleteCategory} = require("../Controller/CategoryController")
//sub controller
const {createSub, getsubs, updateSubs, deleteSub, getSubonCategory} = require("../Controller/subController")
const { getallusers } = require("../Controller/UserController")

//publisher 
const {createPublisher, getPublishers, searchPublishers, getsinglePublisher, updatesinglePublisher} = require("../Controller/publisherController")
const { CreateWritter, getWritters, getSingleWritter, UpdateWritter } = require("../Controller/writterController")

const {
	createReview,
	IncreaseLike,
	IncreaseDislike,
} = require("../Controller/ReviewController");

const {
	AddtoCart,
	getCart,
	removeCart,
} = require("../Controller/CartController");

const {
	CreateOrder,
	getOrders,
	updateOrders,
	getSelfOrder,
	getOrderInformation,
} = require("../Controller/OrderController");

const router = express.Router()

//createbooks
router.route("/createbook").post(protect, restrictedTo("admin"), CreateBook)
//get all books admin
router.route("/getbooks").get(protect, getBooks);

//get book by user
router.route("/getbook/:slug").post( getbook)

//update Boook
router.route("/book/updatebook/:slug").patch(protect, restrictedTo("admin"), updateBook)

//category
//create category
router.route("/createcategory").post(protect, restrictedTo("admin"), createCategory)
//get category
router.route("/getcategories").get(protect, restrictedTo("admin"), getCategorylist)
//get single Category
router.route("/getsinglecategory/:slug").get(protect, restrictedTo("admin"), getSingleCategory)
//update category
router.route("/updatecategory/:slug").patch(protect, restrictedTo("admin"), updateCategory)
//delete Category
router.route("/deletecategory/:slug").get(protect, restrictedTo("admin"), deleteCategory)

//sub
//create Sub
router.route("/createsub").post(protect, restrictedTo("admin"), createSub)
//getsubs
router.route("/getsubs").get(protect, restrictedTo("admin"), getsubs)
//updatesubs
router.route("/updatesub/:slug").patch(protect, restrictedTo("admin"), updateSubs)
//deletesubs
router.route("/deletesub/:slug").delete(protect, restrictedTo("admin"), deleteSub)

//getsubs on category
router.route("/getsub/:slug").get( getSubonCategory)


//search field
router.route("/searchdata").post(searchBookByFields)

//selected data
router.route("/selecteddata").post(selectedData, searchBookByFields)

//publisher
//create publisher
router.route("/createpublisher").post(protect, restrictedTo("admin"), createPublisher)
//get publishers
router.route("/getpublisher").get(protect, restrictedTo("admin"), getPublishers)
//search publishers by pagination
router.route("/searchPublisher").post(protect, restrictedTo("admin"), searchPublishers)

//search by slug
router.route("/search-singlepublisher/:slug").post(protect, restrictedTo("admin"), getsinglePublisher)
//update single publisher
router.route("/update-singlepublisher/:slug").post(protect, restrictedTo("admin"),  updatesinglePublisher)


//createWritter
router.route("/create-writter").post(protect, restrictedTo("admin"), CreateWritter)
router.route("/get-writters").get(protect, restrictedTo("admin"), getWritters)
//get singlewriter
router.route("/get-single-writter/:slug").get(protect, restrictedTo("admin"), getSingleWritter)
//router.route("/update-writter/:slug")
router.route("/update-writter/:slug").patch(protect, restrictedTo("admin"), UpdateWritter)

//create Review
router.route("/:bookId/create-review").post(protect, createReview);

//like
router.route("/like").patch(protect, IncreaseLike)
router.route("/dislike").patch(protect, IncreaseDislike)

//add to cart
router.route("/addtocart").post(protect,AddtoCart )
router.route("/getCart").get(protect,getCart )
router.route("/removeCart/:CartId").delete(protect, removeCart)

//createOrder
router.route("/createorder").post(protect, CreateOrder)
router.route("/getallorders").get(protect, restrictedTo("admin"), getOrders);
router
	.route("/updateorders")
	.patch(protect, restrictedTo("admin"), updateOrders);

router
	.route("/getdashboardinfo")
	.get(protect, restrictedTo("admin"), getOrderInformation);
router.route("/getOrderbyCustomer").get(protect, getSelfOrder);


module.exports = router