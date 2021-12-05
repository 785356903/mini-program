import { request } from '../../request/index.js';
import { getSetting, showToast, showModal, chooseAddress, openSetting } from '../../utils/asyncWx';
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/cart/index.js
/*
  1.获取用户的收获地址
    1 绑定点击事件
    2 调用小程序内置api 获取用户的收货地址 wx.chooseAddress
  2.获取用户对小程序所授予获取地址的权限状态
    1 假设用户 点击获取收货地址的提示框 确定 authSetting scope.address
    scope 值 true  直接调用 获取收货地址
    2 假设用户 从来没有调用过 收货地址的api 
    scope 值  undefined   直接调用 获取收货地址
    3 假设 用户点击获取收货地址的提示框 取消  wx.openSetting
    scope 值 false 
      1 诱导用户 自己打开授权 设置页面 当用户重新给予 获取地址权限
      2 获取收货地址
    4 把获取到的收货地址 存入到本地存储中
  3.页面加载完毕
    0 onLoad onShow
    1 获取本地存储中的地址数据
    2 把数据设置给data中的一个变量
  4.onShow
    0 回到商品详情页面 第一次添加商品的时候 手动添加了属性
    1.num
    2.checked
    1 获取缓存中的购车数组
    2 把购物策车数据 填充到 data
  5.全选的实现 数据的展示
    1 onShow 获取缓存中的购物车数组
    2 根据购物车中的商品数据 所有的商品都被选中checked=true 全选选中
  6.总价格和总数量
    1 都需要商品被选中 我们才拿他计算
    2 获取购物车数组
    3 遍历
    4 判断商品是否被选中
    5 总价格 = 商品单价 * 商品数量
    6 总数量 += 商品数量
    7 把计算后的价格和数量设置回data中即可
  7.商品的选中
    1 绑定点击事件
    2 获取到被修改的商品对象
    3 商品对象的选中状态 取反
    4 重新填充回data和缓存中
    5重新性能计算全选 总价格 总数量
  8.全选和反选功能
    1 全选复选框绑定时间 change
    2 获取data中的全选变量 allChecked
    3 直接取反 allChecked = ！allChecked
    4 遍历购物车数组 让里面的商品选中状态跟随allChecked改变
    5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置会缓存中
  9.商品数量的编辑
     1 + - 绑定同一个点击事件 去扽的关键在一个自定义属性上
      1 + +1
      2 - -1
    2 传递被点击的商品的id goods_id
    3 回去到data中的购物车数组 来获取需要被修改的商品对象
      4 当购物车数量等于1 同时用户电机的是减号
        弹窗提示（showModal） 询问用户是否要删除
        1 确定 直接删除
        2 取消 什么都不做 
    4 直接修改商品的数量属性num
    5 把购物车数组重新性能设置回缓存中和data中
  10.点击结算
    1 判断有没有收货地址信息
    2 用户有没有选购商品
    3 经过以上验证跳转支付页面
*/
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    // 1.获取缓存中的收获地址信息
    const address = wx.getStorageSync('address');
    // 1 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || [];
    this.setData({ address });
    this.setCart(cart);
  },

  // 点击 收货地址
  async handleChosseAddress() {
    // // 1.获取 权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     // 2.获取权限状态 主要发现一些 属性名那个很怪异的时候 都要用[]形式来获取属性值
    //     console.log(result);
    //     const scopeAddress = result.authSetting['scope.address'];
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1);
    //         },
    //       });
    //     } else {
    //       // 3.用户 以前拒绝过授予权限 现有到用户打开授权界面
    //       wx.openSetting({
    //         success: (result2) => {
    //           // 4.可以调用收货地址代码
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3);
    //             },
    //           });
    //         },
    //       });
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {},
    // });

    try {
      // 1.获取权限状态的
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting['scope.address'];
      // 2.判断权限状态
      if (scopeAddress === false) {
        await openSetting();
        // 3.用户 以前拒绝过授予权限 现有到用户打开授权界
      } else {
        // 4.可以调用收货地址代码
      }
      const address = await chooseAddress();
      address.all =
        address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 5.存入缓存中
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 1.拿到被修改的商品对象的id
    const goods_id = e.currentTarget.dataset.id;
    console.log(goods_id);
    // 2.获取购物策划数组
    let { cart } = this.data;
    // 3.找到被修改的商品对象
    let index = cart.findIndex((v) => v.goods_id === goods_id);
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5 6.把数据重新设置回data和缓存中
    this.setCart(cart);
  },
  // 设置购物车状态 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    // this.setData({
    //   cart,
    // });
    // 1.计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么每一个回调函数都返回true 那么erry 的返回值就是true
    //  只要有一个回调函数返回了false 那么不在循环执行，直接返回false
    //  空数组 调用every，返回值就是true
    // const allChecked = cart.length ? cart.every((v) => v.checked) : false;
    let allChecked = true;
    // 1.总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断一下数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;

    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
    });
    wx.setStorageSync('cart', cart);
  },
  // 商品的全选功能
  handleItemAllChange() {
    // 1获取data中的数据
    let { cart, allChecked } = this.data;
    // 2修改值
    allChecked = !allChecked;
    // 3循环修改cart数组 中的商品选中状态
    cart.forEach((v) => (v.checked = allChecked));
    // 4.把修改后的值 填充回data或缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 1.获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    console.log(operation, id);
    // 2.获取购物车数组
    let { cart } = this.data;
    // 3.找到需要修改的商品的索引
    const index = cart.findIndex((v) => v.goods_id === id);
    // 4.判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      // wx.showModal({
      //   title: '提示',
      //   content: '您确定要删除么！',
      //   success: (res) => {
      //     if (res.confirm) {
      //       cart.splice(index, 1);
      //       this.setCart(cart);
      //     } else if (res.cancel) {
      //     }
      //   },
      // });
      const res = await showModal({ content: '您确定要删除么！' });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4.进行修改数量
      cart[index].num += operation;
      // 5.设置回缓存中
      this.setCart(cart);
    }
  },
  // 点击结算
  async handlePay() {
    // 1.判断收获地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: '您还没有填写地址' });
      return;
    }
    // 2.判断用户有没有选择商品
    if (totalNum === 0) {
      await showToast({ title: '您还没有选购商品' });
      return;
    }
    // 跳转支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  },
});
