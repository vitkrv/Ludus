var app = angular.module('app',
    ['ngRoute', 'appControllers', 'appServices', 'appDirectives', 'appFilters', 'ui.bootstrap.pagination', 'ng-breadcrumbs']);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);
var appFilters = angular.module('appFilters', []);

var options = {};

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
            otherwise({
                redirectTo: '/'
            });
    }]);

app.run(function ($rootScope, $location, $window) {
    $rootScope.location = $location;

    // nav bar
    $rootScope.toShop = function () {
        $location.path("/shop");
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

appDirectives.directive('sortArrow', [
    function () {
        return function (scope, element, attr) {
            scope.$watch(attr.sortArrow, function (value) {
                if (value)
                    element.text(' ▾');
                else
                    element.text(' ▴');
            });
        };
    }]);
appFilters.filter('shopFilter', function(){
        return function(array, expression, comparator) {
            if (!angular.isArray(array)) return array;

            var comparatorType = typeof(comparator),
                predicates = [];

            predicates.check = function(value) {
                for (var j = 0; j < predicates.length; j++) {
                    if(!predicates[j](value)) {
                        return false;
                    }
                }
                return true;
            };

            if (comparatorType !== 'function') {
                if (comparatorType === 'boolean' && comparator) {
                    comparator = function(obj, text) {
                        return angular.equals(obj, text);
                    };
                } else {
                    comparator = function(obj, text) {
                        if (obj && text && typeof obj === 'object' && typeof text === 'object') {
                            for (var objKey in obj) {
                                if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey) &&
                                    comparator(obj[objKey], text[objKey])) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        text = (''+text).toLowerCase();
                        return (''+obj).toLowerCase().indexOf(text) > -1;
                    };
                }
            }

            var search = function(obj, text){
                if (typeof text == 'string' && text.charAt(0) === '!') {
                    return !search(obj, text.substr(1));
                }
                switch (typeof obj) {
                    case "boolean":
                    case "number":
                    case "string":
                        return comparator(obj, text);
                    case "object":
                        switch (typeof text) {
                            case "object":
                                return comparator(obj, text);
                            default:
                                for ( var objKey in obj) {
                                    if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                                        return true;
                                    }
                                }
                                break;
                        }
                        return false;
                    case "array":
                        for ( var i = 0; i < obj.length; i++) {
                            if (search(obj[i], text)) {
                                return true;
                            }
                        }
                        return false;
                    default:
                        return false;
                }
            };
            switch (typeof expression) {
                case "boolean":
                case "number":
                case "string":
                    expression = {$:expression};
                    /* falls through */
                case "object":
                    for (var key in expression) {
                        /* jshint -W083 */
                        (function(path) {
                            if (typeof expression[path] === 'undefined' || expression[path] === null || expression[path] === '') return;
                            predicates.push(function(value) {
                                return search(path == '$' ? value : (value && value[path]), expression[path]);
                            });
                        })(key);
                        /* jshint +W083 */
                    }
                    break;
                case 'function':
                    predicates.push(expression);
                    break;
                default:
                    return array;
            }
            var filtered = [];
            for ( var j = 0; j < array.length; j++) {
                var value = array[j];
                if (predicates.check(value)) {
                    filtered.push(value);
                }
            }
            return filtered;
        };
});

appFilters.filter('skip', function () {
    return function (input, skipCount) {
        if(angular.isArray(input))
            return input.slice(skipCount);
    };
});
/* global angular: true */
angular.module('ui.bootstrap.pagination', [])
    .controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
        var self = this,
            ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
            setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

        this.init = function(ngModelCtrl_, config) {
            ngModelCtrl = ngModelCtrl_;
            this.config = config;

            ngModelCtrl.$render = function() {
                self.render();
            };

            if ($attrs.itemsPerPage) {
                $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
                    self.itemsPerPage = parseInt(value, 10);
                    $scope.totalPages = self.calculateTotalPages();
                });
            } else {
                this.itemsPerPage = config.itemsPerPage;
            }
        };

        this.calculateTotalPages = function() {
            var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
            return Math.max(totalPages || 0, 1);
        };

        this.render = function() {
            $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
        };

        $scope.selectPage = function(page) {
            if ( $scope.page !== page && page > 0 && page <= $scope.totalPages) {
                ngModelCtrl.$setViewValue(page);
                ngModelCtrl.$render();
            }
        };

        $scope.getText = function( key ) {
            return $scope[key + 'Text'] || self.config[key + 'Text'];
        };
        $scope.noPrevious = function() {
            return $scope.page === 1;
        };
        $scope.noNext = function() {
            return $scope.page === $scope.totalPages;
        };

        $scope.$watch('totalItems', function() {
            $scope.totalPages = self.calculateTotalPages();
        });

        $scope.$watch('totalPages', function(value) {
            setNumPages($scope.$parent, value); // Readonly variable

            if ( $scope.page > value ) {
                $scope.selectPage(value);
            } else {
                ngModelCtrl.$render();
            }
        });
    }])

    .constant('paginationConfig', {
        itemsPerPage: 10,
        boundaryLinks: false,
        directionLinks: true,
        firstText: 'First',
        previousText: 'Previous',
        nextText: 'Next',
        lastText: 'Last',
        rotate: true
    })

    .directive('pagination', ['$parse', 'paginationConfig', function($parse, paginationConfig) {
        return {
            restrict: 'EA',
            scope: {
                totalItems: '=',
                firstText: '@',
                previousText: '@',
                nextText: '@',
                lastText: '@'
            },
            require: ['pagination', '?ngModel'],
            controller: 'PaginationController',
            templateUrl: 'template/pagination.html',
            replace: true,
            link: function(scope, element, attrs, ctrls) {
                var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                if (!ngModelCtrl) {
                    return; // do nothing if no ng-model
                }

                // Setup configuration parameters
                var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
                    rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
                scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
                scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

                paginationCtrl.init(ngModelCtrl, paginationConfig);

                if (attrs.maxSize) {
                    scope.$parent.$watch($parse(attrs.maxSize), function(value) {
                        maxSize = parseInt(value, 10);
                        paginationCtrl.render();
                    });
                }

                // Create page object used in template
                function makePage(number, text, isActive) {
                    return {
                        number: number,
                        text: text,
                        active: isActive
                    };
                }

                function getPages(currentPage, totalPages) {
                    var pages = [];

                    // Default page limits
                    var startPage = 1, endPage = totalPages;
                    var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

                    // recompute if maxSize
                    if ( isMaxSized ) {
                        if ( rotate ) {
                            // Current page is displayed in the middle of the visible ones
                            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
                            endPage   = startPage + maxSize - 1;

                            // Adjust if limit is exceeded
                            if (endPage > totalPages) {
                                endPage   = totalPages;
                                startPage = endPage - maxSize + 1;
                            }
                        } else {
                            // Visible pages are paginated with maxSize
                            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

                            // Adjust last page if limit is exceeded
                            endPage = Math.min(startPage + maxSize - 1, totalPages);
                        }
                    }

                    // Add page number links
                    for (var number = startPage; number <= endPage; number++) {
                        var page = makePage(number, number, number === currentPage);
                        pages.push(page);
                    }

                    // Add links to move between page sets
                    if ( isMaxSized && ! rotate ) {
                        if ( startPage > 1 ) {
                            var previousPageSet = makePage(startPage - 1, '...', false);
                            pages.unshift(previousPageSet);
                        }

                        if ( endPage < totalPages ) {
                            var nextPageSet = makePage(endPage + 1, '...', false);
                            pages.push(nextPageSet);
                        }
                    }

                    return pages;
                }

                var originalRender = paginationCtrl.render;
                paginationCtrl.render = function() {
                    originalRender();
                    if (scope.page > 0 && scope.page <= scope.totalPages) {
                        scope.pages = getPages(scope.page, scope.totalPages);
                    }
                };
            }
        };
    }])

    .constant('pagerConfig', {
        itemsPerPage: 10,
        previousText: '« Previous',
        nextText: 'Next »',
        align: true
    })

    .directive('pager', ['pagerConfig', function(pagerConfig) {
        return {
            restrict: 'EA',
            scope: {
                totalItems: '=',
                previousText: '@',
                nextText: '@'
            },
            require: ['pager', '?ngModel'],
            controller: 'PaginationController',
            templateUrl: 'template/pager.html',
            replace: true,
            link: function(scope, element, attrs, ctrls) {
                var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                if (!ngModelCtrl) {
                    return; // do nothing if no ng-model
                }

                scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
                paginationCtrl.init(ngModelCtrl, pagerConfig);
            }
        };
    }]);
