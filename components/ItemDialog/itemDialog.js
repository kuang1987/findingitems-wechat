var Instruction = require('../../helper/instruction.js')

Component({
  properties: {
    item: {
      type: Object,
    },
    show: {
      type: Boolean,
    }
  },
  data: {
    btns: [
      {
        text: "重新输入",
      },
      {
        text: "确定"
      }
    ],
  },
  lifetimes: {
  },
  methods: {
    onBtnTap(e) {
      // if(e.detail.index==1){
      //   this.setData({
      //     show: false
      //   })
      // }
      if(e.detail.index==0){
        Instruction.deleteInstruction(this.data.item.id)
      }
      this.setData({
        show: false
      })
    }
  },
})
