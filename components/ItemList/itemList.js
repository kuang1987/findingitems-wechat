var Instruction = require('../../helper/instruction.js')

Component({
  properties: {
    searchId: {
      type: String,
      value: null,
    },
    currentLocId: {
      type: Number,
      value: null
    }
  },
  data: {
    itemData: [],
    triggered: false,
    currentPage: 1,
    hasMore: true,
    totalCount: 0
  },
  observers: {
    'currentLocId': function(locId) {
      console.log('observer')
      console.log(locId)
      // console.log(this.data.currentLocId)
      this.fetchList()
    }
  },
  lifetimes: {
    attached: function() {
      console.log('attached')
      this.fetchList()
    },
    detached: function() {
    },
  },
  methods: {
    onDelete(e) {
      var dataset = e.currentTarget.dataset;  
      Instruction.deleteInstruction(
        dataset['id'],
        (res) => {
          this.onRefresh()
        }
      )
    },
    onPulling() {
      console.log('on pulling')
    },
    onRefresh() {
      this.setData(
        {
          itemData: [],
          hasMore: true,
          currentPage: 1,
          totalCount: 0,
        }
      )
      console.log('on refresh')
      this.fetchList()
    },
    onRestore() {
      console.log('on restore')
    },
    onAbort() {
      console.log('on abort')
    },
    onLoadMore() {
      console.log('on load more..')
      this.fetchList()
    },
    fetchList() {
      if(this.data.searchId == null) {
        console.log('in fetch list')
        console.log(this.data.currentLocId != null)
        if(this.data.currentLocId != 0) {
          this.fetchItemList()
        }
      } else {
        this.findItemList(this.data.searchId)
      }
    },
    fetchItemList() {
      Instruction.listInstruction(
        this.data.currentPage,
        8,
        this.data.currentLocId,
        (res) => {
          this.setData({
            itemData: this.data.itemData.concat(res.data.results),
            hasMore: res.data.next != null,
            currentPage: this.data.currentPage + 1,
            triggered: false,
            totalCount: res.data.count
          })
        }
      )
    },
    findItemList(instructionId) {
      Instruction.searchInstruction(
        this.data.currentPage,
        8,
        instructionId,
        (res) => {
          this.setData({
            itemData: this.data.itemData.concat(res.data.results),
            hasMore: res.data.next != null,
            currentPage: this.data.currentPage + 1,
            triggered: false,
            totalCount: this.data.count
          })
        }
      )
    }
  },
})
