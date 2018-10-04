
const Sequelize = require("sequelize")
const sequelize = require("../../initializers/sequelize")()

const Picture = sequelize.define('pictures', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    user_id: Sequelize.INTEGER,
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

module.exports = Picture