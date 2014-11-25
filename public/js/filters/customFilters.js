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
 