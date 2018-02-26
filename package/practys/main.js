/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module          :   main.js
 *
 *  Description     :   Main Controller
 *
 *  Developer       :   Sheema
 *
 *  Date            :   24/08/2016
 *
 *  Version         :   1.0
 *
 **********************************************************************/

 app.controller('mainCtrl', ['$scope','$rootScope','$SQLite','ngDialog','$location','$state','$stateParams','Auth','$rootScope', 'translationService','Config','$interval','$http','synchronousService','AuthenticationService','AuthToken','__env','$webSql','$uibModal','$window','toastr','checkConnection','utilService','$q',function ($scope,$rootScope,$SQLite,ngDialog,$location,$state,$stateParams,Auth,$rootScope, translationService,Config,$interval,$http,synchronousService,AuthenticationService,AuthToken,__env,$webSql,$uibModal,$window,toastr,checkConnection,utilService,$q) { 

  var main = this ;
  var url = __env.apiUrl;
  $rootScope.popup = false;
  $scope.currentstate = {};
  $rootScope.messageCount = 0;
  $rootScope.notificationCount = 0;
  $rootScope.addPatientSetting = 0;
  $rootScope.inventoryPopup = false;
  $rootScope.imagePreview = false;
  // $rootScope.messageUpdateCount = false;
  $rootScope.messageNewMessageAlert = false;
  // $rootScope.paymentHistoryPop = false;
  $rootScope.practysLoader = false;
  main.addPatientDetails = addPatientDetails;
  main.getNotification = getNotification;
  main.getAppointmentDetails = getAppointmentDetails;
  main.AppointmentUserDetails = AppointmentUserDetails;
  main.updateNotifyCount = updateNotifyCount;
  main.clinicSwit = clinicSwit;

  // main.userLevel = JSON.parse(localStorage.getItem('user'))['user_level'];
  // console.log = function() {};


  function clinicSwit(){
  	$rootScope.messageCount = 0;
  	$state.go('clinicName');
  }

  /*Add Patient*/
  function addPatientDetails(){
    $rootScope.popup = false;
    $rootScope.addPatientSetting = 1;
    if($rootScope.online){
       ngDialog.open({
        templateUrl:'components/patient/addPatient.html',
        controller :'patientController as vm'
      });
    }else{
      toastr.error("No Internet Connection");
    }
  }

   $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          main.Synchronization();
        });
      }, false);

    $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
          main.Synchronization();
        });
      }, false);

      $rootScope.$watch('online',function(online,offline){
          if(online != offline){
              if(online){
                 toastr.success("Connection Established");
                var stringtoken  = $window.localStorage.getItem('token');
                var stringKey   = $window.localStorage.getItem('referKey');
                if(stringtoken && stringKey ){
                      var token    = stringtoken.replace(/"/g,"");
                      var key      = stringKey.replace(/"/g, "");
                }
                var data ='Basic '+token+' '+key;
                var id   = JSON.parse($window.localStorage.getItem('user'))["id"];
                window.dao.sync(id+"/online",data);
              }else{
                toastr.error("No Internet Connection");
                main.getNotification();
              }
          }
      })
     
  
  $interval(function(){
      if($rootScope.online){
      	// console.log(localStorage.getItem('user'));
      	var localDatas = utilService.getItem('user');
      	if(localDatas != null){
      	var userLevel = JSON.parse(localStorage.getItem('user'))['user_level'];
        if(userLevel == 'doctor'){
          main.clinicId = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
        }
      	 // console.log($location.path(),"location pathhhhhhhhhhhhhhhhhh");
      	 if($location.path() == '/appointment'){
      	 	// alert("success");
      	 	 $scope.$broadcast('someEvent');
    		 $scope.$broadcast('someEvents');
      	 }

      	

      	 
            // if($location.path() != '/messages' || $rootScope.messageUpdateCount == true){
            var id = JSON.parse(localStorage.getItem('user'));
            
            if(id != null){
              main.id = JSON.parse(localStorage.getItem('user'))["id"];
              // var userLevel = JSON.parse(localStorage.getItem('user'))['user_level'];
            }
            $rootScope.appIds = [];

            if(userLevel == "clinic"){
                $http.get(url+'messages/getCount?recieverId='+main.id).then(function(resp) {
                      
                            if (resp.data.data.status == 'success') {
                              var unSeenMsg = [];
                              unSeenMsg.push(JSON.stringify(resp.data.data.message));
                              localStorage.setItem('unSeenMsg',unSeenMsg);
                              $rootScope.messageCount = resp.data.data.message.length; 
                              $rootScope.messageNewMessageAlert = true;
                              // $rootScope.$emit("messageInterval", {});
                              // messagesController.getUnreadCount();  
                            }else{
                              $rootScope.messageNewMessageAlert = false;
                              $rootScope.messageCount = 0;
                            }
                });
               

                $http.get(url+'appointments/getCount?clinicId='+main.id).then(function(resp) {
                  $scope.notifyApp = [];
                  $scope.totNotify = [];
                    if (resp.data.data.status == 'success') {
                              angular.forEach(resp.data.data.message, function(Value, Key) {
                              if(Value.fromDevice == 1){
                                    if(Value.status == 0 && Value.appStatus != 'cancel' && Value.appStatus != 'checkOut'){
                                         $scope.notifyApp.push(Value);
                                    }
                                    $rootScope.appIds.push(Value.id);

                                         $scope.totNotify.push(Value);
                                   
                              }
                        });
                              $rootScope.notificationCount = $scope.notifyApp.length;  
                              $rootScope.notify = $scope.totNotify; 
                              console.log($rootScope.notify);
                    }else{
                      $rootScope.notificationCount = 0;
                    }
                });
                // $rootScope.messageUpdateCount = false;
            }else{
              var doctor = JSON.parse(localStorage.getItem('doctor'));
           
              if(doctor != null){
               $http.get(url+'messages/getCount?recieverId='+main.id+'&senderId='+main.clinicId).then(function(resp) {
                            if (resp.data.data.status == 'success') {
                              var unSeenMsg = [];
                              unSeenMsg.push(JSON.stringify(resp.data.data.message));
                              localStorage.setItem('unSeenMsg',unSeenMsg);
                              $rootScope.messageCount = resp.data.data.message.length;   
                            }else{
                              $rootScope.messageCount = 0;
                            }
                });

               $http.get(url+'appointments/getCount?doctorId='+main.id+'&clinicId='+main.clinicId).then(function(resp) {
                console.log(resp);
                  $scope.notifyApp = [];
                            if (resp.data.data.status == 'success') {
                              angular.forEach(resp.data.data.message, function(Value, Key) {
                                if(Value.status == 0 && Value.appStatus != 'cancel' && Value.appStatus != 'checkOut'){
                                     $scope.notifyApp.push(Value);
                                }
                                $rootScope.appIds.push(Value.id);
                              });
                              $rootScope.notificationCount = $scope.notifyApp.length;  
                              $rootScope.notify = resp.data.data.message; 
                            }else{
                              $rootScope.notificationCount = 0;
                            }
                            console.log($rootScope.notify);
                });
             }
              
            } 
           
      }
      }else{
        main.Synchronization();
      }  
    },10000);

  function updateNotifyCount(){
    var view = JSON.parse(localStorage.getItem('user'))['username'];
    var obj = {ids: $rootScope.appIds,viewedBy: view};
  
    var dataObj    =   $.param(obj);
    $http.post(url+'appointments/updateCount',dataObj).then(function(resp) {
       
    });
  }


  function getNotification(){
    $rootScope.notify             = [];
    $rootScope.getAllNotifiaction = [];
    main.id = JSON.parse(localStorage.getItem('user'))["id"];
    var userLevel = JSON.parse(localStorage.getItem('user'))['user_level'];
    if(!$rootScope.online && userLevel == 'clinic'){
      $SQLite.ready(function(){
       this.select('SELECT * FROM practysapp_appointments WHERE practysapp_appointments.clinicId = ? AND practysapp_appointments.status != ? AND practysapp_appointments.isDeleted = ? AND practysapp_appointments.fromDevice = ?',[main.id,'block',"0","1"]).then(function(){
            console.log("empty result");
          },function(){
            console.log("error");
            },function(data){
                $rootScope.notify.push(data.item);
                if($rootScope.notify.length == data.count){
                  main.getAppointmentDetails();
                }
            });
          });
       $SQLite.ready(function(){
       this.select('SELECT * FROM practysapp_appointments  WHERE clinicId = ? AND status = ?',[main.id,'book']).then(function(){
                       console.log("empty result");
                    },function(){
                   console.log("error");
                },function(data){
                      $rootScope.getAllNotifiaction.push(data.item);
                     if($rootScope.getAllNotifiaction.length == data.count){
                        main.AppointmentUserDetails();
                     }
        });
   });
}
}

  function getAppointmentDetails(){
    if($rootScope.notify){
        angular.forEach($rootScope.notify,function(value,key){
            value.appStatus = value.status;
            utilService.getUserDetails(value.clinicId).then(function(resp){
              if(resp){
                 value.Doctor  = resp;
              }else{
                value.Doctor   = [];
              }
            });
            utilService.getUserDetails(value.patientId).then(function(resp){
              if(resp){
                value.Patient = resp;
              }else{
                value.Patient = [];
              }
              
            });
            utilService.getService(value.serviceId).then(function(resp){
              if(resp){
                value.Services = resp;
              }else{
                value.Services = [];
              }
              
            });
            utilService.getSpeciality(value.specialityId).then(function(resp){
              if(resp){
                value.Speciality = resp;
              }else{
                value.Speciality = [];
              }
              
            });
            console.log(value);
        });
    }
  }

  main.logOut = function()
  {
    if($rootScope.online){
      main.image ='';
      main.user = '';
      AuthenticationService.logout().then(function(resp){
        if(resp.data.status == "success"){
          window.dao.deletedData();
        AuthToken.setToken();
        $location.path('/login');
        }else{
          toastr.error(resp.data.message);
        }
      });
    }else{
      toastr.error("No Internet Connection");
    }  
  };
  main.initial = function(){
    
      window.dao.sync();
   Config.getConfig().then(function(config){
               
                main.config     =   config.data.SERVER_PATH;
                // console.log( main.config );
            });

  
  };
 
  $scope.changeLanguage   =   function() 
  {
      //console.log($scope.action.language);
      Locale.changeResources($scope.action.language).then(function(lang) {
          $window.location.href   =   "/"
      });
  };

  $scope.formatDate = function(customDate){
    return moment(customDate).format("MMMM Do YYYY, h:mm a");
  }

  $scope.defaultLanguageCall   =   function() 
  {
     //alert(main);
    //console.log($scope.action.language);
    translationService.getTranslation($scope, 'en-us');  
  };

  $scope.defaultLanguageCall();

  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams,$window) {
      $state.current = toState;
      $scope.currentstate =  $state.current.name;
      $rootScope.activeTab =  $state.current.activetab;
      $rootScope.inventoryPopup = false;
      $rootScope.paymentHistoryPop = false;

   // console.log($scope.currentstate,'currentstateeeeeeeeeeeeee');
       if($scope.currentstate  ===  'login'){
         main.loginpage = true;
         }else if($scope.currentstate  ===  'dashboard'){
            main.user = JSON.parse(localStorage.getItem('user'))["username"];
            main.image = JSON.parse(localStorage.getItem('user'))["image"];
            main.path = JSON.parse(localStorage.getItem('user'))["thumbImage"];
            $rootScope.userLevel  = JSON.parse(localStorage.getItem('user'))["user_level"];
            main.clinicSwitch =false;
            main.dashboard = true;
            main.loginpage = false;
         }else if($scope.currentstate  ===  'clinicName'){
            main.user = JSON.parse(localStorage.getItem('user'))["username"];
            main.image = JSON.parse(localStorage.getItem('user'))["image"];
            main.path = JSON.parse(localStorage.getItem('user'))["thumbImage"];
            $rootScope.userLevel  = JSON.parse(localStorage.getItem('user'))["user_level"];
            main.clinicSwitch =false;
            main.dashboard = true;
            main.loginpage = false;
            main.user = JSON.parse(localStorage.getItem('user'))["username"];
         }else if($scope.currentstate  ===  'drDashboard'){
            main.image = JSON.parse(localStorage.getItem('user'))["image"];
            main.path = JSON.parse(localStorage.getItem('user'))["thumbImage"];
            main.clinicSwitch =false;
            main.dashboard = true;
            main.loginpage = false;
         }else{
            // main.image = JSON.parse(localStorage.getItem('user'))["image"];
            // main.path = JSON.parse(localStorage.getItem('user'))["thumbImage"];
            main.clinicSwitch = true;
            main.loginpage = false;
            // main.dashboard = false;
            main.user = JSON.parse(localStorage.getItem('user'))["username"];
            main.userLevel = JSON.parse(localStorage.getItem('user'))["user_level"];
            if(main.userLevel == 'admin'){

                main.dashboard = true;

            }else if($scope.currentstate  ===  'messages' || $scope.currentstate  ===  'financeLogin' || $scope.currentstate  ===  'patient'){
			
				main.dashboard = false;
				main.wrapperHeight = true;

			}else{
				
				main.wrapperHeight = false;
                main.dashboard = false;
                
            }
            $rootScope.userLevel  =  main.userLevel;
		
            main.image = JSON.parse(localStorage.getItem('user'))["image"];
            main.path = JSON.parse(localStorage.getItem('user'))["thumbImage"];
      
       }

       if($scope.currentstate  !==  'financeLogin' && $scope.currentstate  !==  'finance'){

        sessionStorage.removeItem('finance');
       }
      //console.log( $state.current);
    }
 );
 var h = window.innerHeight;
 $scope.scrollBarconfig = {
    scrollButtons: {
        enable: true // enable scrolling buttons by default
    },
    autoHideScrollbar: true,
    theme: 'light',
    advanced:{
        updateOnContentResize:true,   
        updateOnBrowserResize:true  
    },
        //setHeight: h + 100,
        scrollInertia: 500
    };


