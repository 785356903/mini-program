// pages/feedback/index.js
/**
 * 1.点击 + 号 出发tap事件
 *  1 调用小程序内置的 选择图片的 api
 *  2 获取到图片路径数组
 *  3 把图片路径 存到data变量中
 *  4 页面就可以根据 图片数组进行循环显示 自定义组件
 * 2.点击 自定义图片 组件
 *  1 获取被点击元素的索引
 *  2 获取图片数组
 *  3 根据索引 删除图片数组中的图片
 *  4 把图片数组重新设置回data中
 * 3.点击 '提交'
 *  1 获取文本域内容 类似输入框
 *   1 data中定义变量 表示输入框内容
 *   2 文本域绑定输入事件  事件触发 把输入框的值 存入变量
 *  2 对这些内容 进行合法验证
 *  3 验证通过将 用户选择的图片 上传到专门的服务器 返沪图片的外网链接
 *   1 便利图片数组
 *   2 挨个上传
 *   3 自己在维护图片数组 存放 图片后的外网链接
 *  4 将 文本域 和外网图片 提交到服务器  前端模拟（没有接口）
 *  5 清空页面
 *  6 返回上一页
 */
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            { id: 0, value: '体验问题', isActive: true },
            { id: 1, value: '商家、商家投诉', isActive: false },
        ],
        // 被选中的图片路径数组
        chooseImg: [],
        inputText: '',
    },
    // 外网的图片的路径数组
    UpLoadImgs: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},
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
    // 1.点击加号选择图片
    handleChooseImg() {
        // 2.调用小程序内置的选择图片的api
        wx.chooseImage({
            // 同时选中的图片数量
            count: 9,
            // 图片的格式 原图 压缩
            sizeType: ['original', 'compressed'],
            // 图片的来源 相册 照相机
            sourceType: ['album', 'camera'],
            success: (result) => {
                this.setData({
                    // 图片数组 拼接数组
                    chooseImg: [...this.data.chooseImg, ...result.tempFilePaths],
                });
                console.log(result);
            },
            fail: () => {},
            complete: () => {},
        });
    },
    // 点击 自定义图片组件
    handleRemoveImg(e) {
        console.log(e);
        // 2.获取被点击的组件的索引
        const { index } = e.currentTarget.dataset;
        // 3.获取data中的图片数组
        let { chooseImg } = this.data;
        chooseImg.splice(index, 1);
        this.setData({ chooseImg });
    },
    // 文本输入事件
    handleInputText(e) {
        this.setData({
            inputText: e.detail.value,
        });
    },
    //  提交点击事件
    handleSubmit() {
        // 1.获取文本与内容 图片数组
        const { inputText, chooseImg } = this.data;
        // 2.判断合法性
        if (!inputText.trim()) {
            // 不合法
            wx.showToast({
                title: '输入不合法',
                icon: 'none',
                mask: true,
            });
            return;
        }
        // 3.准备上传图片 到专门的图片服务器
        // 上传文件的api 不支持 多个文件上传 遍历数组 挨个上传
        // 显示正在等待的图标
        wx.showLoading({
            title: '正在加载上传中',
            mask: true,
        });
        // 判断有没有上传的图片数组
        if (chooseImg.length != 0) {
            chooseImg.forEach((v, i) => {
                let that = this;
                wx.uploadFile({
                    // 图片要上传到哪里
                    url: 'https://imgurl.org/',
                    // 被上传的图片路径
                    filePath: v,
                    // 上传的文件的名称 后台获取文件（后台约定） file
                    name: 'file',
                    // 顺带的文本信息
                    formData: {},
                    success: (result) => {
                        console.log(result);
                        let url = result.errMsg;
                        this.UpLoadImgs.push(url);
                        // 所有图片上传完毕才触发
                        if (i === chooseImg.length - 1) {
                            //
                            console.log('把文本内容和外网图片数组提交到服务器中');
                            wx.hideLoading();
                            // 提交都成功了 返回上一个页面
                            this.setData({
                                chooseImg: [],
                                inputText: '',
                            });
                            wx.navigateBack({
                                delta: 1,
                            });
                        }
                    },
                });
            });
        } else {
            console.log('只提交了文本');
            wx.hideLoading();
            // 提交都成功了 返回上一个页面
            this.setData({
                chooseImg: [],
                inputText: '',
            });
            wx.navigateBack({
                delta: 1,
            });
        }
    },
    // urlExtract(content) {
    //     let imgReg = /<img.*?(?:>|\/>)/gi; //匹配图片中的img标签
    //     let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的src
    //     let arr = content.match(imgReg); //筛选出所有的img
    //     console.log(arr);
    //     let srcArr = [];
    //     for (let i = 0; i < arr.length; i++) {
    //         let src = arr[i].match(srcReg);
    //         // 获取图片地址
    //         srcArr.push(src[1]);
    //     }
    //     console.log(srcArr);
    // },
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