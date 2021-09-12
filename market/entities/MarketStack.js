const {Sequelize, Model, DataTypes} = require('sequelize');

const dbConfig = require('../../config/dbConfig.json')['development']
const sequelize = new Sequelize(dbConfig)


const MarketStack = sequelize.define('market_stack', {
  id: {
    type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,
  },
  stockCode: {type: DataTypes.STRING, field: 'stock_code'},
  open: {type: DataTypes.INTEGER},
  high: {type: DataTypes.INTEGER},
  low: {type: DataTypes.INTEGER},
  close: {type: DataTypes.INTEGER},
  date: {type: DataTypes.DATE},
  createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at'},
  updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at'}
}, {freezeTableName: true})


module.exports = {MarketStack};