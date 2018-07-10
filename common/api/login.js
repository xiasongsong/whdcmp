import {
  baseUrl,
  api,
  MOCK_URL
} from './config.js'
// 登录
let login = () => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '登录...',
      mask: true
    })
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: baseUrl + api,
            data: {
              Act: 'HCLogin',
              Data: JSON.stringify({
                code: res.code
              })
            },
            success(r) {
              console.log(r)
              if (r.data.success) {
                resolve(r.data.openid)
              }
            },
            complete () {
              wx.hideLoading()
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
          reject('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
// 授权获取用户信息
let getUserInfo = (OpenID) => {
  wx.showLoading({
    title: '获取中',
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true,
      success: res => {
        let encryptedData = res.encryptedData
        let iv = res.iv
        wx.request({
          url: baseUrl + api,
          data: {
            Act: 'HCGetUserInfo',
            Data: JSON.stringify({
              OpenID,
              iv,
              encryptedData
            })
          },
          success(r) {
            if (r.data.IsSuccess) {
              resolve(r.data.Data)
            }
          }
        })
      },
      fail: err => {
        reject(err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  })
}
export {
  login,
  getUserInfo
}