
class APiFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    pagination(){
        this.query = this.query.select("-__v")
        let page =  this.queryString.page || 1;
        let limit = parseInt(this.queryString.limit )|| 4
        const skip = (page - 1) * limit
        
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = APiFeatures