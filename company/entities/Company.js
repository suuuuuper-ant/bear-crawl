const {Sequelize, Model, DataTypes} = require('sequelize');

const dbConfig = require('../../config/dbConfig.json')['development']
const sequelize = new Sequelize(dbConfig)

const Company = sequelize.define('company', {
  id: {type: DataTypes.BIGINT, primaryKey: true},
  stockCode: {type: DataTypes.STRING, field: 'stock_code'},
  shortName: {type: DataTypes.STRING, field: 'short_name'},
  krName: {type: DataTypes.STRING, field: 'kr_name'},
  enName: {type: DataTypes.STRING, field: 'en_name'},
  marketType: {type: DataTypes.STRING, field: 'market_type'},
  isKospi200: {type: DataTypes.BOOLEAN, field: 'is_kospi_200'},
  total: {type: DataTypes.INTEGER}
}, {freezeTableName: true, timestamps: false})

module.exports = {Company};