/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('staticCtrl', ['staticService', 'roomTypeService', '$routeParams',
    function (service, roomTypeService, $routeParams) {
    var self = this;
    self.type = $routeParams.operateType;
    //酒店名称搜索条件
    self.hotelName = '';
    //客户姓名搜索条件
    self.guestName = '';
    self.sex = '';
    self.roomType = '';
    self.age = '';
    self.startTime = '';
    self.endTime = '';
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
            self.totalPage = data.pages.pages;
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
        if(isNaN(self.pagingParam.age)){
            alert('年龄必须为数字,请检查!');
            return;
        }
        if(startTime && endTime){
            if(new Date(startTime).getTime() >= new Date(endTime).getTime()){
                alert('查询的终止时间必须大于起始时间!');
                return;
            }
        }
        operateMap[self.type]($.extend({
            pageNum: 1,
            pageSize: 20
        }, self.pagingParam));
    };

    var operateMap = {
        house: self.getHouseList
    };
    operateMap[self.type]({
        pageNum: 1,
        pageSize: 20
    });
    roomTypeService.getAllRoomType().then(function (data) {
        self.roomTypeList = data;
    });
}]);