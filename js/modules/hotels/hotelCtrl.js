/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('hotelCtrl', ['$routeParams', '$location', 'commService', 'hotelService', 'dialogService',
    function ($routeParams, $location, commService, service, dialogService) {
    var self = this,
        hotelBrandMap = {},
        goodsList,
        queryConditionObj,
        cacheQueryObj;
    self.type = $routeParams.operateType;
    self.param = $routeParams.param;
    self.pagingParam = {
        condition: '',
        province: '',
        name: ''//品牌条件
    };

    this.getHotelList = function (paramObj) {
        service.fetchHotels(paramObj).then(function (data) {
            var list = data.list;
            for(var i = 0, l = list.length;i < l;i += 1){
                //将酒店品牌转换为对应的汉字
                list[i].nameCn = hotelBrandMap[list[i].name];
            }
            self.hotelList = list;
            self.pageNum = data.pages.pageNum;
            self.totalPage = data.pages.pages;
            self.pageSize = data.pages.pageSize;
            queryConditionObj = paramObj;
            localStorage.setItem('hotel_condition', JSON.stringify(queryConditionObj));
        }).catch(function () {
            self.hotelList = [];
        });
    };
    this.updateHotel = function (isValid, hotel) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        self.province && (hotel.province = self.province.id);
        self.city && (hotel.city = self.city.id);
        self.area && (hotel.country = self.area.id);
        /*var strArr = [],
            prevBrandId;
        prevBrandId = hotel.brandId;
        for(var i = 0,l = hotel.brandId.length;i < l;i += 1){
            strArr.push(hotel.brandId[i].id);
        }
        hotel.brandId = strArr.join(',');*/
        if(!hotel.province || !hotel.city || !hotel.country){
            alert('请选择地区!');
            return;
        }
        service.updateHotel(hotel).then(function (flag) {
            alert('操作成功!');
            if(self.type !== 'editHotel'){
                self.backListView();
            }
        }).catch(function (msg) {
            //hotel.brandId = prevBrandId;
            alert(msg);
        });
    };
    this.deleteHotel = function (hotel) {
        if(!confirm('确定删除?')){
            return;
        }
        service.deleteHotel(hotel).then(function (flag) {
            if(flag){
                for(var s = 0, len = self.hotelList.length;s < len;s += 1){
                    if(self.hotelList[s].id === hotel.id){
                        self.hotelList.splice(s, 1);
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
    this.goAddHotel = function () {
        $location.path('/hotel/add/addHotel');
    };
    this.getHotelListBySearch = function (hotelName) {
        self.pagingParam.condition = hotelName || '';
        self.pagingParam.province = self.conditProv;
        self.pagingParam.name = self.conditName;
        queryConditionObj.pageNum = 1;
        self.getHotelList($.extend(queryConditionObj, self.pagingParam));
    };
    /*this.editHotel = function (hotel) {
        self.isEdit = true;
        self.userHotel = hotel;
        getBrand();
        prevEditHotel = $.extend({}, hotel);
    };*/
    this.backListView = function () {
        window.history.back();
    };
    this.goModifyInfo = function () {
        var str = '<form name="monitorForm" class="pl-form monitor-form" novalidate>' +
            '<div class="form-item"><label class="form-key">用户账号:</label>' +
            '<label class="form-value">' + self.userHotel.userName + '</label>' +
            '</div>' +
            '<div class="form-item"><label class="form-key">用户密码:</label>' +
            '<input class="form-value password" type="text"' +
            'value="' + self.userHotel.password + '"/>' +
            '</div>' +
            '</form>';
        dialogService.confirm({
            title: '修改用户密码',
            template: str,
            width: 480,
            okHandler: modifyAccountInfo
        });
    };
    function modifyAccountInfo(){
        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,20}/,
            account = {};
        account.hotelId = self.userHotel.id;
        account.password = $('.password').val();
        if(!account.password || !reg.test(account.password)){
            alert('请输入正确的密码,字母加数字至少6位,最多20位!');
            return;
        }
        service.modifyAccountInfo(account.hotelId, account.password).then(function (flag) {
            self.userHotel.password = account.password;
            alert('操作成功!');
        }).catch(function () {
            alert('操作失败!');
        });
    }
    function initMap(){

        //创建地图实例
        var map = new BMap.Map("map"),
            lng,//经度
            lat,//纬度
            point,
            marker,
            p;
        if(self.userHotel.lbsLngLat){
            p = self.userHotel.lbsLngLat.split(',');
            lng = p[0];
            lat = p[1];
        }else{
            lng = 116.337408;
            lat = 39.99913;
        }
        point = new BMap.Point(lng, lat);
        //地图初始化
        map.centerAndZoom(point, 15);
        map.addControl(new BMap.NavigationControl());   //添加地图类型控件
        //map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        if(self.userHotel.lbsLngLat){
            marker = new BMap.Marker(point);        // 创建标注
            map.addOverlay(marker);
        }
        map.addEventListener("click", function(e){
            self.userHotel.lbsLngLat = e.point.lng + ',' + e.point.lat;
            map.removeOverlay(marker);
            marker = new BMap.Marker(e.point);        // 创建标注
            map.addOverlay(marker);
        });
    }
    /*function getBrand(){
        var brands,
            rs = [],
            tmp;
        brands = self.userHotel.brandId.split(',');
        for(var i = 0,l = brands.length;i < l;i += 1){
            if(brands[i]){
                tmp = {};
                tmp.id = brands[i];
                rs.push(tmp);
            }
        }
        self.userHotel.brandId = rs;
        if(!goodsList || goodsList.length) {
            commService.getSelectData('HotelBrand').then(function (data) {
                //商品品牌
                goodsList = data;
                self.goodsList = goodsList.concat([]);
                var rsData = self.goodsList,
                    sData = self.userHotel.brandId;
                for(var s = 0, m = sData.length;s < m;s += 1){
                    for(var p = 0;p < rsData.length;p += 1){
                        if(rsData[p].id == sData[s].id){
                            sData[s].nameCn = rsData[p].nameCn;
                            rsData.splice(p, 1);
                            break;
                        }
                    }
                }
            });
        }else{
            self.goodsList = goodsList.concat([]);
            var rsData = self.goodsList,
                sData = self.userHotel.brandId;
            for(var s = 0, m = sData.length;s < m;s += 1){
                for(var p = 0;p < rsData.length;p += 1){
                    if(rsData[p].id == sData[s].id){
                        sData[s].nameCn = rsData[p].nameCn;
                        rsData.splice(p, 1);
                        break;
                    }
                }
            }
        }
    }*/


    commService.getSelectData('HotelPinPai').then(function (data) {
        //酒店品牌
        self.brandList = data;
        for(var i = 0, l = self.brandList.length;i < l;i += 1){
            hotelBrandMap[self.brandList[i].id] = self.brandList[i].nameCn;
        }
    }).then(function () {
        if(self.type === 'editHotel'){
            self.isEdit = true;
            service.getHotelByUser().then(function (data) {
                self.userHotel = data;
                self.userHotel.nameCn = hotelBrandMap[self.userHotel.name];
                self.province = {id: self.userHotel.province};
                self.city = {id: self.userHotel.city};
                self.area = {id: self.userHotel.country};
                initMap();
            })/*.then(function () {
                getBrand();
            })*/;
        }else if(self.type === 'hotelList'){
            if(self.param !== 'all'){
                service.getHotelInfo(self.param).then(function (data) {
                    self.userHotel = data;
                    self.userHotel.nameCn = hotelBrandMap[self.userHotel.name];
                    self.province = {id: self.userHotel.province};
                    self.city = {id: self.userHotel.city};
                    self.area = {id: self.userHotel.country};
                    initMap();
                });
            }else{
                cacheQueryObj = localStorage.getItem('hotel_condition');
                if(cacheQueryObj){
                    cacheQueryObj = JSON.parse(cacheQueryObj);
                    self.conditName = cacheQueryObj.name;
                    self.conditProv = cacheQueryObj.province;
                    self.condition = cacheQueryObj.condition;
                }
                cacheQueryObj = cacheQueryObj || {
                        pageNum: 1,
                        pageSize: 20
                    };
                self.getHotelList(cacheQueryObj);
                self.provList = service.getAllProvince();
            }
        }else{
            self.userHotel = service.resetHotel();
            self.province = {id: self.userHotel.province};
            self.city = {id: self.userHotel.city};
            self.area = {id: self.userHotel.country};
            initMap();
        }
    });
    //self.hotelList = data;
}]);