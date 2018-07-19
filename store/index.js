import { observable } from '../common/utils/mobx'
import {
  login,
  getRoles
} from '../common/api/login'
let store = observable({
  openid: '',
  baseInfo: null,
  roleInfo: null,
  // action
  upopenid (str) {
    this.openid = str
  },
  upRoleInfo (obj) {
    this.roleInfo = obj
  },
  getBase () {
    return new Promise((resolve, reject) => {
      login().then(res => {
        if (res.data.IsSuccess) {
          resolve(res)
          let baseInfo = res.data.Data
          this.baseInfo = baseInfo
          this.openid = res.data.Data.OpenID
        } else {
          wx.showModal({
            title: '提示',
            content: '返回数据错误！'
          })
        }
      })
    })
  },
  getRole () {
    return new Promise((resolve, reject) => {
      getRoles(this.openid).then(res => {
        if (res.data.IsSuccess) {
          resolve(res)
          let roleInfo = res.data.Data
          wx.setStorageSync('roleInfo', JSON.stringify(roleInfo))
          this.roleInfo = JSON.parse(wx.getStorageSync('roleInfo'))
        }
      })
    })
  }
})
export default store