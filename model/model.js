import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const modelDB = defineModel('sp_model', {
    groupId: Sequelize.INTEGER,
    name: Sequelize.STRING,
    color: Sequelize.STRING,
    country: Sequelize.STRING,
    chartsUrl: Sequelize.STRING, //趋势图链接
    originText: Sequelize.STRING //型号识别文字
});