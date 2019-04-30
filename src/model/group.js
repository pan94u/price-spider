import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const groupDB = defineModel('sp_group', {
  name: Sequelize.STRING,
  hot: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  new: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  weight: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  originText: Sequelize.STRING //分组识别文字
});
