const {CorrectMessage} =  require("../utils/MessageSender")
const {erorMessage} = require("../utils/MessageSender")
const {slugify} = require("../utils/slugify")
const PublisherModel = require("../Models/PublisherModel")
const ApiFeatures = require("../utils/APiFeatures")
const CreateFeatures = require("../utils/CreateFeatures") 
const { getSchemas, createSchema, findbyslug,  Updatedata} = require("../utils/splitFeatures")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

exports.createPublisher =   createSchema( PublisherModel)
    
    
    

exports.getPublishers = getSchemas(PublisherModel);

exports.searchPublishers =catchAsync (async (req, res, next)=>{
  
        const data =new ApiFeatures(PublisherModel.find(), req.query).pagination()
    
     
        
        let finaldata  = await data.query
        finaldata.page = parseInt(req.query.page)
        CorrectMessage(201, finaldata, res)

}
)
//find single

exports.getsinglePublisher = findbyslug(PublisherModel);

exports.updatesinglePublisher =  Updatedata(PublisherModel)