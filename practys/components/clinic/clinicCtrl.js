/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   clinicCtrl
 *
 *  Description :   clinic
 *
 *  Developer   :   Nishanth
 * 
 *  Date        :   05/10/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

(function () {
    'use strict';

 angular
    .module('practysApp')
    .controller('clinicController', clinicController);

    clinicController.$inject = ['$scope','Auth','$location','toastr','$state','$window','clinicService'];

    function clinicController ($scope,Auth,$location,toastr,$state,$window,clinicService) {


      // if(!Auth.isLoggedIn())
      // {
      //     $location.path('/login');
      //     return false;
      // }
      var vm = this;
      vm.submit = submit;
      vm.init = init;
      vm.doctor ={};

       vm.doctor.doctorName =JSON.parse($window.localStorage.getItem('user'))["username"];
       vm.id = JSON.parse($window.localStorage.getItem('user'))["id"];
       

       function submit(){
        if(vm.doctor.clinic == "" || vm.doctor.clinic == undefined){
          toastr.error("Select the Clinic");
          return false;
        }else{
          vm.doctor.doctorName =JSON.parse($window.localStorage.getItem('user'))["username"];
          vm.doctor.doctorId = JSON.parse($window.localStorage.getItem('user'))["id"];
          $window.localStorage.setItem('doctor',JSON.stringify(vm.doctor)); 
          console.log(vm.doctor);
          // vm.test = JSON.parse($window.localStorage.getItem('user'));
          // vm.test.origImage="http://54.169.138.244/files/clinic-"+vm.doctor.clinic.id+"/userimages/original/";
          // vm.test.thumbImage="http://54.169.138.244/files/clinic-"+vm.doctor.clinic.id+"/userimages/thumbnail/";
          // $window.localStorage.setItem('user',JSON.stringify(vm.test)); 
          // console.log(vm.test);
         
          $state.go("dashboard");
        }
       }

       function init(){
        vm.clinic = [];
        var id = JSON.parse($window.localStorage.getItem('user'))["id"];
        clinicService.getClinic(id).then(function(resp){
          console.log(resp.data.status);
          if(resp.data.status == "success"){
              if(resp.data.message.length == 1){
                vm.clinics = resp.data.message[0];
                // vm.submit();
                toastr.info("There is One Clinic Only");
              vm.doctor.doctorName =JSON.parse($window.localStorage.getItem('user'))["username"];
              vm.doctor.doctorId = JSON.parse($window.localStorage.getItem('user'))["id"];
              vm.doctor.clinic = vm.clinics;
              vm.test =JSON.parse($window.localStorage.getItem('user'));
              vm.test.origImage="http://54.169.138.244/files/clinic-"+vm.doctor.clinic.id+"/userimages/original/";
          	  vm.test.thumbImage="http://54.169.138.244/files/clinic-"+vm.doctor.clinic.id+"/userimages/thumbnail/";
              $window.localStorage.setItem('user',JSON.stringify(vm.test)); 
              $window.localStorage.setItem('doctor',JSON.stringify(vm.doctor)); 
              // return false;
              $state.go("dashboard");

             }else{
              vm.clinicName = resp.data.message;
               	angular.forEach(vm.clinicName, function(value, key) {
					vm.clinic.push(value.clinicName);
                });
             }
          }else{
                vm.clinicName = "";
                toastr.error("No clinics for this doctor");
          }

        });

       }


      vm.init();

  }

})();