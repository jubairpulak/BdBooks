exports.erorMessage = (statucode, error, res)=>{

    if( error.code === 11000){
         error.message = "Data is already existed"
    }
    res.status(404).json({
        status : "failed",
        message : error.message
    }) 
}



exports.CorrectMessage = (statuscode, data, res) =>{
    res.status(statuscode).json({
		status: "success",
       
		data: {
			data,
		},
	});
}