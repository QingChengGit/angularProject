/**
 * Created by Administrator on 2015/11/16.
 */
plMod.directive('titleBar', function () {
    var template = '<div class="title-bar">' +
        '<p ng-bind="titleName"></p>' +
        '<div class="search-area" ng-if="showSearch">' +
        '<input type="text" class="search-input" placeholder="{{searchPlaceHolder}}" ng-model="searchContent"/>' +
        '<div class="blue-btn search-btn" ng-click="searchHandler({content:searchContent});">查询</div>' +
        '</div>' +
        '</div>';
    return {
        restrict: 'E',
        template: template,
        replace: true,
        scope: {
            titleName: '@',
            showSearch: '=',
            searchContent: '=',
            searchHandler: '&',
            searchPlaceHolder: '@'
        }
    };
});