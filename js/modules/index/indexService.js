/**
 * Created by Administrator on 2015/11/30.
 */
plMod.service('indexService', ['postIntercept', '$q', function ($http, $q) {
    this.loginOut = function () {
        var url = 'api/user/logOut';
        return $http.post(url).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.publish = function () {
        var url = 'api/publish/publishSave';
        return $http.post(url).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.getCurVersion = function () {
        //获取系统当前最新版本
        var url = 'api/publishPkgs/queryVersion';
        return $http.post(url).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.fetchMenuList = function (userType) {
        var url = 'api/sysMenu/listMenuByUserType',
            data = {
                userType: userType || ''
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
}]);