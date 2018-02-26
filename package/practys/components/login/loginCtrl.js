/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   loginCtrl
 *
 *  Description :   Login
 *
 *  Developer   :   Nishant
 * 
 *  Date        :   12/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/


(function() {
    'use strict';

    app.controller('loginCtrl', LoginController);

    LoginController.$inject = ['$location', '$rootScope', '$scope', 'AuthenticationService', 'toastr', '$window', '$state', 'ngDialog'];

    function LoginController($location, $rootScope, $scope, AuthenticationService, toastr, $window, $state, ngDialog) {
        var auth = this;
        auth.login = login;
        auth.forgotPassword = forgotPassword;
        auth.openDefault = openDefault;
        auth.loading = false;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        //remember me functionality
        $scope.remember = false;

        // if ($window.localStorage.getItem('username') != null && $window.localStorage.getItem('username') != '' && $window.localStorage.getItem('password') != '') {
        //     $scope.remember = true;
        //     auth.login.userName = $window.localStorage.getItem('username');
        //     auth.login.userPassword = $window.localStorage.getItem('password');
        // }
        // $scope.rememberMe = function() {
           
        // };

        function login() {
            auth.loading = true;

             if (auth.login.userName != undefined && auth.login.userPassword != undefined) {
               
            }else {
                $rootScope.cookiesVar = false;
                auth.loading = false;
                $scope.remember = false;
                toastr.error("Enter the EmailId or password");
                return false;
            }
            
            if (auth.login.userName != undefined && auth.login.userPassword != undefined && auth.login.userName != '' && auth.login.userPassword != '') {
                AuthenticationService.Login(auth.login.userName, auth.login.userPassword, function(response) {

                    if (response.data.status == "success") {
                    	 if ($scope.remember) {
		                    AuthenticationService.cookiesProcess(auth.login.userName,auth.login.userPassword, 'set');
		                }else {
		                    $rootScope.cookiesVar = false;
		                    AuthenticationService.cookiesProcess(null,null, 'set');
		                }
                        AuthenticationService.SetCredentials(auth.login.userName, auth.login.userPassword, response.data.token, response.data.referKey, response.data.message.User);

                        if (response.data.message.User.user_level == "clinic") {
                             var stringtoken  = $window.localStorage.getItem('token');
                             var stringKey   = $window.localStorage.getItem('referKey'); 
                             if(stringtoken && stringKey ){
                                var token    = stringtoken.replace(/"/g,"");
                                var key      = stringKey.replace(/"/g, "");
                             }
                             var data ='Basic '+token+' '+key;
                            if(response.data.message.User.id){
                                 window.dao.sync(response.data.message.User.id,data);
                            }   
                            $state.go('dashboard');
                        } else if (response.data.message.User.user_level == "doctor") {
                            $state.go('clinicName');
                        } else if (response.data.message.User.user_level == "admin") {
                            $state.go('settings');
                        } else {
                            auth.login.userName = "";
                            auth.login.userPassword = "";
                            toastr.error("Invalid Credentials");
                            auth.loading = false;
                        }
                    } else {
                        auth.loading = false;
                        toastr.error(response.data.message);
                    }
                });
            } else {
                auth.loading = false;
                toastr.error("Please enter Email Id and password");
            }
        };

        function forgotPassword(obj) {
            console.log(obj);
            // return false;
            if(obj == undefined){
                toastr.error("Enter the Valid Email");
                return false;
            }
            if(obj.email == ""){
                 toastr.error("Enter the Valid Email");
                return false;
            }
            
            AuthenticationService.forgotPassword(obj.email).then(function(resp) {
                if (resp.data.status == "success") {
                	
                    toastr.success("Check your Email....");
                    ngDialog.close();
                } else {
                	
                    toastr.error(resp.data.message);
                }

            });

        };


        function openDefault() {
            $rootScope.popup = true;
            ngDialog.open({
                template: 'firstDialogId',
                controller: 'loginCtrl',

            });

        };
        
         /*Fucntionalities to check whether the remember me is checked or not*/
        var obj = AuthenticationService.cookiesProcess(null,null,'get');
        if(obj != ''){
            if(obj.username != ''){
                $scope.remember = true;
                auth.login.userName = obj.username;
                auth.login.userPassword = obj.password;
                return false;
            }
            // alert("cookie datas.......");
            
        }

       
        // if($rootScope.cookiesVar){
        //     var obj = AuthenticationService.cookiesProcess(null,null,'get');
        //     $scope.remember = true;
        //     auth.login.userName = obj.username;
        //     auth.login.userPassword = obj.password;
        // }else{
        //     $rootScope.cookiesVar = false;
        // }
        

    }

})();
