/**
 * Created by Administrator on 2015/11/19.
 */
plMod.directive('pagingBar', function () {
    var template = '<div class="paging-bar">' +
        '<span class="item paging-item" ng-if="isShowAddBtn" ng-click="addListItem();">添加</span>' +
        '<span class="item paging-item" ng-click="goFirst();">首页</span><span class="item paging-item" ng-click="goPrev();">上一页</span>' +
        '<span class="item paging-item" ng-click="goNext();">下一页</span><span class="item paging-item" ng-click="goLast();">末页</span>' +
        '<span class="item item-text">第</span><input type="text" class="item paging-input" ng-init="pageNum = 1" ng-model="pageNum" /><span class="item item-text">页</span>' +
        '<span class="item paging-item" ng-click="goTargetPage();">跳转</span>' +
        '<span class="item item-text">共{{totalPage}}页,每页显示</span>' +
        '<select ng-model="pageSize" class="item paging-select" ' +
        'ng-options="item for item in pageSizeArr" ng-change="switchSize();"></select>' +
        '</div>';

    function link(scope, ele, attr){
        scope.pageSizeArr = [20, 50, 100,200];
        scope.goFirst = function () {
            scope.pageNum = 1;
            scope.pageAction({
                param: $.extend(scope.pagingParam, {
                    pageNum: scope.pageNum,
                    pageSize: scope.pageSize
                })
            });
        };
        scope.goPrev = function () {
            if(scope.pageNum <= 1 || scope.pageNum > (scope.totalPage + 1)){
                return;
            }
            scope.pageNum = parseInt(scope.pageNum, 10) - 1;
            scope.pageAction({
                param: $.extend(scope.pagingParam, {
                    pageNum: scope.pageNum,
                    pageSize: scope.pageSize
                })
            });
        };
        scope.goNext = function () {
            if(scope.pageNum >= scope.totalPage){
                scope.pageNum = scope.totalPage;
                return;
            }
            scope.pageNum = parseInt(scope.pageNum, 10) + 1;
            scope.pageAction({
                param: $.extend(scope.pagingParam, {
                    pageNum: scope.pageNum,
                    pageSize: scope.pageSize
                })
            });
        };
        scope.goLast = function () {
            scope.pageNum = scope.totalPage;
            scope.pageAction({
                param: $.extend(scope.pagingParam, {
                    pageNum: scope.pageNum,
                    pageSize: scope.pageSize
                })
            });
        };
        scope.goTargetPage = function () {
            if(!scope.pageNum || isNaN(scope.pageNum) || parseInt(scope.pageNum) <= 0 ||
                parseInt(scope.pageNum) > parseInt(scope.totalPage)){
                scope.pageNum = 1;
                return;
            }
            scope.pageAction({
                param: $.extend(scope.pagingParam, {
                    pageNum: scope.pageNum,
                    pageSize: scope.pageSize
                })
            });
        };
        scope.switchSize = function () {
            if(isNaN(scope.pageSize)){
                return;
            }
            //重置pageNum为第一页
            scope.pageNum = 1;
            scope.pageAction({
                param: $.extend(scope.pagingParam, {
                    pageNum: scope.pageNum,
                    pageSize: scope.pageSize
                })
            });
        };
    }
    return {
        restrict: 'E',
        template: template,
        replace: true,
        scope: {
            isShowAddBtn: '=',
            addListItem: '&',
            pageAction: '&',
            pagingParam: '=',
            pageNum: '=',
            pageSize: '=',
            totalPage: '='
        },
        link: link
    };
});