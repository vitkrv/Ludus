var app = angular.module('app',
    ['ngRoute', 'appControllers', 'appServices', 'appDirectives', 'appFilters', 'ui.bootstrap.pagination', 'angularFileUpload']);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);
var appFilters = angular.module('appFilters', []);

var options = {};
options.api = {};

app.config(['$locationProvider', '$routeProvider',
    function ($location, $routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            }).
            when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'UserCtrl'
            }).
            when('/admin/staff', {
                templateUrl: 'partials/admin/editList.html',
                access: { requiredAuthentication: true },
                controller: 'StaffCtrl'
            }).
            when('/admin/staff/create', {
                templateUrl: 'partials/admin/createStaff.html',
                access: { requiredAuthentication: true },
                controller: 'StaffCreateCtrl'
            }).
            when('/admin/staff/edit', {
                templateUrl: 'partials/admin/editStaff.html',
                access: { requiredAuthentication: true },
                controller: 'StaffEditCtrl'
            }).
            when('/shop', {
                templateUrl: 'partials/shop.html',
                controller: 'ShopCtrl'
            }).
            when('/mediapartners', {
                templateUrl: 'partials/mediapartners.html',
                controller: 'MediaPartnersCtrl'
            }).
            when('/sponsors', {
                templateUrl: 'partials/sponsors.html',
                controller: 'SponsorsCtrl'
            }).
            when('/about', {
                templateUrl: 'partials/about.html',
                controller: 'AboutCtrl'
            }).
            when('/pubstomps', {
                templateUrl: 'partials/pubstomps.html',
                controller: 'PubstompsCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.run(function ($rootScope, $location, $window, AuthenticationService) {
    options.api.base_url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/v1";
    options.url = $location.protocol() + "://" + $location.host() + ":" + $location.port();
    $rootScope.location = $location;
    $rootScope.isAdmin = $window.sessionStorage;
    $rootScope.allTowns = ['Харьков', 'Днепропетровск', 'Ужгород'];

    $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set
        if (nextRoute !== null &&
            nextRoute.access &&
            nextRoute.access !== null &&
            nextRoute.access.requiredAuthentication && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {

            $rootScope.toMain();
        }
    });

    // nav bar
    $rootScope.toShop = function () {
        $location.$$search = {};
        $location.path("/shop");
    };
    $rootScope.toPubstomps = function () {
        $location.$$search = {};
        $location.path("/pubstomps");
    };
    $rootScope.toAbout = function () {
        $location.$$search = {};
        $location.path("/about");
    };
    $rootScope.toSponsors = function () {
        $location.$$search = {};
        $location.path("/sponsors");
    };
    $rootScope.toMediapartners = function () {
        $location.$$search = {};
        $location.path("/mediapartners");
    };
    $rootScope.toMain = function () {
        $location.$$search = {};
        $location.path("/");
    };

    // admin panel
    $rootScope.toCreateStaff = function () {
        $location.path("/admin/staff/create");
    };
    $rootScope.toEditList = function () {
        $location.path("/admin/staff/");
    };
});
