import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const group = defineModel('sp_group', {
    groupId: Sequelize.INTEGER,
    name: Sequelize.STRING
});
