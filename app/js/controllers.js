appControllers.controller('MainCtrl', ['$rootScope', '$scope', '$location', '$window',
    function ($rootScope, $scope, $location, $window) {
        $rootScope.header = 'Ludus - Главная';
    }
]);
appControllers.controller('ShopCtrl', ['$rootScope', '$scope', '$location', '$window',
    function ($rootScope, $scope, $location, $window) {
        $rootScope.header = 'Ludus - Магазин';
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
