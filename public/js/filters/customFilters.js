/*
angular.module("customFilters", [])
    .filter("unit", function (recipeConfigSrv) {
        return function (unitSystem, unitType) {
            var arrUnitTable = recipeConfigSrv.unitTable();

            if (angular.isDefined(arrUnitTable[unitSystem][unitType])) {
                return arrUnitTable[unitSystem][unitType];
            }
            else {
                return "";
            }
        }
    });
*/

angular.module("customFilters", [])
    .filter("unit", function (unitSystemConfig) {
        return function (unitSystem, unitType) {
            if (!angular.isDefined(unitSystem) || !angular.isDefined(unitType))
            {
                return "?";
            }
            if (angular.isDefined(unitSystemConfig.contents[unitSystem][unitType])) {
                return unitSystemConfig.contents[unitSystem][unitType]
            }
            else {
                return "?";
            }
        }
    })
    .filter("formatTime", function () {
        return function (unix_timestamp) {
            if (unix_timestamp) {
                try{
                    var a = new Date(parseInt(unix_timestamp, 10)); //in ms
                    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    var year = a.getFullYear();
                    var month = months[a.getMonth()];
                    var date = a.getDate();
                    var hour = a.getHours();
                    var min = a.getMinutes();
                    var sec = a.getSeconds();
                    
                    return date + ',' + month + ' ' + year;
                }
                catch (e) {
                    return "";
                }
            }
            else {
                return unix_timestamp;
            }
        }
    });
/*
angular.module("customFilters", [])
    .filter("unit", function (unitSystemConfig) {
        return function (unitSystem, unitType) {
            var test = unitSystemConfig;
            if (angular.isDefined(unitSystemConfig.contents[unitSystem][unitType])) {
                //return unitSystemConfig.contents[unitSystem][unitType]
                return "";
            }
            else {
                return "";
            }
        }
    });
    */
 