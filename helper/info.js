import cookies from 'weapp-cookie'
var Http = require('./http.js');
var Config = require('./config.js')
import store from '../store/index'

function totalNotificationCount(success,fail) {
    console.log('total count')
    Http.get(
      `/notification/totalCount/`,
      {},
      success,
      fail
    )
}

module.exports = {
  totalNotificationCount: totalNotificationCount
}