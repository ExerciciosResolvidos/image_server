const envLoader = require("env-o-loader")
const _ = require("underscore")

const routes = envLoader("../config/routes.yaml")
const s3 = envLoader("../config/s3.yaml")
const sql = envLoader("../config/sql.yaml")

console.log("teste")

module.exports = {

  health: (req, res) => {

    res.json({
      NODE_ENV: process.env.NODE_ENV,
      routes,
      s3,
      sql: _(sql).omit("primary", "secondary")
    })
  }
}