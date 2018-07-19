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
    status: '',
    timeout: false,
    content: null,
    showForm: false,
    refuseReasons: [],
    refuseReasonIndex: 0,
    refuseReasonText: '',
    showClose: false,
    closeReasons: [],
    closeReasonIndex: 0,
    closeReasonText: ''
  },
  getContent(cb) {
    fetch({
      Act: 'HCGetTrouble',
      Data: JSON.stringify({
        TroubleID: this.data.id
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let content = res.data.Data
        content.troubleinfo.FinishPicture = content.troubleinfo.FinishPicture
          ? content.troubleinfo.FinishPicture.split(',') : []
        content.troubleinfo.ScenePicture = content.troubleinfo.ScenePicture
          ? content.troubleinfo.ScenePicture.split(',') : []
        this.setData({
          content,
          status: content.troubleinfo.Status,
          timeout: content.troubleinfo.IsTimeOut
        })
        cb && cb()
      }
    })
  },
  openRefuse(e) {
    this.setData({
      showForm: true
    })
  },
  closeRefuse() {
    this.setData({
      showForm: false
    })
  },
  openClose(e) {
    this.setData({
      showClose: true
    })
  },
  closeClose() {
    this.setData({
      showClose: false
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
        TroubleID: this.data.id
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        wx.showModal({
          title: '提示',
          content: res.data.Message,
          showCancel: false
        })
      }
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
          let TroubleID = this.data.id
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
              this.getContent(() => {
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
          let TroubleID = this.data.id
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
              this.getContent(() => {
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
          let TroubleID = this.data.id
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
              this.getContent()
            }
          })
        }
      }
    })
  },
  // 预览
  preview(e) {
    let current = e.currentTarget.dataset.src
    let group = e.currentTarget.dataset.group
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: group // 需要预览的图片http链接列表
    })
  },
  // 打电话
  teleCall(e) {
    let phoneNumber = e.target.dataset.tel
    wx.makePhoneCall({
      phoneNumber
    })
  },
  onLoad(options) {
    let id = options.id
    let status = options.status
    this.setData({
      id,
      status
    })
  },
  onReady() { },
  onShow() {
    this.getContent()
    this.getRefuseReasons()
    this.getCloseReasons()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
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