/**
 * Created by Administrator on 2015/12/29.
 */
plMod.directive('gallery', function () {
    var template = '<div class="pl-gallery-container" ng-click="imgClick($event);">' +
        '<a class="gallery-left-btn"></a>' +
        '<div class="gallery-content" ng-repeat="item in curImgArr">' +
        '<img ng-src="" imgNo="$index"/>' +
        '</div>' +
        '<a class="gallery-right-btn"></a>' +
        '</div>';
    function link(scope, el ,attr){
        //scope.imgs的接口为二维数组结构
        var datas = scope.imgs,
            len = datas.length,
            index = 0;
        scope.goNext = function () {
            if(index >= len){
                return;
            }
            scope.curImgArr = datas[index + 1];
        };
        scope.goPrev = function () {
            if(index <= 0){
                return;
            }
            scope.curImgArr = datas[index - 1];
        };
        scope.imgClick = function (evt) {
            var imgNo = parseInt(evt.currentTarget.attr('imgNo'));
            //点击相册图片时，将当前被点击的图片信息传递给该处理函数
            scope.imgClickHandler(scope.curImgArr[imgNo]);
        };
        scope.curImgArr = datas[0];
    }

    return {
        restrict: 'E',
        link: link,
        scope: {
            imgClickHandler: '&'
        }
    };
});