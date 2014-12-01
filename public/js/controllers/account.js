angular.module("app")
    .controller("accountCtrl", function ($rootScope, $scope, $location, accountSrv, recipeListSrv, recipeSavedSrv, recipeDeletedSrv)
    {
        //checkbox in login panel
        $scope.login = {
            keepMeLoggedIn: false,
            showError: false,
            loginError:""
        };

        $scope.user = accountSrv.getUser();

        $scope.recpeList = {};

        //On Load
        //Check if we have loggedin cookie, if so log in
        usernameTokenPair = getCookie("usernameTokenPair");
        if (usernameTokenPair !== "")
        {
            loginWithToken(usernameTokenPair);
        }

        /*
        $rootScope.$on('recipeSaved', function () {
            // update recipe list
            recipeListSrv.syncRecipes($scope.user, function (errors, recipes) {
                $scope.recpeList = recipes;
            });
        });
        */
        recipeSavedSrv.listen(function () {
            recipeListSrv.syncRecipes($scope.user, function (errors, recipes) {
                $scope.recpeList = recipes;
            });
        });

        recipeDeletedSrv.listen(function () {
            recipeListSrv.syncRecipes($scope.user, function (errors, recipes) {
                $scope.recpeList = recipes;
            });
        });

        /*
        $rootScope.$on('recipeDeleted', function () {
            // update recipe list
            recipeListSrv.syncRecipes($scope.user, function (errors, recipes) {
                $scope.recpeList = recipes;
            });
        });
        */

        function loginWithToken(usernameTokenPair) {
            var parts = usernameTokenPair.split('|');
            var username = parts[0];
            var token = parts[1];

            accountSrv.loginWithToken(username, token, function (errors, objUser) {
                if (!errors) {
                    $scope.user = objUser;
                    //load recipes into recipes service
                    recipeListSrv.syncRecipes(objUser, function (errors, recipes) {
                        $scope.recpeList = recipes;
                    });
                    //redirect to overview page
                    $location.path("/home");
                }
            });
        }


        $scope.loginWithPassword = function () {
            $scope.loginInProcess = true;
            accountSrv.login($scope.user.username, $scope.user.password, function (errors, objUser) {
                if (!errors) {
                    $scope.user = objUser;
                    //set reminder cookie if needed
                    if ($scope.login.keepMeLoggedIn) {
                        setCookie("usernameTokenPair", objUser.username + "|" + objUser.token, 1);
                    }
                    //load recipes into recipes service
                    recipeListSrv.syncRecipes(objUser, function (errors, recipes) {
                        $scope.recpeList = recipes;
                    });
                    //redirect to overview page
                    $location.path("/home");
                }
                else {
                    $scope.login.errorMessage = errors;
                    $scope.showError = true;
                }
                $scope.loginInProcess = false;
            });
        }


        $scope.logout = function () {
            setCookie("usernameTokenPair", "", -1);
            accountSrv.logout();
            recipeListSrv.empty();
            //redirect to overview page
            $location.path("/home");
        }

        var getRecipies = function () {
            dataSrv.getRecipies(function (results, message, resultCode) {

                if (resultCode == 0) {
                    $scope.user.recipeOverview = results;
                }

            });
        }

        $scope.getRecipe = function (id) {
            dataSrv.getRecipe(id, function (results, message, resultCode) {

                if (resultCode == 0) {
                    var jsonData = JSON.parse(results[0].data);
                    var commonValues = jsonData.commonValues;
                    var grainBill = jsonData.grains;
                    commonBillSrv.setCommonValues(commonValues);
                    grainBillSrv.setGrainBill(grainBill);
                }

            });
        }



        $scope.createAccount = function (passwordConformation) {
            $scope.signupInProcess = true;
            if ($scope.user.password == passwordConformation) {
                accountSrv.createAccount($scope.user.username, $scope.user.password, function (response) {
                    if (response.hasOwnProperty('errors')) {
                        $scope.showError = true;
                        $scope.login.errorMessage = response.errors;
                    }
                    else {
                        $scope.user = response;
                        //load recipes into recipes service
                        recipeListSrv.syncRecipes($scope.user, function (recipes) {
                            $scope.recpeList = recipes;
                        });
                        //redirect to overview page
                        $location.path("/home");
                    }
                });
            }
            else {
                $scope.showError = true;
                $scope.login.errorMessage = "Passwords don't match";
            }
            $scope.signupInProcess = false;
        }


        $scope.closeNotice = function () {
            $scope.showError = false;
        }

        

        //Helper functions

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
            }
            return "";
        }

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        }

    });