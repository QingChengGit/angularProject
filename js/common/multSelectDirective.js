/**
 * Created by Administrator on 2015/11/27.
 */
plMod.directive('mulSelect', function () {
    var template = '<div class="mul-select">' +
        '<div class="select-area">' +
            '<div class="select-item" ng-repeat="item in resourceData">' +
            '<p ng-bind="item.nameCn" ng-click="selected($event, item, \'select\');" ng-dblclick="selectItem(\'select\', item);"></p>' +
            '</div>' +
        '</div>' +
        '<div class="operate-area">' +
            '<span class="operate-btn" ng-click="selectAll(\'select\');">全部添加</span>' +
            '<span class="operate-btn" ng-click="selectSingle(\'select\');">添加</span>' +
            '<span class="operate-btn" ng-click="selectSingle(\'delete\');">移除</span>' +
            '<span class="operate-btn" ng-click="selectAll(\'delete\');">全部移除</span>' +
        '</div>' +
        '<div class="selected-area">' +
            '<div class="select-item" ng-repeat="s in selectedData">' +
            '<p ng-bind="s.nameCn" ng-click="selected($event, s, \'delete\');" ng-dblclick="selectItem(\'delete\', s);"></p>' +
            '</div>' +
        '</div>' +
        '</div>';

    return {
        restrict: 'E',
        template: template,
        replace: true,
        scope: {
            resourceData: '=',
            selectedData: '='
        },
        link : function (scope, ele, attr) {
            scope.selectItem = function (type, item) {
                scope.curItem = null;
                if(!scope.resourceData || Object.prototype.toString.call(scope.resourceData)!=='[object Array]'){
                    scope.resourceData = [];
                }
                if(!scope.selectedData || Object.prototype.toString.call(scope.selectedData)!=='[object Array]'){
                    scope.selectedData = [];
                }
                var rd = (type === 'select' ? scope.resourceData : scope.selectedData),
                    sd = (type === 'delete' ? scope.resourceData : scope.selectedData);
                for(var i = 0, len = rd.length;i < len;i += 1){
                    if(rd[i].id === item.id){
                        rd.splice(i, 1);
                        break;
                    }
                }
                sd.push(item);
            };
            scope.selectAll = function (type) {
                if(!scope.resourceData || Object.prototype.toString.call(scope.resourceData)!=='[object Array]'){
                    scope.resourceData = [];
                }
                if(!scope.selectedData || Object.prototype.toString.call(scope.selectedData)!=='[object Array]'){
                    scope.selectedData = [];
                }
                if(type === 'select'){
                    if(scope.resourceData.length > 0){
                        for(var m = 0, n = scope.resourceData.length;m < n;m += 1){
                            scope.selectedData.push(scope.resourceData[m]);
                        }
                        scope.resourceData = [];
                    }
                }else if(type === 'delete'){
                    if(scope.selectedData.length === 0){
                        return;
                    }
                    for(var i = 0, l = scope.selectedData.length;i < l;i += 1){
                        scope.resourceData.push(scope.selectedData[i]);
                    }
                    scope.selectedData = [];
                }
            };
            scope.selected = function (evt, item ,type) {
                $('.select-item').removeClass('item-selected');
                $(evt.currentTarget).parent().addClass('item-selected');
                scope.curItem = item;
                scope.curType = type;
            };
            scope.selectSingle = function (type) {
                if(scope.curItem && scope.curType === type){
                    scope.selectItem(type, scope.curItem);
                }else{
                    if(type === 'select'){
                        alert('请选择要添加的项');
                    }else{
                        alert('请选择要移除的项');
                    }
                }
            };
        }
    };
});