/**
 * Created by Administrator on 2015/11/17.
 */
plMod.directive('hideNextAll', function () {
    function link(scope, el, attr){
        el.click(function () {
            if(!el.attr('toggleFlag')){
                el.attr('toggleFlag', 1);
                el.nextAll().hide();
            }else{
                el.removeAttr('toggleFlag');
                el.nextAll().show();
            }
        });
    }
    return {
        restrict: 'A',
        link: link
    };
}).directive('selectLink', function () {
    var prevLink = null;
    function link(scope, el, attr){
        el.click(function (evt) {
            if(evt.target.className.indexOf('menu-link') !== -1){
                if(prevLink){
                    prevLink.className = prevLink.className.replace(/ menu-link-selected/, '');
                }
                prevLink = evt.target;
                evt.target.className += ' menu-link-selected';
            }
        });
    }
    return {
        restrict: 'A',
        link: link
    };
});