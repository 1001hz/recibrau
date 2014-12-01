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
        
        $http.post("/api/user/tokenlogin",
                { "token": token, "username": username }
            )
            .success(function (response) {
                if (response.hasOwnProperty('errors')) {
                    callbackFunc(response.errors, null);
                }
                else {
                    user.loggedIn = true;
                    user.token = token;
                    user.username = username;
                    callbackFunc(null, user);
                }

            })
            .error(function (data, status, headers, config) {
                if (data === "") {
                    data = "Error connecting to server.";
                }
                callbackFunc(data, null);
            });
    }


    this.login = function (username, password, callbackFunc) {
        
        $http.post("/api/user/login",
                { "password": password, "username": username }
            )
            .success(function (response) {
                if (response.hasOwnProperty('errors')) {
                    callbackFunc(response.errors, null);
                }
                else {
                    user.loggedIn = true;
                    user.token = response.token;
                    user.username = username;
                    callbackFunc(null, user);
                }

            })
            .error(function (data, status, headers, config) {
                if (data === "") {
                    data = "Error connecting to server.";
                }
                callbackFunc(data, null);
            });
            /*
        //DEBUG
        user.loggedIn = true;
        user.token = "abcdefg"+password;
        user.username = username;
        callbackFunc(true, "login ok", user);
        */
    }



    this.logout = function () {
        user.loggedIn = false;
        user.token = null;
        user.username = "";
        user.password = "";
    }


    this.createAccount = function (username, password, callbackFunc) {
        $http.post("/api/user/create",
                { "username": username, "password": password }
            )
            .success(function (response) {
                if (response.hasOwnProperty('errors')) {
                    callbackFunc(response);
                }
                else {
                    user.loggedIn = true;
                    user.token = response.token;
                    user.username = username;
                    callbackFunc(user);
                }
            })
            .error(function (data, status, headers, config) {
                if (data === "") {
                    data = "Error connecting to server.";
                }
                callbackFunc(data, null);
            });
    }

});

