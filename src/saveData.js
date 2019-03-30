import {priceDB} from './model/price'
import {modelDB} from './model/model'
import {groupDB} from './model/group'
import {loopData} from './main'
//定时任务
const schedule = require('node-schedule');
//时间处理
const moment = require('moment');
//同步一下库
// (async () => {
//   await priceDB.sync({force:true})
//   await modelDB.sync({force:true})
//   await groupDB.sync({force:true})
// })()


function start() {
  console.log(`开始写入数据库 in ${moment().format('YYYY-MM-DD HH:mm:ss')}`)
  loopData().then((result) => {
    //遍历全部分组
    result.forEach((group, index) => {
      let originText = group.headText, //分组文字（用于识别）
          name = group.headText, //分组名称
          detail = group.detail, //分组内容
          country = -1, //国家默认为-1（未知）
          groupId;
      //国家判断
      if(originText.indexOf('国行') > -1) {
        country = 1 //国行
      }
      if(originText.indexOf('港行') > -1 || originText.indexOf('港版') > -1) {
        country = 2 //港行
      }
      //获取groupId
      groupDB.findAll({
        where:{originText}
      }).then((result) => {
        //如果查不到，则新建
        if(isEmptyArr(result)) {
          groupDB.create({
            name,
            originText,
            status: 0
          }).then((result) => {
            //新建完成后给groupId赋值
            groupId = result.id
            //遍历组内机器
            loopDetail()
          })
        } else{
          //如果查得到，则赋值groupId
          groupId = result[0].id
          //遍历组内机器
          loopDetail()
        }
      }).catch((err) => {
        console.log(`err:${err}`)
      })
      function loopDetail() {
      //遍历每个分组内的机型
        detail.forEach((model, index) => {
          let originText = model.name, //机型文字（用于识别）
              name = model.name, //机型名称
              chartsUrl = model.chartsUrl, //机型的趋势图URL
              priceArr = model.priceArr //该机型内价格数组
          //遍历每个机型组内的具体内容
          priceArr.forEach((value, index) => {
            let color = value.color,
                price = value.num,
                modelId;
            modelDB.findAll({where:{originText,country,color,groupId}}).then((result) => {
              if(isEmptyArr(result)) {
                //如果没有这个型号则新建
                modelDB.create({originText,country,color,name,chartsUrl,groupId,status: 0}).then((result) => {
                  modelId = result.id
                  priceDB.create({price,modelId,groupId,country,status:0})
                })
              } else{
                //如果有这个型号则赋值
                modelId = result[0].id
                 //查询该报价并比对价格和时间，若价格相等并在同一天，则不操作
                 priceDB.findAll({where:{modelId,groupId,country,status: 0}}).then((result) => {
                  if(isEmptyArr(result)){
                    priceDB.create({price,modelId,groupId,country,status:0}).then((result)=>{
                      
                    })
                    return
                  }
                  if(price == result[0].price && moment(parseInt(result[0].updateAt)).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                    //报价没更新
                  } else if(price != result[0].price && moment(parseInt(result[0].updateAt)).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                    //若价格不相等但还是当天
                    priceDB.update({price,updateAt:Date.now()},{where: {modelId,groupId,country,status: 0}})
                    console.log(`当天更新${modelId}in ${moment().format('YYYY-MM-DD HH:mm:ss')}`)
                  } else {
                    //跨天了
                    //将旧报价停用
                    priceDB.update({status: 1},{where: {modelId,groupId,country,status: 0}}).then((result) => {
                      //创建新一天的报价
                      priceDB.create({price,modelId,groupId,country,status:0})
                    })
                  }
                })
              }
            })
          })
        })
      }
      
    })
    
  })  
}
const  scheduleCronstyle = ()=>{
  //每60秒定时执行一次:
  let rule = new schedule.RecurrenceRule()
  rule.second = 10
  schedule.scheduleJob(rule,()=>{
    start()
  }); 
}
scheduleCronstyle()

function isEmptyArr(arr) {
  return Array.isArray(arr) && arr.length === 0
}