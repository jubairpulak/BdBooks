const mongoose = require("mongoose")

const {ObjectId} = mongoose.Schema

const subCategoryModel = new mongoose.Schema({
    Item_Name : {
        type : String,
        required : [true,"Each sub category must have a name"],
        unique : [true, "Each Sub must be uniaue"]
        
    },
    slug : String,
    parent : {
        type : ObjectId,
        ref : "categoryModel",
        required : [true, "Each sub category must have a category"]
        }
}, {timestamps : true} )

subCategoryModel.pre(/^find/, function (next) {
	this.populate({
		path: "parent",
		select: "Item_Name -_id",
	});
	next();
});

module.exports = mongoose.model("subModel", subCategoryModel)