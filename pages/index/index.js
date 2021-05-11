// index.js
import create from '../../utils/create'
import store from '../../store/index'

var plugin = requirePlugin("WechatSI")
var User = require('../../helper/user.js')
var Http = require('../../helper/http.js')
var Instruction = require('../../helper/instruction.js')
var Loc = require('../../helper/locations.js')
var Info = require('../../helper/info.js')
var pathUtil = require('../../utils/path.js')
const recoManager = plugin.getRecordRecognitionManager()
// const recoFindManager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()

const ACTION_STORE = 1
const ACTION_FIND = 2

innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})

create.Page(store, {
  use: [
    'userInfo',
    'isLogin'
  ],
  data: {
    disabled: false,
    plain: false,
    loading: false,
    showText: "",
    hasVoice: false,
    isPlaying: false,
    audioPath: "",
    isErrorTips: false,
    errorTipText: "",
    isInfoTips: false,
    infoTipText: "",
    isShowHelp: false,
    helpDialogBtns: [
      {
        text: "开始使用"
      }
    ],
    action: ACTION_STORE,
    storeItem: {},
    isStoreItemDialogShow: false,
    searchId: null,
    isShowSearchResult: false,
    isShowNavDrawer: false,
    currentLocId: null,
    notificationCount: {
      invitationCount: 0
    },
  },
  showErrorTips(text) {
    this.setData({
      isErrorTips: true,
      errorTipText: text,
    })
  },
  hideErrorTips() {
    this.setData({
      isErrorTips: false,
      errorTipText: "",
    })
  },
  showInfoTips(text) {
    this.setData({
      isInfoTips: true,
      infoTipText: text,
    })
  },
  hideInfoTips() {
    this.setData({
      isInfoTips: false,
      infoTipText: "",
    })
  },
  onLoad() {
    console.log('on Load')
    var that = this
    if(this.data.$.authChecked) {
      console.log('auth checked')
      this.checkAuth(() => {
        that.initResource()
      })
    } else {
      console.log('auth not checked')
      app.checkAuthCallback = function() {
        that.checkAuth(() => {
          that.initResource()
        })
      }
    }
  },
  onHide() {
    console.log('on hide')
    this.setData({
      isShowNavDrawer: false
    })
  },
  onShow() {
    this.getNotificationCount()
  },
  initResource() {
    this.initRecoRecord()
    // this.initFindRecord()
    this.initLocation()
    this.getNotificationCount()
    if(this.store.data.redirect) {
      wx.navigateTo({
        url: '/' + pathUtil.queryToUrl(this.store.data.redirect.path, this.store.data.redirect.query ? this.store.data.redirect.query: {}),
        fail: (res) => {
          console.log(res)
        },
        complete: () => {
          this.store.data.redirect = {}
        }
      })
    }
  },
  getNotificationCount() {
    console.log('notify count')
    Info.totalNotificationCount(
      (res) => {
        this.setData({
          notificationCount: {
            invitationCount: res.data.invitation_count
          }
        })
      },
      (res) => {
        this.setData({
          notificationCount: {
            invitationCount: 0
          }
        })
      }
    )
  },
  initLocation() {
    console.log('init locs')
  },
  checkAuth(success) {
    if(this.data.$.isLogin) {
      success()
    } else {
      console.log('asdfasdf')
      this.showErrorTips("请登录...")
    }
  },
  showStoreItemDialog(item) {
    this.setData({
      isStoreItemDialogShow: true,
      storeItem: item
    })
  },
  showSearchResult(searchId) {
    this.setData({
      isShowSearchResult: true,
      searchId: searchId
    })
  },
  hideSearchResult() {
    this.setData({
      isShowSearchResult: false,
      searchId: null
    })
  },
  initRecoRecord() {
    recoManager.onStart = (res) => {
      console.log('recorder start', res)
      this.showInfoTips("请开始录音...")
    }
    recoManager.onStop = (res) => {
      console.log('recorder stop', res)
      this.setData({
        audioPath: res.tempFilePath,
      })
      console.log("识别结果:" + res.result)
      if(res.result == null || res.result == "") {
        this.showErrorTips("无法识别，请重新操作...")
        return
      }
      var that = this
      Http.uploadFile(
        that.getUploadFileName(),
        res.tempFilePath,
        (uploadUrl) => {
          if(that.data.action == ACTION_STORE) {
            console.log("store item")
            Instruction.storeItem(
              uploadUrl,
              res.result,
              that.data.currentLocId,
              function(res) {
                console.log("添加成功")
                that.showStoreItemDialog(res.data)
              },
              function(res) {
                console.log("添加失败,请重新操作...")
                that.showErrorTips("添加失败,请重新操作...")
              }
            )
          } else if (that.data.action == ACTION_FIND) {
            console.log("finding item")
            Instruction.findingItem(
              uploadUrl,
              res.result,
              function(res) {
                console.log("添加成功")
                that.showSearchResult(res.data.id)
              },
              function(res) {
                console.log("添加失败,请重新操作...")
                that.showErrorTips("添加失败,请重新操作..")
              }
            )
          }
        }
      )
    }
    recoManager.onError = (res) => {
      console.error("error msg", res.msg)
      this.showErrorTips("操作失败,请长按录音...")
    }
  },
  getUploadFileName() {
    if(this.data.action == ACTION_STORE) {
      return 'store.mps'
    } else if (this.data.action == ACTION_FIND) {
      return 'finding.mp3'
    }
  },
  // initStoreRecord() {
  //   recoStoreManager.onStart = (res) => {
  //     console.log('recorder start', res)
  //     this.showInfoTips("请开始录音...")
  //   }
  //   recoStoreManager.onStop = (res) => {
  //     console.log('recorder stop', res)
  //     this.setData({
  //       audioPath: res.tempFilePath,
  //     })
  //     console.log("识别结果:" + res.result)
  //     if(res.result == null || res.result == "") {
  //       this.showErrorTips("无法识别，请重新操作...")
  //       return
  //     }
  //     var that = this
  //     Http.uploadFile(
  //       that.getUploadFileName(),
  //       res.tempFilePath,
  //       (uploadUrl) => {
  //         console.log("store item")
  //         Instruction.storeItem(
  //           uploadUrl,
  //           res.result,
  //           this.data.currentLocId,
  //           function(res) {
  //             console.log("添加成功")
  //             that.showStoreItemDialog(res.data)
  //           },
  //           function(res) {
  //             console.log("添加失败,请重新操作...")
  //             that.showErrorTips("添加失败,请重新操作...")
  //           }
  //         )
  //       }
  //     )
  //   }
  //   recoStoreManager.onError = (res) => {
  //     console.error("error msg", res.msg)
  //     this.showErrorTips("操作失败,请长按录音...")
  //   }
  // },
  // initFindRecord() {
  //   recoFindManager.onStart = (res) => {
  //     console.log('finding recorder start', res)
  //     this.showInfoTips("请开始录音...")
  //   }
  //   recoFindManager.onStop = (res) => {
  //     console.log('finding recorder stop', res)
  //     this.setData({
  //       audioPath: res.tempFilePath,
  //     })
  //     if(res.result == null || res.result == "") {
  //       this.showErrorTips("无法识别，请重新操作...")
  //       return
  //     }
  //     var that = this
  //     Http.uploadFile(
  //       'finding.mp3',
  //       res.tempFilePath,
  //       (uploadUrl) => {
  //         console.log("finding item")
  //         Instruction.findingItem(
  //           uploadUrl,
  //           res.result,
  //           function(res) {
  //             console.log("添加成功")
  //             that.showSearchResult(res.data.id)
  //           },
  //           function(res) {
  //             console.log("添加失败,请重新操作...")
  //             that.showErrorTips("添加失败,请重新操作..")
  //           }
  //         )
  //       }
  //     )
  //   }
  //   recoFindManager.onError = (res) => {
  //     console.error("error msg", res.msg)
  //     this.showErrorTips("添加失败,请重新操作..")
  //   }
  // },
  onPressStore() {
    this.hideSearchResult()
    this.setData({
      action: ACTION_STORE
    },
    () => {
      this.checkAuth(() => {
        this.showInfoTips("准备中....")
        recoManager.start({duration:30000, lang: "zh_CN"})
      })
    }
    )
  },
  onStoreEnd() {
    this.checkAuth(() => {
      this.hideInfoTips()
      recoManager.stop()
    })
  },
  onPressFinding() {
    this.hideSearchResult()
    this.setData({
      action: ACTION_FIND
    },
    () => {
      this.checkAuth(() => {
        this.showInfoTips("准备中....")
        recoManager.start({duration:30000, lang: "zh_CN"})
      })
    }
    )
  },
  onFindingEnd() {
    this.checkAuth(() => {
      this.hideInfoTips()
      recoManager.stop()
    })
  },
  // play() {
  //   innerAudioContext.autoplay = false
  //   innerAudioContext.src = this.data.audioPath
  //   innerAudioContext.stop()
  //   innerAudioContext.play()
  // },
  // search() {
  //   this.setData({
  //     showText: "我要找东西"
  //   })
  // },
  onUserLogin(e) {
    var that = this
    if (e.detail.userInfo) {
      User.login(
        (res) => {
          console.log('login success')
          that.initResource()
        },
        (res) => {
          console.log('login fail')
        }
      )
    }
    else {
      //用户按了拒绝按钮
      wx.showToast({
        icon: "none",
        title: '授权失败',
      })
    }
  },
  onUserLogout(e) {
    if(this.store.data.isLogin) {
      User.setUserLogout()
      this.setData({
        isShowNavDrawer: false
      })
    }
  },
  onShowHelp(e) {
    this.setData({
      isShowHelp: true
    })
  },
  onCloseHelp(e) {
    this.setData({
      isShowHelp: false
    })
  },
  onShowNavDrawer() {
    this.setData({
      isShowNavDrawer: true,
    })
  },
  onHideNavDrawer() {
    this.setData({
      isShowNavDrawer: false,
    })
  },
  onLocIdChange({detail}) {
    console.log('loc selector id change')
    console.log(detail.currentLocId)
    this.setData({
      currentLocId: detail.currentLocId
    })
  }
})
