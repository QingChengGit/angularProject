/**
 * Created by Administrator on 2015/12/2.
 */
plMod.service('postIntercept', ['$http', '$q', function ($http, $q) {
    var $mask = $('.mask-layer');
    this.post = function () {
        $mask.show();
        return $http.post.apply(null, arguments).then(function (res) {
            $mask.hide();
            var rs = res.data;
            if(!rs.status && rs.loginStatus){
                window.location.href = 'login.html';
                return $q.reject(null);
            }else{
                return $q.when(res);
            }
        }).catch(function () {
            $mask.hide();
        });
    };
}]);