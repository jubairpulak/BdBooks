const express = require("express")
const cors = require('cors')
const fs = require("fs")
const morgan = require("morgan")
const ratelimit = require("express-rate-limit");
const globalErrorHanlder = require("./Controller/handleError")
const UserRouter = require("./Router/UserRouter")
const BookRouter = require("./Router/BookRouter")
const AppError = require("./utils/appError")
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const Cache = require("./services/cache");

const app = express()
//global middlewares
app.use(compression())
app.use(helmet())
if(process.env.NODE_ENV === "development"){

    app.use(morgan("dev"))
}

const limiter = ratelimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many request from this IP, Please Try again in an hour!",
});
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use(cors())

fs.readdirSync(('./Router')).map((r)=>{
    app.use("/api", require("./Router/" +r))
})

app.all("*", (req, res, next)=>{
    next (new AppError(`Can't find ${req.originalUrl}`, 404))
})

app.use(globalErrorHanlder)
module.exports = app