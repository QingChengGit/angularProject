/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('monitorService', ['postIntercept', '$q', function ($http, $q){
    function Monitor(data){
        this.id = data.id || '';
        //酒店品牌
        this.name = data.name || '';
        //酒店品牌对应的中文
        this.nameCn = '';
        //酒店名称
        this.subName = data.subName || '';
        this.phone = data.phone || '';
        this.tvLockTime = data.tvLockTime || '';
        this.tvLockPercent = data.tvLockPercent || '';
    }
    function RCU(data){
        this.id = data.id;
        this.hotelId = data.hotelId || '';
        this.roomNum = data.roomNum || '';
        this.limitedTime = data.limitedTime || '';
        this.runningTime = data.runningTime || '';
        this.runningTimeNum = data.runningTimeNum || '';
        this.expireTime = data.expireTime || '';
    }
    function TVVersion(data){
        this.id = data.id || '';
        this.hotelId = data.hotelId || '';
        this.roomNum = data.roomNum || '';
        this.curVersion = data.curVersion || '';
        this.lastPowerOnTime = data.lastPowerOnTime || '';
    }
    this.fetchMonitorList = function (paramObj) {
        var url = 'api/hotel/loadPagesHotelMonitor',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var monitors = $.map(res.data.list, function (monitor) {
                    return new Monitor(monitor);
                });
                res.data.list = monitors;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.fetchRCUList = function (paramObj) {
        var url = 'api/monitor/roomRcuPageList',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var rcus = $.map(res.data.list, function (rcu) {
                    return new RCU(rcu);
                });
                res.data.list = rcus;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.fetchTVVersionList = function (paramObj) {
        var url = 'api/monitor/roomTvPageList',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var tvVersions = $.map(res.data.list, function (tvVersion) {
                    return new TVVersion(tvVersion);
                });
                res.data.list = tvVersions;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateMonitor = function (monitor) {
        var url = 'api/hotel/update';
        return $http.post(url, monitor).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateRCU = function (rcu) {
        var url = 'api/monitor/updateRoomRcu';
        return $http.post(url, rcu).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(null);
            }
        });
    };
}]);