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
    .controller('appointmentController', appointmentController);

    appointmentController.$inject = ['$SQLite','moment', 'calendarAlert', 'calendarConfig','$scope','$rootScope','Auth','$location','toastr','$state','appointmentService','settingOfflineServices','appointmentOfflineService','$timeout', 'utilService','$window','ngDialog','$interval'];

    function appointmentController ($SQLite,moment, calendarAlert, calendarConfig, $scope,$rootScope,Auth,$location,toastr,$state,appointmentService,settingOfflineServices,appointmentOfflineService,$timeout, Utils,$window,ngDialog,$interval) {

      if(!Auth.isLoggedIn())
      {
          $location.path('/login');
          return false;
      }



      $scope.close = function(){
        ngDialog.close();
      }




      var vm = this;
      vm.clinicTime        = [];
      vm.getAllAppointment = getAllAppointment;
      vm.formateWeekDate  = formateWeekDate;
      vm.changeDateCtrl    = changeDateCtrl;
      vm.changeWeekCtrl    = changeWeekCtrl;
      vm.mouse             = mouse;
      vm.init             = init;
      vm.getDoctors        = getDoctors;
      vm.bookPop = bookPop;
      vm.rightPop = rightPop;
      vm.blockPop = blockPop;
      vm.blockTimeSlot = blockTimeSlot;
      vm.getUpdate = getUpdate;
      vm.doctorDetail = doctorDetail;
      vm.AppointmentProcess = AppointmentProcess;
      vm.defaultLoadDate = defaultLoadDate;
      vm.getAllClinicAppointment = getAllClinicAppointment;
      vm.getAppointmentDatasById = getAppointmentDatasById;
      vm.getAppointmentDatasByDate =  getAppointmentDatasByDate;
      vm.getAppointmentByDoctorId = getAppointmentByDoctorId;
      vm.unblockTimeSlot = unblockTimeSlot;
      vm.userLevel = JSON.parse($window.localStorage.getItem('user'))["user_level"];

      vm.popOver = new Array([]);
      if(vm.userLevel == 'clinic'){
      	vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
          vm.clinicTime = JSON.parse($window.localStorage.getItem('user'))["clinicTiming"];
      }else{
      	vm.clinicId = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
        $rootScope.docId = JSON.parse($window.localStorage.getItem('user'))["id"];
          vm.clinicTime = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['clinicTime'];
      }


      calendarConfig.showTimesOnWeekView = true;

      $scope.calendarDayView = 'components/appointment/appointment_day.html';
      $scope.calendarWeekView = 'components/appointment/appointment_week.html';

    //calendarConfig.templates.calendarDayView = 'components/appointment/appointment_day.html';
      vm.dayDoctor = [];
      vm.weekDoctor = [];
      vm.monthDoctor = [];
      vm.showBookApp = false;


      vm.appointment = {};
      vm.appointment.endsAt = moment().startOf('week').add(1, 'week').add(9, 'hours').toDate();

      // vm.events = [];
      // vm.eventsList = [];
      vm.dayDoctorPatient = [];
      vm.mouseover = [];

      //These variables MUST be set as a minimum for the calendar to work
      vm.calendarView = 'month';
      vm.viewDate = new Date();

      //var currentDate = moment(new Date()).format("YYYY-MM-DD");
      // $rootScope.dateDisplay = 'Today';
      $scope.currentCount  = 0;


       /*
       Updating the appointmnet notification counts
      */
      // if($state.params.status == true){
      //   console.log("true");
      //   appointmentService.updateCount(vm.clinicId,$state.params.appointmentId).then(function(resp){
      //     if(resp.data.status == "success"){

      //     }else{
      //       toastr.error("connection error");
      //     }

      //   });
      // }


   /*
      Function is used when the drop down will uncheck it is used to get all the appointments for all doctors
   */
    $scope.selected = function(type,data){
      // alert("multi doctor select");
        if(type == 'day'){
          if(data != [] && data != undefined && data != ''){
            return false;
          }else{
             $rootScope.drop = '';
             vm.toggleCalendar('day',vm.dayDoctor);
          }

        }else if(type == 'week'){
          if(data != [] && data != undefined && data != ''){
            return false;
          }else{
            $rootScope.drop = '';
             vm.toggleCalendar('week',vm.dayDoctor);
          }
        }else{
          if(data != [] && data != undefined && data != ''){
            return false;
          }else{
            $rootScope.drop = '';
             vm.toggleCalendar('month',vm.dayDoctor);
          }
        }
    }


    function getAllClinicAppointment(){
      var data  = [];
        appointmentOfflineService.getAppointment(vm.clinicId).then(function(resp){
          if(resp){
            if(resp.getAppointmentData.length > 0){
                 data = resp.getAppointmentData;
              }
            }
        });
        return data;
    }


      function getUpdate(){
        // alert("updation");
          if($rootScope.drop != '' && $rootScope.drop != undefined){
            // alert("doctorif");
            if($rootScope.dateDisplay != 'Today'){
            	// alert($rootScope.drop);
            	// alert($rootScope.dateDisplay);
              vm.getAllAppointment($rootScope.drop,$rootScope.dateDisplay);
            }else{
              $scope.currentDate = new Date();
              var date = moment($scope.currentDate).format("YYYY-MM-DD");
              // alert($rootScope.drop);
            	// alert(date);
              vm.getAllAppointment($rootScope.drop,date);
            }
          }else{
            // alert("doctorelse");
            // alert($rootScope.dateDisplay);
             if($rootScope.dateDisplay != 'Today'){
              vm.getAllAppointment(null,$rootScope.dateDisplay);
            }else{
              $scope.currentDate = new Date();
              var date = moment($scope.currentDate).format("YYYY-MM-DD");
              vm.getAllAppointment(null,date);
            }
          }
      }


      function mouse (){
        vm.mouseover = true;
      }



      function blockPop(time,id,name){
        $rootScope.popup = false;
        $scope.obj = {};
        $scope.obj.clinicId = vm.clinicId;
        $scope.obj.startTime = time+':'+'00';
        var splitTime = time.split(':');
        var d2 = moment({ hour:splitTime[0], minute:splitTime[1] });
        var d3 = moment(d2).add(15, 'minutes');

        $scope.obj.appointmentStart = d2._d;
        $scope.obj.appointmentEnd = d3._d;
        $scope.obj.endTime =moment(d3).format("HH:mm") +':'+'00';
        $scope.obj.doctorId = id;
        $scope.obj.doctorName = name;
        if($rootScope.dateDisplay == 'Today'){
          $scope.currentDate = new Date();
          var date = moment($scope.currentDate).format("YYYY-MM-DD");
          $scope.obj.date = date;
        }else{
          $scope.obj.date = $rootScope.dateDisplay;
        }


        ngDialog.open({
                      template: 'blockConfirmation',
                      controller:'appointmentController',
                      scope :$scope
                      // className:'ngdialog-theme-default'

                  });
      }

      function blockTimeSlot(obj){
        console.log(vm.eventsList);
        if(vm.userLevel == "clinic"){
          obj.createdBy = JSON.parse($window.localStorage.getItem('user'))["username"];
        }
        if(vm.userLevel == "doctor"){
          obj.clinicId =  JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
          obj.doctorId = JSON.parse($window.localStorage.getItem('user'))["id"];
          obj.createdBy = "DR."+JSON.parse($window.localStorage.getItem('user'))["username"];
        }

        obj.startTime = moment(obj.appointmentStart).format("HH:mm") +':'+'00';
        obj.endTime = moment(obj.appointmentEnd).format("HH:mm") +':'+'00';
          var f = obj.startTime.split(':');
          var h = obj.endTime.split(':');
          var zz = (+f[0]) * 60 + (+f[1]);
          var yy = (+h[0]) * 60 + (+h[1]);

            // return false;
            if(zz > yy){
               toastr.error("Start Time should be Less than End Time");
               return false;
            }else if(zz == yy){
            	toastr.error("Both the start and end time are same, Kindly change the time");
                return false;
            }else{
                var timeDiffInStrng = yy - zz;
                obj.serviceTime = timeDiffInStrng;

            }
        if(obj.reason == undefined){
          toastr.error("Enter the reason before blocking the timeSlot");
          return false;
        }else{
          if($rootScope.online){
            if(obj){
              // var oneDay   = (1000*60);
              // var timeDiff = (((obj.appointmentEnd.getTime() - obj.appointmentStart.getTime()) / (oneDay))*2);
            appointmentService.blockTimeSlot(obj).then(function(resp) {
            	$scope.loader = true;
              if(resp.data.status == "success"){
              	$scope.loader = false;
              	$rootScope.practysLoader = false;
                toastr.success(resp.data.message);
                vm.getUpdate();
                 // vm.eventsList[moment(obj.appointmentStart).format("HH:mm")] = {};
                 // vm.eventsList[moment(obj.appointmentStart).format("HH:mm")][obj.doctorId] = {};
                 // vm.eventsList[moment(obj.appointmentStart).format("HH:mm")][obj.doctorId] =  resp.data.data;
                 // vm.eventsList[moment(obj.appointmentStart).format("HH:mm")][obj.doctorId]['divHeight'] = timeDiff+'px';
                 ngDialog.close();
              }else{
              	$scope.loader = false;
              	$rootScope.practysLoader = false;
                toastr.error(resp.data.message);
              }
          });
          }
          }
        }
      }


      //unblock timeslot
      function unblockTimeSlot(id){
      	if(id){
      		$rootScope.practysLoader = true;
      		 appointmentService.unblockTimeSlot(id).then(function(resp) {
              if(resp.data.status == "success"){
              	$rootScope.practysLoader = false;
                toastr.success(resp.data.message);
                vm.getUpdate();
                 ngDialog.close();
              }else{
              	$rootScope.practysLoader = false;
                toastr.error(resp.data.message);
              }
          });
      	}else{
      		toastr.error("Id is missing");
      		return false;
      	}

      }


      /*
        Right click functionality for book and block time slot
      */

      function rightPop(time,index,timeM){
        // console.log(vm.popOver,index);

        vm.popOver[time][index] = false;
        vm.rightClickTime = time;
        // vm.rightClickTimeM = timeM;
        // alert("right click works");

      }

      /*
        Book an appointment by double clicking the calender in day view
      */
      function bookPop(time){
        $rootScope.popup = false;
        // alert(time);
        // console.log(time,'appointment timeeee');
        $scope.clickTime = time;
        if($rootScope.online){
           ngDialog.open({
                      template: 'components/appointment/book_appointment.html',
                      controller:'bookAppointmentController',
                      scope :$scope
                      // className:'ngdialog-theme-default'

                  });
         }else if(vm.userLevel == 'clinic'){
            toastr.error("No Internet Connection");
         }
      }


       /*
        It connectes the book appoitnment controller, after booking appointment by ryt clicking the particular Time slot , returning to get particular appointment on calender.
      */
      $scope.$on('dialogEvent', function(e,args) {
      	// alert("success");
      	console.log(args,"appointment controller");
        if(args == "success"){
          vm.getUpdate();
          ngDialog.close();
        }
      });


      /*functionality to change the next previous to change the date */

      function changeDateCtrl (vals){

        // alert(vals);
        // alert($rootScope.dateDisplay);
        // alert($scope.currentCount);
        // finding date difference
        if($rootScope.dateDisplay == 'Today'){
          $scope.currentDate = new Date();
          var date = moment($scope.currentDate).format("YYYY-MM-DD");
          var date1 = new Date($scope.currentDate);
          var date2 = new Date(date);
        }else{
          $scope.currentDate = new Date();
          var date = moment($scope.currentDate).format("YYYY-MM-DD");
          var date1 = new Date($scope.currentDate);
          var date2 = new Date($rootScope.dateDisplay);
        }

       if(date == $rootScope.dateDisplay){
       	$rootScope.dateDisplay = 'Today';
       }
       if($rootScope.dateDisplay != 'Today'){
          var timeDiff = Math.abs(date2.getTime() - date1.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          $scope.currentCount = diffDays;
        }else{
          $scope.currentCount = 0;
        }

        $rootScope.dateDisplay = [];
        vm.eventsList = [];

        var nextDay = new Date();

        if(vals == 'prev'){
          if($scope.currentCount  <= 1){
            // alert("welcome");
            $rootScope.dateDisplay = 'Today';
            $scope.currentDate = new Date();
                var date = moment($scope.currentDate).format("YYYY-MM-DD");
                // alert(date);
                if($rootScope.drop!= undefined){
                  vm.getAllAppointment($rootScope.drop,date);
                }else{

                  vm.getAllAppointment(null,date);
                }
            return false;
          }else{
            $scope.currentCount --;
          }
        }else{
          // alert("else");
          $scope.currentCount ++;

        }
        if($scope.currentCount  == 0){
          $rootScope.dateDisplay = 'Today';

        }
        // alert($scope.currentCount);
        var dateIncrement = nextDay.getDate() + $scope.currentCount ;
        nextDay.setDate(dateIncrement);
        $rootScope.dateDisplay = moment(nextDay).format("YYYY-MM-DD");
        // alert($rootScope.dateDisplay);
        /*Displaying the appointments by changing the date*/

            if($rootScope.drop!= undefined){

              vm.getAllAppointment($rootScope.drop,$rootScope.dateDisplay);
            }else{
              // alert($scope.currentCount);
              vm.getAllAppointment(null,$rootScope.dateDisplay);
            }

      };

      function formateWeekDate(datevalue){
        // console.log(datevalue,"date Valueeeeeeeeee");
        return moment(datevalue).format('MMM') + ' ' + moment(datevalue).format('YYYY') + ' - WEEK ' + moment(datevalue).week();
      }

      /*functionality to change the next previous to change the date */

      function changeWeekCtrl (vals){
        // alert("week");
        console.log(vals);
        // alert("change date");
        // $scope.WeekDisplay = moment().format('MMM') + ' ' + moment().format('YYYY') + ' - WEEK ' + moment().week();
        // //var nextDay = new Date();

        // var weeknumber = moment("04-23-2017", "MMDDYYYY").week();

        // var currentDate = moment('2017-03-23').format("YYYY-MM-DD");

        // var weekStart = currentDate.clone().startOf('week');
        // var weekEnd = currentDate.clone().endOf('week');

        // if(vals == 'prev'){
        //   if(currentCount <= 1){
        //     $scope.weekDisplay = moment().format('MMM') + ' ' + moment().format('YYYY') + ' - WEEK ' + moment().week();
        //     $scope.currentDate = new Date();

        //          var days = [];
        //           var daysStr = [];
        //           for (var i = 0; i <= 6; i++) {
        //               days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
        //               daysStr.push({'Date': moment(weekStart).add(i, 'days').format("D"), 'Days': moment(weekStart).add(i, 'days').format("ddd")});
        //           };

        //           vm.weekDaystr = daysStr;
        //           vm.weekDays = days;

        //         if($rootScope.drop!= undefined){
        //           vm.getAllAppointment($rootScope.drop,days,'week');
        //         }else{

        //           vm.getAllAppointment(null,days,'week');
        //         }
        //     return false;
        //   }else{
        //     currentCount--;
        //   }
        // }else{
        //   currentCount++;

        // }
        // if(currentCount == 0){
        //   //$rootScope.dateDisplay = 'Today';
        //   $scope.weekDisplay = moment().format('MMM') + ' ' + moment().format('YYYY') + ' - WEEK ' + moment().week();

        // }

        // var new_date = moment(currentDate, "YYYY-MM-DD").add('week',currentCount);
        // //var dateIncrement = nextDay.getDate() + currentCount;
        // currentDate.setDate(new_date);
        // //$rootScope.dateDisplay = moment(nextDay).format("YYYY-MM-DD");

        // var weekStart = new_date.clone().startOf('week');
        // var weekEnd = new_date.clone().endOf('week');

        // $scope.weekDisplay = new_date.format('MMM') + ' ' + new_date.format('YYYY') + ' - WEEK ' + new_date.week();

        vm.eventsList = [];

        var weekStart = moment(vals).startOf('week');

        var days = [];
        var daysStr = [];
        for (var i = 0; i <= 6; i++) {
            days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
            daysStr.push({'Date': moment(weekStart).add(i, 'days').format("D"), 'Days': moment(weekStart).add(i, 'days').format("ddd")});
        }

        vm.weekDaystr = daysStr;
        vm.weekDays = days;

        /*Displaying the appointments by changing the date*/

        if($rootScope.drop!= undefined){
          vm.getAllAppointment($rootScope.drop,days,'week');
        }else{
          vm.getAllAppointment(null,days,'week');
        }

      };



    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function(args) {
        alert.show('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function(args) {
        alert.show('Deleted', args.calendarEvent);
      }
    }];


    vm.isCellOpen = false;
    vm.viewChangeEnabled = false;

    vm.eventClicked = function(event) {
      $state.go('viewAppointment', {appointmentId: event.appointmentId});
    };

    vm.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    vm.eventDeleted = function(event) {
      alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
      alert.show('Dropped or resized', event);
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

    vm.toggle = function($event, field, event) {
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

    vm.doctorListDatas = {};

    vm.weekDays = {};
    vm.weekDaystr = {};

    vm.doctorIds = [];
    vm.doctorNames = [];
    vm.doctorNamesList = [];

    function getDoctorDetails(){
      vm.dayDoctor = [];
      vm.weekDoctor = [];
      vm.monthDoctor = [];
      vm.doctorNamesList = [];

       if(vm.userLevel == 'clinic'){
        var id = JSON.parse($window.localStorage.getItem('user'))["id"];
      }
      else if(vm.userLevel == 'doctor'){
        var id = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
         var docId = [];
         docId.push(JSON.parse($window.localStorage.getItem('user'))["id"]);
      }

      $rootScope.practysLoader = true;
      if($rootScope.online){
          Utils.getDoctors(null,id,null).then(function(resp){
            if(resp.data.status == 'success'){
              $rootScope.practysLoader = false;
                 vm.doctorNamesList = resp.data.message;
                 // vm.doctorDetail(docId,resp.data.message);
            }
        });
      }else if(vm.userLevel == 'clinic'){
              settingOfflineServices.getClinicDoctor(id).then(function(resp){
                  if(resp){
                    if(resp.clinicDoctorData.length > 0){
                      vm.doctorNamesList = resp.clinicDoctorData;
                    }else{
                      vm.doctorNamesList = [];
                    }
                  }
              });
      }
    }


    function getDoctors(docId){
        vm.doctorNames = [];
       if(vm.userLevel == 'clinic'){
        var id = JSON.parse($window.localStorage.getItem('user'))["id"];
      }
      else if(vm.userLevel == 'doctor'){
        var id = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
         var docId = [];
         docId.push(JSON.parse($window.localStorage.getItem('user'))["id"]);
      }
      if($rootScope.online){
        $rootScope.practysLoader = true;
         Utils.getDoctors(null,id,null).then(function(resp){
            if(resp.data.status == 'success'){
              $rootScope.practysLoader = false;
                 vm.doctorNames = resp.data.message;
                 vm.doctorDetail(docId,resp.data.message);
            }
        });
      }else if(vm.userLevel == 'clinic'){
        vm.doctorNames = [];
          $SQLite.ready(function(){
              this.select('SELECT *,practysapp_specialityUserMaps.userId AS id FROM practysapp_users INNER JOIN practysapp_specialityUserMaps  ON practysapp_users.id = practysapp_specialityUserMaps.userId  WHERE practysapp_users.user_level="doctor" AND practysapp_specialityUserMaps.clinicId=? AND practysapp_specialityUserMaps.specialityId != ? GROUP BY practysapp_users.id',[id,0]).then(function(){
                    console.log('empty result');
                    toastr.error("No Data Found");
                },function(){
                 console.log("error");
              },function(data){
               vm.doctorNames.push(data.item);
            });
        });
          $timeout(function(){
              if(docId == null || docId == undefined){
                 vm.doctorDetail(docId,vm.doctorNames);
              }
          },1000);
      }
    }

    function doctorDetail(docId,resp){
        if(docId == null || docId == undefined){
                    vm.doctorListDatas = {};
                    vm.doctorIds = [];
                    if(resp){
                         angular.forEach(resp, function(Value, Key) {
                            vm.doctorIds[Value.id] = Value.id;
                            vm.doctorListDatas[Value.id] = Value.firstName+' '+Value.lastName;
                      });
                    }
                     var keys = Object.keys(vm.doctorListDatas);
                     vm.len = keys.length;
                  }else{
                    vm.doctorListDatas = {};
                    vm.doctorIds = [];
                    angular.forEach(resp, function(Value, Key) {
                      for(var i = 0 ; i < docId.length ;i++){
                        if(Value.id == docId[i]){
                        vm.doctorIds[Value.id] = Value.id;
                        vm.doctorListDatas[Value.id] = Value.firstName+' '+Value.lastName;
                      }
                     }
                    });
                     var keys = Object.keys(vm.doctorListDatas);
                     vm.len = keys.length;
                }
    }



     // function to get all appointments for month , week and day
    function getAllAppointment(docId,date,calType){
      // console.log(date);

       vm.calenderDate = $rootScope.dateDisplay;
       if($rootScope.dateDisplay == 'Today'){
        vm.calenderDate = new Date();
       }
       //  var oneDay = 24*60*60*1000;
       //  var firstDate = new Date();
       //   if($rootScope.dateDisplay == 'Today'){
       //      var secondDate = new Date();
       //    }else{
       //       var secondDate = new Date(vm.calenderDate);
       //    }

       //  var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
       //  $scope.currentCountt = diffDays;
      // alert($scope.currentCount);
      $rootScope.practysLoader = true;
         vm.date = date;
         vm.eventsList = [];
         vm.leaveList = [];
        if(vm.userLevel == 'clinic'){
          var id = JSON.parse($window.localStorage.getItem('user'))["id"];
           var getLeaveDays = JSON.parse(JSON.parse($window.localStorage.getItem('user'))["clinicTiming"]);
          if(getLeaveDays.length > 0){
              vm.getLeaveDetails(getLeaveDays);
          }
        }
        else if(vm.userLevel == 'doctor'){
          var id = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
          var docId = JSON.parse($window.localStorage.getItem('user'))["id"];
          var getLeaveDays  =   JSON.parse(JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['clinicTime']);
          if(getLeaveDays.length > 0){
               vm.getLeaveDetails(getLeaveDays);
          }
        }
        if($rootScope.online){
          appointmentService.getAppointments(null,id,docId,date).then(function(resp) {
            console.log(resp,"appoinmentttttttttttt");
            vm.events = [];
            if(resp.data.status == 'success'){
             $rootScope.practysLoader = false;
                var object = {};
                var datas = resp.data.message;
                vm.AppointmentProcess(datas,object,'online',calType);
              }else{
                $rootScope.practysLoader = false;
               vm.defaultLoadDate();
                 }
          });
        }else if(vm.userLevel == 'clinic'){
          if(id && date && docId){
             var object = {};
             var datas  = [];
             vm.events  = [];
             var selectDate = [];
            if(angular.isString(date)){
                selectDate.push(date);
            }else{
              selectDate = date;
            }
            appointmentOfflineService.getAppointment(id).then(function(resp){
              if(resp){
                  if(resp.getAppointmentData.length > 0){
                      datas   = resp.getAppointmentData;
                    vm.getAppointmentDatasById(datas,function(appDataId){ vm.getAppointmentDatasByDate(appDataId,selectDate,function(appDataDate){
                            vm.getAppointmentByDoctorId(appDataDate,docId,function(appDataDoc){
                              vm.AppointmentProcess(appDataDoc,object,'offline',calType);
                            })
                        })
                      });
                   }
              }
            });
             return false;

        }else if(id && date){
            var selectDate = [];
            if(angular.isString(date)){
                selectDate.push(date);
            }else{
              selectDate = date;
            }
             var object  = {};
             var datas   = [];
             vm.events   = [];
              appointmentOfflineService.getAppointment(id).then(function(resp){
              if(resp){
                  if(resp.getAppointmentData.length > 0){
                      datas   = resp.getAppointmentData;
                    vm.getAppointmentDatasById(datas,function(appDataId){ vm.getAppointmentDatasByDate(appDataId,selectDate,function(appDataDate){
                               vm.AppointmentProcess(appDataDate,object,'offline',calType)
                        })
                      });
                   }
              }
            });
            return false;
        }else if(id && docId){
           var object = {};
           var datas  = [];
           vm.events     = [];
            appointmentOfflineService.getAppointment(id).then(function(resp){
              if(resp){
                  if(resp.getAppointmentData.length > 0){
                      datas  = resp.getAppointmentData;
                    vm.getAppointmentDatasById(datas,function(appDataDocId){vm.getAppointmentByDoctorId(appDataDocId,docId,function(appDataId){
                      vm.AppointmentProcess(appDataId,object,'offline',calType)
                    })
                  });
                  }
              }
            });
            return false;
        }else if(id){
          var object    = {};
          var datas     = [];
          vm.events     = [];
           appointmentOfflineService.getAppointment(id).then(function(resp){
            if(resp){
              if(resp.getAppointmentData.length > 0){
                  datas =  resp.getAppointmentData;
                  vm.getAppointmentDatasById(datas,function(appData){vm.AppointmentProcess(appData,object,'offline',calType)});
              }
            }
           });
        }
      }
    }


    function getAppointmentDatasById(appointmentData,callback){
      var data   =  [];
              angular.forEach(appointmentData,function(value,key){
                console.log(value);
                if(value.status != "block"){
                  data.push(value);
                }
              });
              callback(data);
    }

    function getAppointmentDatasByDate(appointmentData,date,callback){
      var data = [];
        angular.forEach(appointmentData,function(value,key){
          if(date.indexOf(value.startDate) != -1){
            data.push(value);
          }
        });
        callback(data);
    }


    function getAppointmentByDoctorId(appointmentData,date,callback){
        var data = [];
        angular.forEach(appointmentData,function(value,key){
          if(date.indexOf(value.doctorId) != -1){
            data.push(value);
           }
        });
        callback(data);
    }


      function AppointmentProcess(datas,object,type,calType){
                     $rootScope.practysLoader = true;
                     console.log(vm.events);
          angular.forEach(datas, function(value, key) {
             var today = new Date();
             var colorConfig;
             var startDate = moment(value.appointmentStart).format("YYYY-MM-DD HH:mm");
             var dbEndDate = moment(value.appointmentEnd).format("YYYY-MM-DD HH:mm");
             var startrDate = moment(value.appointmentStart).format("YYYY-MM-DD");
             var endDate = moment(today).format("YYYY-MM-DD");
             var startMin = moment(value.appointmentStart).format("HH:mm");
             var endMin = moment(value.appointmentEnd).format("HH:mm");
             var endDateMin = moment(today).format("HH:mm");
             var b = moment(startDate); //todays date
             var a = moment(dbEndDate); // another date
             var classname = "futureCls";
              if(startDate >  endDate){
                  colorConfig = calendarConfig.colorTypes.important;
              }else if(startrDate == endDate){
                  if(endDateMin >=  startMin  &&  endDateMin <= endMin){
                    colorConfig = calendarConfig.colorTypes.info;
                  }else if(startMin > endDateMin){
                    colorConfig = calendarConfig.colorTypes.important;
                  }else if(startMin < endDateMin){
                    classname = "pastCls";
                    colorConfig = calendarConfig.colorTypes.warning;
                  }
              }else{
                  classname = "pastCls";
                  colorConfig = calendarConfig.colorTypes.warning;
              }
              var remHours = a.diff(b, 'minutes');

              if(type == 'online'){
                    var data = {
                    	
                    	clinicId:vm.clinicId,
                        status:value.status,
                        title: value.patient.firstName+' '+value.patient.lastName,
                        description: value.doctor.firstName+' '+value.doctor.lastName,
                        colorCode:value.doctor.colorCode,
                        startsAt: new Date(value.appointmentStart),
                        endsAt: new Date(value.appointmentEnd),
                        remHour: remHours,
                        color: colorConfig,
                        draggable: false,
                        resizable: false,
                        cssClass: classname,
                        appointmentId: value.id,
                        age:value.patient.age,
                        birthday:value.patient.birthday,
                        gender:value.patient.gender
                    };
                    vm.events.push(data);
                    console.log(vm.events,"eventsssssssssssssssssssssssssssssssss");
                    var divHeight = '0px';
                    if(remHours == 15){
                      divHeight = '30px';
                    }else{
                      var splithours = remHours/15;
                      divHeight =  (30*splithours) + 'px';
                    }
                    // $rootScope.practysLoader = false;



                    if(object.hasOwnProperty(startMin)){
                      // console.log("startMin");
                      if(calType == 'week'){
                        // console.log("week");
                        //console.log('test');
                        if(!object[startMin].hasOwnProperty(value.startDate)){
                          object[startMin][value.startDate] = [];
                        }
                        data.divHeight = divHeight;
                        object[startMin][value.startDate].push(data);
                      }else{
                        // console.log("else week");
                        object[startMin][value.doctor.id] = [];
                        data.divHeight = divHeight;
                        object[startMin][value.doctor.id] = data;
                      }

                    }else{
                      // console.log("else startMin");
                      if(calType == 'week'){
                        // console.log("week");
                        object[startMin] = {};
                        object[startMin][value.startDate] = [];
                        data.divHeight = divHeight;
                        object[startMin][value.startDate].push(data);

                        //console.log(object);
                      }else{
                         // console.log("else week");
                        object[startMin] = {};
                        object[startMin][value.doctor.id] = [];
                        data.divHeight = divHeight;
                        object[startMin][value.doctor.id] = data;
                      }
                    }

                    if(calType != 'week'){
                     angular.forEach(object, function(value, key) {
                        angular.forEach(vm.doctorIds, function(values, keys) {
                          if (!(values in value)){
                            object[key][values] = [];
                            var arra = {
                            "title": "none"
                            };
                            object[key][values] = arra;
                          }
                        });
                     });
                    }

                    $timeout(function(){
	                    $scope.$apply(function(){
	                    vm.eventsList = object;
	                    console.log(vm.eventsList,"testing");
	                    });
                    },10);
                    vm.defaultLoadDate();


               }
               else if(type == 'offline'){
                    var data    = {};
                    data.id          =  value.doctorId;
                    if(value.doctor){
                            data.description = value.doctor.firstName+' '+value.doctor.lastName,
                            data.colorCode   = JSON.parse(value.doctor.colorCode);
                    }
                    if(value.patient){
                          data.title       = value.patient.firstName+' '+value.patient.lastName,
                          data.age         = value.patient.age,
                          data.birthday    = value.patient.birthday,
                          data.gender      = value.patient.gender
                    }
                    data.startsAt      =  new Date(value.appointmentStart);
                    data. endsAt       =  new Date(value.appointmentEnd);
                    data.remHour       =  remHours;
                    data.status        = value.status;
                    data.color         =  colorConfig;
                    data.draggable     =  false;
                    data.resizable     =  false;
                    data.cssClass      =  classname;
                    data.clinicId      = vm.clinicId;
                    data.appointmentId =  value.id;
                    vm.events.push(data);

                    var divHeight = '0px';
                    if(remHours == 15){
                      divHeight = '30px';
                    }
                    else{
                      var splithours = remHours/15;
                      divHeight =  (30*splithours) + 'px';
                    }

                    if(object.hasOwnProperty(startMin)){
                      if(calType == 'week'){
                        if(!object[startMin].hasOwnProperty(value.startDate)){
                          object[startMin][value.startDate] = [];
                        }
                        data.divHeight = divHeight;
                        object[startMin][value.startDate].push(data);
                      }else{
                        object[startMin][value.doctor.id] = [];
                        data.divHeight = divHeight;
                        object[startMin][value.doctor.id] = data;
                      }
                    }
                    else{
                      if(calType == 'week'){
                        object[startMin] = {};
                        object[startMin][value.startDate] = [];
                        data.divHeight = divHeight;
                        object[startMin][value.startDate].push(data);
                      }else{
                        object[startMin] = {};
                        object[startMin][value.doctor.id] = [];
                        data.divHeight = divHeight;
                        object[startMin][value.doctor.id] = data;
                      }
                    }

                    if(calType != 'week'){
                      angular.forEach(object, function(value, key) {
                        angular.forEach(vm.doctorIds, function(values, keys) {
                          if (!(values in value)){
                            object[key][values] = [];
                            var arra = {
                              "title": "none"
                            };
                            object[key][values] = arra;
                          }
                        });
                      });
                    }

                    $timeout(function(){
                      $scope.$apply(function(){
                        vm.eventsList = object;
                      });
                    },1000);

                    vm.defaultLoadDate();

               }
          });
        }

      //Functionality for convertion of time into minutes

     function defaultLoadDate(){
      // console.log(vm.clinicTime);
       // $rootScope.practysLoader = true;
       if(vm.date == undefined){
            var newDate = new Date();
            var day = moment(newDate);
          }else{
            var day = moment(vm.date);
        }
        // console.log(day);
           var daysInCount = day.day();
           // console.log(daysInCount);
            var parseTime = JSON.parse(vm.clinicTime);
            for(var i = 0 ; i < parseTime.length; i++){
              if(daysInCount == i){
                 vm.startingTime = parseTime[i].open;
                 vm.closingTime = parseTime[i].close;
                 break;
              }
            }
            // console.log(vm.startingTime);
            // console.log( vm.closingTime);
            var a = vm.startingTime.split(':'); // split it at the colonsvm.closingTime
           if(vm.closingTime != '00:00:00'){
               var b =  vm.closingTime.split(':');
            }else{
                vm.closingTime = '23:00:00';
                var b = vm.closingTime.split(':');
            }
                // Hours are worth 60 minutes.
           var tt = (+a[0]) * 60 + (+a[1]);
           var te = (+b[0]) * 60 + (+b[1]);
           vm.min = tt;
           vm.max = te;

            //function cboHrsAMPM(){
              //debugger;
           var x = 15; //minutes interval
           vm.times = []; // time array
              // var tt = 480; // start time
           var ap = ['AM', 'PM']; // AM-PM

              //loop to increment the time and push results in array
            for (var i=7;tt<te+15; i++) {
                var hr = {};
                var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
                var mm = (tt%60); // getting minutes of the hour in 0-55 format
                var index = ("0" + (hh)).slice(-2) + ':' + ("0" + mm).slice(-2);
                hr[index] = {};
                hr[index]['orig'] = index;
                hr[index]['text'] = ((hh != 12) ? ("0" + (hh % 12)).slice(-2) : 12 )+ ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
                tt = tt + x;
                vm.times.push(hr);

             }
                //Functionality for getting the start and close time for clinic

            angular.forEach(vm.times, function(values, keys) {
                if(keys == 0){
                   angular.forEach(values, function(values, keys) {
                                  // console.log(values);
                                  vm.startTime =keys;
                                  // console.log(keys);
                                });
                  }
                            //end time
                if(keys == vm.times.length - 1){
                    angular.forEach(values, function(values, keys) {
                          vm.closeTime = keys;
                    });
                     // $rootScope.practysLoader = false;
                }
          });
            $timeout(function(){
                $rootScope.practysLoader = false;
            },100);
     }


      function init(){
       // alert($rootScope.dateDisplay);
        if($rootScope.dateDisplay != undefined){
          vm.calendarView = 'day';
          vm.toggleCalendar('day',undefined,$rootScope.dateDisplay);
        }else{
        	vm.getAllAppointment(null);
        	$scope.toggleView = true;
   			  vm.dropMonth = true;
        }
        vm.getDoctors(null);
        getDoctorDetails(null);
      }






    vm.toggleCalendar = function(value,docArr,dateFromMonth){
    	$('.popover').popover('destroy');
    	vm.events = [];
    	vm.eventsList = [];
    	// console.log(vm.events);
    	// console.log(vm.eventsList);

    	// alert($rootScope.dateDisplay);
    	// console.log($rootScope.dateDisplay);
      // alert(dateFromMonth);
      if(dateFromMonth){
        $rootScope.dateDisplay = dateFromMonth;
      }else{
        $rootScope.dateDisplay = 'Today';
        $scope.currentCount = 0;
      }

      if(!docArr && ! dateFromMonth && value){
        getDoctorDetails();
      }

      if(value == 'day'){
      	$interval(function(){
			     	  var minutes = moment().format('mm');
			     	  if(minutes < 15){
			     	  	var setMinute = moment().minutes(0);
			     	  	$scope.repeatDate = moment(setMinute).format('hh:mmA');
			     	  	 // $scope.repeatDate = moment().format('hh:mmA');
			     	  }else if(minutes < 30){
			     	  	var setMinute = moment().minutes(15);
			     	  	$scope.repeatDate = moment(setMinute).format('hh:mmA');
			     	  }else if(minutes < 45){
			     	  	var setMinute = moment().minutes(30);
			     	  	$scope.repeatDate = moment(setMinute).format('hh:mmA');
			     	  }else if(minutes > 45){
			     	  	var setMinute = moment().minutes(45);
			     	  	$scope.repeatDate = moment(setMinute).format('hh:mmA');
			     	  }
			     	  $scope.curTiming = moment().format('hh:mmA');
		},1000);
      }

      if(vm.userLevel == "clinic"){
              if(value == 'day' ){



                  vm.showBookApp = true;
                  vm.dropDay = true;
                  vm.dropWeek = false;
                  vm.dropMonth = false;
                  $scope.toggleView = false;
                  if($rootScope.dateDisplay != 'Today'){
                    var date = $rootScope.dateDisplay;
                  }else{
                    $scope.currentDate = new Date();
                    var date = moment($scope.currentDate).format("YYYY-MM-DD");
                  }

                  if(docArr != '' && docArr != undefined && docArr != []){
                    // alert("appointments getting if");
                      $rootScope.drop = docArr;
                      vm.getAllAppointment(docArr,date,'day');
                      vm.getDoctors(docArr);
                      $scope.$broadcast ('someEvent');
                      $scope.$broadcast ('someEvents');
                  }else{
                   // alert("appointments getting else");
                      vm.getAllAppointment(undefined,date,'day');
                      vm.getDoctors(null);
                      $scope.$broadcast ('someEvent');
                      $scope.$broadcast ('someEvents');
                  }
                  $timeout(function(){
                       $scope.curTimeWidth = $(".main-table").width();
                  },1000);
                }else if(value == 'week' ){
                  vm.showBookApp = false;
                  vm.dropDay = false;
                  vm.dropWeek = true;
                  vm.dropMonth = false;
                  $scope.toggleView = false;
                  // $rootScope.drop = vm.dropSelect;

                  var currentDate = moment();

                  var weekStart = currentDate.clone().startOf('week');
                  var weekEnd = currentDate.clone().endOf('week');

                  var days = [];
                  var daysStr = [];
                  for (var i = 0; i <= 6; i++) {
                      days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
                      daysStr.push({'Date': moment(weekStart).add(i, 'days').format("D"), 'Days': moment(weekStart).add(i, 'days').format("ddd")});
                  };
                  //$scope.weekDays = days;

                  if(docArr != '' && docArr != undefined && docArr != []){
                    vm.getDoctors(docArr);
                    $rootScope.drop = docArr;
                    vm.getAllAppointment(docArr,days,'week');
                    $scope.$broadcast ('someEvent');
                    $scope.$broadcast ('someEvents');
                  }else{
                    vm.getDoctors(null);
                    vm.getAllAppointment(undefined,days,'week');
                    $scope.$broadcast ('someEvent');
                    $scope.$broadcast ('someEvents');
                  }

                  //$scope.WeekDisplay = moment().format('MMMM');

                  // console.log(moment().format('MMMM') + ' ' + moment().format('YYYY'));

                  // var weekdisp = moment().format('MMMM') + ' ' + moment().format('YYYY') + ' - WEEK ' + moment().week();

                  vm.weekDaystr = daysStr;
                  vm.weekDays = days;
                  // console.log(vm.weekDays);
                  // $scope.WeekDisplay = weekdisp;
                  // console.log($scope.weekDisplay);

                  // vm.getAllAppointment(vm.dropSelect,null);
                  // if(docArr != '' && docArr != undefined && docArr != []){

                  // }else{
                  //    vm.getDoctors(null);
                  // }
                  //vm.events = vm.events;
                }else{
                  vm.showBookApp = false;
                  vm.dropDay = false;
                  vm.dropWeek = false;
                  vm.dropMonth = true;
                  $scope.toggleView = true;
                  // $rootScope.drop = vm.dropSelect;

                  if(docArr != '' && docArr != undefined && docArr != []){
                     vm.getDoctors(docArr);
                    $rootScope.drop = docArr;
                    vm.getAllAppointment(docArr,null);
                    $scope.$broadcast ('someEvent');
                    $scope.$broadcast ('someEvents');
                  }else{
                    vm.getDoctors(null);
                    vm.getAllAppointment(undefined,undefined);
                    $scope.$broadcast ('someEvent');
                    $scope.$broadcast ('someEvents');
                  }
                  // vm.getAllAppointment(vm.dropSelect,null);
                  // if(docArr != '' && docArr != undefined && docArr != []){

                  // }else{
                  //    vm.getDoctors(null);
                  // }
                }
      }else{
                 if(value == 'day' ){
                  // alert("day doctor");
                  vm.showBookApp = true;
                  vm.dropDay = true;
                  vm.dropWeek = false;
                  vm.dropMonth = false;
                  $scope.toggleView = false;
                   if($rootScope.dateDisplay != 'Today'){
                    var date = $rootScope.dateDisplay;
                    }else{
                    $scope.currentDate = new Date();
                    var date = moment($scope.currentDate).format("YYYY-MM-DD");
                    }
                    $scope.$broadcast ('someEvent');
                    $scope.$broadcast ('someEvents');
                   // $scope.currentDate = new Date();
                   //  var date = moment($scope.currentDate).format("YYYY-MM-DD");
                    vm.getAllAppointment(null,date,'day');
                    // $scope.toggleView = false;
                    $timeout(function(){
                       $scope.curTimeWidth = $(".main-table").width();
                    },1000);

                    //vm.events = vm.eventsList;
                  }else if(value == 'week' ){
                    vm.showBookApp = false;
                    $scope.toggleView = false;
                     vm.dropDay = false;
                    vm.dropWeek = true;
                    vm.dropMonth = false;
                    $scope.$broadcast ('someEvent');
                    $scope.$broadcast ('someEvents');
                    var currentDate = moment();

                  var weekStart = currentDate.clone().startOf('week');
                  var weekEnd = currentDate.clone().endOf('week');

                  var days = [];
                  var daysStr = [];
                  for (var i = 0; i <= 6; i++) {
                      days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
                      daysStr.push({'Date': moment(weekStart).add(i, 'days').format("D"), 'Days': moment(weekStart).add(i, 'days').format("ddd")});
                  };
                    // $scope.toggleView = true;
                    vm.getAllAppointment(null,days,'week');

                    vm.weekDaystr = daysStr;
                    vm.weekDays = days;
                    //vm.events = vm.events;
                  }else{
                    vm.showBookApp = false;
                    $scope.toggleView = false;
                    vm.dropDay = false;
                    vm.dropWeek = false;
                    vm.dropMonth = true;
                   $scope.$broadcast ('someEvent');
                   $scope.$broadcast ('someEvents');
                    $scope.toggleView = true;
                    vm.getAllAppointment(null);

                  }
      }
    }

    vm.disabledLeaveday =  function(dKval){
       var date =  false;
      if(dKval){
          var day  =  new Date(dKval).getDay();
          if(vm.leaveList.indexOf(day) != -1){
             date =  true;
        }
       return date;
      }

    }
    vm.getLeaveDetails  =  function(getLeaveDays){
      if(getLeaveDays.length > 0){
           angular.forEach(getLeaveDays,function(value,key){
                if(!value.clinicOpen){
                  vm.leaveList.push(key);
                }
              });
       }
    }
    vm.getClinicStatus =  function(){
       var clinicStatus = false;
       var curentDate =  new Date();
       var clinicTimeSchedule = [];
       //console.log($rootScope.dateDisplay);
       if(vm.clinicTime)
              clinicTimeSchedule = (JSON.parse(vm.clinicTime));

       if(clinicTimeSchedule.length > 0){
       	// if($rootScope.dateDisplay == undefined){
       	// 	$rootScope.dateDisplay = 'Today';
       	// }
          if($rootScope.dateDisplay == undefined || $rootScope.dateDisplay == 'Today'){
             var checkDate = curentDate.getDay();
              if(clinicTimeSchedule[checkDate].clinicOpen){
                  clinicStatus = true;
                 }
            }else{
              var checkDate  =  new Date($rootScope.dateDisplay).getDay();
              if(clinicTimeSchedule[checkDate].clinicOpen){
                  clinicStatus = true;
                 }
            }
       }
       return clinicStatus;
    }
    vm.getKeyObject = function(){
      return Object.keys(vm.doctorListDatas).length;
    }

    // vm.getAllClinicAppointment();
    vm.init();
  }



  angular
      .module('practysApp').filter("rounded",function(){
      return function(val){
          return val.toFixed(0);
      }
  });

})();
