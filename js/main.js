/**
 * Created by Administrator on 2015/11/13.
 */
var plMod = angular.module('app', ['ngRoute']);

plMod.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    /*$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });*/
    function param(obj) {
        var query = '';
        var name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        if (value.hasOwnProperty(subName)) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) +
                        '=' + encodeURIComponent(value) + '&';
                }
            }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    }

    $httpProvider.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function (data) {
        return param(data);
    }];
    $routeProvider.when('/index', {
        templateUrl: 'templates/welcome.html'
    }).when('/hotel/:operateType/:param', {
        templateUrl: 'templates/hotel.html',
        controller: 'hotelCtrl',
        controllerAs: 'hotel'
    }).when('/user/:operateType', {
        templateUrl: 'templates/user.html',
        controller: 'userCtrl',
        controllerAs: 'user'
    }).when('/telvision/:operateType', {
        templateUrl: function ($routeParams){
            var basePath = 'templates/',
                path;
            if($routeParams.operateType === 'movie'){
                path = 'telvision.html';
            }else if($routeParams.operateType === 'group'){
                path = 'telvGroup.html';
            }
            return basePath + path;
        },
        controller: 'telvisionCtrl',
        controllerAs: 'telv'
    }).when('/room/:operateType/:param', {
        templateUrl: 'templates/room.html',
        controller: 'roomCtrl',
        controllerAs: 'room'
    }).when('/rcu/:operateType', {
        templateUrl: 'templates/rcu.html',
        controller: 'rcuCtrl',
        controllerAs: 'rcu'
    }).when('/sys/:operateType', {
        templateUrl: function ($routeParams){
            var basePath = 'templates/',
                path;
            if($routeParams.operateType === 'dict'){
                path = 'sysmanager.html';
            }else if($routeParams.operateType === 'install'){
                path = 'hotelInstall.html';
            }
            return basePath + path;
        },
        controller: 'sysmanageCtrl',
        controllerAs: 'sys'
    }).when('/ms', {
        templateUrl: 'templates/managerSys.html',
        controller: 'managesysCtrl',
        controllerAs: 'ms'
    }).when('/tv/:operateType/:parentId', {
        templateUrl: function ($routeParams){
            var basePath = 'templates/',
                path;
            if($routeParams.operateType){
                path = 'tvChannel' + $routeParams.operateType +'.html';
            }
            return basePath + path;
        },
        controller: 'tvCtrl',
        controllerAs: 'tv'
    }).when('/tv', {
        templateUrl: 'templates/tvConfig.html',
        controller: 'tvCtrl',
        controllerAs: 'tv'
    }).when('/publish', {
        templateUrl: 'templates/publish.html',
        controller: 'publishCtrl',
        controllerAs: 'pub'
    }).when('/menu/:operateType/:param', {
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl',
        controllerAs: 'menu'
    }).when('/monitor/:operateType/:param', {
        templateUrl: 'templates/monitor.html',
        controller: 'monitorCtrl',
        controllerAs: 'moni'
    }).when('/roomType/:operateType', {
        templateUrl: 'templates/roomType.html',
        controller: 'roomTypeCtrl',
        controllerAs: 'roomType'
    }).when('/static/:operateType', {
        templateUrl: function ($routeParams){
            var basePath = 'templates/',
                path;
            if($routeParams.operateType){
                path = $routeParams.operateType +'Query.html';
            }
            return basePath + path;
        },
        controller: 'staticCtrl',
        controllerAs: 'static'
    }).otherwise({
        templateUrl: 'templates/welcome.html'
    });
}]);

