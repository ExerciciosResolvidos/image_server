"use strict"

const Sequelize = require("sequelize")
const envLoader = require("env-o-loader")
const URL = require("url")

const {
  primary: primarySqlUrl,
  secondary: secondarySqlUrl,
} = envLoader("../config/sql.yaml")

let sequelize

module.exports = () => {
  if (sequelize) {
    return sequelize
  } else {
    if (secondarySqlUrl) {
      // primary config
      const primaryUri =  new URL.parse(primarySqlUrl)

      const database = primaryUri.pathname.replace(/\//, "")
      const protocol = primaryUri.protocol.replace(/:/, "")
      const [ username, password ] = primaryUri.auth.split(":")
      const primaryHost = primaryUri.host


      // secondary host

      const secondaryUri =  new URL.parse(secondarySqlUrl)
      const [ usernameRead, passwordRead ] = primaryUri.auth.split(":")
      const secondaryHost = secondaryUri.host

      const config = {
        dialect: protocol,
        replication: {
          read: [
            {
              host: secondaryHost,
              username: usernameRead,
              password: passwordRead,
            },
          ],
          write: {
            host: primaryHost, username, password,
          }
        },
      }

      // logger.info(config)
      sequelize = new Sequelize(database, null, null, config)
    } else {
      sequelize = new Sequelize(primarySqlUrl, {})
    }

    return sequelize
  }
}