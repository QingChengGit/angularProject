/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('rcuService', ['postIntercept', '$q', function ($http, $q){
    function RCU(data){
        //用户对象
        this.id = data.id || '';
        //板卡类型
        this.boardType = data.boardType || '';
        this.port = data.port;
        //网络连接数
        this.connNum = data.connNum;
        //出厂编号
        this.factoryNum = data.factoryNum || '';
        this.version = data.version || '';
        this.osVersion = data.osVersion || '';
        //DI路数
        this.digitalInputNum = data.digitalInputNum || '';
        //AI路数
        this.analogInputNum = data.analogInputNum || '';
        //DO路数
        this.digitalOutputNum = data.digitalOutputNum || '';
        //PW路数
        this.powerNum = data.powerNum || '';
        //空调路数
        this.airConditionerNum = data.airConditionerNum || '';
        //调光路数
        this.dimmerNum = data.dimmerNum || '';
        //RCU到期时间
        this.timeLock = data.timeLock || '';
        //灯光模式配置
        this.lightMode = data.lightMode;
        /*//灯光模式配置的路数
        this.nums = data.nums || '';
        //灯光模式配置的灯光模式
        this.modeId = data.modeId || '';*/
        //给server传递的灯光模式配置。格式为:id@模式id@路数;id@模式id@路数;id@模式id@路数
        this.lightModeCfg = data.lightModeCfg || '';
    }
    function RCUTemplate(data){
        this.roomType = data.roomType || '';
        this.rcuTemplate = data.roomRCUCfgListAndTypeJsons || [];
        //传递给server的模板配置。格式为：lineType@num(路数)@name(名称)
        this.templateCfg = data.templateCfg || '';
    }

    this.fetRCU = function (paramObj) {
        var url = 'api/rcu/query',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                res.data.hotelRCUCfgEntityJson.lightMode = res.data.airModeEntityJsons;
                return $q.when(new RCU(res.data.hotelRCUCfgEntityJson));
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateRCU = function (rcu) {
        var url = 'api/rcu/save';
        return $http.post(url, rcu).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.fetchTemplate = function (roomType) {
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
    this.setTemplate = function (template) {
        var url = 'api/roomrcu/save';
        return $http.post(url, template).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.applyTemplate = function (roomType) {
        if(!roomType){
            return $q.when(false);
        }
        var url = 'api/roomrcu/apply2room';
        return $http.post(url, {
            roomType: roomType
        }).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.resetUser = function () {
        return new RCU({});
    };
}]);