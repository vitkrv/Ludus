appServices.factory('StaffService', function ($http, $rootScope) {
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
        delete: function (id) {
            return $http.delete(options.api.base_url + '/shop/' + id);
        },
        updateStaff: function (staff) {
            return $http.put(options.api.base_url + '/shop/' + staff.id, staff);
        },
        createStaff: function (staff) {
            return $http.post(options.api.base_url + '/shop/', staff);
        },
        imgClean: function (name) {
            return $http.delete(options.api.base_url + '/img/delete', {headers: {filename: name}});
        },
        addTown: function (staff, town) {
            var pos = staff.towns.indexOf(town);
            if (pos == -1) {
                staff.towns.push(town);
                staff.towns.sort();
            }
            else {
                staff.towns.splice(pos, 1);
            }
        },
        cancelChanges: function () {
            $rootScope.toEditList();
        },
        deletePhoto: function (array, index) {
            array.splice(index, 1);
        },
        addPhotoFromUrl: function (array, url) {
            if (angular.isArray(array))
                array.push(url);
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
