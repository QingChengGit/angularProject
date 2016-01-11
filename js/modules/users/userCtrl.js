/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('userCtrl', ['$routeParams', 'userService', 'telvisionService', 'commService', function ($routeParams, service, telvService, commService) {
    var self = this,
        curPageSize,
        curEditUser,
        goodsList,
        userTypeMap = {
            HOTEL: '酒店管理',
            ADMIN: '云管理'
        };
    self.isEdit = false;
    self.type = $routeParams.operateType;

    this.getUserList = function (paramObj) {
        service.fetchUsers(paramObj).then(function (data) {
            var list = data.list;
            for(var i = 0;i < list.length;i += 1){
                list[i].userTypeCn = userTypeMap[list[i].userType];
            }
            self.userList = list;
            self.totalPage = data.pages.pages;
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.userList = [];
        });
    };
    this.updateUser = function (isValid, user) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        var strArr = [],
            prevBrandId;
        //因为user对象中的地区的省、市、地区为object所以此处需要转换下
        user.province = self.province.id;
        user.city = self.city.id;
        user.country = self.area.id;
        prevBrandId = user.brandId;
        for(var i = 0,l = user.brandId.length;i < l;i += 1){
            strArr.push(user.brandId[i].id);
        }
        user.brandId = strArr.join(',');
        if(self.type === 'addUser'){
            service.saveUser(user).then(function (data) {
                if(self.userList.length === 0 || self.userList.length < curPageSize) {
                    data.brandId = prevBrandId;
                    data.userTypeCn = userTypeMap[data.userType];
                    self.userList.unshift(data);
                }else{
                    self.getUserList({
                        pageNum: 1,
                        pageSize: curPageSize
                    });
                }
                alert('添加成功!');
                self.backListView();
            }).catch(function (msg) {
                user.brandId = prevBrandId;
                alert(msg);
            });
        }else{
            service.updateUser(user).then(function (flag) {
                alert('修改成功!');
                /*
                    因为user跟当前被修改的用户对象不是同一个对象了，
                    所以不会触发双向绑定
                 */
                $.extend(curEditUser, user);
                curEditUser.brandId = prevBrandId;
                self.backListView();
            }).catch(function () {
                user.brandId = prevBrandId;
                alert('修改失败!');
            });
        }
    };
    this.deleteUser = function (user) {
        service.deleteUser(user).then(function (flag) {
            if(flag){
                for(var s = 0, len = self.userList.length;s < len;s += 1){
                    if(self.userList[s].id === user.id){
                        self.userList.splice(s, 1);
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
    this.getUserListBySearch = function (hotelName) {
        var hotels,
            hotel_name_reg = new RegExp(hotelName, 'gi');
        if(!hotelName){
            return;
        }
        hotels = self.userList;
        for(var i = 0,len = hotels.length;i < len;i += 1){
            if(!hotel_name_reg.test(hotels[i].name)){
                self.userList.splice(i, 1);
            }
        }
    };
    this.editUser = function (user) {
        self.isEdit = true;
        curEditUser = user;
        self.userInfo = service.resetUser();
        //去获取用户的个人信息以及他所拥有的酒店信息
        service.fetchUserInfo(user.id).then(function (data) {
            var brands,
                rs = [],
                tmp;
            self.userInfo = data;
            self.province = {id: self.userInfo.province};
            self.city = {id: self.userInfo.city};
            self.area = {id: self.userInfo.country};
            brands = self.userInfo.brandId.split(',');
            for(var i = 0,l = brands.length;i < l;i += 1){
                if(brands[i]){
                    tmp = {};
                    tmp.id = brands[i];
                    rs.push(tmp);
                }
            }
            self.userInfo.brandId = rs;
        }).then(function () {
            if(!goodsList || goodsList.length) {
                commService.getSelectData('HotelBrand').then(function (data) {
                    //商品品牌
                    goodsList = data;
                    self.goodsList = goodsList.concat([]);
                    var rsData = self.goodsList,
                        sData = self.userInfo.brandId;
                    for(var s = 0, m = sData.length;s < m;s += 1){
                        for(var p = 0;p < rsData.length;p += 1){
                            if(rsData[p].id == sData[s].id){
                                sData[s].nameCn = rsData[p].nameCn;
                                rsData.splice(p, 1);
                                break;
                            }
                        }
                    }
                });
            }else{
                self.goodsList = goodsList.concat([]);
                var rsData = self.goodsList,
                    sData = self.userInfo.brandId;
                for(var s = 0, m = sData.length;s < m;s += 1){
                    for(var p = 0;p < rsData.length;p += 1){
                        if(rsData[p].id == sData[s].id){
                            sData[s].nameCn = rsData[p].nameCn;
                            rsData.splice(p, 1);
                            break;
                        }
                    }
                }
            }
        });
    };
    this.backListView = function () {
        self.isEdit = false;
        self.type = 'userList';
        self.isSubmit = false;
    };

    if(self.type === 'addUser'){
        self.userInfo = service.resetUser();
        self.province = {id: self.userInfo.province};
        self.city = {id: self.userInfo.city};
        self.area = {id: self.userInfo.country};
        commService.getSelectData('HotelBrand').then(function (data) {
            //商品品牌
            self.goodsList = data;
        });
        self.userInfo.brandId = [];
    }
    commService.getSelectData('HotelPinPai').then(function (data) {
        //酒店品牌
        self.brandList = data;
    });

    telvService.getGroupByType('0').then(function (data) {
        //获取通用组类别下的分组
        self.commGroupList = data;
    });
    self.getUserList({
        pageNum: 1,
        pageSize: 20
    });

}]);