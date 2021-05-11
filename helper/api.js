var user = require('user.js')
const app = getApp()
const API_BASE_URL = "http://localhost:8888/api"

function _getApiEndpoint(func='') {
  return `${API_BASE_URL}/${func}/`
}

function _call(func, method='GET', data={}, success=null, fail=null) {
  var header = {}
  try {
    let jwtToken = wx.getStorageSync('token')
    header['Authorization'] = `Bearer ${token}`
  } catch (e) {
    console.log('no token present')
  }
  wx.request({
    url: _getApiEndpoint(func),
    header: header, 
    success: (res) => {
      if(res.data.code != 0) {
        console.log(res.data.error_msg)
        if(fail) {
          fail(res.data)
        }
        return
      }
      if(success) {
        success(res.data)
      }
    },
    fail: (e) => {
      console.log(e)
    },
    data: data
  })
}

function login(js_code, encryptedData) {
  let data = {
    'js_code': js_code,
    'encryptedData': encryptedData
  }
  return _call(
    'login',
    'POST',
    data,
    (res) => {
      wx.setStorageSync('token', res.data.token)
      user.setUserLoggedIn(res.data)
    }
  )
}

function auth() {
  let data = {}
  return _call(
    'auth',
    'POST',
    data,
    (res) => {
      wx.setStorageSync('token', res.data.token)
      user.setUserLoggedIn(res.data)
    }
  )
}

module.exports = {
  login: login,
  auth: auth
}
