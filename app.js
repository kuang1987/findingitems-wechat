var User = require('helper/user.js')
import store from './store/index'

// app.js
App({
  onLaunch() {
    var options = wx.getLaunchOptionsSync()
    if (options.path != 'pages/index/index') {
      wx.redirectTo({
        url: 'pages/index/index',
        complete: () => {
          store.data.redirect = {
            path: options.path,
            query: options.query
          }
        }
      })
    }
    var that = this
    User.goCheckAuth(() => {
      if(that.checkAuthCallback) {
        that.checkAuthCallback()
      }
    },
    () => {
      console.log('check auth failed')
    })
  },
  globalData: {
  }
})
