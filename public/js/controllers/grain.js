angular.module("app")
    .controller("grainCtrl", function ($scope, $filter, billSrv, dataSrv, unitSystemConfig)
    {
        //get system grains
        $scope.grains = [];
        dataSrv.getGrains(function (grains) {
            $scope.grains = grains;
            $scope.grains = $filter('orderBy')($scope.grains, 'colour');
        });

        //holds grains added by user
        $scope.grainBill = billSrv.getGrainBill();

        $scope.systemBill = billSrv.getSystemBill();

        
        //fired when user adds grain using button
        $scope.addGrain = function (grain) {
            grain.weight = 0;
            $scope.grainBill.push(grain);
            billSrv.setGrainBill($scope.grainBill);
        }

        $scope.removeGrain = function (grain) {
            $scope.grainBill = removeFromGrainBill(grain);
            billSrv.setGrainBill($scope.grainBill);
        }

        $scope.isInList = function (grain) {
            var found = false;
            for(i=0;i<$scope.grainBill.length;i++){
                if (grain.id === $scope.grainBill[i].id) {
                    found = true;
                    break;
                }
            }
            return found;
        }


        function removeFromGrainBill(grain) {
            var updatedGrainBill = [];
            for (i = 0; i < $scope.grainBill.length; i++) {
                if (grain.id !== $scope.grainBill[i].id) {
                    updatedGrainBill.push($scope.grainBill[i]);
                }
            }
            return updatedGrainBill;
        }

        //Order drop down
        $scope.order = function (order) {
            if (order == 'colour') {
                $scope.grains = $filter('orderBy')($scope.grains, 'colour');
            } else {
                $scope.grains = $filter('orderBy')($scope.grains, 'name');
            }
        }

        /*
        //holds all grains from DB
        $scope.grains = null;
        dataSrv.getGrains(function (dataResponse) {
            $scope.grains = dataResponse;
        });

        //holds grains added by user
        $scope.grainBill = grainBillSrv.getGrainBill();

        //holds common values
        $scope.commonValues = commonBillSrv.getCommonValues();

        

        $scope.removeGrain = function (grain)
        {
            $scope.grainBill = grainBillSrv.removeFromGrainBill(grain);
        }

        $scope.getGrainWeights = function () {
            $scope.grainBill = grainBillSrv.getGrainWeights();
        }

        //hides grain add button if already in grain bill
        $scope.alreadyInGrainBill = function (id)
        {
            for(i=0;i<$scope.grainBill.length;i++)
            {
                if ($scope.grainBill[i].id == id) {
                    return false;
                }
            }
            return true;
        }
        */
        

    });