/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('monitorCtrl', ['monitorService', '$routeParams', '$location', 'commService', 'dialogService',
    function (service, $routeParams, $location, commService, dialogService) {
    var self = this,
        curPageSize = 10,
        hotelBrandMap = {};
    self.isEdit = false;
    self.type = $routeParams.operateType;
    self.param = $routeParams.param;
    self.hotelName = '';
    if(self.type === 'list'){
        self.pagingParam = {
            name: '',
            condition: ''
        };
    }else{
        self.pagingParam = {
            hotelId: self.param
        };
    }

    this.getMonitorList = function (paramObj) {
        service.fetchMonitorList(paramObj).then(function (data) {
            var list = data.list;
            for(var i = 0, l = list.length;i < l;i += 1){
                //将酒店品牌转换为对应的汉字
                list[i].nameCn = hotelBrandMap[list[i].name];
            }
            self.monitorList = data.list;
            self.pageNum = data.pages.pageNum;
            self.totalPage = data.pages.pages;
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.monitorList = [];
        });
    };
    this.getRCUList = function (paramObj) {
        service.fetchRCUList(paramObj).then(function (data) {
            self.rcuList = data.list;
            self.pageNum = data.pages.pageNum;
            self.totalPage = data.pages.pages;
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.rcuList = [];
        });
    };
    this.getTVVersionList = function (paramObj) {
        service.fetchTVVersionList(paramObj).then(function (data) {
            self.tvList = data.list;
            self.pageNum = data.pages.pageNum;
            self.totalPage = data.pages.pages;
            data.hotelTvInfo.brandName = hotelBrandMap[data.hotelTvInfo.brandName];
            self.hotelInfo = data.hotelTvInfo;
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.tvList = [];
        });
    };
    this.updateTVClock = function (item) {
        self.curMonitor = item;
        var str = '<form name="monitorForm" class="pl-form monitor-form" novalidate>' +
            '<div class="form-item"><label class="form-key">酒店品牌:</label>' +
            '<label class="form-value">' + self.curMonitor.nameCn + '</label>' +
            '</div>' +
            '<div class="form-item"><label class="form-key">酒店名称:</label>' +
            '<label class="form-value">' + self.curMonitor.subName + '</label>' +
            '</div>' +
            '<div class="form-item"><label class="form-key">电视锁定时间:</label>' +
            '<input class="form-value tvLockTime" onclick="SelectDate(this,\'yyyy-MM-dd hh:mm:ss\')" type="text" readonly="readonly" ' +
            'value="' + self.curMonitor.tvLockTime + '"/>' +
            '</div>' +
            '<div class="form-item">' +
            '<label class="form-key">电视锁定百分比:</label>' +
            '<select class="tvLockPercent">' +
            '<option value="0.1">10%</option><option value="0.5">50%</option><option value="1">100%</option>' +
            '</select>' +
            '</div>' +
            '</form>';
        dialogService.confirm({
            title: '修改电视锁定设置',
            template: str,
            width: 480,
            okHandler: saveMonitor
        });
        $('.tvLockPercent').val(self.curMonitor.tvLockPercent);
    };
    function saveMonitor() {
        var timePrev = self.curMonitor.tvLockTime;
        var percentPrev = self.curMonitor.tvLockPercent;
        self.curMonitor.tvLockTime = $('.tvLockTime').val();
        self.curMonitor.tvLockPercent = $('.tvLockPercent').val();
        if(!self.curMonitor.tvLockTime){
            self.curMonitor.tvLockTime = timePrev;
            self.curMonitor.tvLockPercent = percentPrev;
            alert('请选择电视锁定时间!');
            return;
        }
        if(!confirm('您是否确认修改电视锁定时间?')){
            return;
        }
        service.updateMonitor(self.curMonitor).then(function (flag) {
            alert('操作成功!');
        }).catch(function () {
            alert('操作失败!');
            self.curMonitor.tvLockTime = timePrev;
            self.curMonitor.tvLockPercent = percentPrev;
        });
    }
    this.updateRCU = function (item) {
        self.curMonitorRCU = item;
        var str = '<form name="monitorForm" class="pl-form monitor-form" novalidate>' +
            '<div class="form-item"><label class="form-key">房间号:</label>' +
            '<label class="form-value">' + self.curMonitorRCU.roomNum + '</label>' +
            '</div>' +
            '<div class="form-item"><label class="form-key">RCU设置时长:</label>' +
            '<input class="form-value expireTime" type="text" value="' + self.curMonitorRCU.limitedTime + '"/>小时' +
            '</div>' +
            '</form>';
        dialogService.confirm({
            title: '修改RCU时长',
            template: str,
            width: 480,
            okHandler: saveRCU
        });
    };
    function saveRCU(){
        var time = $('.expireTime').val(),
            data = {};
        if(!time || isNaN(time) || !/^\d{1,8}$/.test(time) || parseInt(time) <= 0){
            alert('请输入正确的RCU到期时间,最大8位正整数!');
            return;
        }
        if(parseInt(time) <= parseInt(self.curMonitorRCU.runningTimeNum)){
            alert('RCU设置时长不能少于已运行时长!');
            return;
        }
        data.id = self.curMonitorRCU.id;
        data.hotelId = self.curMonitorRCU.hotelId;
        data.limitedTime = time;
        service.updateRCU(data).then(function (flag) {
            self.getRCUList({
                pageNum: 1,
                pageSize: curPageSize,
                hotelId: self.param
            });
            alert('操作成功!');
        }).catch(function () {
            alert('操作失败!');
        });
    }
    this.changeMonitorList = function (content) {
        self.pagingParam.condition = content || '';
        self.pagingParam.name = self.hotelName;
        self.getMonitorList($.extend({
            pageNum: 1,
            pageSize: 20
        }, self.pagingParam));
    };
    this.switchSort = function () {
        if(!self.monitorOrderBy || self.monitorOrderBy === 'desc'){
            self.monitorOrderBy = 'asc';
        }else{
            self.monitorOrderBy = 'desc';
        }
        self.pagingParam.orderBy = self.monitorOrderBy;
        self.getMonitorList($.extend({
            pageNum: self.pageNum,
            pageSize: curPageSize
        }, self.pagingParam));
    };
    this.switchTvSort = function (sortField, columnName) {
        if(!self[sortField] || self[sortField] === 'desc'){
            self[sortField] = 'asc';
        }else{
            self[sortField] = 'desc';
        }
        self.pagingParam[sortField] = self[sortField];
        self.pagingParam.columnName = columnName;
        self.getTVVersionList($.extend({
            pageNum: self.pageNum,
            pageSize: curPageSize
        }, self.pagingParam));
    };
    this.backListView = function () {
        window.history.back();
    };

    commService.getSelectData('HotelPinPai').then(function (data) {
        //酒店品牌
        self.brandList = data;
        for(var i = 0, l = self.brandList.length;i < l;i += 1){
            hotelBrandMap[self.brandList[i].id] = self.brandList[i].nameCn;
        }
    }).then(function () {
        if(self.type === 'list'){
            self.getMonitorList({
                pageNum: 1,
                pageSize: 20
            });
        }else if(self.type === 'rcu'){
            self.getRCUList({
                pageNum: 1,
                pageSize: 20,
                hotelId: self.param
            });
        }else if(self.type === 'tv'){
            self.getTVVersionList({
                pageNum: 1,
                pageSize: 20,
                hotelId: self.param
            });
        }
    });
}]);