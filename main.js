import cheerio from 'cheerio'
import { getPath, indexUrl } from './api/appletuan'
import { isEmptyObject, requestUrl } from './utils/tools'



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

const getHtml = (path) => {
    return new Promise((resolve, reject) => {
        requestUrl(indexUrl + path).then(res => {
            let $ = cheerio.load(res)
            $('.header').remove() //删掉报价导航头
            resolve($('.col-md-8 .box').eq(1).html())
        })
    })
}

getUrl().then((data) => {
    getHtml(data.path).then(html => {
        console.log(html)
    })
})