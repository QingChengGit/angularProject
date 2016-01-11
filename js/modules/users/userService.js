/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('userService', ['postIntercept', '$q', function ($http, $q){
    function User(data){
        //用户对象
        this.id = data.id || '';
        this.sysId = data.sysId || '';
        this.orgId = data.orgId || '';
        this.realName = data.realName || '';
        this.userName = data.userName || '';
        this.userType = data.userType || '';
        this.userTypeCn = '';
        this.password = data.password || '';
        this.serverId = data.serverId || '';

        this.tvLockTime = data.tvLockTime || '';
        this.tvLockPercent = data.tvLockPercent || '';
        this.modifyTime = data.modifyTime || '';

        //下面是跟酒店有关信息
        //酒店品牌
        this.name = data.name || '';
        this.province = data.province || '';
        //this.hotelPinPai = data.hotelPinPai || '';
        //通用分组id
        this.groupId = data.movieGroup || '';
        this.city = data.city || '';
        this.country = data.country || '';
        this.hotelNum = data.hotelNum || '';
        this.chainId = data.chainId || '';
        this.serviceIp = data.serviceIp || '';
        this.brandId = data.brandId || '';
        this.needTv = (data.needTv === true);
        this.needRcu = (data.needRcu === true);
    }

    this.fetchUsers = function (paramObj) {
        var url = 'api/user/loadPagesUser',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var users = $.map(res.data.list, function (user) {
                    return new User(user);
                });
                res.data.list = users;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.saveUser = function (user) {
        var url = 'api/user/save';
        return $http.post(url, user).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.updateUser = function (user) {
        var url = 'api/user/update';
        return $http.post(url, user).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.deleteUser = function (user) {
        var url = 'api/user/delete',
            data = data = {
                id:user.id
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
    this.fetchUserInfo = function (userId) {
        if(!userId){
            return;
        }
        var url = 'api/user/getUserInfo',
            data = {
                id: userId
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var user = res.data.user,
                    hotel = res.data.hotel,
                    rs = $.extend(hotel, user);
                return $q.when(new User(rs));
            }else{
                return $q.reject(null);
            }
        });
    };
    this.resetUser = function () {
        return new User({});
    };
}]);