const wrap = require("co-express")
const FilterParams = require("filter-params")
const PictureService = require("../services/picture-service")
const _ = require("underscore")

module.exports = {

  delete: wrap(function*(req, res) {

    // add url helper
    const urlHelpers = req.app.get("urlHelpers")
    
    const { id } = req.params
    const picture = yield PictureService.remove(id)
    picture.href = urlHelpers.imagesGet(picture.id, "300x300")
    
    res.json({
      deleted: true,
      data: picture,
      links: []
    })
  }),

  update: wrap(function*(req, res) { 
    const urlHelpers = req.app.get("urlHelpers")
    const { id } = req.params
    const { body: attrs } = req

    const picture = yield PictureService.update(id, attrs)
    picture.href = urlHelpers.imagesGet(picture.id, "300x300")
    

    res.json({
      updated: true,
      data: picture,
      links: [
        { rel: "self", href: urlHelpers.picturesGet(picture.id) },
        { rel: "/picture/update", href: urlHelpers.picturesUpdate(picture.id) },
      ]
    })
  }),

  create: wrap(function*(req, res) { 
    const urlHelpers = req.app.get("urlHelpers")

    const { body: attrs } = req

    const picture = yield PictureService.create(attrs)
    picture.href = urlHelpers.imagesGet(picture.id, "300x300")
    
    res.json({
      created: true,
      data: picture,
      links: [
        { rel: "self", href: urlHelpers.picturesGet(picture.id) },
        { rel: "/picture/update", href: urlHelpers.picturesUpdate(picture.id) },
      ]
    })
  }),

  get: wrap(function*(req, res) {
    const urlHelpers = req.app.get("urlHelpers")
    let { id } = req.params

    const picture = yield PictureService.findById(id)

    picture.href = urlHelpers.imagesGet(id, "300x300")

    res.json({
      meta: {},
      data: picture,
      links: [
        { rel: "self", href: urlHelpers.picturesGet(id) },
        { rel: "/picture/update", href: urlHelpers.picturesUpdate(id) },
      ]
    })
  }),

  list: wrap(function*(req, res) {

    const urlHelpers = req.app.get("urlHelpers")
    
    
    let { page = 1, size = 10, terms } = req.query


    page = parseInt(page)
    size = parseInt(size)

    const count = yield PictureService.count(terms)
    const pictures = yield PictureService.search(terms, { page, size })


    const pages = Math.ceil(count / size)
    
    
    const links = []
    
    if (page < pages) {
      links.push({ 
        rel: "/picture/next", 
        href: urlHelpers.picturesList({ terms, page: page + 1, size }) 
      })
    }

    if (page > 1 && page < pages) {
      links.push({ 
        rel: "/picture/prev", 
        href: urlHelpers.picturesList({ terms, page: page - 1, size }) 
      })
    }

    res.json({
      meta: {
        count, page, size, pages
      },
      data: pictures.map(picture => 
        _(picture).extend({
          href: urlHelpers.imagesGet(picture.id),
          links: [
            { rel: "self", href: urlHelpers.picturesGet(picture.id) },
            { rel: "/picture/update", href: urlHelpers.picturesUpdate(picture.id) }
            
          ]
        })
      ),
      links: [
        { rel: "self", href: urlHelpers.picturesList({ terms, page, size }) },
        ...links,
        { rel: "/picture/create", href: urlHelpers.picturesCreate() },
      ]
    })
  })
}