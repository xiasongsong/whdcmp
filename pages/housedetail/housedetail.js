import {
  colorMap,
  categoryMap,
  states,
  positions
} from '../../common/config.js'
import {
  fetch
} from '../../common/api/index.js'
import {
  baseUrl
} from '../../common/api/config.js'
Page({
  data: {
    id: null,
    house: {},
    activeTabIndex: 0,
    tabs: [
      {
        name: '问题图示'
      },
      {
        name: '问题列表'
      }
    ],
    colorMap,
    categories: categoryMap,
    problems: [],
    showFilter: false,
    selectedstates: '',
    selectedrooms: '',
    selectedroomsID: '',
    selectedpositions: '',
    selectedpositionsID: '',
    states,
    rooms: [],
    positions: [],
    roompoints: []
  },
  init() {
    this.watchFilters('states')
    this.watchFilters('rooms')
    this.watchFilters('positions')
  },
  swiperChangeHandler (e) {
    let activeTabIndex = e.detail.current
    this.setData({
      activeTabIndex
    })
  },
  // 查看问题详细
  goOrderDetail (e) {
    let id = e.currentTarget.dataset.id
    let statu = e.currentTarget.dataset.state
    wx.navigateTo({
      url: `/pages/orderdetail/orderdetail?id=${id}&statu=${statu}`,
    })
  },
  // 收楼页面
  goAccept () {
    wx.navigateTo({
      url: '/pages/accept/accept?id=' + this.data.id + '&checkid=' + this.data.house.HouseCheckID,
    })
  },
  // 不收楼页面
  goRefuse() {
    wx.navigateTo({
      url: '/pages/refuse/refuse?id=' + this.data.id + '&checkid=' + this.data.house.HouseCheckID,
    })
  },
  // 获取图片和描点
  getRoomPoint () {
    fetch({
      Act: 'HCGetRoomPoint',
      Data: JSON.stringify({
        HouseID: this.data.id
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let roompoints = res.data.Data
        roompoints.forEach(item => {
          item.x = 100 * item.x / this.data.house.Huxing.PicW + '%'
          item.y = 100 * item.y / this.data.house.Huxing.PicH + '%'
        })
        this.setData({
          roompoints
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 前往添加问题
  goAddNew () {
    wx.navigateTo({
      url: '/pages/addnew/addnew?id=' + this.data.id + '&checkid=' + this.data.house.HouseCheckID,
    })
  },
  // 带参数添加问题
  goAddNewWithPara (e) {
    let RoomID = e.target.dataset.roomid
    wx.navigateTo({
      url: `/pages/addnew/addnew?id=${this.data.id}&checkid=${this.data.house.HouseCheckID}&roomid=${RoomID}`,
    })
  },
  // 筛选相关
  showFilterBox () {
    this.setData({
      showFilter: true
    })
  },
  hideFilterBox() {
    this.setData({
      showFilter: false
    })
  },
  checkboxChange (e) {
    let name = e.currentTarget.dataset.target
    let target = this.data[name]
    let value = e.detail.value
    target.map(item => {
      if (value == item.ID) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    this.watchFilters (name)
    if (name === 'rooms') {
      this.getPartRes()
    }
  },
  watchFilters (name, clear = false) {
    // clear 表示清空
    let arr
    if (clear) {
      arr = this.data[name].map(item => item.checked = false)
      if (arr.length < 1) return
      this.setData({
        [`selected${name}`]: '',
        [`selected${name}ID`]: '',
        [name]: this.data[name]
      })
    } else {
      arr = this.data[name].filter(item => item.checked)
      if (arr.length < 1) return
      this.setData({
        [`selected${name}`]: arr[0].Name,
        [`selected${name}ID`]: arr[0].ID,
        [name]: this.data[name]
      })
    }
  },
  clearFilters () {
    // this.watchFilters('states', true)
    this.watchFilters('rooms', true)
    this.watchFilters('positions', true)
  },
  // 切换tab
  tabTap (e) {
    let activeTabIndex = e.target.dataset.index
    this.setData({
      activeTabIndex
    })
  },
  // 请求房子信息
  getHouse () {
    fetch({
      Act: 'HCGetHouseList',
      Data: JSON.stringify({
        ID: this.data.id
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let house = res.data.Data.House
        house.Huxing.Picture = baseUrl + house.Huxing.Picture
        this.setData({
          house
        })
        this.getRoomPoint()
        this.getProblems()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 请求问题列表
  getProblems (RoomID = 0, PartID = 0, PartResID = 0, Status = '') {
    fetch({
      Act: 'HCGetHouseTroubleList',
      Data: JSON.stringify({
        HouseID: parseInt(this.data.id),
        HouseCheckID: this.data.house.HouseCheckID,
        RoomID,
        PartID,
        PartResID,
        Status
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let problems = res.data.Data
        this.setData({
          problems
        })
      }
    })
  },
  // 获取部位
  getParts () {
    fetch({
      Act: 'HCGetPart'
    }).then(res => {
      if (res.data.IsSuccess) {
        let rooms = res.data.Data
        this.setData({
          rooms
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 获取部品
  getPartRes () {
    fetch({
      Act: 'HCGetPartRes',
      Data: JSON.stringify({
        ID: this.data.selectedroomsID
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let positions = res.data.Data
        this.setData({
          positions
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 确定筛选
  doFilt () {
    this.getProblems(0, this.data.selectedroomsID, this.data.selectedpositionsID, '')
    this.hideFilterBox()
  },
  onLoad (options) {
    console.log(options)
    let id = options.id || ''
    let building = options.building
    let floor = options.floor
    let unit = options.unit
    let houseno = options.houseno
    let title = houseno ? building + '-' + unit + '-' + floor + '-' + houseno  : '测试房号1203'
    wx.setNavigationBarTitle({
      title
    })
    this.setData({
      id
    })
    this.init()
  },
  onReady () {},
  onShow () {
    this.getHouse()
    this.getParts()
    this.getPartRes()
  },
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {},
  onReachBottom () {},
  onShareAppMessage () {}
})