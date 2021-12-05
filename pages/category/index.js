// 0 引入 用来发送请求的 方法 一定要把路径补全
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 左侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentInsex: 0,
    // 右侧内容的滚动条
    scrollTop: 0,
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 0.web中的本地存储和小程序中的本地存储的区别
    // 1.写代码的方式不一样
    // web:localStorage.setItem("key","value") localStorage.getItem("key")
    // 小程序中： wx.setStorageSync("key", "value"); wx.setStorageSync("key");
    // 2.村的时候有没有做类型转换
    // web：不论存入的是什么类型的数据，最终都会调用 toString()方法，把数据变成字符串在存进去
    // 小程序：不存在类型转换 这个操作，村神恶魔类型的数据进去获取的就是什么类型
    // 1.判断本地存储中有没有旧的数据
    // {time: Date.now(),data:[...]}
    // 2.没有旧数据 就发送新请求
    // 3.如果有数据 同时旧的数据也没有国企 那么就使用旧的数据

    // 1.获取本地存储中的数据（小程序也存在本地存储技术）
    const Cates = wx.getStorageSync('cates');
    // 2.判断
    if (!Cates) {
      // 不存在 发送请求
      this.getCates();
    } else {
      // 存在 并且没有过期就读取本地 定义国企事时间 10s 改5分
      if (Date.now() - Cates.time > 1000 * 10) {
        // 时间过期重新获取
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map((v) => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent,
        });
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: '/categories',
    // }).then((res) => {
    //   this.Cates = res.data.message;
    //   // 把接口的数据存入本地
    //   wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    //   // 构造左侧的发菜单数据
    //   let leftMenuList = this.Cates.map((v) => v.cat_name);
    //   //  构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent,
    //   });
    // });

    // 1.使用es7的async await来发送请求
    const res = await request({ url: '/categories' });
    this.Cates = res;
    // 把接口的数据存入本地
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    // 构造左侧的发菜单数据
    let leftMenuList = this.Cates.map((v) => v.cat_name);
    //  构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent,
    });
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 1.获取被点击的标题身上的索引
    // 2.给data中的currentIndex赋值就可以了
    // 3.根据不同的做因渲染不同的内容
    const { index } = e.currentTarget.dataset;

    //  构造右侧的商品数据
    let rightContent = this.Cates[index].children;

    this.setData({
      currentInsex: index,
      rightContent,
      // 重新设置 右侧内容的  scroll-view标签距离顶部的距离
      scrollTop: 0,
    });
  },
});
