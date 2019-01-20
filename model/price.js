import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const price = defineModel('sp_price', {
    price: Sequelize.INTEGER,
    modelId: Sequelize.INTEGER,
    groupId: Sequelize.INTEGER,
    country: Sequelize.STRING,
});