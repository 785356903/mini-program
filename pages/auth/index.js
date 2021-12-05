// pages/auth/index.js
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from '../../utils/asyncWx.js';
// 支付权限问题  需要企业级账号 没有权限获取不到token
Page({
  handleGetUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {},
    });
  },
  // 获取用户信息
  async handleGetUserInfo(e) {
    // 1.获取用户信息
    const { encryptedData, rawData, iv, signature } = e.detail;
    let code = '';
    // 2.获取小程序登录成功后的code
    wx.login({
      timeout: 10000,
      success: (result) => {
        code = result.code;
        console.log(code);
      },
    });
    const loginParams = { encryptedData, rawData, iv, signature, code };
    // 3.发送请求获取用户的token值
    const res = await request({ url: '/users/wxlogin', data: loginParams, method: 'POST' });
    // 4.把token存入缓存中 同时跳转回上一个页面
    const token = res
      ? res.token
      : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo';
    wx.setStorageSync('token', token);
    wx.navigateBack({
      delta: 1, // 返回上一层
    });
  },
});
