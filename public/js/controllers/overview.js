angular.module("app")
    .controller("overviewCtrl", function ($rootScope, $scope, $location, $routeParams, recipeListSrv, accountSrv, billSrv, recipeSavedSrv, recipeDeletedSrv)
    {
        // get logged in user
        $scope.user = accountSrv.getUser();

        //$scope.recipeModified = billSrv.isModified();

        $scope.currentRecipe = {};
        $scope.id = $routeParams.id;
        if ($scope.id) {
            if ($scope.id == "new") {
                billSrv.clearBill();
                $scope.currentRecipe = billSrv.getBill();
            }
            else {
                var user = accountSrv.getUser();

                if (user.loggedIn) {
                    //get recipe from DB
                    recipeListSrv.getRecipe(user, $scope.id, function (recipe) {
                        $scope.currentRecipe = recipe;
                    });

                    //load into bill service
                    billSrv.setBill($scope.currentRecipe);
                }
                else {
                    //Warning: user needs to be logged in
                    $scope.warning = true;
                    $scope.message = "You need to be logged in to view this recipe";
                }
            }
        }
        else {
            $scope.currentRecipe = billSrv.getBill();
        }


        $scope.saveRecipe = function () {
            $scope.saveInProgress = true;
            var recipeData = billSrv.getBill();
            var recipeName = recipeData.name;
            recipeListSrv.saveRecipe(recipeData, recipeName, $scope.user, function (errors, recipe) {
                if (errors) {
                    $scope.warning = true;
                    $scope.message = errors;
                }
                else {
                    // save recipe to bill
                    billSrv.setBill(recipe);
                    $scope.success = true;
                    $scope.message = "Your recipe has been saved.";
                    console.log(recipe);
                    //$rootScope.$broadcast('recipeSaved');
                    recipeSavedSrv.broadcast();
                }
                $scope.saveInProgress = false;
            }); 
        }


        $scope.deleteRecipe = function () {
            $scope.deleteInProgress = true;
            var recipeData = billSrv.getBill();
            var recipeName = recipeData.name;
            recipeListSrv.deleteRecipe(recipeData._id, $scope.user, function (errors, recipe) {
                if (errors) {
                    $scope.warning = true;
                    $scope.message = errors;
                }
                else {
                    billSrv.clearBill();
                    $scope.success = true;
                    $scope.message = "Your recipe has been deleted.";
                    recipeDeletedSrv.broadcast();
                    $scope.currentRecipe = {};
                    //redirect to overview page
                    $location.path("/home");
                }
                $scope.deleteInProgress = false;
            });
        }


        $scope.closeNotice = function () {
            $scope.warning = false;
            $scope.error = false;
            $scope.success = false;
            $scope.message = "";
        }


        /*
        $scope.success = null;
        $scope.warning = null;
        $scope.error = null;
        $scope.message = "";

        $scope.closeNotice = function () {
            $scope.success = null;
            $scope.warning = null;
            $scope.error = null;
            $scope.message = "";
        }

        $scope.recipeName = commonBillSrv.getCommonValues().name;

        $scope.unitSystem = unitSystem;

        $scope.commonValues = commonBillSrv.getCommonValues();

        $scope.grains = grainBillSrv.getGrainBill();
        $scope.hops = hopBillSrv.getHopBill();

        //watch for commonValues change
        $rootScope.$on('event:data-change', function () {
            $scope.commonValues = commonBillSrv.getCommonValues();
            $scope.recipeName = commonBillSrv.getCommonValues().name;
        });

        $scope.saveRecipe = function () {
            //var grainBill = $scope.grains;
            var recipeName = $scope.recipeName;
            $scope.recipeName = commonBillSrv.setName(recipeName);

            var recipeData = {commonValues: $scope.commonValues, grains: $scope.grains, hops: $scope.hops};

            dataSrv.saveRecipe(recipeName, recipeData, function (success, resultMessage, resultCode, id) {
                
                if (resultCode == 0) {
                    $scope.commonValues.id = id;
                    commonBillSrv.setCommonValues($scope.commonValues);
                    $scope.success = true;
                    $scope.message = "Your recipe has been saved.";
                }
                if (resultCode == 201) {
                    //Token has expired
                    $scope.warning = true;
                    $scope.message = "Your changes can't be saved as your session has expired. Log in and retry.";
                    accountSrv.logout();
                }
                if (resultCode == 202) {
                    //Token invalid
                    $scope.error = true;
                    $scope.message = "Your login is invalid. Please log in again.";
                    accountSrv.logout();
                }

            });
        }

        */

    });