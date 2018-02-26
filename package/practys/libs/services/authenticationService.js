(function () {
    'use strict';
 
   app.factory('AuthenticationService', AuthenticationService);
 
    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','commonService','$window','utilService','__env','$q','AuthToken','$location'];
    function AuthenticationService($http, $cookieStore, $rootScope, $timeout,commonService,$window,utilService,__env,$q,AuthToken,$location) {
        var service = {};
 
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.forgotPassword = forgotPassword;
        service.logout = logout;
        service.cookiesProcess = cookiesProcess;

        var url = __env.apiUrl;
 
        return service;

        
        function Login(username, password, callback) {
             console.log(username);
             console.log(password);
 
            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            // $timeout(function () {
            //     var response;
            //     commonService.GetByUsername(username)
            //         .then(function (user) {
            //             console.log(user);
            //             if (user !== null && user.password === password) {
            //                 response = { success: true };
            //             } else {
            //                 response = { success: false, message: 'Username or password is incorrect' };
            //             }
            //             callback(response);
            //         });
            // }, 1000);
 
            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/api/authenticate', { username: username, password: password })
            //    .success(function (response) {
            //        callback(response);
            //    });

             var obj        = { email: username, password: password};
             var dataObj    =   $.param(obj);


           commonService.Create(url+'users/login',dataObj)
            .success(function(response) {
                  callback(response);
            }); 
 
        }

         function forgotPassword(Email) {
          var obj        = { email: Email};
          var dataObj    =   $.param(obj);
          var serviceCall =  commonService.Create(url+'users/forgotPassword',dataObj);
          var deferred = $q.defer();

          serviceCall
               .success(function(data) {
                   console.log(data);
                   deferred.resolve(data);
               }).
               error(function(response){
                   console.log("Error : Request failed ");
                   console.log(response);
                   deferred.reject(response.data);
               });

           return deferred.promise;
        }

        function logout(){

            var deferred = $q.defer();

            var serviceCall =   commonService.Create(url+'users/logout');
// console.log(serviceCall);return false;
            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
                error(function(response){
                    console.log("Error : message retrive failed ");
                    console.log(response);
                    deferred.reject(response);
                });

            return deferred.promise;


        }

        
 
        function SetCredentials(username, password,token,referKey,user) {
            console.log(username);
            console.log(password);
            console.log("detailssssss");
            console.log(user);
                 //console.log(token);
            var authdata = Base64.encode(username + ':' + password);
            console.log(authdata);
            //$window.localStorage.setItem('token', token);
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
 
            // $http.defaults.headers.common['Authorization'] = 'Basic ' + token; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
            
            //$window.localStorage.setItem('token', token);
            //$window.localStorage.setItem('user', user);
            
            if(user.user_level == 'clinic' ||user.user_level == 'doctor' ||user.user_level == 'admin'){
               utilService.saveItem('user',user); 
               utilService.saveItem('token', token);
                utilService.saveItem('referKey', referKey);
                var stringtoken  = $window.localStorage.getItem('token');
                var stringKey   = $window.localStorage.getItem('referKey');
                   console.log(stringtoken);
                    console.log(stringKey);  
                if(stringtoken && stringKey ){
                    var token    = stringtoken.replace(/"/g,"");
                    var key      = stringKey.replace(/"/g, "");
                }
                 var data = token+' '+key;
                 console.log(data);
                $http.defaults.headers.common.Authorization = 'Basic '+data;

            }
            
        }

        function cookiesProcess(username, password,type){
        	if(type == 'set'){
        		if(username != null && username != '' && password != null && password != ''){
        			$rootScope.cookiesVar = true;
        			var loginId = Base64.encode(username);
           			var loginPass = Base64.encode(password);
        		}else{
        			var loginId = '';
           			var loginPass = '';
        		}
        		
				utilService.saveItem('username', loginId);
           		utilService.saveItem('password', loginPass);
        	}

        	if(type == 'get'){
        		var encodedUser = utilService.getItem('username');
        		var encodedPass = utilService.getItem('password');
        		// alert(encodedUser);
        		// alert(encodedPass);
        		if(encodedUser != '' && encodedPass != '' && encodedUser != undefined && encodedPass != undefined){
        			var decodedUser = Base64.decode(encodedUser);
        			var decodedpass = Base64.decode(encodedPass);
        		}else{
        			var decodedUser = '';
        			var decodedpass = '';
        		} 
        		
        		var obj = {
        			username: decodedUser,
        			password: decodedpass
        		}
        		return obj;
        		
        	}
        	    
        }
 
        function ClearCredentials() {
            if($rootScope.online){
                 $rootScope.globals = {};
                $cookieStore.remove('globals');
                $http.defaults.headers.common.Authorization = 'Basic';
                //$window.localStorage.removeItem('token');
                $rootScope.messageCount = 0;
                $rootScope.notificationCount = 0;
                utilService.saveItem('user');
                utilService.saveItem('specialityService');
                utilService.saveItem('unSeenMsg');
                 utilService.saveItem('referKey');
                utilService.saveItem('token');
            }
           
            
        }
    }
 
    // Base64 encoding service used by AuthenticationService
    var Base64 = {
 
        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
 
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                // window.alert("There were invalid base64 characters in the input text.\n" +
                //     "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                //     "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 
})();