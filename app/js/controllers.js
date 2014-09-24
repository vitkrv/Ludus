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

        $scope.describe = function (id) {
            $location.path('/shop/staff').search('id', id);
        };
    }
]);
appControllers.controller('ShopItemCtrl', ['$rootScope', '$scope', '$location', '$window', '$routeParams', 'StaffService',
    function ($rootScope, $scope, $location, $window, $routeParams, StaffService) {
        $rootScope.header = 'Ludus - Магазин';
        $scope.staff = {};

        StaffService.getOne($routeParams.id).success(function (data) {
            $scope.staff = StaffService.pretty(data);
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
        $scope.deleteStaff = function (id) {
            StaffService.delete(id).success(function () {
                StaffService.fulList().success(function (data) {
                    $scope.staffs = StaffService.prettyArray(data.staffs);
                });
            });
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

        $scope.addTown = StaffService.addTown;
        $scope.cancelChanges = StaffService.cancelChanges;
        $scope.deletePhoto = StaffService.deletePhoto;
        $scope.addPhotoFromUrl = StaffService.addPhotoFromUrl;

        $scope.onFileSelect = function ($files, isAvatar) {
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
                    if (isAvatar) {
                        var imgName = $scope.staff.avatar.split('/').reverse()[0];
                        StaffService.imgClean(imgName).success(function () {
                            console.log('success deleted ' + imgName);
                        });
                        $scope.staff.avatar = options.url + '/img/uploads/' + data.name;
                    }
                    else {
                        $scope.staff.photos.push(options.url + '/img/uploads/' + data.name);
                    }
                    console.log(data);
                });
            }
        };

        $scope.createStaff = function () {
            StaffService.createStaff($scope.staff).success(function () {
                $rootScope.toEditList();
            });
        };
    }
]);

appControllers.controller('StaffEditCtrl', ['$rootScope', '$scope', '$location', '$window', '$upload', '$routeParams', 'StaffService',
    function ($rootScope, $scope, $location, $window, $upload, $routeParams, StaffService) {
        $rootScope.header = 'Ludus - Редактировать';

        $scope.addTown = StaffService.addTown;
        $scope.cancelChanges = StaffService.cancelChanges;
        $scope.deletePhoto = StaffService.deletePhoto;
        $scope.addPhotoFromUrl = StaffService.addPhotoFromUrl;

        StaffService.getOne($routeParams.staffId).success(function (data) {
            $scope.staff = data;
        });

        $scope.onFileSelect = function ($files, isAvatar) {
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
                    if (isAvatar) {
                        var imgName = $scope.staff.avatar.split('/').reverse()[0];
                        StaffService.imgClean(imgName).success(function () {
                            console.log('success deleted ' + imgName);
                        });
                        $scope.staff.avatar = options.url + '/img/uploads/' + data.name;
                    }
                    else {
                        $scope.staff.photos.push(options.url + '/img/uploads/' + data.name);
                    }
                    console.log(data);
                });
            }
        };

        $scope.updateStaff = function () {
            StaffService.updateStaff($scope.staff).success(function () {
                $rootScope.toEditList();
            });
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