/* global angular: false */
appServices.factory('UserService', function ($http) {
    return {};
});
angular.module("ng-breadcrumbs",[]).factory("breadcrumbs",["$rootScope","$location","$route",function(r,a,t){var e={breadcrumbs:[],get:function(r){if(this.options=r||this.options,this.options)for(var a in this.options)if(this.options.hasOwnProperty(a))for(var t in this.breadcrumbs)if(this.breadcrumbs.hasOwnProperty(t)){var e=this.breadcrumbs[t];e.label===a&&(e.label=this.options[a])}return this.breadcrumbs},generateBreadcrumbs:function(){var r=t.routes,e=a.path().split("/"),n="",o=this,s=function(r){if(t.current){var a;return angular.forEach(t.current.params,function(t,e){-1!==r.indexOf(t)&&(a=t),a&&(r=r.replace(t,":"+e))}),{path:r,param:a}}};""===e[1]&&delete e[1],this.breadcrumbs=[],angular.forEach(e,function(a){n+="/"===n?a:"/"+a;var t=s(n);if(t&&r[t.path]){var e=r[t.path].label||t.param,i=r[t.path].name||"";o.breadcrumbs.push({label:e,path:n,name:i,param:t.param})}})}};return r.$on("$routeChangeSuccess",function(){e.generateBreadcrumbs()}),r.$watch(function(){return e.options},function(){e.generateBreadcrumbs()}),e.generateBreadcrumbs(),e}]);