/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('monitorCtrl', ['monitorService', '$routeParams', '$location', 'commService', 'dialogService',
    'hotelService',function (service, $routeParams, $location, commService, dialogService, hotelService) {
    var self = this,
        hotelBrandMap = {},
        selectedRooms = [],
        queryConditionObj,
        cacheQueryObj;
    self.isEdit = false;
    self.type = $routeParams.operateType;
    self.param = $routeParams.param;
    self.hotelName = '';
    //省份搜索条件
    self.conditProv = '';
    if(self.type === 'list'){
        cacheQueryObj = localStorage.getItem('monitor_condition');
        if(cacheQueryObj){
            cacheQueryObj = JSON.parse(cacheQueryObj);
            self.hotelName = cacheQueryObj.name;
            self.conditProv = cacheQueryObj.province;
            self.condition = cacheQueryObj.condition;
        }
        self.pagingParam = cacheQueryObj || {
            name: '',
            province: '',
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
            self.pageSize = data.pages.pageSize;
            self.totalPage = data.pages.pages;
            queryConditionObj = paramObj;
            localStorage.setItem('monitor_condition', JSON.stringify(queryConditionObj));
        }).catch(function () {
            self.monitorList = [];
        });
    };
    this.getRCUList = function (paramObj) {
        service.fetchRCUList(paramObj).then(function (data) {
            var list = data.list;
            for(var i = 0;i < list.length;i += 1){
                list[i].isSelect = false;
            }
            self.rcuList = list;
            self.pageNum = data.pages.pageNum;
            self.pageSize = data.pages.pageSize;
            self.totalPage = data.pages.pages;
            data.hotelTvInfo.brandName = hotelBrandMap[data.hotelTvInfo.brandName];
            self.hotelInfo = data.hotelTvInfo;
            queryConditionObj = paramObj;
            localStorage.setItem('monitory_rcu_condition', JSON.stringify(queryConditionObj));
        }).catch(function () {
            self.rcuList = [];
        });
    };
    this.getTVVersionList = function (paramObj) {
        service.fetchTVVersionList(paramObj).then(function (data) {
            self.tvList = data.list;
            self.pageNum = data.pages.pageNum;
            self.pageSize = data.pages.pageSize;
            self.totalPage = data.pages.pages;
            data.hotelTvInfo.brandName = hotelBrandMap[data.hotelTvInfo.brandName];
            self.hotelInfo = data.hotelTvInfo;
            queryConditionObj = paramObj;
            localStorage.setItem('monitor_tv_condition', JSON.stringify(queryConditionObj));
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
        if(selectedRooms.length <= 0){
            alert('请选择要修改的房间!');
            return;
        }
        var str = '<form name="monitorForm" class="pl-form monitor-form" novalidate>' +
            '<div class="form-item"><label class="form-key">RCU设置时长:</label>' +
            '<input class="form-value expireTime" type="text" value=""/>小时' +
            '</div>' +
            '</form>';
        dialogService.confirm({
            title: '修改RCU设置时长',
            template: str,
            width: 480,
            okHandler: saveRCU
        });
    };
    function saveRCU(){
        var time = $('.expireTime').val();
        if(!time || isNaN(time) || !/^\d{1,8}$/.test(time) || parseInt(time) <= 0){
            alert('请输入正确的RCU设置时长,最大8位正整数!');
            return;
        }
        /*if(parseInt(time) <= parseInt(self.curMonitorRCU.runningTimeNum)){
            alert('RCU设置时长不能少于已运行时长!');
            return;
        }*/
        service.batchUpdateRCU(self.rcuList[0].hotelId, time, selectedRooms.join(',')).then(function (flag) {
            self.getRCUList($.extend(queryConditionObj, {
                hotelId: self.param
            }));
            self.isSelectAll = false;
            selectedRooms = [];
            alert('操作成功!');
        }).catch(function () {
            alert('操作失败!');
        });
    }
    this.changeMonitorList = function (content) {
        self.pagingParam.condition = content || '';
        self.pagingParam.province = self.conditProv;
        self.pagingParam.name = self.hotelName;
        queryConditionObj.pageNum = 1;
        self.getMonitorList($.extend(queryConditionObj, self.pagingParam));
    };
    this.switchSort = function (sortType, sortField, columnName) {
        if(!self[sortField] || self[sortField] === 'desc'){
            self[sortField] = 'asc';
        }else{
            self[sortField] = 'desc';
        }
        self.pagingParam[sortField] = self[sortField];
        self.pagingParam.columnName = columnName;
        if(sortType === 'tv'){
            self.getTVVersionList($.extend(queryConditionObj, self.pagingParam));
        }else if(sortType === 'rcu'){
            self.getRCUList($.extend(queryConditionObj, self.pagingParam));
        }

    };
    this.selectAll = function () {
        var rucList = self.rcuList;
        selectedRooms = [];
        for(var i = 0;i < rucList.length;i += 1){
            rucList[i].isSelect = self.isSelectAll;
            self.isSelectAll && selectedRooms.push(rucList[i].roomNum);
        }
    };
    this.select = function (rcu) {
        var rucList = self.rcuList;
        if(rcu.isSelect){
            selectedRooms.push(rcu.roomNum);
        }else{
            for(var m = 0;m <selectedRooms.length;s += 1){
                if(selectedRooms[m] === rcu.roomNum){
                    selectedRooms.splice(m ,1);
                    break;
                }
            }
        }
        if(!rcu.isSelect && self.isSelectAll){
            //取消全选中状态
            self.isSelectAll = false;
            return;
        }
        for(var i = 0;i < rucList.length;i += 1){
            if(!rucList[i].isSelect){
                break;
            }
        }
        if(i == rucList.length){
            self.isSelectAll = true;
        }
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
        var condition;
        if(self.type === 'list'){
            cacheQueryObj = localStorage.getItem('monitor_condition');
            if(cacheQueryObj){
                cacheQueryObj = JSON.parse(cacheQueryObj);
            }
            condition = cacheQueryObj || {
                    pageNum: 1,
                    pageSize: 20
                };
            self.getMonitorList(condition);
            self.provList = hotelService.getAllProvince();
        }else if(self.type === 'rcu'){
            self.curTime = new Date().toLocaleString();
            cacheQueryObj = localStorage.getItem('monitory_rcu_condition');
            if(cacheQueryObj){
                cacheQueryObj = JSON.parse(cacheQueryObj);
            }
            condition = cacheQueryObj || {
                    pageNum: 1,
                    pageSize: 20
                };
            self.getRCUList($.extend(condition, {
                hotelId: self.param
            }));
        }else if(self.type === 'tv'){
            cacheQueryObj = localStorage.getItem('monitor_tv_condition');
            if(cacheQueryObj){
                cacheQueryObj = JSON.parse(cacheQueryObj);
            }
            condition = cacheQueryObj || {
                    pageNum: 1,
                    pageSize: 20
                };
            self.getTVVersionList($.extend(condition, {
                hotelId: self.param
            }));
        }
    });
}]);