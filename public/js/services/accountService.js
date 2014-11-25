app.service('accountSrv', function ($http) {

    //v2
    var user = {
        loggedIn: false,
        token: null,
        username: "",
        password: ""
    };

    //v2
    this.getUser = function () {
        return user;
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

