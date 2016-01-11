/**
 * Created by Administrator on 2015/11/18.
 */
plMod.directive('provinceBar', function () {
    var template = '<div class="select-bar">' +
            '<select ng-model="province" ng-options="s.name for s in provinceList track by s.id" class="select-province"></select>' +
        '<select ng-model="city" ng-options="sh.name for sh in cityList track by sh.id" class="select-city"></select>' +
        '<select ng-model="area" ng-options="x.name for x in areaList track by x.id" class="select-area"></select>' +
        '</div>',
        list = addressMap.province;
    function getLocation(province, city){
        var rs = [];
        for(var i = 0, len = list.length;i < len;i += 1){
            if(list[i].id === province.id){
                rs = list[i].city;
                break;
            }
        }
        if(city){
            for(var s = 0, l = rs.length;s < l;s += 1){
                if(rs[s].id === city.id){
                    rs = rs[s].country;
                    break;
                }
            }
        }
        return rs;
    }
    function link(scope, ele, attr){
        scope.$watch('province', function (newVal, oldVal) {
            if(!newVal.id){
                return;
            }
            scope.cityList = getLocation(newVal);
            if(scope.city && scope.city.id){
                scope.areaList = getLocation(scope.province, scope.city);
            }else{
                scope.areaList = scope.cityList[0].country;
            }
        });
        scope.$watch('city', function (newVal, oldVal) {
            scope.areaList = getLocation(scope.province, newVal);

        });

        scope.provinceList = list;
        scope.province = list[0];

        scope.cityList = list[0].city;
        scope.city = scope.cityList[0];

        scope.areaList = scope.cityList[0].country;
        scope.area = scope.areaList[0];
    }

    return {
        restrict: 'E',
        template: template,
        replace: true,
        scope: {
            province: '=',
            city: '=',
            area: '='
        },
        link: link
    };
});