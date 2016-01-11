/**
 * Created by Administrator on 2015/12/6.
 */
plMod.service('publishService', ['postIntercept', '$q', function ($http, $q){
    function Pub(data){
        this.id = data.id || '';
        this.version = data.version || '';
        this.createTime = data.createTime || '';
    }

    this.fetchPubs = function (paramObj) {
        //获取酒店安装管理列表
        var url = 'api/publishPkgs/loadPagesPublishPkgs',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var pubs = $.map(res.data.list, function (pub) {
                    return new Pub(pub);
                });
                res.data.list = pubs;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
}]);