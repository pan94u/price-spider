import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const model = defineModel('sp_model', {
    modelId: Sequelize.INTEGER,
    name: Sequelize.INTEGER,
    color: Sequelize.INTEGER,
    country: Sequelize.STRING,
    originText: Sequelize.STRING //型号识别文字
});