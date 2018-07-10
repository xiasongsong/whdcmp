const app = getApp()
const judge = [
  '非常不满意', '不满意', '一般', '满意', '非常满意'
]
import {
  fetch
} from '../../common/api/index.js'

Page({
  data: {
    id:0,
    checkid:0,
    index: '',
    score: 0,
    judge,
    signImage: app.globalData.signImage,
    date: '',
    shuibiao:'',
    dianbiao:'',
    qibiao:''
  },
  scoreChangeHandler(e) {
    let score = e.detail.score
    this.setData({
      score
    })
  },
  dateChangeHandler(e) {
    let date = e.detail.value
    this.setData({
      date
    })
  },
  openSign () {
    wx.navigateTo({
      url: '/pages/sign/sign',
    })
  },
  goListpage() {
    wx.redirectTo({
      url: "/pages/check/check",
    })
  },
  Add:function()
  {
    var that=this;
   var score = this.data.score
   var signImage= app.globalData.signImage
   var date = this.data.date
   var shuibiao = this.data.shuibiao
   var dianbiao = this.data.dianbiao
   var qibiao = this.data.qibiao
   var eninfo = app.globalData.engineerInfo
   if (dianbiao === '') {
     wx.showModal({
       content: '请填写电表底数！',
       showCancel: false
     })
     return
   }
   if (shuibiao === '') {
      wx.showModal({
        content: '请填写水表底数！',
        showCancel: false
      })
      return
   }
   if (qibiao === '') {
     wx.showModal({
       content: '请填写气表底数！',
       showCancel: false
     })
     return
   }
   if (date === '') {
     wx.showModal({
       content: '请选择接待日期！',
       showCancel: false
     })
     return
   }
   if (!score) {
     wx.showModal({
       content: '请选择满意度！',
       showCancel: false
     })
     return
   }
   if (!signImage) {
     wx.showModal({
       content: '请手写签名！',
       showCancel: false
     })
     return
   }
   fetch({
     Act: 'HCAddDeliver',
     Data: JSON.stringify({
       HouseID: this.data.id,
       HouseCheckID: this.data.checkid,
       EngineerID: eninfo.ID,
       Autograph: signImage,
       shuibiao: shuibiao,
       dianbiao: dianbiao,
       qibiao: qibiao,
       Score:this.data.score
     })
   }).then(res => {
     if (res.data.IsSuccess) {
       wx.showToast({
         title: '提交成功',
         icon: 'succes'
       })
        let timeout = setTimeout(() => {
          clearTimeout(timeout)
          wx.navigateBack({
            delta: 2
          })
          app.globalData.signImage = ''
        }, 1000)
     }
   })
  },
  onLoad(options) {
    app.globalData.signImage = ''
    this.setData({ id: options.id, checkid: options.checkid })
  },
  onReady() {
  },
  onShow() {
    let signImage = app.globalData.signImage
    this.setData({
      signImage
    })
  },
  shuibiao(e) {
    this.setData({
      shuibiao: e.detail.value
    });
  },
  dianbiao(e) {
    this.setData({
      dianbiao: e.detail.value
    });
  },
  qibiao(e) {
    this.setData({
      qibiao: e.detail.value
    });
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
  onReachBottom() { },
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