app.factory('Interceptor',function($rootScope,$q,$location){
        var Interceptor ={
            responseError: function(response){
                $rootScope.practysLoader = false;
                if(response.status == 403 && $location.path() != '/login'){
                    alert("Time Expires Login to continue..");
                     $location.path('/login');
                }
                // $rootScope.appointmentLoader = false;
                $rootScope.status = response.status;
                $q.reject(response);
                return response;
            },
            response: function(response){
            	if(response.status == 403 && $location.path() != '/login'){
                    alert("Time Expires Login to continue..");
                    $location.path('/login');
                 }
                $rootScope.status = response.status;
                return response;
            }
        };
        return Interceptor;
});