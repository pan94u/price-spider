import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const groupDB = defineModel('sp_group', {
    name: Sequelize.STRING,
    originText: Sequelize.STRING //分组识别文字
});
