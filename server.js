const dotenv = require("dotenv");
dotenv.config({path : "./.env"})
const Connection = require("./Connection")

const app = require("./app")

console.log(app.get('env'))
const port = process.env.port || 8080;
Connection()
const server =app.listen(port , (req, res)=>{
    console.log("apps is listening on port : 8080")
})

// process.on('unhandledRejection', err=>{
//     console.log(err.name, err.message)
//     console.log("Server shutting down for some problem..")

//     server.close(()=>{
//       process.exit(1)
//     })
// })