//  Promise 形式的 getSetting
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    // 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {},
    });
  });
};
//  Promise 形式的 chooseAddress
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    // 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {},
    });
  });
};
//  Promise 形式的 openSetting
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    // 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {},
    });
  });
};

//  Promise 形式的 showModal
// @param {object} param0 参数
export const showModal = ({ content }) => {
  return new Promise((resolve, reject) => {
    // 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限
    wx.showModal({
      title: '提示',
      content: content,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 询问弹窗
export const showToast = ({ title }) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

//  Promise 形式的 login 获取用户登录
// export const login = ({}) => {
//   return new Promise((resolve, reject) => {
//     wx.login({
//       timeout: 10000,
//       success: (result) => {
//         resolve(result);
//       },
//       fail: (err) => {
//         reject(err);
//       },
//     });
//   });
// };

/**
 * promise 形式的 小程序的微信支付
 * @param {object} pay 支付所必要的参数
 */
export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
