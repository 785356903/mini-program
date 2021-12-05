// pages/order/index.js
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
/*
  1.页面打开的时候 onShow
    0 onShow 不同于 onLoad 无法在形参上接收option
    0.5 判断缓存中又没有token
      1 没有直接跳转授权页面
      2 有 直接往下执行
    1 获取url上的参数type
    2 根据type来决定页面标题的数组元素 哪个选中被激活
    2 根据type 发送请求获取订单数据
    3 渲染页面
  2.点击不同标题 重新发送请求渲染页面
*/
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0, value: '全部', isActive: true },
      { id: 1, value: '待付款', isActive: false },
      { id: 2, value: '代发货', isActive: false },
      { id: 3, value: '退款/退货', isActive: false },
    ],
    orders: [
      {
        order_number: 'HMDD20190802000000000428',
        order_price: 13999,
        create_time: 1564731518,
        user_id: 1,
      },
      {
        order_number: 'HMDD20190802000000000428',
        order_price: 13999,
        create_time: 1564731518,
        user_id: 2,
      },
      {
        order_number: 'HMDD20190802000000000428',
        order_price: 13999,
        create_time: 1564731518,
        user_id: 3,
      },
      {
        order_number: 'HMDD20190802000000000428',
        order_price: 13999,
        create_time: 1564731518,
        user_id: 4,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 2.修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => (i === index ? (v.isActive = true) : (v.isActive = false)));
    // 3.赋值到data中
    this.setData({
      tabs,
    });
  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 2.重新发送请求 type=1 的时候 index=0
    this.getOrders(index + 1);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (option) {
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../../pages/auth/index',
      });
      return;
    }

    // 1.获取当前小程序的页面栈--数组 长度最大是10
    // 2.数组中索引最大的就是当前页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    // 3.获取url上的type参数
    const { type } = currentPage.options;
    console.log(currentPage);
    // 4.激活选中页面标题
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },

  // 获取订单列表
  async getOrders(type) {
    const res = await request({ url: '/my/orders/all', data: { type } });
    // console.log(res);
    console.log(new Date().toLocaleString());
    this.setData({
      // toLocaleString 解析事件戳
      orders: res.orders.map((v) => ({
        ...v,
        create_time_cn: new Date(v.create_time * 1000).toLocaleString(),
      })),
    });

    // res.orders.map(function () {
    //   ({ ...v });
    // });
  },
});
