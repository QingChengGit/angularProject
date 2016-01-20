/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('staticCtrl', ['staticService', 'roomTypeService', '$routeParams',
    function (service, roomTypeService, $routeParams) {
    var self = this,
        queryConditionObj,
        cacheQueryObj;
    self.type = $routeParams.operateType;
    self.pagingParam = {
        hotelName: '',
        guestName: '',
        sex: '',
        roomType: '',
        age: '',
        timeRange: ''
    };

    this.getHouseList = function (paramObj) {
        service.fetchHouse(paramObj).then(function (data) {
            self.houseList = data.list;
            self.pageNum = data.pages.pageNum;
            self.pageSize = paramObj.pageSize;
            self.totalPage = data.pages.pages;
            queryConditionObj = paramObj;
            localStorage.setItem('static_house_condition', JSON.stringify(queryConditionObj));
        }).catch(function () {
            self.houseList = [];
        });
    };
    this.getLogList = function (paramObj) {
        service.fetchLogs(paramObj).then(function (data) {
            self.logList = data.list;
            self.totalPage = data.pages.pages;
        }).catch(function () {
            self.logList = [];
        });
    };
    this.getPurchaseList = function (paramObj) {
        service.fetchPurchases(paramObj).then(function (data) {
            self.purchaseList = data.list;
            self.totalPage = data.pages.pages;
        }).catch(function () {
            self.purchaseList = [];
        });
    };
    this.getListBySearch = function () {
        var startTime = document.querySelector('.startTime').value;
        var endTime = document.querySelector('.endTime').value;
        self.pagingParam.hotelName = self.hotelName;
        self.pagingParam.guestName = self.guestName;
        self.pagingParam.sex = self.sex;
        self.pagingParam.roomType = self.roomType;
        self.pagingParam.age = self.age;
        self.pagingParam.timeRange = startTime + '~' + endTime;
        if(self.pagingParam.age && isNaN(self.pagingParam.age)){
            alert('年龄必须为数字,请检查!');
            return;
        }
        if(startTime && endTime){
            if(new Date(startTime).getTime() >= new Date(endTime).getTime()){
                alert('查询的终止时间必须大于起始时间!');
                return;
            }
        }
        cacheQueryObj.pageNum = 1;
        operateMap[self.type].interface($.extend(cacheQueryObj, self.pagingParam));
    };

    var operateMap = {
        house: {
            conditionName: 'static_house_condition',
            interface: self.getHouseList
        }
    };
    cacheQueryObj = localStorage.getItem(operateMap[self.type].conditionName);
    if(cacheQueryObj){
        cacheQueryObj = JSON.parse(cacheQueryObj);
        self.guestName = cacheQueryObj.guestName;
        self.sex = cacheQueryObj.sex;
        self.roomType = cacheQueryObj.roomType;
        self.age = cacheQueryObj.age;
        self.startTime = cacheQueryObj.timeRange ? cacheQueryObj.timeRange.split('~')[0] : '';
        self.endTime = cacheQueryObj.timeRange ? cacheQueryObj.timeRange.split('~')[1] : '';
    }
    cacheQueryObj = cacheQueryObj || {
        pageNum: 1,
        pageSize: 20
    };
    operateMap[self.type].interface(cacheQueryObj);
    roomTypeService.getAllRoomType().then(function (data) {
        self.roomTypeList = data;
    });
}]);