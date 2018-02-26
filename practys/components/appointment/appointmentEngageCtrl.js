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
    .controller('appointmentEngageController', appointmentEngageController);

    appointmentEngageController.$inject = ['$scope','$rootScope','Auth','toastr','$state','appointmentService','appointmentOfflineService','$timeout', 'utilService','$window'];

    function appointmentEngageController ($scope,$rootScope,Auth,toastr,$state,appointmentService,appointmentOfflineService,$timeout, Utils,$window) {

      var vm = this;
      vm.getEngageAppoinment = getEngageAppoinment;
      vm.getEngageAppointmentList = getEngageAppointmentList;
      vm.displayAppointmentList = displayAppointmentList;
      vm.getAppointmentDocList = getAppointmentDocList;
      vm.toObject   = toObject;
      
      vm.userLevel = JSON.parse($window.localStorage.getItem('user'))["user_level"];
      vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
      // console.log(vm.sample); 
      //vm.engageWaitingEvents = [];

      $scope.$on('someEvents', function(e) {
                             vm.getEngageAppoinment();
              
      });


      function toObject(arr) {
          var rv = {};
          for (var i = 0; i < arr.length; ++i)
            if (arr[i] !== undefined) rv[i] = arr[i];
          return rv;
      }

      /*$rootScope.$on("myEvent", function (event, args) {
          console.log(args.value);

          vm.getEngageAppoinment();

          console.log("engageWaitingEvents");

          console.log(vm.engageWaitingEvents);
      });*/


    // function to get all appointments for month , week and day
    function getEngageAppoinment(){
    
      if(vm.userLevel == 'clinic'){
      var id = JSON.parse($window.localStorage.getItem('user'))["id"];
      var docId = $rootScope.drop;
      // alert('engage');
      console.log(docId);
      }else{
       var id = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id']; 
       var docId = $rootScope.docId;
      }

      if(docId != undefined && docId != ''){
        vm.engageWaitingEvents = [];
        if($rootScope.online){
            appointmentService.getengageWaitingDetails('engage',id,docId).then(function(resp) {
              vm.engageWaitingEvents = [];
                console.log(resp);
                if(resp.data.status == 'success'){
                  var object = {}; 

                  var datas = resp.data.message;
                  angular.forEach(datas, function(value, key) {
                    //console.log(value);
                    //console.log(key);

                    var time = moment(value.appointmentStart).format("hh:mm A");

                    var data = {
                        patientName: value.patient.firstName+' '+value.patient.lastName,
                        patientImage:value.patient.thumbimage+value.patient.image,
                        doctorName: value.doctor.firstName+' '+value.doctor.lastName,
                        colorCode: value.doctor.colorCode,
                        time: time,
                        appointmentId: value.id,
                        appointmentStatus: value.status,
                        type:"engage"
                      };

                      vm.engageWaitingEvents.push(data);
                      
                  });
                   console.log(vm.engageWaitingEvents,"engaged list");
                }
            });
        }else if(vm.userLevel == 'clinic'){    
            vm.engageWaitingEvents = [];
            vm.getEngageAppointmentList(id,function(appData){vm.getAppointmentDocList(appData,docId,function(appDocData){
              vm.displayAppointmentList(appDocData)
            })});
        }
      }else{
        if($rootScope.online){
          appointmentService.getengageWaitingDetails('engage',id).then(function(resp) {
          vm.engageWaitingEvents = [];
            console.log(resp);
            if(resp.data.status == 'success'){
              var object = {}; 

              var datas = resp.data.message;
              angular.forEach(datas, function(value, key) {
                //console.log(value);
                //console.log(key);

                var time = moment(value.appointmentStart).format("hh:mm A");

                var data = {
                    patientName: value.patient.firstName+' '+value.patient.lastName,
                    patientImage:value.patient.thumbimage+value.patient.image,
                    doctorName: value.doctor.firstName+' '+value.doctor.lastName,
                    colorCode: value.doctor.colorCode,
                    time: time,
                    appointmentId: value.id,
                    appointmentStatus: value.status,
                        type:"engage"
                  };

                  vm.engageWaitingEvents.push(data);
                  
              });

              }
          });
        }else if(vm.userLevel == 'clinic'){
          vm.getEngageAppointmentList(id,function(appData){vm.displayAppointmentList(appData)});
        }
      }
      
    }

    function getEngageAppointmentList(id,callback){
       var datas  = [];
         appointmentOfflineService.getEngageList(id,'engage').then(function(response){
          if(response){
            if(response.getEngageList.length > 0){
              datas = response.getEngageList;
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


    vm.getEngageAppoinment();
   


  }

})();


