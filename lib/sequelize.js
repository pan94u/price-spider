import Sequelize from 'sequelize'
import { DB as DBConfig, System as SystemConfig } from '../config'

let seq = new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, {
  host: DBConfig.host,
  dialect: SystemConfig.db_type,
  dialectOptions: { // MySQL > 5.5，其它数据库删除此项
    charset: 'utf8mb4',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: {
    max: 50,
    min: 0,
    idle: 10000
  }
})


/**
 * 定义数据模型
 * 
 * @param {any} name 模型名称【数据库表名】
 * @param {any} attributes 数据字段集合
 * @returns 数据模型对象
 */
export function defineModel (name, attributes) {
  var attrs = {};
  //将传入的attributes传入attrs
  for (let key in attributes) {
      let value = attributes[key];
      if (typeof value === 'object' && value['type']) {
          value.allowNull = value.allowNull || false;
          attrs[key] = value;
      } else {
          attrs[key] = {
              type: value,
              allowNull: false
          };
      }
  }

  // 附加公共字段
  // attrs.id = {
  //     type: ID_TYPE,
  //     primaryKey: true
  // };
  attrs.createAt = {
      type: Sequelize.BIGINT,
      allowNull: false
  };
  attrs.updateAt = {
      type: Sequelize.BIGINT,
      allowNull: false
  };
  attrs.version = {
      type: Sequelize.BIGINT,
      allowNull: false
  };
  // 状态：0表示有效，1表示无效，2表示已删除，默认为0.
  attrs.status = {
      type: Sequelize.INTEGER,
      allowNull: false
  };
  
   // 调用seq的方法定义模型并返回
  let model = seq.define(name, attrs, {
      tableName: name,
      timestamps: false,
      hooks: {
          beforeValidate: function (obj) {
              let now = Date.now();
              if (obj.isNewRecord) {
                  obj.createAt = now;
                  obj.updateAt = now;
                  obj.version = 0;
              } else {
                  obj.updateAt = now;
                  ++obj.version;
              }
          }
      }
  });
  return model;
}
