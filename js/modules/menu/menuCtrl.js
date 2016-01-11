/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('menuCtrl', ['menuService', '$routeParams', '$location', function (service, $routeParams, $location) {
    var self = this,
        curPageSize = 10;
    self.isEdit = false;
    self.type = $routeParams.operateType;
    self.param = $routeParams.param;
    //默认查询超级管理员菜单
    self.userType = "-100";
    self.pagingParam = {
        //默认查询super角色的菜单
        parentId: parseInt(self.param) || -100
    };
    
    this.getMenuList = function (paramObj) {
        service.fetchMenuList(paramObj).then(function (data) {
            self.menuList = data.list;
            self.totalPage = data.pages.pages;
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.menuList = [];
        });
    };
    this.checkMenuOrderRepeat = function (orderNum) {
        var parentId = self.param;
        service.checkMenuOrderRepeat(parentId, orderNum).then(function (flag) {
            self.isOrderNumRepeat = flag;
        });
    };
    this.saveMenu = function (isValid, menu) {
        self.isSubmit = true;
        if(!isValid || self.isOrderNumRepeat){
            return;
        }
        service.updateMenu(menu).then(function (flag) {
            alert('操作成功!');
            self.backListView();
        }).catch(function () {
            alert('操作失败!');
        });
    };
    this.deleteMenu = function (menu) {
        service.deleteMenu(menu).then(function (flag) {
            if(flag){
                var list = self.menuList;
                for(var i = 0, len = list.length;i < len;i += 1){
                    if(list[i].id === menu.id){
                        list.splice(i, 1);
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
    this.changeMenuList = function (type) {
        self.pagingParam.parentId = type;
        self.getMenuList({
            pageNum: 1,
            pageSize: curPageSize,
            parentId: self.pagingParam.parentId
        });
    };
    this.goAddMenu = function () {
        $location.path('/menu/add/'+ self.pagingParam.parentId);
    };
    this.backListView = function () {
        window.history.back();
    };

    if(self.type === 'list'){
        self.getMenuList({
            pageNum: 1,
            pageSize: 20,
            parentId: self.pagingParam.parentId
        });
    }else if(self.type === 'modify'){
        service.getMenuById(self.param).then(function (data) {
            self.curMenu = data;
        });
    }else{
        self.curMenu = service.resetMenu();
        self.curMenu.parentId = self.pagingParam.parentId;
    }
}]);