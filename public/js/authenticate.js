app.service("Authenticate", function ($auth, $http, $state, $rootScope) {
    this.login = function (credentials) {
        var data = $auth.login(credentials).then(function () {
            return $http.get('api/authenticate/user');
        }, function (error) {
            console.log("Error while login: ", error);
            return error.data.error;
        }).then(function (response) {
            console.log("User: ", response.data.user);
            var user = JSON.stringify(response.data.user);
            localStorage.setItem('user', user);
            $rootScope.authenticated = true;
            $rootScope.currentUser = response.data.user;

            $state.go('users', {});
        });

        return data;
    };

    this.logout = function () {
        $auth.logout().then(function () {
            localStorage.removeItem('user');
            $rootScope.authenticated = false;
            $rootScope.currentUser = null;

            $state.go('auth', {});
        })
    };
});