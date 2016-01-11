/**
 * Created by Administrator on 2015/12/24.
 */
plMod.directive('tip', function () {
    var tipNode;
    function link(scope, el, attr){
        el.mousemove(function (evt) {
            var target,
                elements,
                positionX,
                positionY;
            if(scope.targetSelector){
                elements = el.querySelectorAll(scope.targetSelector);
                for(var i = 0,l = elements.length;i < l;i += 1){
                    if(elements[i] === evt.target){
                        target = elements[i];
                    }
                }
            }else{
                if(evt.target.nodeName.toLowerCase() === 'td'){
                    target = evt.target;
                }
            }
            if(!target){
                return false;
            }
            //生成悬浮提示框
            if(!tipNode){
                tipNode = document.createElement('div');
            }
            tipNode.className = 'tip-container';
            tipNode.textContent = target.textContent;
            document.body.appendChild(tipNode);
            positionY = evt.pageY - 20;
            positionX = evt.pageX + 40;
            if(positionX + tipNode.clientWidth >= document.body.clientWidth){
                positionX = evt.pageX - 40 -tipNode.clientWidth;
                (tipNode.className.indexOf('tip-right-arrow') === -1) && (tipNode.className += ' tip-right-arrow');
            }else{
                (tipNode.className.indexOf('tip-left-arrow') === -1) && (tipNode.className += ' tip-left-arrow');
            }
            tipNode.style.cssText = 'top:' + positionY + 'px;left:' + positionX + 'px;';
        });
        el.mouseout(function () {
            if(tipNode){
                document.body.removeChild(tipNode);
                tipNode = null;
            }
        });
    }
    return {
        restrict: 'A',
        scope: {
            targetSelector: '@'
        },
        link: link
    };
});