// components/LocSelector/locSelector.js
import create from '../../utils/create'
import store from '../../store/index'
var Loc = require('../../helper/locations.js')
var User = require('../../helper/user.js')

create.Component(store, {
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    use: [
      'userInfo',
      'isLogin'
    ],
    locations: [],
    selectedLoc: 0
  },
  lifetimes: {
    attached: function() {
      this.listLocs()
    },
    detached: function() {
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    // show: function () { 
    //   this.listLocs()
    // },
  },
  /**
   * Component methods
   */
  methods: {
    listLocs() {
      Loc.listLocs(
        (res) => {
          var sortedLocs = Loc.setDetfaultOrder(res.data.results, User.getDefaultLocId())
          this.setData({
            locations: sortedLocs
          })
          if(res.data.results.length > 0) {
            // this.store.data.currentLocId = res.data.results[0].id
            this.triggerEvent('locChange', {'currentLocId': sortedLocs[0].id}, {})
          }
        }
      )
    },
    onLocationChange(e) {
      this.setData({
        selectedLoc: e.detail.value
      })
      this.triggerEvent('locChange', {'currentLocId': this.data.locations[e.detail.value].id}, {})
    },
  }
})
