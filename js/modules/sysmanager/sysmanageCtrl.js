/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('sysmanageCtrl', ['$routeParams', '$q', 'sysmanageService', 'commService', function ($routeParams, $q, service, commService) {
    var self = this,
        curParentId,
        queryConditionObj,
        cacheQueryObj,
        curPageSize,
        prevEditDict = {},
        hotelBrandMap = {},
        //发布值map
        publishValMap = {
            notShop: '非商品',
            shop: '商品',
            log: '动作日志'
        },
        pagingObj;
    self.isEdit = false;
    self.type = $routeParams.operateType;
    //品牌搜索条件
    self.hotelName = '';
    //程序类型搜索条件
    self.pkgType = '';
    //是否在线搜索条件
    self.isOnline = '';
    if(self.type === 'dict'){
        self.pagingParam = {
            parentId: 0
        };
    }else if(self.type === 'install'){
        cacheQueryObj = localStorage.getItem('install_condition');
        if(cacheQueryObj){
            cacheQueryObj = JSON.parse(cacheQueryObj);
            self.hotelName = cacheQueryObj.hotelName;
            self.pkgType = cacheQueryObj.pkgType;
            self.isOnline = cacheQueryObj.isOnline;
            self.subName = cacheQueryObj.subName;
        }
        self.pagingParam = {
            hotelName: '',
            pkgType: '',
            isOnline: '',
            subName: ''//搜索关键字条件
        };
    }

    this.getDictList = function (paramObj) {
        service.fetchDicts(paramObj).then(function (data) {
            var list = data.list;
            for(var i = 0;i < list.length;i += 1){
                list[i].valueCn = publishValMap[list[i].value];
            }
            if(self.isShowDetail){
                self.dictDetailList = list;
            }else{
                self.dictList = list;
            }
            self.totalPage = data.pages.pages;
            pagingObj = paramObj;
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            if(self.isShowDetail) {
                self.dictDetailList = [];
            }else{
                self.dictList = [];
            }
        });
    };
    this.showDetail = function (item) {
        self.isShowDetail = true;
        self.pagingParam.parentId = item.id;
        curParentId = item.id;
        self.getDictList($.extend(pagingObj, {
            parentId: item.id
        }));
    };
    this.backSummary = function () {
        self.isShowDetail = false;
        self.pagingParam.parentId = 0;
    };
    this.goAddDict = function (item) {
        self.isEdit = true;
        self.isAdd = true;
        self.curDict = service.resetDict();
        if(self.isShowDetail){
            self.curDict.parentId = curParentId;
        }
    };
    this.addDict = function (isValid, dict) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        service.saveDict(dict).then(function (data) {
            if(self.isShowDetail && (self.dictDetailList.length === 0 || self.dictDetailList.length < curPageSize)){
                self.dictDetailList.unshift(data);
            }else{
                if(self.isShowDetail && self.dictDetailList.length === curPageSize){
                    self.getDictList($.extend(pagingObj, {
                        parentId: self.pagingParam.parentId
                    }));
                }
                if(self.dictList.length === 0 || self.dictList.length < curPageSize){
                    self.dictList.unshift(data);
                }else{
                    self.getDictList($.extend(pagingObj, {
                        parentId: 0
                    }));
                }
            }
            alert('添加成功!');
            self.backListView();
        }).catch(function () {
            alert('添加失败!');
        });
    };
    this.updateDict = function (isValid, dict) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        if(confirm('字典是系统关键信息,修改可能会带来严重后果,确定修改吗？')){
            service.updateDict(dict).then(function (flag) {
                alert('修改成功!');
                self.backListView();

            }).catch(function () {
                alert('修改失败!');
            });
        }
    };
    this.deleteDict = function (dict) {
        if(confirm('字典是系统关键信息,确定删除?')){
            service.deleteDict(dict).then(function (flag) {
                if(flag){
                    var list;
                    if(self.isShowDetail){
                        list = self.dictDetailList;
                    }else{
                        list = self.dictList;
                    }
                    for(var i = 0, len = list.length;i < len;i += 1){
                        if(list[i].id === dict.id){
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
    this.getInstallList = function (paramObj) {
        //获取酒店安装管理列表
        service.fetchInstalls(paramObj).then(function (data) {
            var list = data.list;
            for(var i = 0, l = list.length;i < l;i += 1){
                //将酒店品牌转换为对应的汉字
                list[i].nameCn = hotelBrandMap[list[i].hotelName];
            }
            self.installList = list;
            self.pageNum = data.pages.pageNum;
            self.pageSize = paramObj.pageSize;
            self.totalPage = data.pages.pages;
            queryConditionObj = paramObj;
            localStorage.setItem('install_condition', JSON.stringify(queryConditionObj));
        }).catch(function () {
            self.installList = [];
        });
    };
    this.getInstallListBySearch = function (content) {
        self.pagingParam.subName = content || '';
        self.pagingParam.hotelName = self.hotelName;
        self.pagingParam.pkgType = self.pkgType;
        self.pagingParam.isOnline = self.isOnline;
        //需要重置下pageNum为1
        cacheQueryObj.pageNum = 1;
        self.getInstallList($.extend(cacheQueryObj, self.pagingParam));
    };
    this.upgrade = function (link) {
        service.upgrade(link).then(function (data) {
            if(data == 0){
                alert('升级成功!');
            }else if(data == 10014){
                alert('无本地服务!');
            }else{
                alert('升级失败!');
            }
            self.getInstallList(cacheQueryObj);
        }).catch(function () {
            alert('升级失败');
        });
    };
    this.editDict = function (dict) {
        self.isEdit = true;
        self.isAdd = false;
        self.curDict = dict;
        prevEditDict = $.extend({}, dict);
    };
    this.switchSort = function (sortField, columnName) {
        if(!self[sortField] || self[sortField] === 'desc'){
            self[sortField] = 'asc';
        }else{
            self[sortField] = 'desc';
        }
        self.pagingParam[sortField] = self[sortField];
        self.pagingParam.columnName = columnName;
        self.getInstallList($.extend(cacheQueryObj, self.pagingParam));
    };
    this.backListView = function () {
        self.isEdit = false;
        self.isAdd = false;
        if(!self.isSubmit){
            $.extend(self.curDict, prevEditDict);
        }
        self.isSubmit = false;
    };

    $q.all([commService.getSelectData('HotelPinPai'), commService.getSelectData('PKGType')]).then(function (data) {
        //酒店品牌
        var brandList = data[0];
        self.brandList = data[0];
        self.pkgTypes = data[1];
        for(var i = 0, l = brandList.length;i < l;i += 1){
            hotelBrandMap[brandList[i].id] = brandList[i].nameCn;
        }
    }).then(function () {
        if(self.type === 'dict'){
            self.getDictList({
                pageNum: 1,
                pageSize: 20,
                parentId: 0
            });
        }else if(self.type === 'install'){
            cacheQueryObj = cacheQueryObj || {
                    pageNum: 1,
                    pageSize: 20
                };
            self.getInstallList(cacheQueryObj);
        }
    });
}]);