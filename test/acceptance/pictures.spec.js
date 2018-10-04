
const app = require("../../app")

const { expect } = require("chai")
const request = require("supertest")
const fs = require("fs")

const Picture = require("../../models/sequelize/picture")

describe("[pictures]", () => {

  describe("GET /api/v1/pictures", () => {

    let res

    before(function*() {
      yield Picture.destroy({ truncate: true })
      yield new Picture({
        title: "image de teste",
        description: "descrição de teste",
      }).save()

      res = yield request(app).get("/api/v1/pictures")
    })

    describe("response", () => {

      it("status 200", () => {
        expect(res.status).to.be.equal(200)
      })

      describe("body" , () => {
        it("body.resource is array", () => {
          expect(res.body.resource).is.an("Array")
        })

        it("body.resource content", () => {
          const [ data ] = res.body.resource
          expect(data).to.have.all.keys("id", "title", "description", "links")
        })

        it("body have links", () => {
          expect(res.body.links).to.be.eqls([
            {
              href: "/api/v1/pictures?page=1&size=10",
              rel: "self"
            },
            {
              href: "/api/v1/pictures?",
              rel: "/picture/create"
            }
          ])
        })
      })

      describe("links", () => {

        let links

        before(() => {
          links = [ 
            ...res.body.links,
            ...res.body.resource[0].links
          ]
        })

        it("create link", function*() {
          const { href } = links.find(l => l.rel === "/picture/create")
          const base64_image = fs.readFileSync("./test/support/conjuntos.png").toString("base64")
          
          const res = yield request(app).post(href).send({
            title: "teste title",
            description: "teste",
            base64_image
          })

          expect(res.status).to.be.equal(200)
        })

        it("update link", function*() {
          const { href } = links.find(l => l.rel === "/picture/update")

          const res = yield request(app).put(href).send({
            title: "teste title",
            description: "teste", 
          })

          debugger
          expect(res.status).to.be.equal(200)
        })
      })
    })
  })
})