/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('hotelService', ['postIntercept', '$q', function ($http, $q){
    /*hotelTypeMap = {
     GONG_YU: '公寓',
     JING_JI_XING: '经济型',
     QING_NIAN_LV_SHE: '青年旅舍',
     HAO_HUA_XING: '豪华型',
     SHU_SHI_XING: '舒适型',
     ZHONG_GAO_DUAN: '中高端'
     }*/
    var addressList = addressMap.province;
    function Hotel(data){
        //酒店对象
        this.id = data.id || '';
        this.sysId = data.sysId || '';
        this.orgId = data.orgId || '';
        this.address = data.address || '';
        this.bus = data.bus || '';
        this.userName = data.userName || '';
        this.password = data.password || '';
        this.env = data.env || '';
        this.fax = data.fax || '';
        this.hotelNum = data.hotelNum || '';
        this.name = data.name || '';
        //酒店品牌对应的中文名
        this.nameCn = '';
        this.phone = data.phone || '';
        this.postCode = data.postCode || '';
        this.subName = data.subName || '';
        this.type = data.type || '';
        this.province = data.province || '';
        this.city = data.city || '';
        this.country = data.country || '';
        var rs = getLocation(this.province, this.city, this.country);
        this.provinceCn = rs.provinceCn;
        this.area = rs.cityCn + ',' + rs.countryCn;
        //位置地图坐标
        this.lbsLngLat = data.lbsLngLat || '';
        /*this.crIsoCode = data.crIsoCode || '';
        this.uniqueNum = data.uniqueNum || '';
        this.needRcu = (data.needRcu === true);
        this.needTv = (data.needTv === true);
        this.screen = (data.screen === true);*/
        this.welcomesCn = data.welcomesCn || '';
        this.welcomesEn = data.welcomesEn || '';
        this.weatherCode = data.weatherCode || '';
        this.cityNameEn = data.cityNameEn || '';
        this.rollCn = data.rollCn || '';
        this.rollEn = data.rollEn || '';
        this.movieGroup = data.movieGroup || '';
        this.chainId = data.chainId || '';
        this.serviceIp = data.serviceIp || '';
        this.brandId = data.brandId || '';
        this.airConfig = data.airConfig || '';
        this.available = data.available || '';
    }
    function getLocation(province, city, country){
        var rs = {},
            tmp = [];
        for(var i = 0, len = addressList.length;i < len;i += 1){
            if(addressList[i].id === province){
                rs.provinceCn = addressList[i].name;
                tmp = addressList[i].city;
                break;
            }
        }
        if(city){
            for(var s = 0, l = tmp.length;s < l;s += 1){
                if(tmp[s].id === city){
                    rs.cityCn = tmp[s].name;
                    tmp = tmp[s].country;
                    break;
                }
            }
        }
        if(country){
            for(var m = 0, n = tmp.length;m < n;m += 1){
                if(tmp[m].id === country){
                    rs.countryCn = tmp[m].name;
                    break;
                }
            }
        }
        return rs;
    }

    this.fetchHotels = function (paramObj) {
        var url = 'api/hotel/loadPagesHotel',//接口请求地址
            //接口所需参数
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                //status为true
                var hotels = $.map(res.data.list, function (hotel) {
                    return new Hotel(hotel);
                });
                res.data.list = hotels;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.getHotelInfo = function (hotelId) {
        var url = 'api/hotel/get',
            data = {
                id: hotelId
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(new Hotel(res.data));
            }else{
                return $q.reject(null);
            }
        });
    };
    this.getHotelByUser = function () {
        var url = 'api/user/getHotel';
        return $http.post(url).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(new Hotel(res.data));
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateHotel = function (hotel) {
        var url = 'api/hotel/update';
        return $http.post(url, hotel).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.deleteHotel = function (hotel) {
        var url = 'api/hotel/delete',
            data = {
                id:hotel.id
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.modifyAccountInfo = function (hotelId, pwd) {
        var url = 'api/user/update',
            data = {
                hotelId: hotelId,
                password: pwd
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.getAllProvince = function () {
        var rs = [],
            tmp;
        for(var i = 0, len = addressList.length;i < len;i += 1){
            tmp = {};
            tmp.id = addressList[i].id;
            tmp.name = addressList[i].name;
            rs.push(tmp);
        }
        return rs;
    };
    this.resetHotel = function () {
        return new Hotel({});
    };
}]);