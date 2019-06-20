const envLoader = require("env-o-loader")
const ImageService = require("../services/image-service")
const cache = require("../helpers/cache")
const Jimp = require("jimp")

const { original, sizes } = envLoader("../config/images.yaml")

module.exports = {

  get(req, res) {
    const { path, params: { id , size = "300x300" } } = req

    if (size === original) {
      ImageService.getS3UrlById(id)
                  .then(data => res.end(data, "binary"))
      
    } else {
      const [ width , height ] = (sizes[size] || size).split("x").map(e => parseInt(e))

      ImageService.getS3UrlById(id)
        .then(data => Jimp.read(data))
        .then(image =>
          new Promise((resolve, reject) =>
            image.contain(width, height)
              .getBuffer(Jimp.MIME_PNG, (err, buffer) => err ? reject(err) : resolve(buffer))
          )
        )
        .then(resized => res.end(resized, 'binary'))
    }
  }
}