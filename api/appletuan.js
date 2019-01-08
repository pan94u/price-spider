import request from '../utils/request'
import qs from 'qs'

export function getPath() {
  return request({
    url: `http://www.appletuan.com/page/about`,
    method: 'GET'
  })
}

export function requestUrl(url) {
  return request({
    url: url,
    method: 'GET'
  })
}

export const indexUrl = 'http://www.appletuan.com'