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
        $location.$$search = {};
        $location.path("/admin/staff/");
    };
});

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

appControllers.controller('StaffCreateCtrl', ['$rootScope', '$scope', '$location', '$window', '$upload', 'StaffService',
    function ($rootScope, $scope, $location, $window, $upload, StaffService) {
        $rootScope.header = 'Ludus - Добавить в магазин';

        $scope.staff = {};
        $scope.staff.avatar = options.url + '/img/default-staff-avatar.png';
        $scope.staff.available = false;
        $scope.staff.photos = [];
        $scope.staff.towns = [];

        $scope.addTown = function (town) {
            var pos = $scope.staff.towns.indexOf(town);
            if (pos == -1) {
                $scope.staff.towns.push(town);
                $scope.staff.towns.sort();
            }
            else {
                $scope.staff.towns.splice(pos, 1);
            }
        };

        $scope.onFileSelect = function ($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: options.api.base_url + '/img/',
                    method: 'POST',
                    file: file
                }).progress(function (evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    var imgName = $scope.staff.avatar.split('/').reverse()[0];
                    StaffService.imgClean(imgName).success(function () {
                        console.log('success deleted ' + imgName);
                    });
                    $scope.staff.avatar = options.url + '/img/uploads/' + data.name;
                    console.log(data);
                });
            }post
        };

        $scope.createStaff = function () {
            StaffService.createStaff($scope.staff).success(function () {
                $rootScope.toEditList();
            });
        };

        $scope.cancelChanges = function () {
            $rootScope.toEditList();
        };
    }
]);

appControllers.controller('StaffEditCtrl', ['$rootScope', '$scope', '$location', '$window', '$upload', '$routeParams', 'StaffService',
    function ($rootScope, $scope, $location, $window, $upload, $routeParams, StaffService) {
        $rootScope.header = 'Ludus - Редактировать';

        StaffService.getOne($routeParams.staffId).success(function (data) {
            $scope.staff = data;
        });

        $scope.addTown = function (town) {
            var pos = $scope.staff.towns.indexOf(town);
            if (pos == -1) {
                $scope.staff.towns.push(town);
                $scope.staff.towns.sort();
            }
            else {
                $scope.staff.towns.splice(pos, 1);
            }
        };

        $scope.onFileSelect = function ($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: options.api.base_url + '/img/',
                    method: 'POST',
                    file: file
                }).progress(function (evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    var imgName = $scope.staff.avatar.split('/').reverse()[0];
                    StaffService.imgClean(imgName).success(function () {
                        console.log('success deleted ' + imgName);
                    });
                    $scope.staff.avatar = options.url + '/img/uploads/' + data.name;
                    console.log(data);
                });
            }
        };

        $scope.updateStaff = function () {
            StaffService.updateStaff($scope.staff).success(function () {
                $rootScope.toEditList();
            });
        };

        $scope.cancelChanges = function () {
            $rootScope.toEditList();
        };
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
appServices.factory('StaffService', function ($http) {
    return {
        pretty: function (item) {
            var maxInRow = 22;

            if (item.available && item.available === true)
                item.available = 'Да';
            else
                item.available = 'Нет';
            if (typeof item.description !== 'undefined' && item.description.length > maxInRow)
                item.description = item.description.slice(0, maxInRow) + '...';

            return item;
        },
        prettyArray: function (array) {
            for (var i = 0; i < array.length; i++) {
                array[i] = this.pretty(array[i]);
            }
            return array;
        },
        fulList: function () {
            return $http.get(options.api.base_url + "/shop");
        },
        list: function (size, page) {
            return $http.get(options.api.base_url + '/shop', {params: { page_size: size, page_num: page}});
        },
        getOne: function (id) {
            return $http.get(options.api.base_url + '/shop/' + id);
        },
        updateStaff: function (staff) {
            return $http.put(options.api.base_url + '/shop/' + staff.id, staff);
        },
        createStaff: function (staff) {
            return $http.post(options.api.base_url + '/shop/', staff);
        },
        imgClean: function (name) {
            return $http.delete(options.api.base_url + '/img/delete', {headers: {filename: name}});
        }
    };
});

appServices.factory('AuthenticationService', function () {
    var auth = {
        isAuthenticated: false
    };

    return auth;
});

appServices.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.params = config.params || {};
            if ($window.sessionStorage.token) {
                config.params.authToken = $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function (rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response !== null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function (rejection) {
            if (rejection !== null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/");
            }

            return $q.reject(rejection);
        }
    };
});
appServices.factory('UserService', function ($http) {
    return {
        signIn: function (username, password) {
            return $http.get(options.api.base_url + '/auth/token', {headers: {username: username, password: password}});
        }
    };
});