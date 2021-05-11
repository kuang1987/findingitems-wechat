// pages/invitation/invitation.js
import create from '../../utils/create'
import store from '../../store/index'
const { $Toast } = require('../../libs/iview/base/index')

var Loc = require('../../helper/locations.js')

create.Page(store, {

  /**
   * Page initial data
   */
  data: {
    invitations: [],
    currentTab: "needConfirm",
    currentInvitationId: null,
    confirmOrReject: true,
    isModalShow: false,
    modalActions: [{
      name: '取消'
    },
    {
      name: '确认',
      color: '#ed3f14',
      loading: false
    }]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options)
    var locId = options ? options.loc_id : null
    console.log(locId)
    if(locId) {
      return Loc.addInvitation(locId,
        (res) => {
          $Toast({
            content: "已发送申请，请等待主人确认",
            type: 'success'
          })
          this.listInvitations()
          this.setData({
            currentTab: "myApplication"
          })
        },
        (res) => {
          console.log(res)
          $Toast({
            content: res.msg,
            type: 'warning'
          })
        })
    }
    this.listInvitations()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    console.log('on invitation hide')
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    console.log('on invitation unload')
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  listInvitations: function () {
    Loc.listInvitations(
      (res) => {
        this.setData({
          invitations: res.data.results
        })
      }
    )
  },

  handleTabChange ({ detail }) {
    console.log(detail)
    this.setData({
        currentTab: detail.key
    });
  },

  onPreConfirm ({currentTarget}) {
    this.setData({
      currentInvitationId: currentTarget.dataset.locInvitation,
      confirmOrReject: true,
      isModalShow: true
    })
  },

  onPreReject ({currentTarget}) {
    this.setData({
      currentInvitationId: currentTarget.dataset.locInvitation,
      confirmOrReject: false,
      isModalShow: true
    })
  },

  onConfirmOrReject ({detail}) {
    if(detail.index == 0) {
      this.setData({
        currentInvitationId: null,
        confirmOrReject: true,
        isModalShow: false
      })
    } else {
      var status = this.data.confirmOrReject ? 1 : 2
      Loc.updateLocInvitation(this.data.currentInvitationId, status,
      (res) => {
        $Toast({
          content: "执行成功",
          type: 'success'
        })
        this.setData({
          currentInvitationId: null,
          confirmOrReject: true,
          isModalShow: false
        })
        this.listInvitations()
      },
      (res) => {
        $Toast({
          content: res.msg,
          type: 'warning'
        })
        this.setData({
          currentInvitationId: null,
          confirmOrReject: true,
          isModalShow: false
        })
      })
    }
  }
})