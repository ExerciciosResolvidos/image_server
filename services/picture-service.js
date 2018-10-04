
const _ = require("underscore")
const FilterParams = require("filter-params")

const Picture = require("../models/sequelize/picture")
const ImageService = require("../services/image-service")

module.exports = {

  search(terms, { size, page }) {
    const query = terms ? { name: terms } : {}

    const offset = (page - 1)* size
    return this._findMany(query, { limit: size, offset }).then(pic => this._serialize(pic))
  },

  create(attrs) {
    attrs = new FilterParams(attrs).req("title", "description", "base64_image").commit()

    if(!attrs.user_id)
      attrs.user_id = 0

    return Picture.create(attrs)
                  .then(pic => {
                    return ImageService.sendBase64ToS3(pic.id, attrs.base64_image)
                                .then(() => pic)
                                .catch(err => {
                                   return pic.destroy()
                                })
                  })
                  .then(pic => this._serialize(pic))
  },

  remove(id) {
    return Picture.findById(id).then(pic => pic.destroy())
  },

  update(id, attrs) {

    attrs = new FilterParams(attrs).req("title", "description").commit()
    
    return Picture.findById(id)
                .then(pic => {
                  _(pic).assign(attrs)
                  return pic.save()
                })
                .then(pic => this._serialize(pic))
    
  },

  findOneBy(query) {
    return Picture.findOne({ where: query }).then(pic => this._serialize(pic))
  },

  findById(id) {
    return Picture.findById(id).then(pic => this._serialize(pic))
  },

  count(terms) {
    const query = terms ? { name: terms } : {}
    return this._count(query)
  },

  _count(query) {
    return Picture.count({ where: query })
  },

  _findMany(query, { limit, offset }) {
    return Picture.findAll({ where: query, limit, offset })
  },

  _serialize(pic) {
    if (pic.map)
      return pic.map(p => this._serialize(p))
    else
      return {
        id: pic.id,
        title: pic.title,
        description: pic.description,
      }
  },
}
