/**
 * Created by Administrator on 2015/12/25.
 */
plMod.service('dialogService',[function () {
    var self = this;
    this.confirm = function (options) {
        var defaultOpt = {
            title: '确认提示框',
            template: '',
            width: 300,
            okHandler: function () {},
            cancelHandler: function () {}
        },
        opt,
        domStr,
        mask,
        $mask,
        $wrap,
        $dialog;

        if(!options){
            opt = defaultOpt;
        }else{
            opt = $.extend(defaultOpt, options);
        }
        domStr = '<div class="pl-dialog">' +
            '<p class="dialog-title">' + opt.title + '</p>' +
            '<div class="dialog-content">' + opt.template + '</div>' +
            '<div class="dialog-btns">' +
            '<div class="dialog-ok-btn">确定</div>' +
            '<div class="dialog-cancel-btn">取消</div>' +
            '</div>' +
            '</div>';
        mask = '<div class="dialog-mask"></div>';
        $wrap = $('.main-wrap');
        $('.pl-dialog').remove();
        if($('.dialog-mask').length === 0){
            $wrap.append(mask);
        }
        $wrap.append(domStr);
        $dialog = $('.pl-dialog');
        $mask = $('.dialog-mask');
        $dialog.css({
            width: opt.width + 'px',
            height: opt.height || 'auto',
            marginTop: '-' + $dialog.height()/2 + 'px',
            marginLeft: '-' + opt.width/2 + 'px'
        });
        $('.pl-dialog .dialog-ok-btn').one('click', function () {
            opt.okHandler();
            $mask.hide();
            $dialog.remove();
        });
        $('.pl-dialog .dialog-cancel-btn').one('click', function () {
            opt.cancelHandler();
            $mask.hide();
            $dialog.remove();
        });
        $mask.show();

    };
}]);