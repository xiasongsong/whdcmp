import {
  login,
  getRole
} from 'common/api/login.js'
import store from 'store/index'
import { observer } from 'common/utils/mobx-wxapp'
App(observer({store})({
  onShow() {
    store.getBase().then(res => {
      wx.hideLoading()
      store.upopenid(res.data.Data.OpenID)
      return store.getRole(res.data.Data.OpenID)
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  globalData: {
    store,
    signImage: '',
    shareConf: {
      title: '武汉地产移动验房',
      path: '/pages/mine/mine',
      imgUrl: '/images/share.png'
    }
  }
}))
