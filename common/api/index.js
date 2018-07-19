import {
  baseUrl,
  api
} from './config.js'
let fetch = data => {
  return new Promise((resolve, reject) => {
    let _self = this
    wx.request({
      url: baseUrl + api,
      method: 'POST',
      data,
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
export {
  fetch
}