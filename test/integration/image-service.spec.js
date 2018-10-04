
const { expect } = require("chai")
const fs = require("fs")

const ImageService = require("../../services/image-service")

describe("[ImageService]", () => {

  describe(".sendBase64ToS3", () => {

    let res

    before(function*() {
      const file = fs.readFileSync("./test/support/conjuntos.png")
      res = yield ImageService.sendBase64ToS3(666, file.toString("base64"))
    })

    it("response shold be", () => {
      console.log(res)
    })
  })
})

