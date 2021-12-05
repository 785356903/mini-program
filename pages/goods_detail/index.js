import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
/*
  1.发送请求数据
  2.点击轮播图 预览大图片
    1.给轮播图帮点点击事件
    2.调用了小程序的api （previewImage）
  3.点击加入购物车
    1.先绑定点击事件
    2.获取缓存中的购物车数据 数组格式
    3.先判断当前的商品已经存在购物车
    4.已经存在修改商品数据 执行购物查数量++ 重新把购物策划数组 填充到缓存中
    5.不存在购物车数组中 直接给购物车添加一个新元素 新元素自己带上一个 购买数量属性 num 重新把购物策划数组 填充到缓存中
    6.弹出提示
  4.商品收藏
    1 页面是onShow的时候 加载缓存中的商品收藏的数据
    2 判断当前商品是不是被收藏的
      1 是改变图标
      2 不是 什么都不做
    3.点击收藏按钮
      1 判断该商品是否存在于缓存数组中
      2 已经存在把该商品删除掉
      3 没有存在 把商品添加到收藏数组中 存入缓存中即可
*/
// pages/goods_detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodObj: {},
    isCollect: false,
  },
  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    var pages = getCurrentPages();
    let currentPages = pages[pages.length - 1];
    let options = currentPages.options;
    const { goods_id } = options;
    this.getGoodsDitail(goods_id);
  },

  // 获取商品详情列表
  async getGoodsDitail(goods_id) {
    const goodObj = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsInfo = goodObj;
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 2.判断当前商品是否被收藏
    let isCollect = collect.some((v) => v.goods_id === this.GoodsInfo.goods_id);
    // console.log(collect);
    this.setData({
      goodObj: {
        goods_name: goodObj.goods_name,
        goods_price: goodObj.goods_price,
        // iphone部分手机不识别webp图片格式
        // 临时自己修改 确保后台存在1.webp =>1.jpg
        goods_introduce: goodObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodObj.pics,
      },
      isCollect,
    });
  },

  // 点击轮播图 预览大图
  previewImage(e) {
    // 1.先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map((v) => v.pics_mid);
    // 2.接受传递过来的图片的url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls, // 需要预览的图片http链接列表
    });
  },

  // 加入购物车点击事件
  handleCartAdd() {
    // 1.获取缓存中的购物车数据 数组格式
    let cart = wx.getStorageSync('cart') || [];
    // 2.先判断当前的商品已经存在购物车
    let index = cart.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 3.不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 4.已经存在购物车数据 执行num++
      cart[index].num++;
    }
    // 5.把购物车重新添加到缓存中
    wx.setStorageSync('cart', cart);
    // 6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户手抖
      mask: true,
    });
  },
  // 点击 商品收藏图标
  handleCollect() {
    let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 2.判断商品是否被收藏过
    let index = collect.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id);
    // 3.当index =-1 代表已经收藏过
    if (index !== -1) {
      // 能找到 已经收藏过 在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 4.把这个数组存入缓存中
    wx.setStorageSync('collect', collect);
    // 5.修改data中的属性 isCollect
    this.setData({ isCollect });
  },
});
