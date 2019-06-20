const express = require("express")
const app = express()
const envLoader = require("env-o-loader")


const routesConf = envLoader("./config/routes.yaml")


// helpers
const RouterHelper = require("./helpers/router-helper")
const routerHelper = RouterHelper(app, routesConf)
const cacheHelper = require("./helpers/cache")

// midlewares
const loggerMiddleware = require("morgan")
const bodyParserMiddleware = require("body-parser")
const catchErrorMiddleware = require("./middleware/catch-error")

const cacheDir = __dirname + '/public'

app.use([
  bodyParserMiddleware.json(),
])

if (process.env.NODE_ENV !== "test") {
  app.use(loggerMiddleware("dev"))
}

app.use(express.static(cacheDir))


routerHelper.get("/api/v1/health", "info#health")

routerHelper.get("/api/v1/pictures", "pictures#list")

if (!routesConf.readOnly) {
  routerHelper.post("/api/v1/pictures", "pictures#create")
  routerHelper.put("/api/v1/pictures/:id", "pictures#update")
  routerHelper.delete("/api/v1/pictures/:id", "pictures#delete")  
}

routerHelper.get("/api/v1/pictures/:id", "pictures#get")

const imagePaths = routesConf.imgPaths.split(",")

/**
 * Add eventListen in response
 */
app.use((req, res, next) => {

  let send = res.send.bind(res)
  let end = res.end.bind(res)
  
  res.send = (...arguments) => {
    return send(...arguments)
  }


  res.end = (...arguments) => {
    // console.log(req.path, res.statusCode, arguments[0])
    console.log(res.statusCode)
    if (res.statusCode === 200) {
      const cacheKey = [ cacheDir, req.path ].join("/")
      cacheHelper.put(cacheKey, arguments[0])
    }
    return end(...arguments)
  }

  next()
})


imagePaths.forEach(path => {
  routerHelper.get(path, "images#get")
})


app.set("urlHelpers", routerHelper.urlHelpers)
app.use(catchErrorMiddleware)

module.exports  = app