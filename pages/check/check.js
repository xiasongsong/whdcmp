import {
  $,
  $$
} from '../../common/utils/util.js'
import {
  fetch
} from '../../common/api/index.js'
const app = getApp()
Page({
  engineerInfo: {},
  data: {
    tabMenus: [
      {
        name: '模拟验房',
        target: 'mock'
      },
      {
        name: '正式交付',
        target: 'formal'
      }
    ],
    activeTabIndex: 0,
    moveBarStyle: '',
    pulldown: true,
    list: {
      mock: [],
      formal: []
    }
  },
  tabChangeHandler(e) {
    let activeTabIndex = e.target.dataset.index
    this.setData({
      activeTabIndex
    })
    this.moveBar()
    this.getList()
  },
  swiperChangeHandler (e) {
    this.setData({
      activeTabIndex: e.detail.current
    })
    this.moveBar()
    this.getList()
  },
  moveBar() {
    if (wx.canIUse('vibrateShort')) {
      wx.vibrateShort()
    }
    $$('.tabnav-item').boundingClientRect(rect => {
      let target = rect[this.data.activeTabIndex]
      this.setData({
        moveBarStyle: `left:${target.left + target.width * .2}px;width:${target.width * .6}px`
      })
    }).exec()
  },
  getList (cb) {
    this.engineerInfo = app.globalData.engineerInfo
    fetch({
      Act: 'HCGetHouseCheckList',
      Data: JSON.stringify({
        FansID: this.engineerInfo.FansID,
        Statu: this.data.activeTabIndex === 0 ? '模拟验房' : '正式验房'
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let target = this.data.tabMenus[this.data.activeTabIndex].target
        let str = `list.${target}`
        this.setData({
          [str]: res.data.Data
        })
        cb && cb()
      }
    })
  },
  getDetail(e) {
    let HouseCheckID = e.target.dataset.batchid
    let FansID = this.engineerInfo.FansID
    let name = e.target.dataset.name
    wx.navigateTo({
      url: `/pages/batchdetail/batch-list?HouseCheckID=${HouseCheckID}&name=${name}`,
    })
  },
  onLoad(options) {
  },
  onReady() { },
  onShow() {
    this.moveBar()
    this.getList()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {
    this.setData({
      pulldown: true
    })
    this.getList(() => {
      wx.stopPullDownRefresh()
      this.setData({
        pulldown: false
      })
    })
  },
  onShareAppMessage() { }
})