/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('rcuCtrl', ['$routeParams', 'rcuService', 'commService', 'roomTypeService',
    function ($routeParams, service, commService, roomTypeService) {
    var self = this,
        confLimitOb = {};
    self.isEdit = false;
    self.type = $routeParams.operateType;
    self.lineTypeMap = {
        Light: '灯光',
        Air: '空调',
        Curtain: '窗帘',
        PWMLight: 'PWM调光',
        AdjustLight: '可调光'
    };

    this.getRCUConfig = function () {
        service.fetRCU().then(function (data) {
            self.rcuConf = data;
            if(self.rcuConf.lightMode.length === 0){
                self.rcuConf.lightMode.push({id:'', nums:'', modeId:''});
            }
        }).catch(function () {
            self.rcuConf = {};
        });
    };
    this.updateRCU = function (isValid, rcu) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        var str = '';
        for(var i = 0, len = rcu.lightMode.length;i < len;i += 1){
            str += rcu.lightMode[i].id + '@' + rcu.lightMode[i].modeId +
                '@' + rcu.lightMode[i].nums + ';';
        }
        rcu.lightModeCfg = str;
        service.updateRCU(rcu).then(function (flag) {
            alert('操作成功!');
        }).catch(function () {
            alert('操作失败!');
        });
    };
    this.getRCUTemplate = function (roomType) {
        //roomType = '300';
        service.fetchTemplate(roomType).then(function (data) {
            self.rcuTemplate = data;
        }).catch(function () {
            self.rcuTemplate = {};
        });
    };
    this.setTemplate = function (template) {
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
        delete cloneObj.rcuTemplate;
        cloneObj.templateCfg = str;
        service.setTemplate(cloneObj).then(function (flag) {
            if(flag){
                alert('设置成功!');
            }else{
                alert('设置失败!');
            }
        }).catch(function () {
            alert('设置失败!');
        });
    };
    this.applyTemplate = function (roomType) {
        service.applyTemplate(roomType).then(function (flag) {
            if(flag){
                alert('应用模板成功!');
            }
        }).catch(function (msg) {
            alert(msg);
        });
    };
    this.addLightMode = function () {
        var tmp = {},
            l = self.rcuConf.lightMode.length;
        $.extend(tmp, self.rcuConf.lightMode[l-1]);
        tmp.$$hashKey = tmp.$$hashKey + '01';
        tmp.id = '';
        tmp.nums = '';
        tmp.modeId = '';
        self.rcuConf.lightMode.push(tmp);
    };
    this.removeLightMode = function (item) {
        var list = self.rcuConf.lightMode;
        for(var i = 0, len = list.length;i < len;i += 1){
            if(list[i].id == item.id){
                self.rcuConf.lightMode.splice(i, 1);
                break;
            }
        }
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
    this.backListView = function () {
        self.isEdit = false;
        self.isSubmit = false;
        self.type = 'setRCU';
    };



    if(self.type === 'setTemplate'){
        //获取房间类型下拉列表数据
        roomTypeService.fetchRoomTypeList().then(function (data) {
            self.roomTypeList = data.list;
            /*
                房间类型列表中的房间类型对象的extInfo字段存储着改类型
                房间对应灯光、空调、窗帘等等rcu模板路数的最大值，其格
                式为: Light:20,Air:2,Curtain:2,PWMLight:2,AdjustLight:2。
                此处是将其处理成{Light:20, Air:2, Curtain:2, ...}此种数
                据格式，方便其他函数调用处理
             */
            var extArr = self.roomTypeList[0].extInfo.split(',');
            for(var i = 0,len = extArr.length;i < len;i += 1){
                var arr = extArr[i].split(':');
                confLimitOb[arr[0]] = parseInt(arr[1], 10);
            }
            self.getRCUTemplate(self.roomTypeList[0].name);
        });
    }else if(self.type === 'setRCU'){
        self.getRCUConfig ();
        //获取RCU板卡类型下拉列表数据
        commService.getSelectData('RcuBoardType').then(function (data) {
            self.boardTypeList = data;
        });
        commService.getSelectData('AirConfigMode').then(function (data) {
            self.lightModeList = data;
        });
    }
}]);