const { Sequelize, Model, DataTypes } = require('sequelize');

const dbConfig = require('../../config/dbConfig.json')['development']
const sequelize = new Sequelize(dbConfig)

const News = sequelize.define("news", {
  id: { type: DataTypes.BIGINT, primaryKey: true },
  stockCode: { type: DataTypes.STRING, field: 'stock_code' },
  title: { type: DataTypes.STRING },
  link: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING},
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
})


module.exports = {News};