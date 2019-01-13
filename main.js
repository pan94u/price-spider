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
        console.log(result)
    })
})

function handle(title ,price) {
    let titleArr = [], detail = []
    title.each((i, elem) => {
        let $ = cheerio.load(elem)
        titleArr.push($(elem).text())
    })
    price.each((i, elem) => {
        if(i==0){return}
        let $ = cheerio.load(elem), tempArr = []
        let chartsUrl, price=[], name, time
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
                price.push({
                    color: title[i+1],
                    num: $(td).text()
                })
                chartsUrl = $(td).find('a').attr('href')
                return
            }
        })
        detail.push(JSON.stringify({
            chartsUrl,price,name,time
        }))
    })
    return {detail}
}