/**
 * Created by Administrator on 2015/11/20.
 */
plMod.directive('upload', function () {
    var template = '<div class="uploader-container">' +
                <!--用来存放item-->
            '<div class="uploader-list">' +
            '<p class="preview-title" ng-bind="previewTitle"></p>' +
            '<div class="file-item thumbnail">' +
            '<img ng-if="!fileType" ng-src={{previewImg.path}} />' +
            '<a ng-if="fileType && previewImg.path" ng-href={{previewImg.path}} target="_Blank">查看</a>' +
            '</div>' +
            '</div>' +
            '<div class="select-btn">选择文件</div>' +
            '<div class="remove-btn">删除</div>' +
            '</div>',
        curFile,
        uploader,
        $mask = $('.mask-layer');
    function init(context, path, fileType){
        var swfPath = 'js/libs/Uploader.swf';

        uploader = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: false,

            // swf文件路径
            swf: swfPath,

            // 文件接收服务端。
            server: path,

            fileSingleSizeLimit: 30*1024*1024,

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: context + ' .select-btn',

            duplicate: true,

            accept: fileType
        });

        // 当有文件添加进来的时候
        uploader.on( 'fileQueued', function( file ) {
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail">' +
                    '<img>' +
                    '</div>'
                ),
                $img = $li.find('img');
            curFile = file;
            // $list为容器jQuery实例
            $(context + ' .preview-title').nextAll().remove();
            $(context + ' .preview-title').after( $li );

            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr( 'src', src );
            }, 300, 200);
        });
        uploader.on( 'uploadError', function( file ) {
            $mask.hide();
            file.setStatus('inited');
            alert('上传文件失败!');
        });
        uploader.on( 'error', function( error ) {
            console.log(error);
        });
    }
    function link(scope, ele, attr){
        // 默认只允许选择图片文件。
        scope.mimeType = scope.fileType || {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            };
        init(scope.context, scope.serverPath, scope.mimeType);
        scope.uploader = uploader;
        scope.uploader.on( 'beforeFileQueued', function( file ) {
            scope.uploader.reset();
            if(!file.ext || scope.mimeType.extensions.indexOf(file.ext) === -1){
                alert('您所选文件格式不符合要求,请选择文件扩展名为:' + scope.fileType.extensions + '的文件');
                return false;
            }
            if(file.size > 30*1024*1024){
                alert('您所选文件太大，请选择30M以下的文件!');
                return false;
            }
            return true;
        });
        scope.uploader.on('uploadProgress', function( file ) {
            $mask.show();
        });
        scope.uploader.on('uploadSuccess', function (file, data) {
            scope.previewImg.path = data.path;
            if(scope.fileSize){
                scope.fileSize.size = data.size;
            }
        });
        $(scope.context + ' .remove-btn').click(function () {
            scope.previewImg.path = '';
            if(scope.fileSize){
                scope.fileSize.size = 0;
            }
            if(curFile){
                scope.uploader.removeFile(curFile, true);
            }
            $(scope.context + ' .preview-title').nextAll().remove();
            return false;
        });
    }

    return {
        restrict: 'E',
        template: template,
        replace: true,
        scope: {
            context: '@',
            serverPath: '=',
            previewTitle: '@',
            previewImg: '=',
            uploader: '=',
            fileSize: '=',
            fileType: '='
        },
        link: link
    };
});