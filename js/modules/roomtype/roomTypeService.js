/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('roomTypeService', ['postIntercept', '$q', function ($http, $q){
    function RoomType(data){
        this.id = data.id || '';
        this.name = data.name || '';
        this.extInfo = data.extInfo || '';
    }

    this.fetchRoomTypeList = function (paramObj) {
        var url = 'api/roomType/loadPagesHotelRoomType',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var roomTypes = $.map(res.data.list, function (roomType) {
                    return new RoomType(roomType);
                });
                res.data.list = roomTypes;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.getAllRoomType = function () {
        var url = 'api/roomType/queryDistinctRoomType';
        return $http.post(url).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateRoomType = function (roomType) {
        var url = 'api/roomType/modify';
        return $http.post(url, roomType).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.deleteRoomType = function (roomType) {
        var url = 'api/roomType/delete',
            data = {
                id:roomType.id
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
    this.checkRoomTypeRepeat = function (roomType) {
        var url = 'api/roomType/checkName',
            data = {
                name: roomType
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data.token);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.resetRoomType = function () {
        return new RoomType({});
    };
}]);