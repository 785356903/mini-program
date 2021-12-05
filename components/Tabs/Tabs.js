// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    // 组件里面的方法要在methods里面
    handleItemTap(e) {
      // 1.获取点击的索引
      const { index } = e.currentTarget.dataset;
      // 2.触发父组件的事件 自定义
      this.triggerEvent('tabsItemChange', { index });
    },
  },
});

/*
  微信小程序 导航组件

1.创建组件 引入组件
2.接受父组件的数组，显示数组内容，书写样式
3.子组件定义方法 获取index 传递给父组件 this.triggerEvent('tabsItemChange', { index });
4. 父组件使用自定义事件，获取索引 使用forEach修改原数组的isActive 在赋值到data中传递回去
 
*/
