export const request = (params) => {
  // 定义公共的url  https://api-hmugo-web.itheima.net/api/public/v1/categories
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
