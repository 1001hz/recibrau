app.service('dataSrv', function ($http, accountSrv) {

    this.getGrains = function (callbackFunc) {
        data = [
            {
                id:1,
                name: "Maris Otter",
                extractPotential: 80,
                colour: 20,
                maxYield: 80
            },
            {
                id: 2,
                name: "Crystal Malt",
                colour: 33,
                extractPotential: 30,
                maxYield: 60
            }
        ];
        callbackFunc(data);
        /*
        $http.get("http://localhost/angularjs/brewsmith/data/grains.php").success(function (data) {
            callbackFunc(data);
        }).error(function (error) {
            alert(error);
        });
        */
    }


    this.getHops = function (callbackFunc) {
        data = [
            {
                id: 1,
                name: "Warrior",
                alpha: 8.6,
                usage: ["bittering"]
            },
            {
                id: 2,
                name: "East Kent Goldings",
                alpha: 13.5,
                usage: ["bittering","aroma"]
            },
            {
                id: 3,
                name: "Cascade",
                alpha: 4.5,
                usage: ["aroma"]
            }
        ];
        callbackFunc(data);
        /*
        $http.get("http://localhost/angularjs/brewsmith/data/grains.php").success(function (data) {
            callbackFunc(data);
        }).error(function (error) {
            alert(error);
        });
        */
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

