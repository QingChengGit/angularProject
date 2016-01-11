/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('menuService', ['postIntercept', '$q', function ($http, $q){
    function Menu(data){
        this.id = data.id || '';
        //菜单名称
        this.nameCn = data.nameCn || '';
        this.nameEn = data.nameEn || '';
        this.orderNum = data.orderNum;
        this.parentId = data.parentId;
        this.target = data.target || '';
    }

    this.fetchMenuList = function (paramObj) {
        var url = 'api/sysMenu/listMenuByParent',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var menus = $.map(res.data.list, function (menu) {
                    return new Menu(menu);
                });
                res.data.list = menus;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.getMenuById = function (id) {
        var url = 'api/sysMenu/get',
            data = {
                id: id
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(new Menu(res.data));
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateMenu = function (sys) {
        var url = 'api/sysMenu/update';
        return $http.post(url, sys).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.deleteMenu = function (sys) {
        var url = 'api/sysMenu/delete',
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
    this.checkMenuOrderRepeat = function (parentId, orderNum) {
        var url = 'api/sysMenu/checkOrderNum',
            data = {
                parentId: parentId,
                orderNum: orderNum
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.isExist);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.resetMenu = function () {
        return new Menu({});
    };
}]);