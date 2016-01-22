/**
 * Created by Administrator on 2015/12/24.
 */
plMod.directive('tip', function () {
    var tipNode,
        isOverTip;
    function link(scope, el, attr){
        el.mouseover(function (evt) {
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
                if(tipNode){
                    tipNode.removeEventListener('mouseout', tipOutHandler, false);
                    tipOutHandler();
                }
                return false;
            }
            //生成悬浮提示框
            if(!tipNode){
                tipNode = document.createElement('div');
            }
            tipNode.className = 'tip-container';
            tipNode.textContent = target.textContent;
            document.body.appendChild(tipNode);

            positionY = evt.target.getBoundingClientRect().top - evt.target.clientHeight/2;
            positionX = evt.target.getBoundingClientRect().left + document.body.scrollLeft + evt.target.clientWidth;
            if(positionX + tipNode.clientWidth >= document.body.clientWidth){
                positionX = positionX - evt.target.clientWidth - tipNode.clientWidth;
                (tipNode.className.indexOf('tip-right-arrow') === -1) && (tipNode.className += ' tip-right-arrow');
            }else{
                (tipNode.className.indexOf('tip-left-arrow') === -1) && (tipNode.className += ' tip-left-arrow');
            }
            tipNode.style.cssText = 'top:' + positionY + 'px;left:' + positionX + 'px;';
            tipNode.addEventListener('mouseout', tipOutHandler, false);
        });
        el.mouseleave(function (evt) {
            if(tipNode && (!evt.relatedTarget || evt.relatedTarget.className.indexOf('tip-container') === -1)){
                //删除事件监听器
                tipNode.removeEventListener('mouseout', tipOutHandler, false);
                document.body.removeChild(tipNode);
            }
        });
    }
    function tipOutHandler(){
        if(tipNode){
            document.body.removeChild(tipNode);
            tipNode = null;
        }
    }
    return {
        restrict: 'A',
        scope: {
            targetSelector: '@'
        },
        link: link
    };
});