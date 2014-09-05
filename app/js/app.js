var app = angular.module('app',
    ['ngRoute', 'appControllers', 'appServices', 'appDirectives', 'appFilters', 'ui.bootstrap.pagination', 'ng-breadcrumbs']);

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

app.run(function ($rootScope, $location, $window) {
    options.api.base_url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/v1";
    $rootScope.location = $location;

    // nav bar
    $rootScope.toShop = function () {
        $location.path("/shop");
    };
    $rootScope.toPubstomps = function () {
        $location.path("/pubstomps");
    };
    $rootScope.toAbout = function () {
        $location.path("/about");
    };
    $rootScope.toSponsors = function () {
        $location.path("/sponsors");
    };
    $rootScope.toMediapartners = function () {
        $location.path("/mediapartners");
    };
    $rootScope.toMain = function () {
        $location.path("/");
    };
});
