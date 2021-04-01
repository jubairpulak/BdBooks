const SubModel = require("../Models/SubCategoryModel");
const catchAsync = require("../utils/catchAsync");
const { CorrectMessage } = require("../utils/MessageSender");
const { createSchema, getSchemas, Updatedata, findbyslug } = require("../utils/splitFeatures");



exports.createSub = createSchema(SubModel)


exports.getsubs = getSchemas(SubModel);
exports.updateSubs = Updatedata(SubModel)



exports.deleteSub = async (req, res)=>{
    const {slug} = req.params
    const deletedata = await SubModel.findOneAndDelete({slug})
    if(!deletedata){
        res.status(401).send("not delete");
      return ;
    } 

    res.status(201).send("Sub deleted")
}

//get Subs on Category User 
exports.getSubonCategory = findbyslug(SubModel);