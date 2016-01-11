/**
 * Created by Administrator on 2015/11/21.
 */
plMod.service('commService',['postIntercept', '$q', function ($http, $q) {
    this.getSelectData = function (typeName) {
        if(!typeName){
            return;
        }
        var url = 'api/dataDict/listByName',
            data = {
                name: typeName
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data.list);
            }else{
                return $q.reject(null);
            }
        });
    };
}]);