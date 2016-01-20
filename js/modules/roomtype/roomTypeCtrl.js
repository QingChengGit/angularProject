/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('roomTypeCtrl', ['roomTypeService', '$routeParams', 'dialogService', function (service, $routeParams, dialogService) {
    var self = this,
        queryConditionObj,
        cacheQueryObj,
        curPageSize = 10,
        roomTypeTemplate = '<form class="pl-form roomtype-form" novalidate>' +
            '<div class="form-item"><label class="form-key">类型名称:</label>' +
            '<input class="form-value room-type" type="text" value=""/>' +
            '</div>' +
            '</form>';
    self.isEdit = false;
    self.type = $routeParams.operateType;
    
    this.getRoomTypeList = function (paramObj) {
        service.fetchRoomTypeList(paramObj).then(function (data) {
            self.roomTypeList = data.list;
            self.pageNum = data.pages.pageNum;
            self.pageSize = data.pages.pageSize;
            self.totalPage = data.pages.pages;
            queryConditionObj = paramObj;
            localStorage.setItem('room_type_condition', JSON.stringify(queryConditionObj));
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.roomTypeList = [];
        });
    };
    this.checkRoomTypeOrderRepeat = function (orderNum) {
        var parentId = self.param;
        service.checkRoomTypeOrderRepeat(parentId, orderNum).then(function (flag) {
            self.isOrderNumRepeat = flag;
        });
    };
    this.saveRoomType = function () {
        var obj = $.extend({}, self.curRoomType),
            roomType = self.curRoomType;
        roomType.name = $('.room-type').val();
        if(!roomType.name || roomType.name.length > 10){
            alert('请填写类型名称,最多10个字!');
            return;
        }
        service.checkRoomTypeRepeat(roomType.name).then(function (flag) {
            if(!flag){
                alert('酒店中已经存在该房型,请修改!');
                roomType.name = obj.name;
            }else{
                service.updateRoomType(roomType).then(function (flag) {
                    alert('操作成功!');
                    if(!roomType.id){
                        self.getRoomTypeList({
                            pageNum: 1,
                            pageSize: 20
                        });
                    }
                }).catch(function () {
                    alert('操作失败!');
                    if(roomType.id){
                        roomType.name = obj.name;
                    }
                });
            }
        }).catch(function () {
            alert('服务出现问题请联系管理员');
        });
    };
    this.deleteRoomType = function (roomType) {
        if(!confirm('确定删除?')){
            return;
        }
        service.deleteRoomType(roomType).then(function (flag) {
            var list = self.roomTypeList;
            for(var i = 0, len = list.length;i < len;i += 1){
                if(list[i].id === roomType.id){
                    list.splice(i, 1);
                    break;
                }
            }
            alert('删除成功!');
        }).catch(function (msg) {
            alert(msg);
        });
    };
    this.goAddRoomType = function () {
        self.curRoomType = service.resetRoomType();
        dialogService.confirm({
            title: '添加房间类型',
            template: roomTypeTemplate,
            width: 480,
            okHandler: self.saveRoomType
        });
    };
    this.goEditRoomType = function (item) {
        self.curRoomType = item;
        dialogService.confirm({
            title: '修改房间类型',
            template: roomTypeTemplate,
            width: 480,
            okHandler: self.saveRoomType
        });
        $('.room-type').val(self.curRoomType.name);
    };

    cacheQueryObj = localStorage.getItem('room_type_condition');
    if(cacheQueryObj){
        cacheQueryObj = JSON.parse(cacheQueryObj);
    }
    cacheQueryObj = cacheQueryObj || {
            pageNum: 1,
            pageSize: 20
        };

    self.getRoomTypeList(cacheQueryObj);
}]);