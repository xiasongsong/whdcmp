import {
  fetch
} from '../../common/api/index.js'
import {
  colorMap
} from '../../common/config.js'
Page({
  data: {
    houseid: '',
    content: null,
    colorMap
  },
  getData() {
    fetch({
      Act: 'HCGetHouseDeliver',
      Data: JSON.stringify({
        ID: this.data.id
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let content = res.data.Data
        console.log(content)
        this.setData({
          content
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  teleCall (e) {
    let phoneNumber = e.target.dataset.tel
    wx.makePhoneCall({
      phoneNumber
    })
  },
  onLoad(options) {
    let id = options.id
    this.setData({
      id
    })
  },
  onReady() { },
  onShow() {
     this.getData()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
  onReachBottom() { },
  onShareAppMessage() { }
})