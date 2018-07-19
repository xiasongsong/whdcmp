import { observer } from '../../common/utils/mobx-wxapp'
import { watch, computed } from '../../common/utils/vuefy.js'
import { fetch } from '../../common/api/index'
const app = getApp()
let store = app.globalData.store
const roles = [
  {
    name: '验房管理员',
    icon: '../../images/checkengineer.png',
    type: 3
  },
  {
    name: '施工单位',
    icon: '../../images/repairengineer.png',
    type: 2
  },
  {
    name: '维修工程师',
    icon: '../../images/manager.png',
    type: 1
  },
  {
    name: '数据报表',
    icon: '../../images/leader.png',
    type: 4
  }
]
Page(observer({ store })({
  data: {
    roles
  },
  check(Types) {
    return fetch({
      Act: 'HCGetStaff',
      Data: JSON.stringify({
        OpenID: store.baseInfo.OpenID,
        Types
      })
    })
  },
  start(e) {
    let type = e.target.dataset.type
    let roleArr
    this.check(type).then(res => {
      console.log(res)
      if (res.data.IsSuccess) {
        store.upRoleInfo(res.data.Data)
        roleArr = store.roleInfo.Type
        let url = ''
        // let item = roleArr.find(item => item.ID == type)
        // let goon
        // if (item) {
        // goon = item.ID
        switch (type) {
          case 3:
            url = '/pages/checkengineer/check/check'
            break
          case 2:
            url = '/pages/holder/batchlist/batchlist'
            break
          case 1:
            url = '/pages/repairengineer/batchlist/batchlist'
            break
          case 4:
            url = '/pages/leader/batchlist/batchlist'
            break
          default:
            url = ''
            break
        }
        wx.navigateTo({
          url
        })
        // }
      } else {
        wx.showModal({
          title: '提示',
          content: '对不起，您没有查看此栏目的权限！',
          showCancel: false
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad(options) {
    computed(this, {
    })
  },
  onReady() { },
  onShow() {
    store.upopenid('00000')
  },
  onHide() {
    app.globalData.store = store
  },
  onUnload() {
    app.globalData.store = store
  },
  onPullDownRefresh() { },
  onReachBottom() { },
  onShareAppMessage() { }
}))