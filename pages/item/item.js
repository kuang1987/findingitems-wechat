// pages/item/item.js
import create from '../../utils/create'
import store from '../../store/index'
create.Page(store, {

  /**
   * Page initial data
   */
  use: [
    'isLogin'
  ],
  data: {
    currentLocId: null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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
  onLocIdChange: function ({detail}) {
    this.setData({
      currentLocId: detail.currentLocId
    })
  }
})