import { request } from '../../request/index.js';
import {
  getSetting,
  showToast,
  showModal,
  chooseAddress,
  openSetting,
  requestPayment,
} from '../../utils/asyncWx';
import regeneratorRuntime from '../../lib/runtime/runtime';

var WxParse = require('../../utils/wxParse/wxParse');
/*
  1.页面加载的时候
    1 从缓存中获取购物车护具 渲染到缓存页面
      这些数据 checked=true
  2.微信支付
    1 哪些人 哪些账号 可以实现微信支付
      1 企业账号
      2 企业账号的小程序后台中 必须给开发者添加上白名单
        1一个 appid可以绑定多个开发者
  3.支付按钮
    1 先判断缓存有没有token
    2 没有 跳转授权页面 惊醒获取token
    3 有token。。。 继续执行
    4 创建订单 获取订单编号
    5.已经完成微信支付
    6.手动删除缓存中已经被选中的商品
    7.重新把删除后的购物车数据填充到缓存中
    8.在跳转页面
*/
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    payUrl: '',
    iconUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    // 1.获取缓存中的收获地址信息
    const address = wx.getStorageSync('address');
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter((v) => v.checked);
    this.setData({ address });
    // 1.总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
    });
  },
  // 支付点击事件
  async handleOrderPay() {
    try {
      // 1.判断缓存中有没有token
      const token = wx.getStorageSync('token');
      // 2.判断
      if (!token && this.data.totalNum == 0) {
        wx.navigateTo({
          url: '../../pages/auth/index',
        });
        return;
      }
      // if (this.data.totalNum == 0) return;
      //3. 创建订单
      // 3.1 准备请求头参数
      // const header = { Authorization: token };
      // 3.2 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach((v) => {
        goods.push({
          goods_id: v.goods_id,
          consignee_addr: v.consignee_addr,
          goods_priceL: v.goods_price,
        });
      });
      const orderParams = { order_price, consignee_addr, goods };
      // 4.准备发送请求 创建订单 获取订单编号
      let order_number = await request({
        url: '/my/orders/create',
        method: 'POST',
        data: orderParams,
      });
      // 定义一个接受带订单
      let resOrder = {};
      if (!order_number) {
        resOrder.order_number = 'HMDD20190809000000001059';
      }
      // 5.发起预支付请求
      const pay = await request({
        url: '/my/orders/req_unifiedorder',
        data: { order_number: resOrder.order_number },
        method: 'POST',
      });
      // 接受pay的变量
      let payment = {};
      if (!pay) {
        payment = {
          timeStamp: '1565346079',
          nonceStr: 'U6tYjNdYvm3ReKgI',
          package: 'prepay_id=wx09182118356902a15c8b8d071931343000',
          signType: 'MD5',
          paySign: 'C514E29387794F8400C983AFFF4707F',
        };
      }
      // console.log(payment);
      // 6.发起微信支付
      // const res = await requestPayment(payment);
      this.wxPay(payment);
      // 7.查询后台 订单状态
      const res = await request({
        url: '/my/orders/chkOrder',
        data: { order_number: resOrder.order_number },
        method: 'POST',
      });
    } catch (error) {}
  },

  /*
    微信支付流程
    1.创建订单 order_number订单编号
    2.准备预支付 获取支付参数pay
    3.发起微信支付 提交pay参数
    4.查询订单
  */

  // 伪微信支付
  wxPay(pay) {
    wx.requestPayment({
      ...pay,
      success: (result) => {},
      // fail: (err)=>{},
      // complete: ()=>{}
    });
    this.setData({
      payUrl:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Ff26f5ed0d000c3413c9a4250f2c22bcb86a9494e2b2a-Gw0bYT_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641006201&t=3250ffb276ff3a0650191198336d7b35',
    });
  },
  // 点击支付成功
  async handlePaySuccess() {
    await this.setData({
      iconUrl: 'https://i.loli.net/2021/12/02/fIGoqFWBEOg4uaU.png',
    });
    await this.setData({
      payUrl: '',
      iconUrl: '',
    });
    await showToast({ title: '支付成功' });
    // 8.删除缓存中已经支付了的商品
    let newCart = wx.getStorageSync('cart');
    // 留下未被选中的
    newCart = newCart.filter((v) => !v.checked);
    wx.setStorageSync('cart', newCart);
    // 8.支付成功后跳转到订单页面
    setTimeout(() => {
      wx.navigateTo({
        url: '../../pages/order/index',
      });
    }, 2000);
  },
  setTime() {},
  // 点击退出支付
  async handleExit() {
    this.setData({
      payUrl: '',
      iconUrl: '',
    });
    await showToast({ title: '支付失败' });
  },
});
