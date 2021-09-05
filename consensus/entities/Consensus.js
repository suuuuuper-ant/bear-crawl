const { Sequelize, Model, DataTypes } = require('sequelize');

const dbConfig = require('../../config/dbConfig.json')['development']
const sequelize = new Sequelize(dbConfig)

const Consensus = sequelize.define('consensus', {
  id: { type: DataTypes.BIGINT, primaryKey: true },
  stockCode: { type: DataTypes.STRING, field: 'stock_code' },
  title: { type: DataTypes.STRING },
  price: { type: DataTypes.STRING },
  opinion: { type: DataTypes.STRING },
  writer: { type: DataTypes.STRING },
  source: { type: DataTypes.STRING },
  file: { type: DataTypes.STRING },
  info: { type: DataTypes.STRING },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_deleted'},
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at'},
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at'}
}, {
  freezeTableName: true
})

module.exports = {Consensus}