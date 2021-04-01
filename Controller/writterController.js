const WritterModel = require("../Models/WritterModel")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const { CorrectMessage } = require("../utils/MessageSender")
const {slugify} = require("../utils/slugify")
const { createSchema, getSchemas, findbyslug, Updatedata } = require("../utils/splitFeatures")

exports.CreateWritter = createSchema(WritterModel);
    
//get all writter list

exports.getWritters = getSchemas(WritterModel);
exports.getSingleWritter = findbyslug(WritterModel);
//update Writters
exports.UpdateWritter = Updatedata(WritterModel)
