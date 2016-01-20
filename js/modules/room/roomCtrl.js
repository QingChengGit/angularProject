/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('roomCtrl', ['$routeParams', '$location', 'roomService', 'roomTypeService', function ($routeParams, $location, service, roomTypeService) {
    var self = this,
        confLimitOb = {},
        roomTypeMap = {},
        queryConditionObj,
        cacheQueryObj,
        prevEditRoom;
    self.isEdit = false;
    self.type = $routeParams.operateType;
    self.param = $routeParams.param;
    self.isRoomNumNotRepeat  = true;

    this.getRoomList = function (paramObj) {
        service.fetchRooms(paramObj).then(function (data) {
            self.roomList = data.list;
            for(var i = 0,l = self.roomList.length;i < l;i += 1){
                self.roomList[i].roomTypeName = roomTypeMap[self.roomList[i].roomType];
            }
            self.pageNum = data.pages.pageNum;
            self.pageSize = data.pages.pageSize;
            self.totalPage = data.pages.pages;
            queryConditionObj = paramObj;
            localStorage.setItem('room_condition', JSON.stringify(queryConditionObj));
        }).catch(function () {
            self.roomList = [];
        });
    };
    this.updateRoom = function (isValid, room, template) {
        var count = 0;
        self.isSubmit = true;
        if(!isValid || !self.isRoomNumNotRepeat){
            return;
        }
        if(self.type === 'batchAdd'){
            count = parseInt(room.roomNumEnd) - parseInt(room.roomNum) + 1;
            if(count <= 0){
                alert('房间起始编号不能大于终止编号!');
                return;
            }
            room.count = count.toString();
        }
        //设置模板
        var cloneObj = $.extend({}, template),
            list = cloneObj.rcuTemplate,
            str = '',
            tmp;
        for(var i = 0, len = list.length;i < len;i += 1){
            str += list[i].lineType + ':';
            tmp = list[i].roomRCUCfgEntityJsons;
            for(var s = 0, l = tmp.length;s < l;s += 1){
                str += tmp[s].num + '@' + tmp[s].name + ';';
            }
        }
        room.templateCfg = str;
        if(self.type === 'batchAdd'){
            service.batchSaveRoom(room).then(function (data) {
                alert('操作成功!');
                self.backListView();
            }).catch(function () {
                alert('修改失败!');
            });
            return;
        }
        service.updateRoom(room).then(function (data) {
            alert('操作成功!');
            self.backListView();
        }).catch(function () {
            alert('修改失败!');
        });
    };
    this.deleteRoom = function (room) {
        if(!confirm('确定删除?')){
            return;
        }
        service.deleteRoom(room).then(function (flag) {
            if(flag){
                for(var i = 0, len = self.roomList.length;i < len;i += 1){
                    if(self.roomList[i].id === room.id){
                        self.roomList.splice(i, 1);
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
    this.goRoom = function () {
        $location.path('/room/addRoom/' + Date.now());
    };
    //点击RCU模板设置中灯光、窗帘等项的加、减按钮
    this.addTemplate = function (type) {
        var list = self.rcuTemplate.rcuTemplate;
        for(var i = 0, len = list.length;i < len;i += 1){
            if(list[i].lineType === type){
                if(list[i].roomRCUCfgEntityJsons.length >= confLimitOb[type]){
                    //如果对应type的路数超过了最高限制路数，不再添加路数
                    return;
                }
                var tmp = {};
                tmp.id = '';
                tmp.num = list[i].roomRCUCfgEntityJsons.length + 1;
                tmp.name = '';
                list[i].roomRCUCfgEntityJsons.push(tmp);
                break;
            }
        }
    };
    this.removeTemplate = function (type) {
        var list = self.rcuTemplate.rcuTemplate;
        for(var i = 0, len = list.length;i < len;i += 1){
            if(list[i].lineType === type){
                if(list[i].roomRCUCfgEntityJsons.length <= 1){
                    //当对应的总路数为1时不能再删除
                    return;
                }
                list[i].roomRCUCfgEntityJsons.pop();
                break;
            }
        }
    };
    this.getRCUTemplate = function (roomType) {
        service.getRCUTemplate(roomType).then(function (data) {
            self.rcuTemplate = data;
        }).catch(function () {
            self.rcuTemplate = {};
        });
    };
    this.checkRoomNum = function (roomNum) {
        service.isRoomNumRepeat(roomNum).then(function (flag) {
            if(flag){
                self.isRoomNumNotRepeat = true;
            }
        }).catch(function () {
            self.isRoomNumNotRepeat = false;
        });
    };
    this.backListView = function () {
        window.history.back();
    };
    function initUploader(){
        var uploader = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: false,

            // swf文件路径
            swf: 'js/libs/Uploader.swf',

            // 文件接收服务端。
            server: 'api/hotelRoom/importData',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#importExcel',

            // 只允许选择图片文件。
            accept: {
                title: 'excel',
                extensions: 'xls',
                mimeTypes: 'application/vnd.ms-excel'
            }
        }),
        $mask = $('.mask-layer');
        uploader.on( 'uploadProgress', function( file, percentage ) {
            $mask.show();
        });
        uploader.on( 'uploadSuccess', function( file, response) {
            $mask.hide();
            uploader.cancelFile( file );
            if(response.status){
                alert('导入成功!');
                getRoomTypeList().then(function () {
                    self.getRoomList(cacheQueryObj);
                });
            }else{
                alert(response.msg);
            }
        });
        uploader.on( 'uploadError', function( file ) {
            alert('导入失败!');
            uploader.cancelFile( file );
            $mask.hide();
        });
        uploader.on( 'beforeFileQueued', function( file ) {
            if(!file.ext || file.ext !== 'xls'){
                uploader.cancelFile( file );
                alert('文件不合法请重新选择excel文件!');
                return false;
            }else{
                return true;
            }
        });
        uploader.on( 'fileQueued', function( file ) {
            uploader.upload();
        });
    }
    function getRoomTypeList(){
        return roomTypeService.fetchRoomTypeList().then(function (data) {
            self.roomTypeList = data.list;
            /*
             房间类型列表中的房间类型对象的extInfo字段存储着改类型
             房间对应灯光、空调、窗帘等等rcu模板路数的最大值，其格
             式为: Light:20,Air:2,Curtain:2,PWMLight:2,AdjustLight:2。
             此处是将其处理成{Light:20, Air:2, Curtain:2, ...}此种数
             据格式，方便其他函数调用处理
             */
            var extArr = self.roomTypeList[0].extInfo.split(','),
                list = self.roomTypeList;
            for(var i = 0, len = extArr.length;i < len;i += 1){
                var arr = extArr[i].split(':');
                confLimitOb[arr[0]] = parseInt(arr[1], 10);
            }
            for(var s = 0, l = list.length;s < l;s += 1){
                roomTypeMap[list[s].id] = list[s].name;
            }
        });
    }

    getRoomTypeList().then(function () {
        if(self.type === 'roomList'){
            cacheQueryObj = localStorage.getItem('room_condition');
            if(cacheQueryObj){
                cacheQueryObj = JSON.parse(cacheQueryObj);
            }
            cacheQueryObj = cacheQueryObj || {
                    pageNum: 1,
                    pageSize: 20
                };
            self.getRoomList(cacheQueryObj);
            initUploader();
        }else if(self.type === 'editRoom'){
            service.getRoomInfo(self.param).then(function (data) {
                self.curRoom = data.room;
                self.rcuTemplate = data.rcuTemplate;
            });
        }else{
            //添加以及批量添加房间
            self.curRoom = service.resetRoom();
            service.resetRCUTemplate().then(function (data) {
                self.rcuTemplate = data;
            });
        }
    });
}]);