var app = angular.module('Forum', ['ui.router', 'satellizer']);

app.config(function ($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide) {

    function redirectWhenLoggedOut($q, $injector) {

        return {
            responseError: function (rejection) {
                var $state = $injector.get('$state');
                var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                angular.forEach(rejectionReasons, function (value, key) {
                    if (rejection.data.error === value){
                        localStorage.removeItem('user');
                        $state.go('auth');
                    }
                });

                return $q.reject(rejection);
            }
        }
    }

    $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

    $httpProvider.interceptors.push('redirectWhenLoggedOut');

    $authProvider.loginUrl = '/api/authenticate';

    $urlRouterProvider.otherwise('/auth');

    $stateProvider
        .state('auth', {
            url: '/auth',
            templateUrl: '../views/authView.html',
            controller: 'AuthController'
        })
        .state('users', {
            url: '/users',
            templateUrl: '../views/userView.html',
            controller: 'UserController'
        })
        .state('newThread', {
            url: '/thread/create',
            templateUrl: '../views/newThreadView.html',
            controller: 'ThreadCreateController'
        })
        .state('showPosts', {
            url: '/thread/:id',
            templateUrl: '../views/showThreadView.html',
            controller: 'ThreadShowController'
        })
        /*.state('showPosts', {
            url: '/thread/:id',
            templateUrl: '../views/showThreadListView.html',
            controller: 'ThreadShowListController'
        })*/
        .state('createPost', {
            url: '/post/create/:tid/:uid',
            templateUrl: '../views/createPostView.html',
            controller: 'PostCreateController'
        })
        .state('createComment', {
            url: '/comment/create/:pid/:uid/:tid',
            templateUrl: '../views/createCommentView.html',
            controller: 'CommentCreateController'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: '../views/settingsView.html',
            controller: 'SettingsController'
        });
});

app.run(function ($transitions, $rootScope) {
    var user = JSON.parse(localStorage.getItem('user'));
    if (user){
        $rootScope.authenticated = true;
        $rootScope.currentUser = user;
    }
    $transitions.onStart({to: 'auth.**'}, function (trans) {
        console.log('stateChangeStart');
        var user = JSON.parse(localStorage.getItem('user'));
        if (user){
            console.log('User is there', user);
            $rootScope.authenticated = true;
            $rootScope.currentUser = user;
            event.preventDefault();
            return trans.router.stateService.target('users');
        }
    });
});

app.controller('AuthController', function ($scope, $http, $rootScope, $state, $auth, Authenticate) {
    $scope.loginError = false;
    $scope.login = function () {
        var credentials = {
            email: $scope.email,
            password: $scope.password
        };

        /*$auth.login(credentials).then(function () {
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
        });*/

        var data = Authenticate.login(credentials);
        if (data.$$state.status === 0){
            $scope.loginError = true;
            $scope.loginErrorText = data;
        }
    }
});

app.controller('UserController', function ($http, $scope, $auth, $rootScope, Authenticate) {
    var userID = JSON.parse(localStorage.getItem('user')).id;

    $http.get('api/authenticate/'+userID).success(function (threads) {
        $scope.data = threads;
        $scope.threads = threads.data;
    }).error(function (error) {
        $scope.error = error;
    });

    $scope.next = function () {
        if ($scope.data.next_page_url){
            $http.get($scope.data.next_page_url)
                .then(function (response) {
                    $scope.data = response.data;
                    $scope.threads = response.data.data;
                });
        }
    };

    $scope.prev = function () {
        if ($scope.data.prev_page_url){
            $http.get($scope.data.prev_page_url)
                .then(function (response) {
                    $scope.data = response.data;
                    $scope.threads = response.data.data;
                });
        }
    };
});

app.controller('ThreadCreateController', function ($scope, $http, $state) {
    var userID = JSON.parse(localStorage.getItem('user')).id;
    $scope.create = function () {
        $http.post('api/thread/'+userID, {
            title: $scope.title,
            description: $scope.description
        });
        $state.go('users', {});
    }
});

