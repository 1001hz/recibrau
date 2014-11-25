angular.module("app")
    .controller("systemCtrl", function ($scope, recipeListSrv, unitSystemConfig, brewMethodConfig, beerStylesConfig, mashRestConfig, accountSrv, billSrv)
    {
        
        $scope.systemBill = billSrv.getSystemBill();

        $scope.percentABV = ((1.05 * ($scope.systemBill.originalGravity - $scope.systemBill.finalGravity)) / $scope.systemBill.finalGravity) / 0.79 * 100;

        //Set up DDLs
        //Unit system
        $scope.unitSystemOptions = [];
        for (var i in unitSystemConfig.contents) {
            $scope.unitSystemOptions.push(i);
        }

        //Styles
        $scope.beerStyles = beerStylesConfig;

        //Brew method
        $scope.brewMethodOptions = brewMethodConfig;

        //If there's a recipe in the bill then load it
        if (angular.isDefined($scope.systemBill)) {

            //Set unit system
            for (i = 0; i < $scope.unitSystemOptions.length; i++) {
                if ($scope.unitSystemOptions[i] === $scope.systemBill.unitSystem) {
                    $scope.systemBill.unitSystem = $scope.unitSystemOptions[i];
                }
            }

            //Set brew method
            $scope.systemBill.method = $scope.systemBill.method
        }



        //watch systemBill
        $scope.$watchCollection(
        "systemBill",
        function (newValue, oldValue) {
            billSrv.setSystemBill($scope.systemBill);
            $scope.percentABV = calcABV($scope.systemBill.originalGravity, $scope.systemBill.finalGravity)
        });

        $scope.$watch(
        "systemBill.method",
        function (newValue, oldValue) {
            if (newValue == "Extract") {
                $scope.systemBill.mashSteps = [];
            }
        });


        $scope.addMashStep = function () {
            if (!angular.isDefined($scope.systemBill.mashSteps)) {
                $scope.systemBill.mashSteps = [];
            }
            $scope.systemBill.mashSteps.push({ temperature: null, length: null });
        }

        $scope.removeMashStep = function (index) {
            $scope.systemBill.mashSteps.splice(index, 1);
        }

        $scope.getRestName = function (temp) {
            for (i = 0; i < mashRestConfig.length; i++) {
                if ($scope.systemBill.unitSystem == "Metric") {
                    if (temp > mashRestConfig[i].metric.low && temp < mashRestConfig[i].metric.high)
                    return mashRestConfig[i].name;
                }
                
            } 
        }

        function calcABV(originalGravity, finalGravity) {
            return ((1.05 * (originalGravity - finalGravity)) / finalGravity) / 0.79 * 100;
        }




        $scope.closeNotice = function () {
            $scope.warning = false;
            $scope.error = false;
            $scope.success = false;
            $scope.message = "";
        }

    });