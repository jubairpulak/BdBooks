const slugify = require("./slugify")
class CreateFeatures{
    constructor(query, body, slugify){
        this.query = query;
        this.body = body;
        this.slugify = slugify
    }

    create(){
          this.body.slug = this.slugify(this.body.publisherName)
          console.log(this.body.slug, this.body)
          this.query = this.query(this.body).save()
          return this
    }
}


module.exports = CreateFeatures