/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   Appointment
 *
 *  Description :   Appointment controller
 *
 *  Developer   :   Karthick
 * 
 *  Date        :   20/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/


(function () {
    'use strict';

 angular
    .module('practysApp')
    .controller('appointmentWaitingController', appointmentWaitingController);

    appointmentWaitingController.$inject = ['moment','calendarAlert', 'calendarConfig','$rootScope','$scope','Auth','$location','toastr','$state','appointmentService','appointmentOfflineService','$timeout', 'utilService','$window'];

    function appointmentWaitingController (moment, calendarAlert, calendarConfig,$rootScope, $scope,Auth,$location,toastr,$state,appointmentService,appointmentOfflineService,$timeout, Utils,$window) {

      var vm = this;
      vm.getWaitingAppointment = getWaitingAppointment;

      vm.getWaitingAppointmentList = getWaitingAppointmentList;
      vm.displayAppointmentList = displayAppointmentList;
      vm.getAppointmentDocList = getAppointmentDocList;

      vm.updateStatus = updateStatus;
      vm.userLevel = JSON.parse($window.localStorage.getItem('user'))["user_level"];
      vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
      // vm.engageWaitingEvents = [];
      console.log($state,"current state nameeeee");

      $scope.$on('someEvent', function(e) {
                             vm.getWaitingAppointment();
              
      });

      function updateStatus(vals,appointmentId){
        console.log(vals);
        console.log($scope);
        // return false;
        // return false;
       vm.appointmentLoader = true;
      
      if(vm.userLevel == 'clinic'){
        var id =JSON.parse($window.localStorage.getItem('user'))["id"];
      }else{
         var id =JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
      }

     
      var obj = {id:appointmentId, status: vals, clinicId: id};
      
      if($rootScope.online){
         appointmentService.updateAppointmentStatus(obj).then(function(resp) {
            if(resp.data.status == 'success'){
              // ngDialog.close();
              // console.log(vals);
              // console.log(appointmentId);
              // return false;
              vm.appointmentLoader = false;
              toastr.success(resp.data.message);
              if(vals == 'engage'){
              	if($state.current.name == "viewAppointment"){
              		vm.getWaitingAppointment();
              		$rootScope.$broadcast('someEvents'); 
              		return false;
              	}else{
              		$state.go('viewAppointment',{appointmentId:appointmentId});
                	return false;
              	}
              }
              $window.location.reload();
            }else{
              toastr.error(resp.data.message);
            }
        });
      }else{
        toastr.error("No Internet Connection");
      } 
    }
      
    // function to get all appointments for month , week and day
    function getWaitingAppointment(){
      
        
      if(vm.userLevel == 'clinic'){
      var id = JSON.parse($window.localStorage.getItem('user'))["id"];
      var docId = $rootScope.drop;
      }else{
       var id = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id']; 
       var docId = JSON.parse($window.localStorage.getItem('user'))["id"];
      }
      
      if(docId != undefined && docId != ''){
        if($rootScope.online){
             appointmentService.getengageWaitingDetails('checkIn',id,docId).then(function(resp) {
              vm.engageWaitingEvents = [];
              if(resp.data.status == 'success'){
                var object = {}; 
                console.log(resp.data.message);

                var datas = resp.data.message;
                angular.forEach(datas, function(value, key) {
                  //console.log(value);
                  //console.log(key);

                   var time = moment(value.appointmentStart).format("hh:mm A");

                  var data = {
                      patientName: value.patient.firstName+' '+value.patient.lastName,
                      patientImage: value.patient.thumbimage+value.patient.image,
                      doctorName: value.doctor.firstName+' '+value.doctor.lastName,
                      colorCode: value.doctor.colorCode,
                      time: time,
                      appointmentId: value.id,
                      appointmentStatus: value.status,
                      type:"waiting"
                    };

                    vm.engageWaitingEvents.push(data);

                    
                });
                console.log(vm.engageWaitingEvents,"engaged list");

              }
            
          });         
        }else if(vm.userLevel == 'clinic'){
           var datas = [];
           vm.engageWaitingEvents = [];
            vm.getWaitingAppointmentList(id,function(appData){vm.getAppointmentDocList(appData,docId,function(appDocData){
              vm.displayAppointmentList(appDocData)
            })});
        }
       }else{
        if($rootScope.online){
              appointmentService.getengageWaitingDetails('checkIn',id).then(function(resp) {
                vm.engageWaitingEvents = [];
                  if(resp.data.status == 'success'){
                    var object = {}; 

                    var datas = resp.data.message;
                    angular.forEach(datas, function(value, key) {
                       var time = moment(value.appointmentStart).format("hh:mm A");
                      var data = {
                          patientName: value.patient.firstName+' '+value.patient.lastName,
                          patientImage:value.patient.thumbimage+value.patient.image,
                          doctorName: value.doctor.firstName+' '+value.doctor.lastName,
                          colorCode: value.doctor.colorCode,
                          time: time,
                          appointmentId: value.id,
                           appointmentStatus: value.status,
                           type:"waiting"
                        };
                        vm.engageWaitingEvents.push(data);  
                    });

                  }
                
            });
        }else if(vm.userLevel == 'clinic'){
          vm.getWaitingAppointmentList(id,function(appData){vm.displayAppointmentList(appData)});
        }
    }
    
  }

  function getWaitingAppointmentList(id,callback){
       var datas  = [];
         appointmentOfflineService.getWaitingList(id,'checkIn').then(function(response){
          if(response){
            if(response.getWaitingList.length > 0){
              datas = response.getWaitingList;
               callback(datas);
            }else{
               callback(datas);
            }
          }
         });
        
    }


    function getAppointmentDocList(appList,date,callback){
      var data = [];
        angular.forEach(appList,function(value,key){
          if(date.indexOf(value.doctorId) != -1){
            data.push(value);
           }
        });
        callback(data);
    }

    function displayAppointmentList(appDataList){
      vm.engageWaitingEvents = [];
        angular.forEach(appDataList,function(value,key){
           var time = moment(value.appointmentStart).format("hh:mm A");
              var data = {
                    time: time,
                    appointmentId: value.id,
                    appointmentStatus: value.status,
                    type:"engage"
                };
                Utils.getUserDetails(value.patientId).then(function(response){
                        data.patientName = response.firstName+' '+response.lastName;
                });
                Utils.getUserDetails(value.doctorId).then(function(response){
                         data.doctorName  = response.firstName+' '+response.lastName;
                         data.colorCode   = JSON.parse(response.colorCode);
                });
                vm.engageWaitingEvents.push(data); 
        });
    }


    vm.getWaitingAppointment();


  }

})();


