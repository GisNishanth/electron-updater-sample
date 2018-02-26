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
    .controller('bookAppointmentController', bookAppointmentController);

    bookAppointmentController.$inject = ['$rootScope','$scope','$SQLite','Auth','toastr','$state','utilService','$timeout','appointmentService','utilService','$window','ngDialog'];

    function bookAppointmentController ($rootScope,$scope,$SQLite,Auth,toastr,$state,Utils,$timeout,appointmentService,utilService,$window,ngDialog,ngMessages) {
      if(!Auth.isLoggedIn())
      {
          $state.go('login');
          return false;
      }
      // console.log($rootScope.dateDisplay,'date root');

      var vm = this;
      vm.getSpeciality = getSpeciality;
      vm.getAppointments = getAppointments;
      vm.checkAppointments = checkAppointments;
      vm.init = init;
      vm.close = close;
     // vm.getAppointmentDatas = getAppointmentDatas;
      vm.serviceSelect = false;
      vm.doctorLists = [];
      vm.specialities = [];
      vm.selectedCountry = [];
      vm.userLevel = JSON.parse($window.localStorage.getItem('user'))["user_level"];
      if(vm.userLevel == 'clinic'){
        vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
        vm.clinicName = JSON.parse($window.localStorage.getItem('user'))["username"];
        vm.clinicTime = JSON.parse($window.localStorage.getItem('user'))["clinicTiming"];
      }
      if(vm.userLevel == 'doctor'){
        vm.userId = JSON.parse($window.localStorage.getItem('user'))["id"];
        vm.clinicId = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
         vm.clinicTime = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['clinicTime'];
      }
     
      // vm.startingTime = JSON.parse($window.localStorage.getItem('user'))["startsAt"];
      // vm.closingTime = JSON.parse($window.localStorage.getItem('user'))["endsAt"];
     
      console.log(vm.userLevel,'user levellllllllllllllll');
      vm.appointment = {};
      // vm.patients = {};
      vm.submitted  = false;

    //These variables MUST be set as a minimum for the calendar to work
    vm.viewDate = new Date();
    // console.log(vm.viewDate,'view dateeee');

    var previousDay = new Date(vm.viewDate);
    var futureDay = new Date(vm.viewDate);
    //console.log((vm.viewDate.getMonth() + 1) + 1);
    futureDay.setMonth((vm.viewDate.getMonth() + 1));

    vm.startDate = previousDay;
    vm.maxDate = futureDay;

    // vm.dialog = ngDialog.open(); 

    if($scope.clickTime !=undefined){
      if($rootScope.dateDisplay == 'Today'){
        // alert('today');
        var endDate = new Date();
      }else{
        // alert('Future');
        var endDate = new Date($rootScope.dateDisplay);
        console.log(endDate);
      }
      var time =$scope.clickTime.split(':');
      console.log(time[0]);
      console.log(time[1]);
      // var endDate = new Date();
      endDate.setHours(time[0], time[1], 0);
    }else{
      var endDate = new Date(vm.viewDate);
      // console.log(endDate,'end dateeee');
      endDate.setHours(8, 0, 1);
      // console.log(endDate,'set Hours');
    }

    vm.appointment.endsAt = moment(endDate).toDate();
    vm.appointment.endTime = moment(endDate).toDate();
    // console.log(vm.appointment.endsAt,'ends Attttttt');
    //console.log('endsAt', vm.appointment.endsAt);

    vm.isCellOpen = true;

    // if(vm.userLevel == 'clinic'){
      if($rootScope.online){
        utilService.getPatients(vm.clinicId).then(function(resp){
          if(resp.data.status == 'success'){
            vm.patients = resp.data.message;
            //console.log(vm.patients);
          }
        });
      }else{
        vm.patients = [];
           $SQLite.ready(function(){
              this.select('SELECT *,practysapp_specialityUserMaps.userId AS id FROM practysapp_users INNER JOIN practysapp_specialityUserMaps  ON practysapp_users.id = practysapp_specialityUserMaps.userId  WHERE practysapp_users.user_level="patient" AND practysapp_specialityUserMaps.clinicId=? AND practysapp_specialityUserMaps.specialityId = ? GROUP BY practysapp_users.id',[vm.clinicId,0]).then(function(){
                    console.log('empty result');
                    toastr.error("No Data Found");
                },function(){
                 console.log("error");
              },function(data){
               console.log(data);
               vm.patients.push(data.item);
            });
        });
      }
    

   vm.addEvent = function(obje,patientDetails) {
   
    // console.log(obje);
    // console.log(patientDetails);
    // return false;
    //condition for appointment booked from the patient data
    if(obje.patient == undefined){
      obje.patient = patientDetails.patient;
    }
    // console.log(patientDetails);

       // return false;
  
    vm.submitted  = true;
    if(vm.userLevel == "clinic"){
      if(obje.speciality == undefined || obje.speciality.id == '' || obje.patient.id == '' || obje.doctorId == undefined){
        // toastr.error('You must select all Doctor Speciality and Patient..');
        return false;
      }
    }
    if(vm.userLevel == "doctor"){
      if(obje.specialityId == undefined || obje.patient.id == '' || obje.doctorId == undefined){
        // alert("if");
        return false;
      }
    }

    var appStarts = moment(obje.endsAt).format("HH:mm");
    var appStartDate = moment(obje.endsAt).format("YYYY-MM-DD");
    var currDate = moment(new Date()).format("YYYY-MM-DD");
    var currTime = moment(new Date()).format("HH:mm"); 
    var currTimeMer = moment(new Date()).format("HH:mm a"); 
  
    //Appointment booking completed time restriction
    if(appStartDate == currDate){
      
      if(appStarts < currTime){
        // alert("success");
        toastr.error("Current Time is "+currTimeMer+", Appointment have to be created after "+currTimeMer+" not before that, Thank You");
        return false;
      }

    }
   
          if(obje.check != undefined && obje.check == true){
            var starts = moment(obje.endsAt).format("HH:mm");
            var ends = moment(obje.endTime).format("HH:mm");
            var f = starts.split(':');
            var h = ends.split(':');
            var zz = (+f[0]) * 60 + (+f[1]);
            var yy = (+h[0]) * 60 + (+h[1]);
            // alert(zz);
            // alert(yy);
            // return false;  
            if(zz == yy){
               toastr.error("Service start Time and End Time should not be equal.");
               return false;
            }
            if(zz > yy){
               toastr.error("Service start Time should be Less than End Time");
               return false;
            }else{
              if(yy <= zz+180){
                var timeDiffInStrng = yy - zz;
                obje.serviceTime = timeDiffInStrng;
                // alert(timeDiffInStrng);
                // return false;
              }else{
                 toastr.error("Service Time should be 3hrs or below");
                 return false;
              }
              

            }
          }else{
            // alert("else");
            obje.serviceTime = obje.service.mins;
            
          }
// console.log(obje);
//           return false;
       // if(vm.date == undefined){
       //    // alert("undefined");
       //      var newDate = new Date();
       //      console.log(newDate);
       //      var day = moment(newDate);
       //    console.log(day);
       //  }else{
          // alert("else");
        var date = moment(vm.appointment.endsAt).format("YYYY-MM-DD");
        console.log(date,'ends date');
        var day = moment(date);
        console.log(day,'ends day');
        // }
        
        var daysInCount = day.day();
        var parseTime = JSON.parse(vm.clinicTime);
      	for(var i = 0 ; i < parseTime.length; i++){
	        if(daysInCount == i){
	            vm.startingTime = parseTime[i].open;
	            vm.closingTime = parseTime[i].close;
	            break;
	        }
      	} 
      
        var i;
        var time = moment(vm.appointment.endsAt).format("HH:mm");
        var endsAt = dateAdd(obje.endsAt, 'minute', obje.serviceTime);
        var endytime = moment(endsAt).format("HH:mm");
        //checking the selected time is between start and close of clinic  time
        var a = vm.startingTime.split(':'); // split it at the colonsvm.closingTime
        var b = vm.closingTime.split(':');
        var c = time.split(':'); // split it at the colonsvm.closingTime
        var d = endytime.split(':');
        var tt = (+a[0]) * 60 + (+a[1]);
        var te = (+b[0]) * 60 + (+b[1]);
        var cc = (+c[0]) * 60 + (+c[1]);
        var dd = (+d[0]) * 60 + (+d[1]);
        // alert(vm.startingTime);
        // alert(vm.closingTime);
        // alert(tt);
        // alert(te);
        // alert(cc);
        // alert(dd);
       
        if(cc < tt || cc > te){
        	if(vm.startingTime == "00:00:00" && vm.closingTime == "00:00:00"){
        		toastr.error("Clinic is  OFF");
          		return false;
        	}
          toastr.error("Enter the Time between " +vm.startingTime +" and "+ vm.closingTime);
          return false;
        }else if(dd > te){
        	toastr.error("Service duration is "+ obje.serviceTime + " mins. If you book an appointment at " + time  + " appointment end Time will exceeds clinic closing time."); 
        	
        	return false;
        }
        // 


// Hours are worth 60 minutes.


        
        vm.error = false;
        // console.log(vm.allAppointmentDates, "appTimeeeesssssssssssssss");
        // console.log(vm.allAppointmentTimes, "appTimeeeesssssssssssssss");
        // console.log(vm.allAppointmentEndTimes, "appEndddddddddddddTimeeeesssssssssssssss");
        // console.log(time);
        // console.log(date);
        // console.log(endytime);
        // return false;
        for(i =0 ; i< vm.allAppointmentTimes.length ; i++)
        {
        	// console.log(vm.allAppointmentTimes[i]+"<="+endytime);
        	// console.log(vm.allAppointmentEndTimes[i]+">="+endytime);
        	if(vm.allAppointmentDates[i] == date  && vm.allAppointmentTimes[i] < endytime && vm.allAppointmentEndTimes[i] > endytime){
        		toastr.error("Change the Time,"+"("+endytime+")"+"was Engaged");
        		return false;
        	}
            if(vm.allAppointmentDates[i] == date  && vm.allAppointmentTimes[i] <= time && vm.allAppointmentEndTimes[i] >= time ){
               toastr.error("Change the Time,"+"("+time+")"+"was Engaged");
               vm.error = true;
               // console.log(vm.error);
               return false;
            }else{
              vm.error = false;
            }
              
        }
        // return false; 
          console.log(vm.error);
      if(vm.error == false){
          var endsAt = dateAdd(obje.endsAt, 'minute', obje.serviceTime);
        obje.appointmentStart = obje.endsAt;
        obje.appointmentEnd = endsAt;
        obje.startDate = moment(obje.appointmentStart).format("YYYY-MM-DD");
        obje.startTime = moment(obje.appointmentStart).format("H:mm:ss");
        obje.endDate = moment(obje.appointmentEnd).format("YYYY-MM-DD");
        obje.endTime = moment(obje.appointmentEnd).format("H:mm:ss");
        if(vm.userLevel == "clinic"){
          obje.specialityId = obje.speciality.id;
          obje.createdBy = 'clinic';
          // obje.createdBy = vm.clinicName;
        }
        if(vm.userLevel == "doctor"){
          obje.specialityId = obje.specialityId;
          obje.createdBy = 'doctor';
          // obje.createdBy    = "Dr."+vm.appointment.doctor;
        }
        obje.serviceId = obje.service.id;
        // if(patientDetails != ''){
        //   obje.patientId =  patientDetails.patientId;
        // }else{
           obje.patientId =  obje.patient.id;
        // }
       
        obje.isView = 0;
        obje.clinicId = vm.clinicId;
        if($rootScope.online){
        	$scope.loader = true;
             appointmentService.createAppointment(obje).then(function(resp) {
                if(resp.data.status == 'success'){
                	$scope.loader = false;
                  //condition for appointment booked from the patient data
                    if(patientDetails != '' && patientDetails != undefined){
                    	
                      ngDialog.close();
                      toastr.success(resp.data.message);
                    }else{
                    	
                      $scope.dialogStatus = "success";
                      $scope.$emit('dialogEvent', $scope.dialogStatus);
                    
                      toastr.success(resp.data.message);

                      $state.go('appointment');
                    }
                
                }else{
                  $scope.loader = false;
                  toastr.error(resp.data.message);
                }
            });
        }else{
          toastr.error("No Internet Connection");
        } 
      }
    };

    $scope.openDatePickers = [];

    $scope.open = function($event, datePickerIndex) {
      $event.preventDefault();
      $event.stopPropagation();

      if ($scope.openDatePickers[datePickerIndex] === true) {
        $scope.openDatePickers.length = 0;
      } else {
        $scope.openDatePickers.length = 0;
        $scope.openDatePickers[datePickerIndex] = true;
      }
    };

    function close(){
      ngDialog.close();
    }

    vm.toggle = function($event, field, event) {
      //console.log(event);
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };


    function dateAdd(date, interval, units) {
      var ret = new Date(date); //don't change original date
      switch(interval.toLowerCase()) {
        case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
        case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
        case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
        case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
        case 'day'    :  ret.setDate(ret.getDate() + units);  break;
        case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
        case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
        case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
        default       :  ret = undefined;  break;
      }
      return ret;
    }

    /*
        Getting all appointments with the doctorId and ClinicID
    */

   function getAppointments(){
    // alert("get all");
     vm.allAppointmentTimes = [];
     vm.allAppointmentEndTimes  = [];
     vm.allAppointmentDates = [];
     // if(vm.userLevel == "clinic"){
     //  var clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
     // }
     // if(vm.userLevel == "doctor"){
     //  var clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
     // }
     
     var docId = vm.appointment.doctorId;
     if($rootScope.online){
     appointmentService.getAppointments(null,vm.clinicId,docId,null).then(function(resp) {
          if(resp.data.status == "success"){
            angular.forEach(resp.data.message, function(Value, Key) {
                    vm.allAppointmentTimes.push(moment(Value.appointmentStart).format("HH:mm"));
                    vm.allAppointmentEndTimes.push(moment(Value.appointmentEnd).format("HH:mm"));
                    vm.allAppointmentDates.push(moment(Value.appointmentStart).format("YYYY-MM-DD"));
               });
            }
        }); 
      }
    }

     /*
        Checking the Appointment dates and Time similar or not
    */

     function checkAppointments(){
     var i;
     var time = moment(vm.appointment.endsAt).format("HH:mm");
     var date = moment(vm.appointment.endsAt).format("YYYY-MM-DD");
      for(i =0 ; i< vm.allAppointmentTimes.length ; i++){
            if(vm.allAppointmentDates[i] == date  && vm.allAppointmentTimes[i] == time ){
               toastr.error("Sorry,"+"("+time+")"+"this Time is Engaged for this Doctor");
               vm.error = true;
               return false;
            }else{
              vm.error = false;
            }
          
      }
    }
   

   

    function getSpeciality (){
      // alert("speciality");
      if($rootScope.online){
        if(vm.userLevel == 'clinic'){
           Utils.getSpecialities(vm.clinicId).then(function(resp) {
              vm.specialities = [];
              if(resp.status == 'success'){
                //console.log(resp.message);
                angular.forEach(resp.message, function(value, key) {
                    value.disabled = false;
                    vm.specialities.push(value);

                });
              }
          });
         }
         if(vm.userLevel == 'doctor'){
          // alert("doctor");
           appointmentService.getSpecialitiesServiceByDocId(vm.userId,vm.clinicId).then(function(resp) {
              vm.specialities = [];
              console.log(resp,"response  from doctorrr flow");
              if(resp.data.status == 'success'){
                //console.log(resp.message);
                vm.appointment.specialityId = resp.data.message.Speciality.id;
                 vm.appointment.speciality = resp.data.message.Speciality.name;
                 vm.appointment.doctor = JSON.parse($window.localStorage.getItem('user'))["username"];
                  vm.appointment.doctorId = JSON.parse($window.localStorage.getItem('user'))["id"];
                  vm.serviceDatas = resp.data.message.Service;
              }
          });
         }
      }else{
        vm.specialities = [];
         $SQLite.ready(function(){
              this.select('SELECT * FROM practysapp_services LEFT JOIN  practysapp_specialities ON practysapp_specialities.id = practysapp_services.specialityId  WHERE practysapp_specialities.clinicId =? GROUP BY practysapp_specialities.id',[vm.clinicId]).then(function(){
                       console.log("empty result");
                    },function(){
                   console.log("error");
                },function(data){
                  console.log(vm.specialities);
                      vm.specialities.push(data.item);
                 });
           });
      }
    }

    function init(){
      vm.getSpeciality();
      vm.getAppointments();
    }

    vm.init();

    $timeout(function() {
      //console.log(vm.specialities);
    }, 100);


    $scope.level1Options = {
        onSelect: function (item) {
          vm.doctorLists  = [];
          vm.appointment.doctorId = "";
          vm.appointment.service = "";
          vm.serviceDatas = [];
          vm.doctorId = item.id;
          vm.doctorEnable = false;
          vm.serviceEnable = false;
          vm.appointment.serviceCost = "";
          vm.serviceTimes = "";
            if($rootScope.online){
              $rootScope.practysLoader = true;
                appointmentService.getDoctorsById(vm.clinicId,item.id).then(function(resp) {
                    console.log(resp);
                   

                    if(resp.data.status == 'success'){
                       $rootScope.practysLoader = false;
                       vm.doctorEnable = true;
                      //console.log(resp.message);
                     vm.doctorLists = resp.data.message;
                       // Utils.saveItem("specialityService",vm.specialities);
                      
                    }else{
                       $rootScope.practysLoader = false;
                      toastr.error("No doctors found for this speciality");
                    }
                  
                });
                  vm.specialTimes = item.mins;
                }else{
                    vm.doctorLists = [];
                  $SQLite.ready(function(){
                      this.select('SELECT *,practysapp_specialityUserMaps.userId AS id FROM practysapp_users LEFT JOIN  practysapp_specialityUserMaps ON practysapp_users.id =  practysapp_specialityUserMaps.userId WHERE practysapp_specialityUserMaps.clinicId = ? AND practysapp_specialityUserMaps.specialityId = ? GROUP BY practysapp_users.id',[vm.clinicId,item.id]).then(function(){
                           console.log("empty result");
                           toastr.error("No Data Found");
                        },function(){
                       console.log("error");
                    },function(data){
                      console.log(data);
                      vm.doctorEnable = !vm.doctorEnable;
                          vm.doctorLists.push(data.item);
                     });
                  }); 
                }
            }
    };

    $scope.levelOptions = {
        onSelect: function (item) {
          vm.serviceSelect = true;
          console.log(item);
          console.log(item.id);
          console.log(item.mins);
          vm.appointment.serviceCost = item.cost;
          vm.serviceTimes = item.mins;
          // var specialityService = Utils.RestoreStateObj($window.localStorage.getItem('specialityService'));
          // angular.forEach(specialityService, function(value, key) {
          //   if(item.id == value.id){
          //       vm.serviceDatas= value.services;
          //   }
          // });
          //   // We're simulation the population of the nested options
          //  //console.log(item);
          // vm.specialTimes = item.mins;
          // Utils.getDoctors({id:item.id,clinicId:vm.clinicId}).then(function(resp) {
          //     if(resp.data.status == 'success'){
          //       console.log(resp.data.message);
          //       vm.doctorLists = resp.data.message;
          //     }
            
          // });
           //console.log(vm.doctorLists);
        }
    };
     $scope.patientSelection = {
        onSelect: function (item) {
          console.log(item);
          console.log(item.id);
          
          // var specialityService = Utils.RestoreStateObj($window.localStorage.getItem('specialityService'));
          // angular.forEach(specialityService, function(value, key) {
          //   if(item.id == value.id){
          //       vm.serviceDatas= value.services;
          //   }
          // });
          //   // We're simulation the population of the nested options
          //  //console.log(item);
          // vm.specialTimes = item.mins;
          // Utils.getDoctors({id:item.id,clinicId:vm.clinicId}).then(function(resp) {
          //     if(resp.data.status == 'success'){
          //       console.log(resp.data.message);
          //       vm.doctorLists = resp.data.message;
          //     }
            
          // });
           //console.log(vm.doctorLists);
        }
    };

    // get available date for the doctor
    $scope.doctorSelectptions = {

      onSelect: function (item) {
        vm.appointment.service = "";
        vm.serviceDatas = [];
        vm.serviceEnable = false;
        vm.appointment.serviceCost = "";
          vm.serviceTimes = "";
        if($rootScope.online) {
          $rootScope.practysLoader = true;
          appointmentService.getServicesByDoctor(vm.clinicId,vm.doctorId,item.id).then(function(resp) {
              if(resp.data.status == 'success'){
                vm.serviceEnable = true;
                $rootScope.practysLoader = false;
               vm.serviceDatas = resp.data.message;
              }
          });
        }else{
             vm.serviceDatas = [];
             // console.log(vm.doctorId);
            // var clinicId = angular.fromJson(vm.clinicId);
            // var doctorId = angular.fromJson(vm.doctorId);
            // var userId   = angular.fromJson(item.id);
             $SQLite.ready(function(){
                  this.select('SELECT * FROM practysapp_services LEFT JOIN  practysapp_specialityUserMaps ON practysapp_services.specialityId =  practysapp_specialityUserMaps.specialityId AND practysapp_services.id = practysapp_specialityUserMaps.serviceId WHERE practysapp_specialityUserMaps.clinicId = ? AND practysapp_specialityUserMaps.specialityId = ? AND practysapp_specialityUserMaps.userId = ?',[vm.clinicId,vm.doctorId,item.id]).then(function(){
                       console.log("empty result");
                       toastr.error("No Data Found");
                    },function(){
                   console.log("error");
                },function(data){
                  vm.serviceEnable = !vm.serviceEnable;
                  console.log(data);
                  vm.serviceDatas.push(data.item);
                 });
              });
          }   
        }
    }


    $scope.disabled = function(date, mode) {
       return ( mode === 'day' && ( date.getDay() === 0 ) );
    };


    /* Using Indexed DB For OfflineStorage */
     if(appointmentService.supportsIDB()) {
        appointmentService.getAppointmentDatas();
      } else {
       console.log('unsupported');
     }
    /* Using Indexed DB For OfflineStorage */


  }

})();


