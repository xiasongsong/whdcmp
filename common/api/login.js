import {
  baseUrl,
  api,
  MOCK_URL
} from './config.js'
import {
  fetch
} from './index.js'
// 登录
let login = () => {
  wx.showLoading({
    title: '',
    mask: true
  })
  console.log('denglu')
  return new Promise((resolve, reject) => {
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
            success (r) {
              resolve(r)
            },
            complete () {}
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
          reject('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail (err) {
        reject(err)
      }
    })
  })
}
// 获取角色身份
let getRoles = openid => {
  return fetch({
    Act: 'HCGetStaff',
    Data: JSON.stringify({
      OpenID: openid
    })
  })
}
// 授权获取用户信息
let getUserInfo = OpenID => {
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
              wx.hideLoading()
            }
          }
        })
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
export {
  login,
  getRoles,
  getUserInfo
}