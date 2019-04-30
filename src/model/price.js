import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const priceDB = defineModel('sp_price', {
    price: Sequelize.STRING,
    modelId: Sequelize.INTEGER,
    groupId: Sequelize.INTEGER,
    country: Sequelize.INTEGER,
});

export const originDB = defineModel('sp_origin_data', {
  data: Sequelize.TEXT,
});