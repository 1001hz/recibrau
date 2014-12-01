app.service('adminDataSrv', function ($http, accountSrv) {

    this.saveGrain = function (grain, callbackFunc) {
        
        var user = accountSrv.getUser();
        //if (user.loggedIn) {
        if (true) {
            $http.post("/api/add/grain",
                    { "name": grain.name, "extractPotential": grain.extractPotential, "colour": grain.colour, "maxYield": grain.maxYield }
                )
                .success(function (response) {
                    callbackFunc(response);
                })
                .error(function (error) {
                    callbackFunc({ errors: error });
                });
        }
        else {
            callbackFunc(false, "User not logged in", 101);
        }
        
    }


    this.deleteGrain = function (grainId, callbackFunc) {

        var user = accountSrv.getUser();
        //if (user.loggedIn) {
        if (true) {
            $http.post("/api/remove/grain",
                    { "id": grainId }
                )
                .success(function (response) {
                    callbackFunc(response);
                })
                .error(function (error) {
                    callbackFunc({ errors: error });
                });
        }
        else {
            callbackFunc(false, "User not logged in", 101);
        }

    }






    this.getRecipies = function (callbackFunc) {
        var user = accountSrv.getUser();
        if (user.loggedIn) {
            $http.post("http://localhost/angularjs/brewsmith/data/get_all_recipes.php",
                    { "username": user.username, "token": user.token }
                )
                .success(function (response) {
                    callbackFunc(response.result, response.message, response.code);
                })
                .error(function (error) {
                    callbackFunc(false, error, -1);
                });
        }
        else {
            callbackFunc(false, "User not logged in", 101);
        }
    }

    this.getRecipe = function (id, callbackFunc) {
        var user = accountSrv.getUser();
        if (user.loggedIn) {
            $http.post("http://localhost/angularjs/brewsmith/data/get_recipe.php",
                    { "username": user.username, "token": user.token, "id": id }
                )
                .success(function (response) {
                    callbackFunc(response.result, response.message, response.code);
                })
                .error(function (error) {
                    callbackFunc(false, error, -1);
                });
        }
        else {
            callbackFunc(false, "User not logged in", 101);
        }
    }


    this.saveRecipe = function (recipeName, recipeData, callbackFunc) {
        var user = accountSrv.getUser();
        if (user.loggedIn)
        {
            $http.post("http://localhost/angularjs/brewsmith/data/save.php",
                    { "data": recipeData, "username": user.username, "recipeName": recipeName, "token": user.token }
                )
                .success(function (response) {
                    callbackFunc(response.result, response.message, response.code, response.id);
                })
                .error(function (error) {
                    callbackFunc(false, error, response.code);
                });
        }
        else {
            callbackFunc(false, "User not logged in", 101);
        }

    }

    //Not being used yet???
    this.saveGrains = function (grainBill, callbackFunc) {
        
        $http.post("http://localhost/angularjs/brewsmith/data/save.php",
                { grainbill: grainBill, user: 1 }
            )
            .success(function (response) {
                callbackFunc(response.result, response.message);
            })
            .error(function (error) {
                callbackFunc(false, error);
            });
        
    }

});

app.value('unitSystem', [
    { name: "Metric", weightLarge: "Kg", weightSmall: "g", volume: "Litres" },
    { name: "Imperial", weightLarge: "Lbs", weightSmall: "oz", volume: "Gallons" }
]);

