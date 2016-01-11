/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('managesysService', ['postIntercept', '$q', function ($http, $q){
    function Sys(data){
        this.id = data.id || '';
        //系统名称
        this.name = data.name || '';
        this.path = {path: data.path || ''};
        this.pkgType = data.pkgType || '';
        this.pkgTypeName = '';
        this.version = data.version || '';
        this.pubTime = data.pubTime || '';
        this.size = {size: data.size || 0};
        this.remark = data.remark || '';
    }

    this.fetchSys = function (paramObj) {
        var url = 'api/sysProgPkgs/loadPagesSysProgPkgs',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var sys = $.map(res.data.list, function (sys) {
                    return new Sys(sys);
                });
                res.data.list = sys;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.saveSys = function (sys) {
        var url = 'api/sysProgPkgs/save',
            prev = $.extend({}, sys);
        prev.path = prev.path.path;
        prev.size = prev.size.size;
        return $http.post(url, prev).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateSys = function (sys) {
        var url = 'api/sysProgPkgs/update',
            prev = $.extend({}, sys);
        prev.path = prev.path.path;
        prev.size = prev.size.size;
        return $http.post(url, prev).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.deleteSys = function (sys) {
        var url = 'api/sysProgPkgs/delete',
            data = {
                id:sys.id
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
    this.resetSys = function () {
        return new Sys({});
    };
}]);