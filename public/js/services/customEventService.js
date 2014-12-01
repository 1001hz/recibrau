app.service('recipeSavedSrv', function ($rootScope) {

    this.broadcast = function () {
        $rootScope.$broadcast('recipeSaved');
    }

    this.listen = function (callback) {
        $rootScope.$on('recipeSaved', callback);
    }

})
.service('recipeDeletedSrv', function ($rootScope) {

    this.broadcast = function () {
        $rootScope.$broadcast('recipeDeleted');
    }

    this.listen = function (callback) {
        $rootScope.$on('recipeDeleted', callback);
    }

});