app.controller('ThreadShowController', function ($scope, $http, $state, Authenticate) {
    console.log($state.params.id);
    getPosts();
    $http.get('api/thread/get/'+$state.params.id)
        .then(function (response) {
            $scope.thread = response.data;
        }, function (error) {
            $scope.error = error.error;
        });
    $http.get('api/user')
        .then(function (response) {
            console.log('users', response.data);
            $scope.users = response.data;
        }, function (error) {
            console.log(error);
            $scope.error = error.error;
        });

    $scope.selIdx=-1;

    $scope.selPost = function (post, idx) {
        $scope.selIdx = idx;
        $scope.selectedPost = post;
        $http.get('api/post/'+post.id)
            .then(function (response) {
                console.log(response.data);
                $scope.comments = response.data;
            }, function (error) {
                $scope.error = error.error;
            });
    };

    $scope.isSelPost = function (post) {
        return $scope.selectedPost===post;
    };

    $scope.parseDate = function (date) {
        return new Date(Date.parse(date));
    };

    $scope.removePost = function (postId) {
        $http.delete('api/post/'+postId)
            .then(function (response) {
                getPosts();
            });

    };

    $scope.addUser = function () {
        $http.put('api/thread/user', {
            userId: $scope.userToAdd,
            threadId: $scope.thread.id
        })
            .then(function (response) {
                console.log(response);
            })
    };

    function getPosts() {
        $http.get('api/thread/'+$state.params.id)
            .then(function (response) {
                console.log(response.data);
                $scope.posts = response.data;
            }, function (error) {
                $scope.error = error.error;
            });
    }
});

/*app.controller('ThreadShowListController', function ($scope, $http, $state, Authenticate) {
    console.log($state.params.id);
    $scope.showCommentsForPost = [];
    getPosts();
    $http.get('api/thread/get/'+$state.params.id)
        .then(function (response) {
            $scope.thread = response.data;
        }, function (error) {
            $scope.error = error.error;
        });

    $scope.parseDate = function (date) {
        return new Date(Date.parse(date));
    };

    $scope.removePost = function (postId) {
        $http.delete('api/post/'+postId)
            .then(function (response) {
                getPosts();
            });

    };

    $scope.click = function (postId) {
        $scope.showCommentsForPost[postId] = !$scope.showCommentsForPost[postId];
    };

    function getPosts() {
        $http.get('api/thread/'+$state.params.id)
            .then(function (response) {
                response.data.forEach(function (element, index, array) {
                    $scope.showCommentsForPost[element.id] = false;
                });
                $scope.posts = response.data;
            }, function (error) {
                $scope.error = error.error;
            });
    }

    $scope.logout = function () {
        Authenticate.logout();
    };
});

app.controller('PostCreateController', function ($scope, $http, $state) {
    var tid = $state.params.tid;
    var uid = $state.params.uid;
    $scope.create = function () {
        $http.post('api/post/create/'+tid+'/'+uid, {
            title: $scope.title,
            content: $scope.content
        });
        $state.go('showPosts', {'id': $state.params.tid});
    }
});*/

app.controller('CommentCreateController', function ($scope, $http, $state) {
    var pid = $state.params.pid;
    var uid = $state.params.uid;
    $scope.create = function () {
        $http.post('api/comment/create/'+pid+'/'+uid, {
            content: $scope.content
        });
        $state.go('showPosts', {'id': $state.params.tid});
    }
});

app.controller('AuthenticationController', function ($scope, $http, Authenticate, $rootScope) {
    $scope.logout = function () {
        Authenticate.logout();
    };

    try {
        $http.get('api/files/' + $rootScope.currentUser.id)
            .then(function (response) {
                console.log(response);
                $scope.avatar = response.data;
                console.log($scope.avatar);
            }, function (error) {
                $scope.avatar = false;
            });
    } catch (e){
        console.log('no User', e);
    }
});

app.controller('SettingsController', function ($scope, $http, $rootScope) {
    $scope.save = function () {
        console.log('picture', $scope.avatar);
        $http.post('api/files', {
            avatar: $scope.avatar,
            user_id: $rootScope.currentUser.id
        }).then(function (response) {
            console.log('resp', response);
        });
    };

    $http.get('api/files/'+$rootScope.currentUser.id)
        .then(function (response) {
            console.log(response);
            $scope.avatar = response.data;
        });
});