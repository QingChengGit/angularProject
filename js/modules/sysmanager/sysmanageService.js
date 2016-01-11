/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('sysmanageService', ['postIntercept', '$q', function ($http, $q){
    var hotelTypeMap = {
            GONG_YU: '公寓',
            JING_JI_XING: '经济型',
            QING_NIAN_LV_SHE: '青年旅舍',
            HAO_HUA_XING: '豪华型',
            SHU_SHI_XING: '舒适型',
            ZHONG_GAO_DUAN: '中高端'
        };
    function Dict(data){
        this.id = data.id || '';
        this.parentId = typeof data.parentId != 'undefined' ? data.parentId : '';
        //唯一名
        this.name = data.name || '';
        this.nameCn = data.nameCn || '';
        this.nameEn = data.nameEn || '';
        this.orderNum = data.orderNum || '';
        this.remark = data.remark || '';
        //发布值
        this.value = data.value || '';
        //发布值对应的中文
        this.valueCn = '';
        //拓展信息
        this.extInfo = data.extInfo || '';
    }
    function Install(data){
        this.id = data.id || '';
        this.hotelId = data.hotelId;
        //酒店品牌
        this.hotelName = data.hotelName || '';
        //酒店品牌对应的中文名称
        this.nameCn = '';
        //店名
        this.subName = data.subName || '';
        this.hotelType = hotelTypeMap[data.type] || '';
        this.address = data.address || '';
        this.curVersion = data.curVersion || '';
        this.lastVersion = data.lastVersion || '';
        this.pkgType = data.pkgType || '';
        this.online = data.online ? "是" : "否";
        this.link = data.link || '';
        /*this.upgradeLink = 'api/pushToLs?id=' + this.hotelId + '&sendMsg=forceUpdate' + this.pkgType + this.link;*/
    }

    this.fetchDicts = function (paramObj) {
        var url = 'api/dataDict/listByParentId',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var dicts = $.map(res.data.list, function (dict) {
                    return new Dict(dict);
                });
                res.data.list = dicts;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.fetchInstalls = function (paramObj) {
        //获取酒店安装管理列表
        var url = 'api/hotelToolPacks/pageList',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var installs = $.map(res.data.list, function (install) {
                    return new Install(install);
                });
                res.data.list = installs;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.saveDict = function (dict) {
        var url = 'api/dataDict/save';
        return $http.post(url, dict).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateDict = function (dict) {
        var url = 'api/dataDict/update';
        return $http.post(url, dict).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.deleteDict = function (dict) {
        var url = 'api/dataDict/delete',
            data = {
                id:dict.id
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
    this.upgrade = function (link) {
        return $http.post(link).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.setDict = function (data) {
        return new Dict(data);
    };
    this.resetDict = function () {
        return new Dict({});
    };
}]);