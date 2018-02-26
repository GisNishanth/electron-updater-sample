app.factory('checkConnection', function($q, $http, $rootScope,commonService,__env){
    var httpLoc = __env.apiUrl+'clinics/upSink'; 
    return{
        ckIfOnline: function(){
        	var deferred    = $q.defer();
        	var serivceCall = commonService.GetAll(httpLoc);
        		serivceCall.success(function(resp){
        			deferred.resolve(resp);
        		})
        		serivceCall.error(function(resp){
        			deferred.reject(resp);
        		});
        		return deferred.promise;
            // $http.get(httpLoc);   
            // return true;                
        }
    }
});