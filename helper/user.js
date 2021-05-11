import cookies from 'weapp-cookie'
var Http = require('./http.js');
var Config = require('./config.js')
import store from '../store/index'

function syncUserInfo(data) {
  store.data.userInfo = Object.assign({
    name: data.real_name,
    logo: data.avatar_url,
    defaultLocId: data.settings.default_loc
  })
}

function setToken(token) {
  try {
    wx.setStorageSync('token', token)
  } catch (e) { 
    console.log(e)
  }
}

function getToken() {
  let token = ''
  try {
    token = wx.getStorageSync('token')
  } catch (e) { 
    console.log(e)
  }
  return token
}

function deleteToken() {
  try {
    wx.removeStorageSync('token')
  }catch (e) { 
    console.log(e)
  }
}

function login(success, fail) {
  console.log('user login')
  wx.login({
    success(res) {
      if (res.code) {
        goServerLogin(res.code, success, fail);
      } else {
        console.log('登录失败！' + res.errMsg)
        if (fail != null) fail({ msg: ('登录失败！' + res.errMsg) })
      }
    }
  })
}

function setUserLogin(data) {
  setToken(data.token)
  syncUserInfo(data)
  store.data.isLogin = true
}

function setUserLogout() {
  console.log("logout")
  cookies.remove("csrftoken")
  cookies.remove("sessionid")
  store.data.userInfo = {}
  store.data.isLogin = false
  deleteToken()
}

function goCheckAuth(success, fail) {
  store.data.authChecked = false
  Http.post(
    "/auth/",
    {},
    (res) => {
      // let token = res.data.token
      // console.log('token:', token)
      // setToken(token)
      setUserLogin(res.data)
      store.data.authChecked = true
      if(success) {
        success()
      }
    },
    (res) => {
      console.log('auth check failed')
      wx.showToast({
        title: '请点击登录',
        icon: 'error',
        duration: 2000
      })
      if(fail) {
        fail()
      }    
    }
  )
}

function goServerLogin(code, success, fail) {
  wx.getUserInfo({
    withCredentials: true,
    success: (result)=>{
      Http.post(
        "/login/",
        { "js_code": code, 'encryptedData': result.encryptedData, 'iv': result.iv },
        (res) => {
          setUserLogin(res.data)
          if (success != null) success(res)
        },
        function (res) {
          if (fail != null) fail(res)
        }
      )
    },
    fail: ()=>{
      if (fail != null) fail({ code: -1, msg: '授权失败', data: null })
    },
  });

}

function getDefaultLocId() {
  return store.data.userInfo.defaultLocId
}

function setDefaultLocId(locId) {
  store.data.userInfo.defaultLocId = locId
  return
}

module.exports = {
  goCheckAuth: goCheckAuth,
  login: login,
  setUserLogout: setUserLogout,
  getDefaultLocId: getDefaultLocId,
  setDefaultLocId: setDefaultLocId,
}