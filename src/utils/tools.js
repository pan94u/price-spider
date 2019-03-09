import request from '../utils/request'

//请求任意URL
export function requestUrl(url) {
    return request({
      url: url,
      method: 'GET'
    })
  }

export function isEmptyObject(obj) {
	var name;
	for (name in obj) {
		return false;
	}
	return true;
}