angular.module("app")
    .controller("primerCtrl", function ($scope, $filter, billSrv, dataSrv) {

        //$scope.hopBill = billSrv.getHopBill();
        $scope.systemBill = billSrv.getSystemBill();
        $scope.primer = [];

        /*
        dataSrv.getYeast(function (hops) {
            $scope.hops = hops;
            $scope.hops = $filter('orderBy')($scope.hops, 'alpha');
        });

        //holds grains added by user
        $scope.hopBill = billSrv.getHopBill();

        


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