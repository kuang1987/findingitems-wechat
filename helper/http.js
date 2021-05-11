import 'weapp-cookie'
import { DOMParser } from 'xmldom'

var config = require('config.js');
// var Parser = require('xmldom/dom-parser.js');


function get(path, params, success, fail, header={}) {
  wx.showLoading({
    title: '',
  })
  wx.requestWithCookie({
    url: config.url + path,
    data: params,
    header: getheader(header),
    method: "GET",
    dataType:"json",
    success(res) {
      detailSuccess(path, res, success, fail)
    },
    fail(err) {
      detailFail(err, fail)
    },
    complete() {
      wx.hideLoading()
    }
  })
}

function post(path, params, success, fail, header={}) {
  wx.showLoading({
    title: '',
    mask: true
  })
  wx.requestWithCookie({
    url: config.url + path,
    data: params,
    header: getheader(header),
    method: "POST",
    dataType: "json",
    success(res) {
      detailSuccess(path, res, success, fail)
    },
    fail(err) {
      detailFail(err, fail)
    },
    complete() {
      wx.hideLoading()
    }
  })
}

function put(path, params, success, fail, header={}) {
  wx.requestWithCookie({
    url: config.url + path,
    data: params,
    header: getheader(header),
    method: "put",
    dataType: "json",
    success(res) {
      detailSuccess(path, res, success, fail)
    },
    fail(err) {
      detailFail(err, fail)
    }
  })
}

function uploadFile(fileName, filePath, success, fail) {
  wx.showLoading({
    title: '',
    mask: true,
  })
  get(
    "/oss_token/",
    {},
    (response) => {
      var data = response.data;
      var name = "" + Date.parse(new Date()) + Math.random().toString(36).substr(2, 7) + "_" + fileName;
      var host = data.host;
      var policy = data.policy;
      var OSSAccessKeyId = data.OSSAccessKeyId;
      var Signature = data.Signature;
      var success_action_status = "201";
      var dir = data.dir;
      wx.uploadFile({
        url: host,
        filePath: filePath,
        name: 'file',
        formData: {
          "key": dir + name,
          "x-oss-object-acl": "public-read",
          "policy": policy,
          "OSSAccessKeyId": OSSAccessKeyId,
          "Signature": Signature,
          "success_action_status": success_action_status
        },
        success: function (res) {
          var data = res.data
          console.log("uploadFile:", res);
          // var DOMParser = Parser.DOMParser;
          var doc = new DOMParser().parseFromString(res.data);
          let location = doc.getElementsByTagName("Location")
          if (location == null || location.lenght == 0 || location[0] == null) {
            fail(Response(-1, "网络错误请稍后再试"))
            return
          }
          var videoUrl = location[0].firstChild.data;
          console.log("videoUrl:", videoUrl);
          if (videoUrl != null) {
            success(videoUrl)
          } else {
            fail(Response(-1, "网络错误请稍后再试"))
          }
        },
        fail: function (err) {
          fail(Response(-1, "网络错误请稍后再试"));
          console.log("uploadFile err:", err);
        },
        complete: function() {
          wx.hideLoading()
        }
      })
    },
    fail
  )
}

function getheader(header = {}) {
  header['content-type'] = 'application/json'
  try {
    let token = wx.getStorageSync('token')
    header['Authorization'] = `Bearer ${token}`
  } catch (e) {
    console.log('No token found')
  }

  return header
}

function detailSuccess(path, res, success, fail) {
  var data = res.data;
  var code = data.code;
  if (code == 401 || code == 403) {
    var User = require('../helper/user.js');
    User.setUserLogout();
  }
  if (code == 0) {
    if (success) success(Response(code, data.error_msg, data.data));
  } else {
    if (fail) fail(Response(code, data.error_msg == null ? "网络错误请稍后再试" : data.error_msg, data.data));
  }
}

function detailFail(err, fail) {
  console.log("request:", err)
  if (fail) fail(Response(-1, "网络错误请稍后再试",))
}

function Response(code, msg, data) {
  return { code: code, msg: msg, data: data }
}



module.exports = {
  get: get,
  post: post,
  put: put,
  uploadFile: uploadFile,
  Response: Response,
}
