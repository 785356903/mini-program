// pages/goods_list/index.js
// 用户上滑页面 滚动条触底 开始加载下一页数据
//  1.找到滚动条触底事件 微信小程序开发文档中
//  2.判断还有没有下一页数据
//   1.获取总页数 （总页数 = Math.ceil(总条数 /页容量)）= Math.ceil(23 /10)
//   2.获取到当前页码
//   3.只要判断当前的页码是否大于等于总页数（表示没有）
//  3.假如没有下一页数据 就弹数一个提示框
//  4.加入还有下一个就加载下一页数据
//    1.当前页码++
//    2.重新发送请求
//    3.数据请求回来 要对data中的数组进行拼接 额不是全部替换！！！

/*
  2.下拉刷新页面
    1.触发下拉刷新事件 需要在页面的json文件开启配置
      1.找到页面触发下拉刷新事件
    2.重置数组
    3.重置页码为1
    4.重新请求
    5.数据请求回来手动关闭下拉
*/
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            { id: 0, value: '综合', isActive: true },
            { id: 1, value: '销量', isActive: false },
            { id: 2, value: '价格', isActive: false },
        ],
        goodsList: [],
    },
    // 接口要的参数
    QueryParams: {
        query: '',
        cid: '',
        pagenum: 1,
        pagesize: 10,
    },
    // 总页数
    totalPages: 1,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.QueryParams.cid = options.cid || '';
        this.QueryParams.query = options.query || '';
        this.getGoodsList();
    },
    // 获取商品列表数据
    async getGoodsList() {
        const res = await request({ url: '/goods/search', data: this.QueryParams });
        console.log(res);
        // 获取 总页数
        const total = res.total;
        // 计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
        // console.log(this.totalPages);
        // 拼接数组
        this.setData({
            goodsList: [...this.data.goodsList, ...res.goods],
        });

        // 关闭下拉框 如果没有调用下拉窗口 直接关闭也不会有问题
        wx.stopPullDownRefresh();
    },

    // 标题点击事件 从子组件传递过来
    handleTabsItemChange(e) {
        // 1.获取被点击的标题索引
        const { index } = e.detail;
        // 2.修改原数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => (i === index ? (v.isActive = true) : (v.isActive = false)));
        // 3.赋值到data中
        this.setData({
            tabs,
        });
    },

    // 页面上滑  滚动条触底事件
    onReachBottom() {
        // console.log('页面');
        // 1.判断还有没有下一页数据
        if (this.QueryParams.pagenum >= this.totalPages) {
            // 没有下一页数据了
            wx.showToast({ title: '没有下一页数据了' });
        } else {
            // 还有下一页
            // console.log('有下一页');
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }
    },

    // 页面下拉刷新事件
    onPullDownRefresh() {
        // 1.重置数组
        this.setData({
            goodsList: [],
        });

        // 2.充值页码
        this.QueryParams.pagenum = 1;
        // 3.重新发送请求
        this.getGoodsList();
    },
});