main.Synchronization = function(){
 checkConnection.ckIfOnline().then(function(resp){
    if(resp){
       if(resp.data.status == 200){
           $rootScope.online = true;
       }
     }else{
     $rootScope.online = false;
   }
 });
};


function AppointmentUserDetails(){
  if($rootScope.getAllNotifiaction){
    angular.forEach($rootScope.getAllNotifiaction,function(value,key){
        utilService.getUserDetails(value.patientId).then(function(resp){
          if(resp){
            value.patient =  resp; 
          }else{
            value.patient =  {}; 
          }
              
        });
        utilService.getUserDetails(value.doctorId).then(function(resp){
          if(resp){
            value.doctor  = resp;
          }else{
            value.doctor = {};
          }
        });
    });
  }
}
   
// $scope.db = $webSql.openDatabase('practys', '1.0', 'practys DB', 2 * 1024 * 1024); 


// $scope.db.createTable('user',{
//   "id":{
//     "type": "INTEGER",
//     "null": "NOT NULL", // default is "NULL" (if not defined)
//     "primary": true, // primary
//     "auto_increment": true // auto increment
//   },
//   "created":{
//     "type": "TIMESTAMP",
//     "null": "NOT NULL",
//     "default": "CURRENT_TIMESTAMP" // default value
//   },
//   "username":{
//     "type": "TEXT",
//     "null": "NOT NULL"
//   },
//   "password": {
//     "type": "TEXT",
//     "null": "NOT NULL"
//   },
//   "age": {
//     "type": "INTEGER"
//   }
// });
 main.initial();
 main.Synchronization();

}]);
