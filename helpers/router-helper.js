
const callsites = require("callsites")
const path = require("path")
const _ = require("underscore")
const qs = require("qs")
const camelize = require("camelize")

// like a singleton
let helper

module.exports = (app, opts) => {

  const { host, controllersPath } = opts

  if (!app && helper) {
    return helper
  } else {
    const dirname = path.dirname(callsites()[1].getFileName())

    const realControllersPath = path.join(dirname, controllersPath)
    
    if (helper) {
      return helper
    } else {
      helper = {
        urlHelpers: {

        },

        buildPathHelper (methodName, path) {
          const parameters = path.match(/(:\w+)|\*/g)
          const callback = (...args) => {

            let pathInstance = path

            const iterableArgs = args.filter(arg => !_(arg).isObject())

            iterableArgs.forEach((param, i) => {
              pathInstance = pathInstance.replace(parameters[i], param)
            })

            const objectArgs = args.filter(arg => _(arg).isObject())
            objectArgs.forEach((keyValue, i) => {
              _(keyValue).each((value, key) => {
                if (pathInstance.match(key)) {
                  pathInstance = pathInstance.replace(key, value)
                  delete keyValue[key]
                }
              })
            })

            const queryString = objectArgs.reduce(
              (memo, item) =>  _(memo).extend(item),
            {})
 
            return `${host}${pathInstance}?${qs.stringify(queryString)}`
          }

          console.log(methodName, "helper generated")
          this.urlHelpers[methodName] = callback
          return callback
        },
    
        get (path, callback, methodName = null) {
          
          const [ controller, action ] = callback.split("#")
          app.get(path, require(`${realControllersPath}${controller}-controller`)[action])
 
          return this.buildPathHelper(methodName || camelize(`${controller}-${action}`), path)
        },
    
        post (path, callback, methodName = null) {
          const [ controller, action ] = callback.split("#")
          app.post(path, require(`${realControllersPath}${controller}-controller`)[action])
    
          return this.buildPathHelper(methodName || camelize(`${controller}-${action}`), path)
        },
    
        put (path, callback, methodName = null) {
          const [ controller, action ] = callback.split("#")
          app.put(path, require(`${realControllersPath}${controller}-controller`)[action])
    
          return this.buildPathHelper(methodName || camelize(`${controller}-${action}`), path)
        },
    
        path (path, callback, methodName = null) {
          const [ controller, action ] = callback.split("#")
          app.patch(path, require(`${realControllersPath}${controller}-controller`)[action])
    
          return this.buildPathHelper(methodName || camelize(`${controller}-${action}`), path)
        },
    
        delete (path, callback, methodName = null) {
          const [ controller, action ] = callback.split("#")
          app.delete(path, require(`${realControllersPath}${controller}-controller`)[action])
    
          return this.buildPathHelper(methodName || camelize(`${controller}-${action}`), path)
        },
      }
    
      return helper
    }
  }
}