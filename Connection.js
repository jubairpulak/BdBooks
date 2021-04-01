const mongoose = require('mongoose')

const Connection = async() => {
   try {
      const dbconnect = await mongoose.connect(process.env.db_link, {
         useNewUrlParser: true,
         useCreateIndex: true,
         useUnifiedTopology: true,
         useFindAndModify : false
         
      })
      console.log("db connected")
   } catch (error) {
      console.log(error)
   }
   
}

module.exports = Connection