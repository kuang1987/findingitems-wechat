// pages/loc/loc.js
import create from '../../utils/create'
import store from '../../store/index'
var Loc = require('../../helper/locations.js')
var User = require('../../helper/user')
const { $Toast } = require('../../libs/iview/base/index')

create.Page(store, {

  /**
   * Page initial data
   */
  data: {
    locations: [],
    isDeleteModalShow: false,
    deleteLoc: {},
    deleteModalActions: [{
      name: '取消'
    },
    {
      name: '确认',
      color: '#ed3f14',
      loading: false
    }],
    editModalTitle: "新增位置",
    editLocDetail: {},
    isEditModalShow: false,
    isCreate: true,
    editModalActions: [{
      name: '取消'
    },
    {
      name: '确认',
      color: '#19be6b'
    }],
    isRemoveMemberModalShow: false,
    removeMemberModalActions: [{
      name: '取消'
    },
    {
      name: '确认',
      color: '#19be6b'
    }],
    removeMemberUserId: null,
    removeLocMembershipId: null,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

    this.listLocs()
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

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

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
  listLocs() {
    Loc.listLocs(
      (res) => {
        this.setData({
          locations: Loc.setDetfaultOrder(res.data.results, User.getDefaultLocId())
        })
        console.log(Loc.setDetfaultOrder(res.data.results, User.getDefaultLocId()))
      }
    )
  },
  onSetDefault(e) {
    var loc = e.currentTarget.dataset.loc
    var currentLocs = this.data.locations
    for(let i=0; i < currentLocs.length; i++) {
      if(currentLocs[i].id == loc.id) {
        currentLocs[i].is_default = true
      } else {
        currentLocs[i].is_default = false
      }
    }
    this.setData({
      locations: currentLocs
    })
    Loc.setDefaultLoc(loc.membership_id,
    (res) => {
      User.setDefaultLocId(loc.id)
      this.listLocs()
      $Toast({
        content: '设置成功',
        type: 'success'
      })
    },
    (res) => {
      this.listLocs()
      $Toast({
        content: '设置失败',
        type: 'error'
      })
    }
    )
  },
  onDeleteLoc({detail}) {
    if(detail.index == 0) {
      this.hideDeleteModal()
    } else {
      Loc.deleteOrLeaveLoc(this.data.deleteLoc,
        (res) => {
          $Toast({
            content: "操作成功",
            type: 'success'
          })
          this.listLocs()
          this.hideDeleteModal()
        },
        (res) => {
          $Toast({
            content: res.msg,
            type: 'error'
          })
          this.hideDeleteModal()
        }
      )
    }
  },
  onPreDelete(e) {
    var loc = e.currentTarget.dataset.loc
    console.log(loc)
    this.showDeleteModal(loc)
  },
  showDeleteModal(loc) {
    this.setData({
      deleteLoc: loc,
      isDeleteModalShow: true,
    })
  },
  hideDeleteModal() {
    this.setData({
      deleteLoc: {},
      isDeleteModalShow: false,
    })
  },
  onPreCreateLoc() {
    this.showEditModal(true, null)
  },
  onPreUpdate(e) {
    this.showEditModal(false, e.currentTarget.dataset.loc.id)
  },
  getEditModalTitle(isCreate) {
    return isCreate ? "新增位置" : "编辑位置"
  },
  showEditModal(isCreate, locId) {
    if(isCreate) {
      this.setData({
        editLocDetail: {},
        isCreate: true,
        editModalTitle: this.getEditModalTitle(true),
        isEditModalShow: true
      })
    } else {
      var currentEditLoc = {}
      var currentLocs = this.data.locations
      for(let i=0; i < currentLocs.length; i++) {
        if(currentLocs[i].id == locId) {
          currentEditLoc = currentLocs[i]
          break
        }
      }
      this.setData({
        editLocDetail: currentEditLoc,
        isCreate: false,
        editModalTitle: this.getEditModalTitle(false),
        isEditModalShow: true
      })
    }
  },
  hideEditModal() {
    this.setData({
      editLocDetail: {},
      editModalTitle: '',
      isEditModalShow: false
    })
  },
  onCreateUpdateLoc({detail}) {
    if(detail.index == 0) {
      this.hideEditModal()
    } else {
      if(!this.data.editLocDetail.name) {
        $Toast({
          content: "名字不能为空",
          type: 'error'
        })
        return
      }
      if(this.data.isCreate) {
        Loc.addLoc(this.data.editLocDetail,
          (res) => {
            $Toast({
              content: "添加成功",
              type: 'success'
            })
            if(this.data.editLocDetail.is_default) {
              User.setDefaultLocId(res.data.id)
            }
            this.listLocs()
            this.hideEditModal()
          },
          (res) => {
            $Toast({
              content: res.msg,
              type: 'error'
            })
          })
      } else {
        console.log(this.data.editLocDetail)
        Loc.updateLocMember(this.data.editLocDetail.membership_id, this.data.editLocDetail,
          (res) => {
            $Toast({
              content: "更新成功",
              type: 'success'
            })
            this.listLocs()
            this.hideEditModal()
          },
          (res) => {
            $Toast({
              content: res.msg,
              type: 'error'
            })
          })
      }
    }
  },
  onSetDetailDefault({detail}) {
    console.log('switch')
    this.setData({
      'editLocDetail.is_default': detail.value
    })
  },
  onSetDetailName({detail}) {
    console.log(detail.detail.value)
    this.setData({
      'editLocDetail.name': detail.detail.value
    })
  },
  onShareAppMessage(object) {
    if(object.from == 'menu') {
      return {
        title: '找物',
        path: '/pages/index/index'
      }
    }
    console.log(object.target.dataset.loc)
    var loc = object.target.dataset.loc
    return {
      title: `${loc.owner.real_name}邀请你加入”${loc.alias_name}“`,
      path: '/pages/invitation/invitation/?loc_id=' + loc.id,
    }
  },
  onPreRemoveMember({currentTarget}) {
    var memberUserId = currentTarget.dataset.memberUserId
    var locMembershipId = currentTarget.dataset.locMembershipId
    console.log(memberUserId)
    console.log(locMembershipId)
    this.setData({
      isRemoveMemberModalShow: true,
      removeMemberUserId: memberUserId,
      removeLocMembershipId: locMembershipId
    })
  },
  onRemoveLocMember({detail}) {
    if(detail.index == 0) {
      this.setData({
        isRemoveMemberModalShow: false,
        removeMemberUserId: null
      })
    } else if (detail.index == 1) {
      Loc.removeLocMember(this.data.removeLocMembershipId, this.data.removeMemberUserId,
      (res) => {
        $Toast({
          content: "更新成功",
          type: 'success'
        })
        this.listLocs()
        this.setData({
          isRemoveMemberModalShow: false,
          removeMemberUserId: null,
          removeLocMembershipId: null
        })
      },
      (res) => {
        $Toast({
          content: res.msg,
          type: 'error'
        })
        this.setData({
          isRemoveMemberModalShow: false,
          removeMemberUserId: null,
          removeLocMembershipId: null
        })
      }  
      )
    }
  }
})