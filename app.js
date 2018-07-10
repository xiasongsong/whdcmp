import {
  fetch
} from 'common/api/index.js'
import {
  baseUrl,
  api,
  MOCK_URL
} from 'common/api/config.js'
App({
  onLaunch() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.hideTabBar()
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
            success: res => {
              if (res.data.IsSuccess) {
                this.globalData.openid = res.data.Data.OpenID
                this.getEngineerInfo()
                this.openidReady && this.openidReady(res.data.Data.OpenID)
                // 获取用户信息
                wx.getSetting({
                  success: res => {
                    if (res.authSetting['scope.userInfo']) {
                      wx.showTabBar()
                      wx.getUserInfo({
                        success: res => {
                          this.getEngineerInfo()
                          this.globalData.userInfo = res.userInfo
                          if (this.userInfoReady) {
                            this.userInfoReady(res)
                          }
                        }
                      })
                    } else {
                      console.log('当前未授权')
                    }
                  }
                })
              }
              wx.hideLoading()
            },
            complete() {
              wx.hideLoading()
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  },
  getEngineerInfo() {
    fetch({
      Act: 'HCGetEngineer',
      Data: JSON.stringify({
        OpenID: this.globalData.openid
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let engineerInfo = res.data.Data
        this.globalData.engineerInfo = engineerInfo
      }
    }).catch(err => {
      console.log(err)
    })
  },
  globalData: {
    openid: '',
    userInfo: null,
    engineerInfo: null,
    signImage: '',
    shareConf: {
      title: '武汉地产在线收房',
      path: '/pages/mine/mine',
      imgUrl: '/images/share.png'
    }
  }
})
