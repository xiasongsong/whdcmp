import { observer } from '../../../common/utils/mobx-wxapp'
import { watch, computed } from '../../../common/utils/vuefy.js'
import {
  fetch
} from '../../../common/api/index.js'
const app = getApp()
const store = app.globalData.store
Page(observer({ store })({
  data: {
    id: '',
    parts: [],
    activePartIndex: 0,
    showFilter: false,
    pulldown: true,
    indexStr: '',
    list: [],
    roomNum: '',
    partID: 0,
    status: '',
    showForm: false,
    refuseReasons: [],
    refuseReasonIndex: 0,
    refuseReasonText: '',
    curTroubleID: '',
    showClose: false,
    closeReasons: [],
    closeReasonIndex: 0,
    closeReasonText: ''
  },
  // 筛选相关
  showFilterBox() {
    this.setData({
      showFilter: true
    })
  },
  hideFilterBox() {
    this.setData({
      showFilter: false
    })
  },
  // 房号input
  inputChange(e) {
    let roomNum = e.detail.value
    this.setData({
      roomNum
    })
  },
  // 单选
  radioChange(e) {
    let partID = e.detail.value
    this.setData({
      partID
    })
  },
  // 重置
  clearFilters() {
    let parts = this.data.parts.map(item => {
      item.checked = false
      return item
    })
    this.setData({
      roomNum: '',
      partID: 0,
      parts
    })
  },
  // 筛选
  doFilt() {
    this.getList(() => {
      this.hideFilterBox()
    })
  },
  // 获取部位
  getParts() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    fetch({
      Act: 'HCGetPart',
      Data: JSON.stringify({
        HouseID: 0
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let parts = res.data.Data
        this.setData({
          parts
        })
      }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  getList(cb) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    fetch({
      Act: 'HCGetTroubleList',
      Data: JSON.stringify({
        StaffID: store.roleInfo.ID,
        HouseCheckID: this.data.id,
        RoomNum: this.data.roomNum,
        PartID: this.data.partID,
        Status: this.data.status
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        this.setData({
          indexStr: res.data.Data.No,
          list: res.data.Data.list
        })
        cb && cb()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  openRefuse(e) {
    let curTroubleID = e.target.dataset.tid
    this.setData({
      showForm: true,
      curTroubleID
    })
  },
  closeRefuse() {
    this.setData({
      showForm: false,
      curTroubleID: ''
    })
  },
  openClose(e) {
    let curTroubleID = e.target.dataset.tid
    this.setData({
      showClose: true,
      curTroubleID
    })
  },
  closeClose() {
    this.setData({
      showClose: false,
      curTroubleID: ''
    })
  },
  // 驳回理由
  getRefuseReasons() {
    fetch({
      Act: 'HCCanCelReasonList',
      Data: JSON.stringify({
        Types: '驳回理由'
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let refuseReasons = res.data.Data
        this.setData({
          refuseReasons
        })
      }
    })
  },
  // 关闭理由
  getCloseReasons() {
    fetch({
      Act: 'HCCanCelReasonList',
      Data: JSON.stringify({
        Types: '终止理由'
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let closeReasons = res.data.Data
        this.setData({
          closeReasons
        })
      }
    })
  },
  pickerChange(e) {
    let refuseReasonIndex = e.detail.value
    this.setData({
      refuseReasonIndex
    })
  },
  textareaChange(e) {
    let refuseReasonText = e.detail.value
    this.setData({
      refuseReasonText
    })
  },
  pickerChange1(e) {
    let closeReasonIndex = e.detail.value
    this.setData({
      closeReasonIndex
    })
  },
  textareaChange1(e) {
    let closeReasonText = e.detail.value
    this.setData({
      closeReasonText
    })
  },
  // 超时提醒
  timeoutAlert(e) {
    let TroubleID = e.target.dataset.tid
    fetch({
      Act: 'HCSendTemp',
      Data: JSON.stringify({
        TroubleID
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        wx.showModal({
          title: '提示',
          content: '超时提醒已发送！',
          showCancel: false
        })
      }
    })
  },
  DisContractor(e)
  {
    let TroubleID = e.target.dataset.tid
    let status = this.data.status
    wx.navigateTo({
      url: `/pages/repairengineer/uptrouble/uptrouble?tid=${TroubleID}&status=${status}`
    })
  },
  // 驳回
  getRefuse(e) {
    // 受理 === 整改中
    // 拒绝 === 取消中
    wx.showModal({
      title: '提示',
      content: '确定驳回吗？',
      success: res => {
        if (res.confirm) {
          let Status = '整改中'
          let TroubleID = this.data.curTroubleID
          let ReasonID = this.data.refuseReasons[this.data.refuseReasonIndex].ID
          let Contents = this.data.refuseReasonText
          let StaffID = store.roleInfo.ID
          fetch({
            Act: 'HCAccTrouble',
            Data: JSON.stringify({
              TroubleID,
              Status,
              ReasonID,
              Contents,
              StaffID,
              Types: '维修工程师'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '驳回成功'
              })
              this.getList(() => {
                this.closeRefuse()
              })
            }
          })
        }
      }
    })
  },
  // 强制关闭
  getClose(e) {
    // 受理 === 整改中
    // 拒绝 === 取消中
    wx.showModal({
      title: '提示',
      content: '确定关闭吗？',
      success: res => {
        if (res.confirm) {
          let Status = '已终止'
          let TroubleID = this.data.curTroubleID
          let ReasonID = this.data.closeReasons[this.data.closeReasonIndex].ID
          let Contents = this.data.closeReasonText
          let StaffID = store.roleInfo.ID
          fetch({
            Act: 'HCAccTrouble',
            Data: JSON.stringify({
              TroubleID,
              Status,
              ReasonID,
              Contents,
              StaffID,
              Types: '维修工程师'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '关闭成功'
              })
              this.getList(() => {
                this.closeClose()
              })
            }
          })
        }
      }
    })
  },
  // 同意
  getAgree(e) {
    wx.showModal({
      title: '提示',
      content: '确定同意取消吗？',
      success: res => {
        if (res.confirm) {
          let Status = '已取消'
          let TroubleID = e.target.dataset.tid
          let ReasonID = 0
          let Contents = ''
          let StaffID = store.roleInfo.ID
          fetch({
            Act: 'HCAccTrouble',
            Data: JSON.stringify({
              TroubleID,
              Status,
              ReasonID,
              Contents,
              StaffID,
              Types: '维修工程师'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '取消成功'
              })
              this.getList()
            }
          })
        }
      }
    })
  },
  getDetail(e) {
    let id = e.currentTarget.dataset.id
    let status = this.data.status
    wx.navigateTo({
      url: `/pages/repairengineer/problemdetail/problemdetail?id=${id}&status=${status}`
    })
  },
  onLoad(options) {
    let id = options.id
    let status = options.status
    console.log(id, status)
    this.setData({
      id,
      status
    })
    wx.setNavigationBarTitle({
      title: `问题列表-${status}`
    })
  },
  onReady() { },
  onShow() {
    this.getParts()
    this.getList()
    this.getRefuseReasons()
    this.getCloseReasons()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {
    this.setData({
      pulldown: true
    })
    // this.getList(() => {
    //   wx.stopPullDownRefresh()
    //   this.setData({
    //     pulldown: false
    //   })
    // })
  },
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
}))