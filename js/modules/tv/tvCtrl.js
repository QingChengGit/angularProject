/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('tvCtrl', ['$routeParams', '$location', '$q', 'tvService', 'commService',
    function ($routeParams, $location, $q, service, commService) {
    var self = this,
        prevEditChannel,
        curPageSize;
    self.isEdit = false;
    self.uploader1 = null;
    self.uploader2 = null;
    self.uploader3 = null;
    self.uploader4 = null;
    self.uploader5 = null;
    self.uploader6 = null;
    self.channelUpload1 = null;
    self.channelUpload2 = null;
    self.channelUpload3 = null;
    self.channelUpload4 = null;
    self.uploadPath = 'api/fileUpload/upload';

    self.type = $routeParams.operateType;
    self.parentId = $routeParams.parentId;
    self.serviceType = $location.search().serviceType;
    self.pagingParam = {
        parentId: self.parentId
    };

    this.getTvConf = function () {
        service.fetchTvConf().then(function (data) {
            self.curConf = data;
        }).catch(function () {
            self.curConf = {};
        });
    };

    //电视频道方法
    this.getTvChannels = function (paramObj) {
        service.fetchTvChannels(paramObj).then(function (data) {
            self.channels = data.list;
            self.totalPage = data.pages.pages;
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.channels = [];
        });
    };
    this.saveChannel = function (isValid, channel) {
        service.saveChannel(channel).then(function (data) {
            if(self.channels.length === 0 || self.channels.length < curPageSize){
                channel.id = data.id;
                var tmp = {},
                    tmpChannel;
                tmp.menuType = channel.menuType;
                tmp.serviceType = channel.serviceType;
                tmpChannel = service.setChannel(tmp);
                channel.menuTypeCn = tmpChannel.menuTypeCn;
                channel.serviceTypeCn = tmpChannel.serviceTypeCn;
                self.channels.unshift(channel);
            }else{
                self.getTvChannels({
                    pageNum: 1,
                    pageSize: curPageSize,
                    parentId: self.parentId
                });
            }
            alert('添加成功!');
            self.backListView();
        }).catch(function (msg) {
            if(msg.length >40){
                alert('服务器出现问题!');
            }else{
                alert(msg);
            }
        });
    };
    this.updateChannel = function (isValid, channel) {
        service.updateChannel(channel).then(function (flag) {
            var tmp = {},
                tmpChannel;
            tmp.menuType = channel.menuType;
            tmp.serviceType = channel.serviceType;
            tmpChannel = service.setChannel(tmp);
            channel.menuTypeCn = tmpChannel.menuTypeCn;
            channel.serviceTypeCn = tmpChannel.serviceTypeCn;
            alert('修改成功!');
            self.backListView();
        }).catch(function (msg) {
            if(msg.length >40){
                alert('服务器出现问题!');
            }else{
                alert(msg);
            }
        });
    };
    this.deleteChannel = function (channelId) {
        if(confirm('确定删除?')){
            service.deleteChannel(channelId).then(function (flag) {
                if(flag){
                    var list = self.channels;
                    /*if(self.isShowDetail){
                     list = self.dictDetailList;
                     }else{
                     list = self.dictList;
                     }*/
                    for(var i = 0, len = list.length;i < len;i += 1){
                        if(list[i].id === channelId){
                            list.splice(i, 1);
                            break;
                        }
                    }
                    alert('删除成功!');
                }else{
                    alert('删除失败!');
                }
            }).catch(function () {
                alert('删除失败!');
            });
        }
    };
    this.modifyChannel = function (isValid, channel) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        var q1 = $q.defer(),
            q2 = $q.defer(),
            q3 = $q.defer(),
            q4 = $q.defer(),
            p1 = q1.promise,
            p2 = q2.promise,
            p3 = q3.promise,
            p4 = q4.promise,
            a = [p1.then(function (){

            }),p2.then(function(){

            })];
        if(self.channelUpload3){
            a.push(p3.then(function (){

            }));
            self.channelUpload3.getFiles('inited').length ? self.channelUpload3.upload() : q3.resolve();
            self.channelUpload3.once('uploadSuccess', function () {
                q3.resolve();
            });
        }
        if(self.channelUpload4){
            a.push(p4.then(function (){

            }));
            self.channelUpload4.getFiles('inited').length ? self.channelUpload4.upload() : q4.resolve();
            self.channelUpload4.once('uploadSuccess', function () {
                q4.resolve();
            });
        }
        $q.all(a).then(function () {
            if(self.channelOperate === 'add'){
                self.saveChannel(isValid, channel);
            }else{
                self.updateChannel(isValid, channel);
            }
        });
        self.channelUpload1.getFiles('inited').length ? self.channelUpload1.upload() : q1.resolve();
        self.channelUpload2.getFiles('inited').length ? self.channelUpload2.upload() : q2.resolve();

        self.channelUpload1.once('uploadSuccess', function () {
            q1.resolve();
        });
        self.channelUpload2.once('uploadSuccess', function () {
            q2.resolve();
        });
    };
    this.editChannel = function (item) {
        self.curChannel = item;
        prevEditChannel = item;
        self.isEdit = true;
        self.channelOperate = 'update';
    };
    this.addChannel = function () {
        self.curChannel = service.resetChannel();
        self.curChannel.parentId = self.parentId;
        self.isEdit = true;
        self.channelOperate = 'add';
    };
    this.backListView = function () {
        self.isEdit = false;
        if(!self.isSubmit){
            $.extend(self.curChannel, prevEditChannel);
        }
        self.isSubmit = false;
    };

    this.upload = function (isValid) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        var q1 = $q.defer(),
            q2 = $q.defer(),
            q3 = $q.defer(),
            q4 = $q.defer(),
            q5 = $q.defer(),
            q6 = $q.defer(),
            p1 = q1.promise,
            p2 = q2.promise,
            p3 = q3.promise,
            p4 = q4.promise,
            p5 = q5.promise,
            p6 = q6.promise;

        $q.all([p1.then(function (){

        }),p2.then(function(){

        }),p3.then(function(){

        }),p4.then(function(){

        }),p5.then(function(){

        }),p6.then(function(){

        })]).then(function (data){
            service.saveTvConf(self.curConf).then(function (data) {
                alert('操作成功!');
            }).catch(function () {
                alert('操作失败!');
            });
        }).catch(function () {
            alert('有图片上传失败请重新上传!');
        });
        self.uploader1.getFiles('inited').length ? self.uploader1.upload() : q1.resolve();
        self.uploader2.getFiles('inited').length ? self.uploader2.upload() : q2.resolve();
        self.uploader3.getFiles('inited').length ? self.uploader3.upload() : q3.resolve();
        self.uploader4.getFiles('inited').length ? self.uploader4.upload() : q4.resolve();
        self.uploader5.getFiles('inited').length ? self.uploader5.upload() : q5.resolve();
        self.uploader6.getFiles('inited').length ? self.uploader6.upload() : q6.resolve();

        self.uploader1.once('uploadSuccess', function () {
            q1.resolve();
        });
        self.uploader2.once('uploadSuccess', function () {
            q2.resolve();
        });
        self.uploader3.once('uploadSuccess', function () {
            q3.resolve();
        });
        self.uploader4.once('uploadSuccess', function () {
            q4.resolve();
        });
        self.uploader5.once('uploadSuccess', function () {
            q5.resolve();
        });
        self.uploader6.once('uploadSuccess', function () {
            q6.resolve();
        });
    };

    if(!self.type){
        commService.getSelectData('signalSource').then(function (data) {
            self.signalList = data;
            self.getTvConf();
        });
    }else{
        self.getTvChannels({
            pageNum: 1,
            pageSize: 20,
            parentId: self.parentId
        });
        if(self.type === 'Two'){
            localStorage.setItem('secondParentId', self.parentId);
        }
        if(self.type === 'Third'){
            localStorage.setItem('thirdParentId', self.parentId);
            self.secondParentId = localStorage.getItem('secondParentId');
        }
        if(self.type === 'Four'){
            self.thirdParentId = localStorage.getItem('thirdParentId');
        }
        if(self.type !== 'One'){
            self.fileType = {
                title: 'Txt',
                extensions: 'txt',
                mimeTypes: 'text/plain'
            };
        }
    }
}]);