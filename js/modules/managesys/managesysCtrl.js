/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('managesysCtrl', ['managesysService', '$q', '$scope', 'commService', function (service, $q, $scope, commService) {
    var self = this,
        queryConditionObj,
        cacheQueryObj,
        curPageSize = 20,
        prevEditSys = {},
        sysTypeMap = {},
        versionReg = /^v\d{2}.\d{2}.\d{2}$/,
        nameArr;
    self.isEdit = false;
    self.uploadPath = 'api/fileUpload/upload';
    self.fileType = {
        title: 'app',
        extensions: 'gz,zip,apk,rar,jar',
        mimeTypes: 'application/x-gzip,application/zip,application/vnd.android,' +
        'application/x-rar-compressed,application/java-archive'
    };
    self.channelUpload1 = null;

    function upload() {
        var q1 = $q.defer(),
            p1 = q1.promise;

        if(self.channelUpload1.getFiles('inited').length){
            self.channelUpload1.upload();
            self.channelUpload1.once('uploadSuccess', function () {
                q1.resolve();
            });
        }else{
            q1.resolve();
        }
        return p1;
    }
    this.getSysList = function (paramObj) {
        service.fetchSys(paramObj).then(function (data) {
            var list = data.list;
            for(var i = 0, l = list.length;i < l;i += 1){
                //将程序包类型转换为对应的汉字
                list[i].pkgTypeName = sysTypeMap[list[i].pkgType];
            }
            self.sysList = list;
            self.pageNum = data.pages.pageNum;
            self.pageSize = paramObj.pageSize;
            self.totalPage = data.pages.pages;
            queryConditionObj = paramObj;
            localStorage.setItem('sys_packages_condition', JSON.stringify(queryConditionObj));
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.sysList = [];
        });
    };

    this.addSys = function (isValid, sys) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        var p = upload();
        p.then(function () {
            if(!sys.path.path){
                alert('请上传安装包文件!');
                return;
            }
            service.saveSys(sys).then(function (data) {
                sys.id = data.id;
                sys.pubTime = data.pubTime;
                sys.pkgTypeName = sysTypeMap[sys.pkgType];
                if(self.sysList.length === 0 || self.sysList.length < curPageSize){
                    self.sysList.unshift(sys);
                }else{
                    self.getSysList({
                        pageNum: 1,
                        pageSize: curPageSize
                    });
                }
                alert('添加成功!');
                self.backListView();
            }).catch(function () {
                alert('添加失败!');
            });
        });
    };
    this.updateSys = function (isValid, sys) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        var p = upload();
        p.then(function () {
            service.updateSys(sys).then(function (flag) {
                sys.pkgTypeName = sysTypeMap[sys.pkgType];
                alert('修改成功!');
                self.backListView();
            }).catch(function () {
                alert('修改失败!');
            });
        });
    };
    this.deleteSys = function (sys) {
        if(!confirm('确定删除?')){
            return;
        }
        service.deleteSys(sys).then(function (flag) {
            if(flag){
                var list = self.sysList;
                for(var i = 0, len = list.length;i < len;i += 1){
                    if(list[i].id === sys.id){
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
    };
    this.goEditSys = function (sys) {
        self.isEdit = true;
        self.isAdd = false;
        self.curSys = sys;
        prevEditSys = $.extend({}, sys);
    };
    this.goAddSys = function () {
        self.isEdit = true;
        self.isAdd = true;
        self.curSys = service.resetSys();
        setTimeout(function () {
            self.channelUpload1.on('beforeFileQueued', function( file ) {
                var name = file.name.substr(0, file.name.lastIndexOf('.')),
                    index = name.lastIndexOf('_'),
                    type = name.substr(0, index),
                    version = name.substr(index + 1);
                nameArr = [];
                if(!type || !versionReg.test(version)){
                    alert('您所选文件名称格式不符合要求,请选择文件名格式为:程序类型_版本号(如TvClient_v01.00.00)的文件');
                    return false;
                }
                if(!sysTypeMap[type]){
                    alert('您所选文件无对应的程序类型，请检查!');
                    return false;
                }
                nameArr.push(type);
                nameArr.push(version);
                return true;
            });
            self.channelUpload1.on('fileQueued', function( file ) {
                self.curSys.pkgType = nameArr[0];
                self.curSys.name = sysTypeMap[nameArr[0]];
                self.curSys.version = nameArr[1];
                $scope.$digest();
            });
        }, 0);
    };
    this.backListView = function () {
        self.isEdit = false;
        self.isAdd = false;
        if(!self.isSubmit){
            $.extend(self.curSys, prevEditSys);
        }
        self.isSubmit = false;
    };
    commService.getSelectData('PKGType').then(function (data) {
        //程序包类型
        var list = data;
        self.pkgTypeList = list;
        for(var i = 0, l = list.length;i < l;i += 1){
            sysTypeMap[list[i].name] = list[i].nameCn;
        }
        cacheQueryObj = localStorage.getItem('sys_packages_condition');
        if(cacheQueryObj){
            cacheQueryObj = JSON.parse(cacheQueryObj);
        }
        cacheQueryObj = cacheQueryObj || {
                pageNum: 1,
                pageSize: 20
            };
        self.getSysList(cacheQueryObj);
    });
}]);