const fs = require("fs")
const path = require("path")
const nothing = () => {}

setInterval(() => {

  while(buffer.length > 0) {
    const { key, value } = buffer.pop();

    fs.mkdir(path.dirname(key) ,{ recursive: true }, err =>
      err ?  console.error(err) : fs.writeFile(key, value, nothing)
    )
  }
}, 
10 * 1000)

const buffer = [];

module.exports = {

  get(key) {
    return new Promise((resolve, reject) => {
      fs.readFile(key , (err, data) => 
        err ? resolve(null) : resolve(data)
      )
    })
  },

  put(key, value) {
    const inBuffer = buffer.find(entry => entry.key === key)

    if(!inBuffer) {
      buffer.push({ key, value })
    }
  }
}