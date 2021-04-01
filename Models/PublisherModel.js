const mongoose = require("mongoose")

const PublisherSchema =new mongoose.Schema({

    Item_Name :{
        type : String,
        required:[true, "Each publisher must have a name"],
        unique : [true, "Duplicate name is not accpeted"],
       
    },
    slug: String,
})

module.exports = mongoose.model("Publishermodel", PublisherSchema)