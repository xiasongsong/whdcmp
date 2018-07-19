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
    reasons: [],
    reasonIndex: 0,
    reasonText: '',
    curTroubleID: ''
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
  inputChange (e) {
    let roomNum = e.detail.value
    this.setData({
      roomNum
    })
  },
  // 单选
  radioChange (e) {
    let partID = e.detail.value
    this.setData({
      partID
    })
  },
  // 重置
  clearFilters () {
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
  doFilt () {
    this.getList(() => {
      this.hideFilterBox()
    })
  },
  // 获取状态
  getParts () {
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
  openRefuse (e) {
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
  // 拒绝受理的理由
  getReasons () {
    fetch({
      Act: 'HCCanCelReasonList',
      Data: JSON.stringify({
        Types: '拒单理由'
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let reasons = res.data.Data
        this.setData({
          reasons
        })
      }
    })
  },
  pickerChange (e) {
    let reasonIndex = e.detail.value
    this.setData({
      reasonIndex
    })
  },
  textareaChange (e) {
    let reasonText = e.detail.value
    this.setData({
      reasonText
    })
  },
  // 受理
  getHandle (e) {
    // 受理 === 整改中
    // 拒绝 === 取消中
    wx.showModal({
      title: '提示',
      content: '确定受理吗？',
      success: res => {
        if (res.confirm) {
          let Status = '整改中'
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
              Types: '施工单位'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '受理成功'
              })
              this.getList()
            }
          })
        }
      }
    })
  },
  // 拒单
  getRefuse (e) {
    // 受理 === 整改中
    // 拒绝 === 取消中
    wx.showModal({
      title: '提示',
      content: '确定拒绝吗？',
      success: res => {
        if (res.confirm) {
          let Status = '取消中'
          let TroubleID = this.data.curTroubleID
          let ReasonID = this.data.reasons[this.data.reasonIndex].ID
          let Contents = this.data.reasonText
          let StaffID = store.roleInfo.ID
          fetch({
            Act: 'HCAccTrouble',
            Data: JSON.stringify({
              TroubleID,
              Status,
              ReasonID,
              Contents,
              StaffID,
              Types: '施工单位'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '提交申请成功'
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
  // 完成
  getFinish (e) {
    wx.showModal({
      title: '提示',
      content: '确定完成吗？',
      success: res => {
        if (res.confirm) {
          let Status = '已整改'
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
              Types: '施工单位'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '完成成功'
              })
              this.getList()
            }
          })
        }
      }
    })
  },
  // 恢复并受理
  getReset (e) {
    wx.showModal({
      title: '提示',
      content: '确定恢复并受理吗？',
      success: res => {
        if (res.confirm) {
          let Status = '恢复并受理'
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
              Types: '施工单位'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '恢复并受理成功'
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
      url: `/pages/holder/problemdetail/problemdetail?id=${id}&status=${status}`
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
    this.getReasons()
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