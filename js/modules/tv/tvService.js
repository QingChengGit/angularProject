/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('tvService', ['postIntercept', '$q', function ($http, $q){
    var menuTypeMap = {
        NORMAL: '普通',
        TV: '电视节目',
        VODEO: 'VOD点播'
    },
    serviceTypeMap = {
        AMIBITUSCOLLECT: '周边汇',
        BILL: '账单查询',
        CHECK_OUT: '退房',
        SHOP: '购物',
        WORD_CLOCK: '世界时间',
        FLOWER: '鲜花服务',
        CAR: '租车服务',
        REQUEST: '客人建议',
        FLIGHT: '航班信息',
        PFHOTO: '照片显示',
        INFO: '图文展示',
        ANDROID: '安卓系统',
        TV: '电视节目',
        SHOPCAR: '购物车',
        FILM: '高清影院',
        PE: '体育竞技',
        TELEPLAY: '电视剧',
        WECHAT: '微信互动',
        VALET: '洗衣服务',
        ORDERING: '订餐服务',
        VARIETY: '综艺节目',
        DOCUMENTARY: '纪录片',
        RESOURCE: '资源搜索',
        NEWS: '新闻资讯',
        EDUATION: '教育频道',
        HOME: '收藏之家',
        PLAY: '播放记录',
        APP: '应用下载',
        GOOUT: '出去逛逛',
        GOTRAIN: '送火车站',
        GOAIRPORT: '送机场'
    };
    function TVConf(data){
        //电视配置对象
        this.id = data.id || '';
        //电视型号
        this.tvModel = data.tvModel || '';
        //信号源
        this.signalSource = data.signalSource || '';
        this.helpImg = {path: data.helpImg || ''};
        this.homeImg = {path: data.homeImg || ''};
        this.logoImg = {path: data.logoImg || ''};
        //中文口号图片
        this.solganCn = {path: data.solganCn || ''};
        //英文口号图片
        this.solgan = {path: data.solgan || ''};
        this.welcomeImg = {path: data.welcomeImg || ''};
    }
    function Channel(data){
        this.id = data.id;
        this.parentId = data.parentId;
        this.nameCn = data.nameCn || '';
        this.nameEn = data.nameEn || '';
        this.orderNum = data.orderNum;
        //所属类型
        this.menuType = data.menuType || '';
        this.menuTypeCn = menuTypeMap[this.menuType];
        //背景图片
        this.backImg = {path: data.backImg || ''};
        this.menuImg = {path: data.menuImg || ''};
        //服务类型
        this.serviceType = data.serviceType || '';
        this.serviceTypeCn = serviceTypeMap[this.serviceType];
        //二级频道中的中文tx,英文txt
        this.contentCn = {path: data.contentCn || ''};
        this.contentEn = {path: data.contentEn || ''};
        //二级频道的图片
        this.img = {path: data.img || ''};
        //二维码图片
        this.qrCodeImg = {path: data.qrCodeImg || ''};
        //广告图
        this.adImg = {path: data.adImg || ''};
    }
    this.fetchTvConf = function () {
        var url = 'api/roomTv/queryCurrentRoomTv';
        return $http.post(url).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(new TVConf(res.data));
            }else{
                return $q.reject(null);
            }
        });
    };
    this.saveTvConf = function (tvConf) {
        var url = 'api/roomTv/modify',
            prevConf = $.extend({}, tvConf);
        prevConf.helpImg = prevConf.helpImg.path;
        prevConf.homeImg = prevConf.homeImg.path;
        prevConf.logoImg = prevConf.logoImg.path;
        prevConf.solganCn = prevConf.solganCn.path;
        prevConf.solgan = prevConf.solgan.path;
        prevConf.welcomeImg = prevConf.welcomeImg.path;
        return $http.post(url, prevConf).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.fetchTvChannels = function (paramObj) {
        var url = 'api/menuChannel/loadPagesMenuChannel',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var channels = $.map(res.data.list, function (channel) {
                    return new Channel(channel);
                });
                res.data.list = channels;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.saveChannel = function (channel) {
        var url = 'api/menuChannel/save',
            prev = $.extend({}, channel);
        prev.backImg = prev.backImg.path;
        prev.menuImg = prev.menuImg.path;
        prev.contentCn = prev.contentCn.path;
        prev.contentEn = prev.contentEn.path;
        prev.img = prev.img.path;
        prev.qrCodeImg = prev.qrCodeImg.path;
        prev.adImg = prev.adImg.path;

        return $http.post(url, prev).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(new Channel(res.data));
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.updateChannel = function (channel) {
        var url = 'api/menuChannel/update',
            prev = $.extend({}, channel);
        prev.backImg = prev.backImg.path;
        prev.menuImg = prev.menuImg.path;
        prev.contentCn = prev.contentCn.path;
        prev.contentEn = prev.contentEn.path;
        prev.img = prev.img.path;
        prev.qrCodeImg = prev.qrCodeImg.path;
        prev.adImg = prev.adImg.path;

        return $http.post(url, prev).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.deleteChannel = function (channelId) {
        var url = 'api/menuChannel/delete',
            data = {
                id:channelId
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.setChannel = function (data) {
        return new Channel(data);
    };
    this.resetChannel = function () {
        return new Channel({});
    };
}]);