const app = getApp()
import {
  baseUrl,
  api,
} from '../../common/api/config.js'
import {
  fetch
} from '../../common/api/index.js'
Page({
  data: {
    rooms:[],
    part:[],
    partres:[],
    partrestouble:[],
    roomIndex: '',
    partIndex: '',
    partresIndex: '',
    partrestoubleIndex: '',
    uploadImages: [],
    Urgency:["一般","紧急","加急"],
    Description: "",//描述
    PartID: '',//部位
    PartResID: '',//部品
    PartResTroubleID: '',//问题
    RoomID: '',//房间
    ScenePicture: ''//图片
  },
  bindInputHandler (e) {
    let Description = e.detail.value
    this.setData({
      Description
    })
  },
  bindPickerChange (e) {
    let name = e.currentTarget.dataset.target
    this.setData({
      [`${name}Index`]: e.detail.value
    })
    if (name === 'room') {
      this.getPart(this.data.rooms[this.data.roomIndex].ID)
      this.setData({
        RoomID: this.data.rooms[this.data.roomIndex].ID,
        PartID: '',
        partIndex: '',
        PartResID: '',
        partresIndex: '',
        PartResTroubleID: '',
        partrestoubleIndex: ''
      })
    }
    if (name === 'part') {
      this.getPartRes(this.data.part[this.data.partIndex].ID)
      this.setData({
        PartID: this.data.part[this.data.partIndex].ID,
        PartResID: '',
        partresIndex: '',
        PartResTroubleID: '',
        partrestoubleIndex: ''
      })
    }
    if (name === 'partres') {
      this.getPartResTouble(this.data.partres[this.data.partresIndex].ID)
      this.setData({
        PartResID: this.data.partres[this.data.partresIndex].ID,
        PartResTroubleID: '',
        partrestoubleIndex: ''
      })
    }
    if (name === 'partrestouble') {
      this.setData({
        PartResTroubleID: this.data.partrestouble[this.data.partrestoubleIndex].ID
      })
    }
  },
  chooseImage () {
    let _self = this
    wx.chooseImage({
      count: 5 - _self.data.uploadImages.length, // 默认9
      success (res) {
        let tempFilePaths = res.tempFilePaths
        let uploadImages = []
        wx.showLoading()
        for (let i = 0; i < tempFilePaths.length; i++) {
          _self.uploadFile(tempFilePaths[i], res => {
            uploadImages.push(baseUrl + JSON.parse(res.data).url)
            if (uploadImages.length === tempFilePaths.length) {
              _self.data.uploadImages = _self.data.uploadImages.concat(uploadImages)
              _self.setData({
                uploadImages: _self.data.uploadImages,
                ScenePicture: _self.data.uploadImages.join(',')
              })
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  removeImage (e) {
    let index = e.target.dataset.index
    this.data.uploadImages.splice(index, 1)
    this.setData({
      uploadImages: this.data.uploadImages
    })
  },
  previewImages () {},
  // 上传照片
  uploadFile(localId, cb) {
    wx.uploadFile({
      url: `${baseUrl}/Content/FileUpload/UploadImg.aspx?v=${Math.random().toString(36).substr(2)}` ,
      filePath: localId,
      name: 'imgFile',
      success: res => {
        cb && cb(res)
      },
      fail: res => {
        console.log(res)
      },
      complete: res => {
      }
    })
  }, 
  getRooms() {
    fetch({
      Act: 'HCGetRoom',
      Data: JSON.stringify({
        HouseID: parseInt(this.data.id),
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let rooms = res.data.Data
        this.setData({
          rooms
        })
        if (!(this.data.RoomID !==0 && !this.data.RoomID)) {
          let roomIndex = rooms.findIndex(item => item.ID == this.data.RoomID)
          this.setData({
            roomIndex
          })
          this.getPart(this.data.rooms[this.data.roomIndex].ID)
        }
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getPart(id) {
    fetch({
      Act: 'HCGetPartByRooms',
      Data: JSON.stringify({
        RoomID: id,
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let part = res.data.Data
        this.setData({
          part
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getPartRes(id) {
    fetch({
      Act: 'HCGetPartRes',
      Data: JSON.stringify({
        ID: id,
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let partres = res.data.Data
        this.setData({
          partres
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getPartResTouble(id) {
    fetch({
      Act: 'HCGetPartResTrouble',
      Data: JSON.stringify({
        ID: id,
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        let partrestouble = res.data.Data
        this.setData({
          partrestouble
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }, 
  goListpage() {
    wx.redirectTo({
      url: "/pages/check/check"
    })
  },
  Add () {
    var that = this;
    var eninfo = app.globalData.engineerInfo
    var id = this.data.id
    var des = this.data.Des
    var selectedReasons = this.data.selectedReasons
    if (this.data.RoomID === '') {
      wx.showToast({
        title: '请选择房间'
      })
      return
    }
    if (this.data.PartID === '') {
      wx.showToast({
        title: '请选择部位'
      })
      return
    }
    if (this.data.PartResID === '') {
      wx.showToast({
        title: '请选择部品'
      })
      return
    }
    if (this.data.PartResTroubleID === '') {
      wx.showToast({
        title: '请选择问题'
      })
      return
    }    
    fetch({
      Act: 'HCAddTrouble',
      Data: JSON.stringify({
        HouseID: this.data.id,
        HouseCheckID: this.data.checkid,
        EngineerID: eninfo.ID,
        Description: this.data.Description,//描述
        PartID: this.data.PartID,//部位
        PartResID: this.data.PartResID,//部品
        PartResTroubleID: this.data.PartResTroubleID,//问题
        RoomID: this.data.RoomID,//房间
        ScenePicture: this.data.ScenePicture,//图片
        Urgency: "一般"//紧急程度
      })
    }).then(res => {
      if (res.data.IsSuccess) {
        that.goListpage()
        wx.showToast({
          title: '提交成功',
          icon: 'succes',
          mask: true,
          duration: 1000
        })
        let timeout = setTimeout(() => {
          clearTimeout(timeout)
          wx.navigateBack()
        }, 1000)
      }
    })
  },
  onLoad (options) {
    let RoomID = options.roomid || ''
    this.setData({
      id: options.id,
      checkid: options.checkid,
      RoomID
    })
  },
  onReady () {},
  onShow () {
    this.getRooms()
  },
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {},
  onReachBottom () {},
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
})