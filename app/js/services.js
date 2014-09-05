appServices.factory('StaffService', function ($http) {
    return {
        fulList: function () {
            return $http.get(options.api.base_url + "/shop");
        },
        list: function (size, page) {
            return $http.get(options.api.base_url + '/shop', {params: { page_size: size, page_num: page}});
        }
    };
});