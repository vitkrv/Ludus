appControllers.controller('UserCtrl', ['$rootScope', '$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function ($rootScope, $scope, $location, $window, UserService, AuthenticationService) {
        $scope.showAlert = false;

        $scope.signIn = function signIn(username, password) {
            if (username !== null && password !== null) {

                UserService.signIn(username, password).success(function (data) {
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.username = username;
                    $rootScope.username = username;
                    $location.path("/");
                }).error(function (data, status) {
                    if (status == 401) {
                        $scope.showAlert = true;
                    } else {
                        // todo insert proper error handling
                    }
                });
            }
        };
        $scope.logout = function () {
            delete $window.sessionStorage.token;
            AuthenticationService.isAuthenticated = false;
            $location.path("/");
        };
        $scope.switchTwitter = function () {
            if ($rootScope.hideTwitter)
                $rootScope.hideTwitter = false;
            else
                $rootScope.hideTwitter = true;
        };
    }
]);
appControllers.controller('MainCtrl', ['$rootScope', '$scope', '$location', '$window',
    function ($rootScope, $scope, $location, $window) {
        $rootScope.header = 'Ludus - Главная';
    }
]);
appControllers.controller('ShopCtrl', ['$rootScope', '$scope', '$location', '$window', 'StaffService',
    function ($rootScope, $scope, $location, $window, StaffService) {
        $rootScope.header = 'Ludus - Магазин';
        $scope.staff = [];

        StaffService.list().success(function (data) {
            $scope.staff = StaffService.prettyArray(data.staffs);
        });
    }
]);

//admin ctrl
appControllers.controller('StaffCtrl', ['$rootScope', '$scope', '$location', '$window', 'StaffService',
    function ($rootScope, $scope, $location, $window, StaffService) {
        $rootScope.header = 'Ludus - Ассортимент магазина';

        StaffService.fulList().success(function (data) {
            $scope.staffs = StaffService.prettyArray(data.staffs);
        });

        $scope.edit = function (id) {
            $location.path('/admin/staff/edit').search('staffId', id);
        };
    }
]);

appControllers.controller('StaffCreateCtrl', ['$rootScope', '$scope', '$location', '$window',
    function ($rootScope, $scope, $location, $window) {
        $rootScope.header = 'Ludus - Добавить в магазин';
    }
]);

appControllers.controller('StaffEditCtrl', ['$rootScope', '$scope', '$location', '$window', '$routeParams', 'StaffService',
    function ($rootScope, $scope, $location, $window, $routeParams, StaffService) {
        $rootScope.header = 'Ludus - Редактировать';

        StaffService.getOne($routeParams.staffId).success(function (data) {
            $scope.staff = data;
        });
    }
]);
appControllers.controller('MediaPartnersCtrl', ['$rootScope', '$scope', '$location', '$window',
    function ($rootScope, $scope, $location, $window) {
        $rootScope.header = 'Ludus - Медиапартнёры';
    }
]);
appControllers.controller('SponsorsCtrl', ['$rootScope', '$scope', '$location', '$window',
    function ($rootScope, $scope, $location, $window) {
        $rootScope.header = 'Ludus - Спонсоры';
    }
]);
appControllers.controller('AboutCtrl', ['$rootScope', '$scope', '$location', '$window',
    function ($rootScope, $scope, $location, $window) {
        $rootScope.header = 'Ludus - Контакты';
    }
]);
appControllers.controller('PubstompsCtrl', ['$rootScope', '$scope', '$location', '$window',
    function ($rootScope, $scope, $location, $window) {
        $rootScope.header = 'Ludus - Пабстомпы';
    }
]);