const app = getApp()
import {
  fetch
} from '../../common/api/index.js'
Page({
  data: {
    id: 0,
    checkid:0,
    fixReasons: [
      '设计缺陷','工程质量瑕疵','与销售承诺不符','其他'
    ],
    selectedReasons: [],
    Des:"",
  },
  checkboxChangeHandler (e) {
    let selectedReasons = e.detail.value
    this.setData({
      selectedReasons:selectedReasons
    })
     
  },
  goRecords () {
    let EngineerID = app.globalData.engineerInfo.ID
    let HouseCheckID = this.data.checkid
    let HouseID = this.data.id
    wx.navigateTo({
      url: `/pages/refuserecord/refuserecord?EngineerID=${EngineerID}&HouseCheckID=${HouseCheckID}&HouseID=${HouseID}`,
    })
  },
  SetDes: function (e) {
    this.setData({
      Des: e.detail.value
    });
    //console.log(e)
  },
 goListpage(){
   wx.navigateBack()
 },
   Add () {
     var that=this;
     var eninfo = app.globalData.engineerInfo
     var id=this.data.id
     var des=this.data.Des
     var selectedReasons = this.data.selectedReasons
     if (selectedReasons.length < 1) {
       wx.showToast({
         title: '请选择拒收原因'
       })
       return
     }
     fetch({
       Act: 'HCAddNoAcceptLog',
       Data: JSON.stringify({
         HouseID: this.data.id,
         HouseCheckID: this.data.checkid,
         Descriptions:des,
         DefCheck: selectedReasons,
         EngineerID: eninfo.ID
       })
     }).then(res => {
       if (res.data.IsSuccess) {
         wx.showToast({
           title: '提交成功',
           icon: 'succes',
           mask: true
         })
         let timeout = setTimeout(() => {
           clearTimeout(timeout)
           that.goListpage()
         }, 1000)
       }
     })
   },
  onLoad (options) {
    this.setData({ id: options.id, checkid: options.checkid})
  },
  onReady () {},
  onShow () {},
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {},
  onReachBottom () {},
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
