app.service('signupSrv', function ($http) {

    $scope.createAccount = function () {
        accountSrv.createAccount();
    }
    
});

