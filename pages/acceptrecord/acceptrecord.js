import {
  fetch
} from '../../common/api/index.js'
Page({
  data: {
    list: [1,2,3,4,5]
  },
  getList () {
    fetch({
      Act: '',
      Data: JSON.stringify({
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let list = res.data.Data
        this.setData({
          list
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 看详情
  goDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/acceptdetail/acceptdetail?id=${id}`,
    })
  },
  onLoad (options) {},
  onReady () {},
  onShow () {
    // this.getList()
  },
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {},
  onReachBottom () {},
  onShareAppMessage () {}
})