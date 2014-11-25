app.service('recipeListSrv', function ($http) {

    var recipes = {};

    this.getRecipes = function () {
        return recipes;
    }

    this.getAllYeast = function () {
        var arrYeast = [];
        for (i = 0; i < recipes.length; i++) {
            arrYeast.push(recipes[i].yeast);
        }
        return arrYeast;
    }

    this.empty = function () {
        recipes = {};
    }

    this.syncRecipes = function (user, callbackFunc) {
        //get recipes from DB, server takes care of validating user agains data
        recipes = [{
            name: "You're my boy brew, you're my boy",
            id: 1,
            updated: "28 Jan 2013",
            settings:{
                unitSystem: "Metric",
                volume: 19,
                method: "BIAB",
                originalGravity: 1.051,
                finalGravity: 1.012,
                mashSteps: [{
                    temperature: 75,
                    length: 60
                }]
            },
            grains: [
                {
                    id:1,
                    name: "Maris Otter",
                    weight: 15,
                    colour: 2,
                    extractPotential: 80,
                    maxYield: 80
                },
                {
                    id:2,
                    name: "Crystal Malt",
                    weight: 12,
                    colour: 33,
                    extractPotential: 80,
                    maxYield: 80
                }
            ],
            hops: [
                
            ],
            yeast:
                {
                    name: "London ESB",
                    lab: "WYeast",
                    strain: "1968",
                    tempLow: 18,
                    tempHigh: 22,
                    flocculation: "Very High",
                    attenuationLow: 67,
                    attenuationHigh: 71
                }
        }, {
            name: "Smashing Otter",
            id: 2,
            updated: "2 May 2013",
            settings: {
                unitSystem: "US",
                volume: 5,
                method: "All grain",
                originalGravity: 1.041,
                finalGravity: 1.011,
            },
            grains: [
                {
                    id: 1,
                    name: "Maris Otter",
                    weight: 12,
                    colour: 2,
                    extractPotential: 80,
                    maxYield: 80
                }
            ],
            hops: [
                {
                    id:1,
                    name: "Warrior",
                    weight: 12,
                    alpha: 8.6,
                    time: 60,
                    method: "boil"
                }
            ],
            yeast:
                {
                    name: "London ESB",
                    lab: "WYeast",
                    strain: "1968",
                    tempLow: 66,
                    tempHigh: 72,
                    flocculation: "Very High",
                    attenuationLow: 67,
                    attenuationHigh: 71
                }
        }];
        callbackFunc(recipes);
    }

    this.getRecipe = function (user, id, callbackFunc) {
        //get recipes from DB, server takes care of validating user agains data
        var recipe = {};
       
        for (i = 0; i < recipes.length; i++) {
            if (recipes[i].id == id) {
                recipe = recipes[i];
            }
        }
        callbackFunc(recipe);
    }






    //v2
    this.loginWithToken = function (username, token, callbackFunc) {
        /*
        $http.post("http://localhost/angularjs/brewsmith/data/loginWithToken.php",
                { "token": token, "username": username }
            )
            .success(function (response) {
                if (response.result) {
                    user.loggedIn = true;
                    user.token = response.token;
                    user.username = username;
                    callbackFunc(true, response.message, user);
                }
                else {
                    callbackFunc(false, response.message, null);
                }

            })
            .error(function (error) {
                callbackFunc(false, error, null);
            });
            */
        //DEBUG
        user.loggedIn = true;
        user.token = token;
        user.username = username;
        callbackFunc(true, "login ok", user);
    }




    this.logout = function () {
        user.loggedIn = false;
        user.token = null;
        user.username = "";
        user.password = "";
    }

    this.login = function (username, password, callbackFunc) {
        /*
        $http.post("http://localhost/angularjs/brewsmith/data/login.php",
                { "password": password, "username": username }
            )
            .success(function (response) {
                if (response.result) {
                    user.loggedIn = true;
                    user.token = response.token;
                    user.username = username;
                    callbackFunc(true, response.message, user);
                }
                else {
                    callbackFunc(false, response.message, null);
                }

            })
            .error(function (error) {
                callbackFunc(false, error, null);
            });
            */
        //DEBUG
        user.loggedIn = true;
        user.token = "abcdefg"+password;
        user.username = username;
        callbackFunc(true, "login ok", user);
    }

});



