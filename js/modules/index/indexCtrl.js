/**
 * Created by Administrator on 2015/11/17.
 */
plMod.controller('indexCtrl', ['indexService', function (service) {
    var self = this,
        menuList;
    self.curYear = new Date().getFullYear();
    self.isSuper = getCookie('userType') == 'ADMIN';
    self.isHigherSuper = getCookie('userType') == 'SUPER';
    self.isHotel = getCookie('userType') == 'HOTEL';
    self.isHotelAdmin = getCookie('userType') == 'HOTELADMIN';
    self.curUserName = getCookie('userName');

    //删除cookie
    function delCookie(name, path) {
        var date = new Date();
        path = path ? path : "/";
        date.setTime(date.getTime() - 1000);
        document.cookie= name + "=;expires=" + date.toGMTString() + ";path=" + path;
    }
    //取得cookie
    function getCookie(name){
        var str=document.cookie.split(";");
        for(var i=0;i<str.length;i++){
            var str2=str[i].split("=");
            if($.trim(str2[0])==name){
                return unescape(str2[1]);
            }
        }
    }
    this.getMenuList = function () {
        service.fetchMenuList().then(function (data) {
            var rs = [];
            menuList = data;
            //admin和普通用户的菜单不同,此处再过滤下子菜单吧，只返回父级菜单
            for(var i = 0,len = menuList.length;i < len;i += 1){
                if(menuList[i].parentId < 0){
                    rs.push(menuList[i]);
                }
            }
            self.menus = rs;
        });
    };
    this.getChildMenuList = function (menu) {
        if(!menu || !menu.id){
            return [];
        }
        var parentId = menu.id,
            rs = [];
        for(var i = 0,len = menuList.length;i < len;i += 1){
            if(menuList[i].parentId === parentId){
                rs.push(menuList[i]);
            }
        }
        return rs;
    };
    this.publish = function () {
        service.publish().then(function (data) {
            self.curVersion = data.version || '';
            alert('发布成功!');
        }).catch(function () {
            alert('发布失败!');
        });
    };
    this.getCurVersion = function () {
        service.getCurVersion().then(function (data) {
            self.curVersion = data.version || '';
        });
    };
    this.loginOut = function () {
        service.loginOut().then(function (flag) {
            delCookie('VALIDATE-TOKEN');
            delCookie('userName');
            delCookie('userType');
            window.location.href = 'login.html';
        }).catch(function () {
            alert('服务器出现点小问题，请联系相关人员~');
        });
    };

    self.getMenuList();
    self.getCurVersion();
}]);