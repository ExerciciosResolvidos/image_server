const app = require("express")()
const envLoader = require("env-o-loader")


// helpers
const RouterHelper = require("./helpers/router-helper")
const routerHelper = RouterHelper(app, envLoader("./config/routes.yaml"))
// midlewares
const loggerMiddleware = require("morgan")
const bodyParserMiddleware = require("body-parser")
const catchErrorMiddleware = require("./middleware/catch-error")

app.use([
  bodyParserMiddleware.json(),
])

if (process.env.NODE_ENV !== "test")
  app.use(loggerMiddleware("dev"))



routerHelper.get("/api/v1/health", "info#health")
  
routerHelper.get("/api/v1/pictures", "pictures#list")
routerHelper.post("/api/v1/pictures", "pictures#create")
routerHelper.get("/api/v1/pictures/:id", "pictures#get")
routerHelper.put("/api/v1/pictures/:id", "pictures#update")
routerHelper.delete("/api/v1/pictures/:id", "pictures#delete")


routerHelper.get("/images/:id/:size", "images#get")


app.set("urlHelpers", routerHelper.urlHelpers)
app.use(catchErrorMiddleware)

module.exports  = app