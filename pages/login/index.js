// pages/login/index.js
Page({
  async handleGetUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    await wx.getUserProfile({
      desc: '用于该买物品', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const { userInfo } = res;
        // console.log(userInfo);
        wx.setStorageSync('userinfo', userInfo);
        wx.navigateBack({
          delta: 1,
        });
        // this.setData({
        //   userInfo: res.userInfo,
        //   hasUserInfo: true,
        // });
      },
    });
  },
});
