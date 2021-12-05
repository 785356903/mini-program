/**
 *  1.输入框绑定 值改变事件 input事件
 *    1 获取输入框的值
 *    2 合法性的判断
 *    3检验通过把输入框的值发送到后台
 *  2.防抖（防止抖动） 定时器
 *    0 防抖一般  输入框中 防止重复输入  重复发送请求
 *    1 节流 一般是用在页面下拉和上拉
 *    1 定义全局的定时器id
 */
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        // 取消按钮 是否显示
        isFocus: false,
        inputValue: '', // 输入的值
    },
    TimeId: -1,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    // 输入框的值改变
    handleInput(e) {
        console.log(e);
        // 1.获取输入框的值
        const { value } = e.detail;
        // 2.检查合法性
        if (!value.trim()) {
            this.setData({
                goods: [],
                isFocus: false,
            });
            // 值不合法
            return;
        }
        // 3.准备发送请求数据
        this.setData({ isFocus: true });
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.qsearch(value);
        }, 1000);
    },
    // 发送请求获取搜索建议数据
    async qsearch(query) {
        const res = await request({ url: '/goods/search', data: { query } });
        console.log(res);
        this.setData({
            goods: res,
        });
    },
    // 点击取消
    handleCancel() {
        this.setData({
            goods: [],
            isFocus: false,
            inputValue: '',
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},
});