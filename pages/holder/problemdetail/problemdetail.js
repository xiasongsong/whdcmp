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
    content: null,
    showForm: false,
    reasons: [],
    reasonIndex: 0,
    reasonText: ''
  },
  getContent (cb) {
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
        ? content.troubleinfo.ScenePicture.split(','): []
        this.setData({
          content,
          status: content.troubleinfo.Status
        })
        cb && cb()
      }
    })
  },
  openRefuse(e) {
    let curTroubleID = this.data.id
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
  getReasons() {
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
  pickerChange(e) {
    let reasonIndex = e.detail.value
    this.setData({
      reasonIndex
    })
  },
  textareaChange(e) {
    let reasonText = e.detail.value
    this.setData({
      reasonText
    })
  },
  // 受理
  getHandle(e) {
    // 受理 === 整改中
    // 拒绝 === 取消中
    wx.showModal({
      title: '提示',
      content: '确定受理吗？',
      success: res => {
        if (res.confirm) {
          let Status = '整改中'
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
              Types: '施工单位'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '受理成功'
              })
              this.getContent()
            }
          })
        }
      }
    })
  },
  // 拒单
  getRefuse(e) {
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
              this.getContent(() => {
                this.closeRefuse()
              })
            }
          })
        }
      }
    })
  },
  // 完成
  getFinish(e) {
    wx.showModal({
      title: '提示',
      content: '确定完成吗？',
      success: res => {
        if (res.confirm) {
          let Status = '已整改'
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
              Types: '施工单位'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '完成成功'
              })
              this.getContent()
            }
          })
        }
      }
    })
  },
  // 恢复并受理
  getReset(e) {
    wx.showModal({
      title: '提示',
      content: '确定恢复并受理吗？',
      success: res => {
        if (res.confirm) {
          let Status = '恢复并受理'
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
              Types: '施工单位'
            })
          }).then(res => {
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '恢复并受理成功'
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
    this.getReasons()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {},
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