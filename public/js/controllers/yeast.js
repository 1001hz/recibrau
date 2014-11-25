angular.module("app")
    .controller("yeastCtrl", function ($scope, $filter, billSrv, dataSrv, recipeListSrv) {
        
        $scope.allYeast = recipeListSrv.getAllYeast();

        $scope.systemBill = billSrv.getSystemBill();
        $scope.yeastBill = billSrv.getYeastBill();
        /*
        $scope.labSelected = function (lab) {
            $scope.yeastBill.lab = lab;
        }

        $scope.nameSelected = function (name) {
            $scope.yeastBill.name = name;
        }
        $scope.strainSelected = function (strain) {
            $scope.yeastBill.strain = strain;
            for (i = 0; i < $scope.allYeast.length; i++) {
                if ($scope.allYeast[i].strain === strain) {
                    $scope.yeastBill.tempLow = $scope.allYeast[i].strain.tempLow;
                }
            }
        }
        */
        /*
        dataSrv.getYeast(function (hops) {
            $scope.hops = hops;
            $scope.hops = $filter('orderBy')($scope.hops, 'alpha');
        });

        //holds grains added by user
        $scope.hopBill = billSrv.getHopBill();

        $scope.systemBill = billSrv.getSystemBill();


        //fired when user adds grain using button
        $scope.addHop = function (hop) {
            hop.weight = 0;
            $scope.hopBill.push(hop);
            billSrv.setHopBill($scope.hopBill);
        }

        $scope.removeHop = function (hop) {
            $scope.hopBill = removeFromHopBill(hop);
            billSrv.setHopBill($scope.hopBill);
        }

        $scope.isInList = function (hop) {
            var found = false;
            for (i = 0; i < $scope.hopBill.length; i++) {
                if (hop.id === $scope.hopBill[i].id) {
                    found = true;
                    break;
                }
            }
            return found;
        }


        function removeFromHopBill(hop) {
            var updatedHopBill = [];
            for (i = 0; i < $scope.hopBill.length; i++) {
                if (hop.id !== $scope.hopBill[i].id) {
                    updatedHopBill.push($scope.hopBill[i]);
                }
            }
            return updatedHopBill;
        }

        //Order drop down
        $scope.order = function (order) {
            if (order == 'alpha') {
                $scope.hops = $filter('orderBy')($scope.hops, 'alpha');
            } else {
                $scope.hops = $filter('orderBy')($scope.hops, 'name');
            }
        }
        */
})