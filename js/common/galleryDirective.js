/**
 * Created by Administrator on 2015/12/29.
 */
plMod.directive('gallery', function () {
    function link(scope, el ,attr){
        var datas,
            len,
        //页数从1开始
            index = 1,
            perPageNum = parseInt(scope.perNum, 10),
            timer,
            startTime = new Date().getTime(),
            curTime;
        //默认每页显示一张图片
        perPageNum = perPageNum > 0 ? perPageNum : 1;
        scope.curPage = 0;

        scope.goNext = function (evt) {
            if(index >= len){
                evt.stopPropagation();
                return;
            }
            scope.curImgArr = datas.slice(index * perPageNum, (index + 1) * perPageNum);
            index += 1;
            scope.curPage = index;
            scope.switchPageHandler && scope.switchPageHandler();
            evt.stopPropagation();
        };
        scope.goPrev = function (evt) {
            if(index <= 1){
                evt.stopPropagation();
                return;
            }
            scope.curImgArr = datas.slice((index - 2) * perPageNum, (index - 1) * perPageNum);
            index -= 1;
            scope.curPage = index;
            scope.switchPageHandler && scope.switchPageHandler();
            evt.stopPropagation();
        };
        scope.imgClick = function (evt) {
            var imgNo = parseInt(evt.target.getAttribute('imgNo')),
                curImg = scope.curImgArr[imgNo];
            //点击相册图片时，将当前被点击的图片信息传递给该处理函数
            scope.imgClickHandler({
                item: curImg,
                evt: evt
            });
        };
        scope.$watch('imgs', function (newVal, oldVal){
            if(!newVal || newVal.length === 0){
                return;
            }
            datas = newVal;
            scope.curImgArr = datas.slice(0, perPageNum);
            len = Math.ceil(datas.length/perPageNum);
            scope.totalPage = len;
            len && (scope.curPage = 1);
        });
        scope.$watch('position', function (newVal, oldVal){
            if(!newVal){
                return;
            }
            el.css({
                'left': scope.position.x + 'px',
                'bottom': scope.position.y + 'px'
            });
        });
    }

    return {
        restrict: 'E',
        templateUrl: function (ele, attr) {
            return 'templates/' + attr.templateUrl;
        },
        replace: true,
        link: link,
        scope: {
            imgClickHandler: '&',
            imgs: '=',
            perNum: '=',
            position: '=',
            switchPageHandler: '&'
        }
    };
});