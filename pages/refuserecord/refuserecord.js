import {
  fetch
} from '../../common/api/index.js'
import {
  formatTime
} from '../../common/utils/util.js'
Page({
  data: {
    EngineerID: '',
    HouseCheckID: '',
    HouseID: '',
    records: [
      // {
      //   date: '2018-07-01',
      //   reasons: ['设计缺陷', '工程质量瑕疵', '与销售承诺不符', '其他'],
      //   desc: '这里是问题描述，补充说明文字'
      // },
      // {
      //   date: '2018-07-01',
      //   reasons: ['设计缺陷', '工程质量瑕疵', '与销售承诺不符', '其他'],
      //   desc: '这里是问题描述，补充说明文字'
      // },
      // {
      //   date: '2018-07-01',
      //   reasons: ['设计缺陷', '工程质量瑕疵', '与销售承诺不符', '其他'],
      //   desc: '这里是问题描述，补充说明文字'
      // }
    ]
  },
  getRecords () {
    fetch({
      Act: 'HCGetNoAcceptLogList',
      Data: JSON.stringify({
        EngineerID: this.data.EngineerID,
        HouseCheckID: this.data.HouseCheckID,
        HouseID: this.data.HouseID
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let records = res.data.Data.map(item => {
          item.Time = formatTime(new Date(item.Time))
          item.Tip = item.Tip ? item.Tip.split(',') : []
          return item
        })
        this.setData({
          records
        })
      }
    })
  },
  onLoad (options) {
    this.setData({
      EngineerID: options.EngineerID,
      HouseCheckID: options.HouseCheckID,
      HouseID: options.HouseID
    })
  },
  onReady () {},
  onShow () {
    this.getRecords()
  },
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {},
  onReachBottom () {},
  onShareAppMessage () {}
})