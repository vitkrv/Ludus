appControllers.controller('MainCtrl', ['$rootScope', '$scope', '$location', '$window', 'breadcrumbs',
    function ($rootScope, $scope, $location, $window, breadcrumbs) {
        $rootScope.header = 'Ludus - Главная';
        $rootScope.breadcrumbs = breadcrumbs;

        $scope.logout = function () {
            $location.path("/login");
        };
        $scope.forgotPassword = function () {
            $location.path("/user/password/reset");
        };
    }
]);
appControllers.controller('ShopCtrl', ['$rootScope', '$scope', '$location', '$window', 'breadcrumbs',
    function ($rootScope, $scope, $location, $window, breadcrumbs) {
        $rootScope.header = 'Ludus - Магазин';
        $rootScope.breadcrumbs = breadcrumbs;
    }
]);
appControllers.controller('MediaPartnersCtrl', ['$rootScope', '$scope', '$location', '$window', 'breadcrumbs',
    function ($rootScope, $scope, $location, $window, breadcrumbs) {
        $rootScope.header = 'Ludus - Медиапартнёры';
        $rootScope.breadcrumbs = breadcrumbs;
    }
]);
appControllers.controller('SponsorsCtrl', ['$rootScope', '$scope', '$location', '$window', 'breadcrumbs',
    function ($rootScope, $scope, $location, $window, breadcrumbs) {
        $rootScope.header = 'Ludus - Спонсоры';
        $rootScope.breadcrumbs = breadcrumbs;
    }
]);
appControllers.controller('AboutCtrl', ['$rootScope', '$scope', '$location', '$window', 'breadcrumbs',
    function ($rootScope, $scope, $location, $window, breadcrumbs) {
        $rootScope.header = 'Ludus - Контакты';
        $rootScope.breadcrumbs = breadcrumbs;
    }
]);
