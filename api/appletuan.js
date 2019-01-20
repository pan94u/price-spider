import request from '../utils/request'

export function getPath() {
  return request({
    url: `http://www.appletuan.com/page/about`,
    method: 'GET'
  })
}


export const indexUrl = 'http://www.appletuan.com'