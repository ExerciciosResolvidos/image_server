const wrap = require("co-express")
const ImageService = require("../services/image-service")
const _ = require("underscore")
const Jimp = require("jimp")
// const sharp = require("sharp")

module.exports = {

  get: wrap(function*(req, res) { 
    const { id , size = "300x300" } = req.params

    const [ width , height ] = size.split("x").map(e => parseInt(e))
    
    const data = yield ImageService.getS3UrlById(id)
    
    /*
      const resized = yield sharp(data)
                            .resize(width, height)
                            .toBuffer()
    */
    console.log(data)
    const resized = yield Jimp.read(data).then(image => {
      return new Promise((resolve, reject) => {
        console.log(image)
        image.contain(width, height)
             .getBuffer(
               Jimp.MIME_PNG, 
               (err, buffer) => err ? reject(err) : resolve(buffer)
              )
      })
    })

    res.end(resized, 'binary')
  }),
}