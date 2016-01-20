/**
 * Created by Administrator on 2015/12/6.
 */
plMod.controller('publishCtrl', ['$routeParams', '$scope', 'publishService', function ($routeParams, $scope, service) {
    var self = this;
    self.isEdit = false;
    self.type = $routeParams.operateType;

    this.getPubList = function (paramObj) {
        service.fetchPubs(paramObj).then(function (data) {
            self.pubList = data.list;
            self.pageNum = data.pages.pageNum;
            self.pageSize = data.pages.pageSize;
            self.totalPage = data.pages.pages;
        }).catch(function () {
            self.pubList = [];
        });
    };

    self.getPubList({
        pageNum: 1,
        pageSize: 20
    });
    $scope.$watch('curVersion', function(newVal, oldVal) {
        self.getPubList({
            pageNum: 1,
            pageSize: 20
        });
    });
}]);