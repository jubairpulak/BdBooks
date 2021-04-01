const CategoryModel = require("../Models/CategoryModel")
const SubModel = require("../Models/SubCategoryModel")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const { CorrectMessage } = require("../utils/MessageSender")
const { createSchema, getSchemas, findbyslug, Updatedata } = require("../utils/splitFeatures")
const slugify = (name)=> name.split(" ").join("-").toLowerCase()


exports.createCategory = createSchema(CategoryModel)

exports.getCategorylist = getSchemas(CategoryModel);

exports.getSingleCategory = findbyslug(CategoryModel);

exports.updateCategory = Updatedata(CategoryModel)
exports.deleteCategory =async (req, res) =>{
    const {slug}= req.params
    const findcategory =await CategoryModel.findOne({slug}).exec()
   
    const findsubundercategory = await SubModel.findOne({parent : findcategory._id})
    if(findsubundercategory){
        res.status(201).json({
            status : "Success",
            message : "Delete these subs first",
            total : findsubundercategory.length,
            data : {
                findsubundercategory
            }
        })
        return;
    }

    const deletecategory = await CategoryModel.findOneAndDelete({slug}).exec()
    res.status(201).json({
        status : "Success",
        message : "Category is deleted"
    })


    console.log(findsubundercategory)
 
}

