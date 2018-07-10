const app = getApp()
import {
  fetch
} from '../../common/api/index.js'
import {
  getUserInfo
} from '../../common/api/login.js'
Page({
  data: {
    userInfo: {
      avatarUrl: '../../images/sample.png'
    },
    engineerInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    score: 4
  },
  userinfoHandler(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      let encryptedData = e.detail.encryptedData
      let iv = e.detail.iv
      getUserInfo(app.globalData.openid).then(res => {
        app.globalData.userInfo = res.DecodedUserInfo
      }).catch(err => {
        console.log(err)
      })
      this.getEngineerInfo()
      wx.showTabBar()
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  getEngineerInfo() {
    fetch({
      Act: 'HCGetEngineer',
      Data: JSON.stringify({
        OpenID: app.globalData.openid
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let engineerInfo = res.data.Data
        this.setData({
          engineerInfo
        })
        console.log(this.data.engineerInfo)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad(options) {
    if (app.globalData.userInfo) {
      console.log(1, app.globalData.engineerInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log(2, app.globalData.openid)
      app.userInfoReady = res => {
        this.setData({
          userInfo: res.userInfo,
          engineerInfo: app.globalData.engineerInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log(3, app.globalData.openid)
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (app.globalData.openid) {
      console.log(1231231)
      this.getEngineerInfo()
    }
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.shareConf.title,
      path: app.globalData.shareConf.path,
      imageUrl: app.globalData.shareConf.imgUrl,
      success(res) {
        // 转发成功
      },
      fail(res) {
        // 转发失败
      }
    }
  }
})