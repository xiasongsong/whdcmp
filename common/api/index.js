import {
  baseUrl,
  testUrl,
  api,
  MOCK_URL
} from './config.js'
let fetch = data => {
  return new Promise((resolve, reject) => {
    let _self = this
    wx.showLoading({
      title: '获取中',
      mask: true
    })
    wx.request({
      url: baseUrl + api,
      method: 'POST',
      data,
      success (res) {
        wx.hideLoading()
        resolve(res)
      },
      fail (res) {
        reject(res)
      },
      complete () {
        wx.hideLoading()
      }
    })
  })
}
let mock = url => {
  return new Promise((resolve, reject) => {
    let _self = this
    wx.showLoading({
      title: '获取中',
      mask: true
    })
    wx.request({
      url: MOCK_URL + api,
      method: 'GET',
      data: {},
      success (res) {
        wx.hideLoading()
        resolve(res)
      },
      fail (res) {
        reject(res)
      },
      complete () {
        wx.hideLoading()
      }
    })
  })
}
export {
  fetch,
  mock
}