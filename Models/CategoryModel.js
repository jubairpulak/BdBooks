const mongoose = require("mongoose");

const CategoryModel = new mongoose.Schema({
    Item_Name :{
        type  : String,
        required : [true, "Each category must have a category name"],
        unique : [true, "Category name must be unique"]
    },
    slug:String,

}, {timestamps : true})

module.exports = mongoose.model("categoryModel", CategoryModel)