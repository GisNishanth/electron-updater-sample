/*********************************************************************
 *
 *	Great Innovus Solutions Private Limited
 *
 *	Module			: 	Login Service
 *
 *	Description 	: 	Authentication
 *
 *	Developer		: 	Nishanth
 * 
 *	Date 			: 	19/08/2016
 *
 *	Version 		: 	1.0
 *
 **********************************************************************/

app.factory('Auth', ['$http', '$q', 'AuthToken', '$window', '$location', 'toastr', 'Config', function($http, $q, AuthToken, $window, $location, toastr, Config) {


    var authFactory = {};

    Config.getConfig().then(function(response) {
        authFactory.SERVER_PATH = response.data.SERVER_PATH;
    });


    // $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    authFactory.login = function(obj) {

        var dataObj = $.param(obj);

        return $http.post(authFactory.SERVER_PATH + 'api/login', dataObj)
            .success(function(data) {

                if (data.token)
                    AuthToken.setToken(data.token);
                else {
                    console.log(data);
                    toastr.error(data.message);
                    AuthToken.setToken();
                }

                return data;
            });
    }

    authFactory.logout = function() {
        var deferred = $q.defer();

        var serviceCall = commonService.Create(url + 'users/logout');

        serviceCall
            .success(function(data) {
                console.log(data);
                deferred.resolve(data);
            }).
        error(function(response) {
            console.log("Error : message retrive failed ");
            console.log(response);
            deferred.reject(response);
        });



        AuthToken.setToken();
        $location.path('/login');
    }

    authFactory.isLoggedIn = function() {
        //alert("yes");
        if (AuthToken.getToken())
            return true;
        else
            return false;
    }

    authFactory.getUser = function() {
        if (AuthToken.getToken())
            return $http.get('/api/me');
        else
            return $q.reject({ message: "User has no token" });

    }
    return authFactory;

}])


.factory('AuthToken', ['$window', function($window) {

    var authTokenFactory = {};

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    }

    authTokenFactory.setToken = function(token) {
        if (token)
            $window.localStorage.setItem('token', token);
        else
            $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('referKey');
        $window.localStorage.removeItem('doctor');
        $window.localStorage.removeItem('doctors');
        $window.localStorage.removeItem('patient');

    }

    return authTokenFactory;

}])


.factory('AuthInterceptor', ['$q', '$location', 'AuthToken', function($q, $location, AuthToken) {

    var interceptorFactory = {};
    interceptorFactory.request = function(config) {

        var token = AuthToken.getToken();

        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    };

    interceptorFactory.responseError = function(response) {

        if (response.status == 403 && $location.path() != '/login') {
            AuthToken.setToken();
            $location.path('/login');
        }


        return $q.reject(response);
    };

    return interceptorFactory;
}]);
