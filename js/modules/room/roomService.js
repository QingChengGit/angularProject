/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('roomService', ['postIntercept', '$q', function ($http, $q){
    var self = this;
    function Room(data){
        //房间对象
        this.id = data.id || '';
        this.hotelId = data.hotelId || '';
        this.uniqueNum = data.uniqueNum || '';
        this.roomNum = data.roomNum || '';
        this.roomType = data.roomType || '';
        //房间类型对应的中文名称
        this.roomTypeName = data.roomTypeName || '';
        this.unit = data.unit;
        this.floor = data.floor;
        this.area = data.area || '';
        this.ip = data.ip || '';
        this.wifi = data.wifi || '';
        this.rcuIp = data.rcuIp || '';
        this.irCut = data.irCut || '';
        this.roomNumStart = data.roomNumStart || '';
        this.roomNumEnd = data.roomNumEnd || '';
        //电视编号
        //this.tvCode = this.uniqueNum + this.unit + this.roomNum;
    }
    function RCUTemplate(data){
        this.roomType = data.roomType || '';
        this.rcuTemplate = data.roomRCUCfgListAndTypeJsons || [];
        //传递给server的模板配置。格式为：lineType@num(路数)@name(名称)
        this.templateCfg = data.templateCfg || '';
    }
    this.fetchRooms = function (paramObj) {
        var url = 'api/hotelRoom/loadPagesHotelRoom',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var rooms = $.map(res.data.list, function (rooms) {
                    return new Room(rooms);
                });
                res.data.list = rooms;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateRoom = function (room) {
        var url = 'api/hotelRoom/updateOrsave';
        return $http.post(url, room).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.batchSaveRoom = function (room) {
        var url = 'api/hotelRoom/saveOnBatch';
        return $http.post(url, room).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.deleteRoom = function (room) {
        var url = 'api/hotelRoom/delete',
            data = {
                id:room.id
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
    this.getRCUTemplate = function (roomType) {
        var url = 'api/roomrcu/query2',
            data = {
                roomType: roomType
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(new RCUTemplate(res.data));
            }else{
                return $q.reject(null);
            }
        });
    };
    this.isRoomNumRepeat = function (roomNum) {
        if(!roomNum){
            return $q.when(false);
        }
        var url = 'api/hotelRoom/checkRoomNum',
            data = {
                roomNum:roomNum
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
    this.getRoomInfo = function (roomId) {
        if(!roomId){
            return $q.when(false);
        }
        var url = 'api/hotelRoom/queryById',
            data = {
                id: roomId
            },
            obj = {};
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                obj.rcuTemplate = new RCUTemplate(res.data.roomRCUCfgListJson);
                obj.room = new Room(res.data.hotelRoomJson);
                return $q.when(obj);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.resetRoom = function () {
        return new Room({});
    };
    this.resetRCUTemplate = function () {
       return self.getRCUTemplate('');
    };
}]);