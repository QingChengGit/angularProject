/**
 * Created by Administrator on 2015/11/13.
 */
plMod.service('telvisionService', ['postIntercept', '$q', function ($http, $q){
    function Movie(data){
        this.id = data.id || '';
        this.nameCn = data.nameCn || '';
        this.nameEn = data.nameEn || '';
        this.hotelId = data.hotelId || '';
        this.checked = data.checked;
        //类别
        this.firstClass = data.firstClass || '电影';
        //类型
        this.secondClass = data.secondClass || '';
        this.path = data.path || '';
        this.backImg = data.backImg || '';
        this.backImgSmall = data.backImgSmall || '';
        this.showYear = data.showYear || '';
        this.area = data.area || '';
        this.intro = data.intro || '';
        this.setNum = data.setNum || '';
        this.direct = data.direct || '';
        this.movieLan = data.movieLan || '';
        this.timeLength = data.timeLength || '';
    }
    function Group(data){
        this.id = data.id || '';
        this.groupName = data.groupName || '';
        //groupType false表示通用组,true是自定义组
        this.groupType = data.groupType || false;
        this.groupTypeAlis = this.groupType ? "1" : "0";
        this.hotelId = data.hotelId || '';
    }

    this.fetchMovies = function (paramObj) {
        var url = 'api/movie/loadPagesMovie',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var movies = $.map(res.data.list, function (movie) {
                    return new Movie(movie);
                });
                res.data.list = movies;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.saveMovie = function (movie) {
        var url = 'api/movie/saveMovie';
        return $http.post(url, movie).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateMovie = function (movie) {
        var url = 'api/movie/updateMovie';
        return $http.post(url, movie).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.deleteMovie = function (movieId) {
        if(!movieId){
            return;
        }
        var url = 'api/movie/deleteMovie',
            data = {
                id: movieId
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
    this.fetchGroups = function (paramObj) {
        var url = 'api/movieGroup/loadPages',
            data = paramObj || null;
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var groups = $.map(res.data.list, function (group) {
                    return new Group(group);
                });
                res.data.list = groups;
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.saveGroup = function (group) {
        var url = 'api/movieGroup/save';
        return $http.post(url, group).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.updateGroup = function (group) {
        var url = 'api/movieGroup/update';
        return $http.post(url, group).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(true);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.deleteGroup = function (groupId) {
        if(!groupId){
            return;
        }
        var url = 'api/movieGroup/delete',
            data = {
                id: groupId
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
    this.saveGroupMovie = function (groupId, movieId) {
        var url = 'api/movieMG/saveMGList',
            data = {
                groupId: groupId,
                movieId: movieId
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
    this.getMoviesByGroup = function (groupId) {
        var url = 'api/movieMG/getGroupId',
            data = {
                groupId: groupId
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                return $q.when(res.data.movieId);
            }else{
                return $q.reject(res.msg);
            }
        });
    };
    this.getGroupByType = function (typeId) {
        //获取通用组或者自定义组类下的分组
        var url = 'api/movieGroup/queryByGroupType',
            data = {
                id: typeId
            };
        return $http.post(url, data).then(function (res) {
            res = res.data;
            if(res.status){
                var groups = $.map(res.data, function (group) {
                    return new Group(group);
                });
                return $q.when(groups);
            }else{
                return $q.reject(null);
            }
        });
    };
    this.resetMovie = function () {
        return new Movie({});
    };
    this.resetGroup = function () {
        return new Group({});
    };
}]);