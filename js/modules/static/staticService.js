/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('staticService', ['postIntercept', '$q', function ($http, $q){
    function House(data){
        this.id = data.id || '';
        this.hotelName = data.hotelName || '';
        this.roomNum = data.roomNum || '';
        this.checkInTime = data.checkInTime || '';
        this.checkOutTime = data.checkOutTime || '';
        this.guestName = data.guestName || '';
        this.sex = data.sex || '';
        this.mobile = data.mobile || '';
        this.roomType = data.roomType || '';
        this.age = data.age || '';
    }
    function Log(data){

    }
    function Purchase(data){

    }

    this.fetchHouse = function (paramObj) {
        var url = 'api/pmsCheckIn/loadPagesPmsCheckInInfo',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var houses = $.map(res.data.list, function (house) {
                    return new House(house);
                });
                res.data.list = houses;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.fetchLogs = function (paramObj) {
        var url = 'api/hotelRoom/loadPagesHotelRoom',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var logs = $.map(res.data.list, function (log) {
                    return new Log(log);
                });
                res.data.list = logs;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.fetchPurchases = function (room) {
        var url = 'api/hotelRoom/loadPagesHotelRoom',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var purchases = $.map(res.data.list, function (purchase) {
                    return new Purchase(purchase);
                });
                res.data.list = purchases;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
}]);