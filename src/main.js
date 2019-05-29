import cheerio from 'cheerio'
import { getPath, indexUrl } from './api/appletuan'
import { isEmptyObject, requestUrl } from './utils/tools'
//时间处理
const moment = require('moment');

let timer = null
//获取当日报价的url和text
const getUrl = () => {
    return new Promise((resolve, reject) => {
        getPath().then(res => {
            let $ = cheerio.load(res)
            let path, dateText
            path = $('#main-nav-price-report').attr('href')
            dateText = $('#main-nav-price-report').text()
            resolve({ path, dateText })
        })
    })
}

//获取html代码
const getHtml = (path) => {
    return new Promise((resolve, reject) => {
        requestUrl(indexUrl + path).then(res => {
            let $ = cheerio.load(res)
            $('.header').remove() //删掉报价导航头
            resolve($('.col-md-8 .box').eq(1).html())
        })
    })
}
//循环HTML 得出数据
export function loopData() {
    let stime = new Date()
    console.log(`开始获取...`)
    return new Promise((resolve, reject) => {
        getUrl().then((data) => {
            console.log(`链接获取成功，总共花费了${new Date() - stime} ms/n链接信息：${JSON.stringify(data)}`)
            getHtml(data.path).then(html => {
                console.log(`HTML获取成功，总共花费了${new Date() - stime} ms`)
                let $ = cheerio.load(html), modelText = []
                $('.product-series-heading strong').each((i, title) => {modelText.push($(title).text())})
                let content = $('.price-report tbody'), result = []
                content.each((i, elem) => {
                    let title = $(elem).find('tr th'), price
                    price = $(elem).find('tr')
                    let fullData = handle(title ,price)
                    fullData.headText = modelText[i]
                    result.push(fullData)
                })
                console.log(`数据全部获取完成，总共花费了${new Date() - stime} ms`)
                resolve(result)
            })
        })
    })
}

//格式化跑出的数据(每个表格)
function handle(title ,price) {
    let titleArr = [], detail = []
    title.each((i, elem) => {
        let $ = cheerio.load(elem)
        titleArr.push($(elem).text())
    })
    price.each((i, elem) => {
        if(i==0){return}
        let $ = cheerio.load(elem), tempArr = []
        let chartsUrl, priceArr=[], name, time
        $(elem).find('td').each((i, td) => {
            if($(td).attr('class') == 'model-name') {
                name = $(td).text()
                return
            }
            if($(td).attr('class') == 'time-ago') {
                time = $(td).text()
                return
            }
            if($(td).attr('class') == 'price-cell') {
                priceArr.push({
                    color: $(title[i]).text(),
                    num: $(td).text()
                })
                chartsUrl = $(td).find('a').attr('href')
                return
            }
        })
        // detail.push(JSON.stringify({
        //     chartsUrl,priceArr,name,time
        // }))
        detail.push({
            chartsUrl,priceArr,name,time
        })
    })
    return {detail}
}