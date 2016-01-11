/**
 * Created by Administrator on 2015/11/13.
 */
plMod.controller('telvisionCtrl', ['$routeParams', 'telvisionService', 'hotelService', function ($routeParams, service, hotelService) {
    var self = this,
        operateMap,
        curPageSize,
        prevEditMovie,
        prevEditGroup;
    self.uploader = null;
    self.uploaderSmall = null;
    self.type = $routeParams.operateType;
    if(self.type === 'movie'){
        self.pagingParam = {
            nameCn: ''
        };
    }

    function renderSelectedMovie(groupId){
        if(groupId !== self.curGroupId){
            /*
            当当前分组的id跟上一个分组的id不一样的时候，将所有电影置为全部未选中，
            然后根据当前分组下选中的电影去渲染被选中的电影
             */
            self.selectAllMovie(false);
            service.getMoviesByGroup(self.curGroupId).then(function (data) {
                var list = self.movieList;
                for(var i = 0, len = data.length;i < len; i += 1){
                    for(var m = 0, l = list.length;m < l;m += 1){
                        if(list[m].id == data[i]){
                            list[m].checked = true;
                            break;
                        }
                    }
                }
            });
        }
    }

    this.getMovieList = function (paramObj) {
        return service.fetchMovies(paramObj).then(function (data) {
            self.movieList = data.list;
            self.pageNum = data.pages.pageNum;
            self.totalPage = data.pages.pages;
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.movieList = [];
        });
    };
    this.getGroupMovies = function (item) {
        var prevGroupId = self.curGroupId;
        self.isEdit = true;
        self.curGroupId = item.id;
        if(!self.movieList || self.movieList.length === 0){
            self.getMovieList().then(function () {
                renderSelectedMovie(prevGroupId);
            });
        }else{
            renderSelectedMovie(prevGroupId);
        }
    };
    this.addMovie = function (isValid, movie) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        service.saveMovie(movie).then(function (data) {
            if(self.movieList.length === 0 || self.movieList.length < curPageSize) {
                $.extend(movie, data);
                self.movieList.unshift(movie);
            }else{
                self.getMovieList({
                    pageNum: 1,
                    pageSize: curPageSize
                });
            }
            alert('添加成功!');
            self.backListView();
            //还需要把文件上传上去
        }).catch(function (msg) {
            alert('添加失败!');
        });
    };
    this.updateMovie = function (isValid, movie) {
        self.isSubmit = true;
        if(!isValid){
            return;
        }
        service.updateMovie(movie).then(function (flag) {
            alert('修改成功!');
            self.backListView();
        }).then(function () {
            /*self.uploader.upload();
            self.uploaderSmall.upload();*/
        }).catch(function () {
            alert('修改失败!');
        });
    };
    this.deleteMovie = function (movieId) {
        if(!confirm('确定删除?')){
            return;
        }
        service.deleteMovie(movieId).then(function (flag) {
            if(flag){
                /*//批量删除时movieId以逗号分隔
                var arr = movieId.split(',');
                for(var i = 0, l = arr.length;i < l;i += 1){
                    for(var s = 0, len = self.movieList.length;s < len;s += 1){
                        if(self.movieList[s].id === arr[i]){
                            self.movieList.splice(s, 1);
                            break;
                        }
                    }
                }*/
                for(var s = 0, len = self.movieList.length;s < len;s += 1){
                    if(self.movieList[s].id === movieId){
                        self.movieList.splice(s, 1);
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
    this.getGroups  = function (paramObj) {
        service.fetchGroups(paramObj).then(function (data) {
            self.groupList = data.list;
            self.totalPage = data.pages.pages;
            curPageSize = paramObj.pageSize;
        }).catch(function () {
            self.groupList = [];
        });
    };
    this.addGroup = function (flag, group) {
        self.isSubmit = true;
        if(!flag){
            return;
        }
        group.groupType = (group.groupTypeAlis == 1);
        service.saveGroup(group).then(function (data) {
            if(self.groupList.length === 0 || self.groupList.length < curPageSize) {
                $.extend(group, data);
                self.groupList.unshift(group);
            }else{
                self.getGroups({
                    pageNum: 1,
                    pageSize: curPageSize
                });
            }
            alert('添加成功!');
            self.backListView();
        }).catch(function (msg) {
            alert('添加失败!');
        });
    };
    this.updateGroup = function (flag, group) {
        self.isSubmit = true;
        if(!flag){
            return;
        }
        group.groupType = (group.groupTypeAlis == 1);
        service.updateGroup(group).then(function (flag) {
            alert('修改成功!');
            self.backListView();
        }).catch(function (msg) {
            alert('修改失败!');
        });
    };
    this.deleteGroup = function (groupId) {
        if(!groupId){
            return;
        }
        service.deleteGroup(groupId).then(function (flag) {
            if(flag){
                for(var s = 0, len = self.groupList.length;s < len;s += 1){
                    if(self.groupList[s].id === groupId){
                        self.groupList.splice(s, 1);
                        break;
                    }
                }
                alert('删除成功!');
            }else{
                alert('删除失败!');
            }
        }).catch(function (msg) {
            alert('删除失败!');
        });
    };
    this.goAddGroup = function () {
        self.isEdit = true;
        self.isEditGroup = true;
        self.operateGroup = "add";
        self.curGroup = service.resetGroup();
    };
    this.goUpdateGroup = function (group) {
        self.isEdit = true;
        self.isEditGroup = true;
        self.operateGroup = "update";
        self.curGroup = group;
        prevEditGroup = $.extend({}, group);
    };
    this.getMovieListBySearch = function (content) {
        self.pagingParam.nameCn = content || '';
        self.getMovieList($.extend({
            pageNum: 1,
            pageSize: 20
        }, self.pagingParam));
    };
    this.save = function (isValid) {
        if(self.operate === 'add'){
            self.addMovie(isValid, self.movie);
        }else if(self.operate === 'update'){
            self.updateMovie(isValid, self.movie);
        }
    };
    this.addNewMovie = function () {
        self.isEdit = true;
        self.operate = 'add';
        self.movie = service.resetMovie();
    };
    this.editMovie = function (movie) {
        self.isEdit = true;
        self.operate = 'update';
        self.movie = movie;
        prevEditMovie = $.extend({}, movie);
    };
    this.backListView = function () {
        self.isEdit = false;
        self.isEditGroup = false;
        if(!self.isSubmit){
            $.extend(self.movie, prevEditMovie);
            $.extend(self.curGroup, prevEditGroup);
        }
        self.isSubmit = false;
        self.movie = null;
        self.curGroup = null;
    };
    //选则某个电影时检测是否所有电影被选中，然后更新全选按钮的状态
    this.checkAll = function () {
        var all = self.movieList,
            flag = true;
        for(var i = 0, len = all.length;i < len;i += 1){
            if(!all[i].checked){
                flag = false;
                break;
            }
        }
        self.isSelectAll = flag;
    };
    this.selectAllMovie = function (flag) {
        var all = self.movieList;
        for(var i = 0, len = all.length;i < len;i += 1){
            if(all[i].checked !== flag){
                all[i].checked = flag;
            }
        }
    };
    this.saveGroupMovie = function () {
        var movieId = [];
        var all = self.movieList;
        for(var i = 0, len = all.length;i < len;i += 1){
            if(all[i].checked){
                movieId.push(all[i].id);
            }
        }
        service.saveGroupMovie(self.curGroupId, movieId.join(',')).then(function (flag) {
            alert('添加电影成功!');
            self.backListView();
        }).catch(function () {
            alert('添加失败!');
        });
    };
    hotelService.fetchHotels({}).then(function (data) {
        self.hotelList = data.list;
    });
    operateMap = {
        movie: self.getMovieList,
        group: self.getGroups
    };
    operateMap[self.type]({
        pageNum: 1,
        pageSize: 20
    });
}]);