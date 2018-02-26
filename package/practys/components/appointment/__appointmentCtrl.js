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

    appointmentController.$inject = ['moment', 'calendarAlert', 'calendarConfig','$scope','Auth','$location','toastr','$state','appointmentService','$timeout', 'utilService'];

    function appointmentController (moment, calendarAlert, calendarConfig, $scope,Auth,$location,toastr,$state,appointmentService, $timeout, Utils) {


      if(!Auth.isLoggedIn())
      {
          $location.path('/login');
          return false;
      }



      var vm = this;
      vm.getAllAppointment = getAllAppointment;
      vm.changeDateCtrl    = changeDateCtrl;

      calendarConfig.showTimesOnWeekView = true;

      $scope.calendarDayView = 'components/appointment/appointment_day.html';

    //calendarConfig.templates.calendarDayView = 'components/appointment/appointment_day.html';

      vm.appointment = {};
      vm.appointment.endsAt = moment().startOf('week').add(1, 'week').add(9, 'hours').toDate();

      vm.events = [];
      vm.eventsList = [];
      vm.dayDoctorPatient = [];

      //These variables MUST be set as a minimum for the calendar to work
      vm.calendarView = 'month';
      vm.viewDate = new Date();

      //var currentDate = moment(new Date()).format("YYYY-MM-DD");
      $scope.dateDisplay = 'Today';
      var currentCount = 1;


       


      function changeDateCtrl (vals){
        console.log(currentCount);
        var nextDay = new Date();
        //var currentDate = moment(new Date()).add(currentCount, 'day').format("YYYY-MM-DD");
        var dateIncrement = vm.viewDate.getDate() + currentCount;
        nextDay.setDate(dateIncrement);
        //console.log(currentDate);
        console.log(nextDay);

        if(vals == 'prev'){
          if(currentCount <= 1){
            return false;
          }else{
            currentCount--;
          }
        }else{
          currentCount++;
        }
        if(currentCount == 1){
          $scope.dateDisplay = 'Today';
        }

        $scope.dateDisplay = moment(nextDay).format("YYYY-MM-DD");

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
    /*vm.events = [
      {
        title: 'An event',
        description: 'DR John',
        color: calendarConfig.colorTypes.warning,
        startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
        endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
        draggable: true,
        resizable: true,
        actions: actions
      }, {
        title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
        description: 'DR David',
        color: calendarConfig.colorTypes.info,
        startsAt: moment().subtract(1, 'day').toDate(),
        endsAt: moment().add(5, 'days').toDate(),
        draggable: true,
        resizable: true,
        actions: actions
      }, {
        title: 'This is a really long event title that occurs on every year',
        description: 'DR Prasad',
        color: calendarConfig.colorTypes.important,
        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        endsAt: moment().startOf('day').add(19, 'hours').toDate(),
        recursOn: 'year',
        draggable: true,
        resizable: true,
        actions: actions
      }
    ];*/

    vm.isCellOpen = false;
    vm.viewChangeEnabled = false;

    vm.eventClicked = function(event) {
      console.log('Clicked', event);
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
      console.log(event);
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

    vm.doctorIds = [];


    // function to get all appointments for month , week and day
    function getAllAppointment(){

      Utils.getDoctors().then(function(resp) {
        console.log(resp);
          if(resp.data.status == 'success'){
              angular.forEach(resp.data.message, function(Value, Key) {
                vm.doctorIds[Value.id] = Value.id;
                vm.doctorListDatas[Value.id] = Value.firstName+' '+Value.lastName;
              }); 
          }
          
      });

      appointmentService.getAppointments().then(function(resp) {
          //console.log(resp);
          if(resp.data.status == 'success'){
            var object = {}; 

            var datas = resp.data.message;
            angular.forEach(datas, function(value, key) {
              //console.log(value);
              //console.log(key);

            var today = new Date();
            var colorConfig;
             // var isToday = (today.toDateString() == value.appointmentStart.toDateString());
             //console.log(moment(value.appointmentStart).fromNow());
            var startDate = moment(value.appointmentStart).format("YYYY-MM-DD hh:mm");
            var dbEndDate = moment(value.appointmentEnd).format("YYYY-MM-DD hh:mm");

            var startrDate = moment(value.appointmentStart).format("YYYY-MM-DD");
            var endDate = moment(today).format("YYYY-MM-DD");

            var startMin = moment(value.appointmentStart).format("hh:mm");
            var endMin = moment(value.appointmentEnd).format("hh:mm");
            var endDateMin = moment(today).format("hh:mm");

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

              var data = {
                  title: value.patient.firstName+' '+value.patient.lastName,
                  description: value.doctor.firstName+' '+value.doctor.lastName,
                  startsAt: new Date(value.appointmentStart),
                  endsAt: new Date(value.appointmentEnd),
                  remHour: remHours,
                  color: colorConfig,
                  draggable: false,
                  resizable: false,
                  cssClass: classname,
                  appointmentId: value.id
                };

                vm.events.push(data);

                var divHeight = '0px';

                if(remHours == 15){
                  divHeight = '50px';
                }else{
                  var splithours = remHours/15;
                  divHeight =  (50*splithours) + 'px';
                }

                if(object.hasOwnProperty(startMin)){
                  object[startMin][value.doctor.id] = [];
                  data.divHeight = divHeight;
                  object[startMin][value.doctor.id] = data;
                }else{
                  object[startMin] = {};
                  object[startMin][value.doctor.id] = [];
                  data.divHeight = divHeight;
                  object[startMin][value.doctor.id] = data;
                }

                
            });
            

            angular.forEach(object, function(value, key) {
              console.log("----doctor")
                console.log(value);                   
                console.log(key);
                angular.forEach(vm.doctorIds, function(values, keys) {
                  if (!(values in value)){
                    console.log(values);
                    object[key][values] = [];
                    var arra = {
                      "title": "none"
                    };
                    object[key][values] = arra;
                    console.log('no');
                  }
                });
             });

            console.log(object);

            console.log("----end doctor")

              vm.eventsList = object;

              console.log(vm.eventsList);

          }

			$scope.doctorCount =  Object.keys(vm.doctorListDatas).length;
          console.log(vm.doctorListDatas);
        
      });
    }


    vm.getAllAppointment();


    //function cboHrsAMPM(){
      //debugger;
      var x = 15; //minutes interval
      vm.times = []; // time array
      var tt = 480; // start time
      var ap = ['AM', 'PM']; // AM-PM

      //loop to increment the time and push results in array
      for (var i=8;tt<1335; i++) {
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
    

    $scope.toggleView = true;

    vm.toggleCalendar = function(value){
      console.log('rrrr');
      //console.log(value);
      if(value == 'day'){
        $scope.toggleView = false;
        //vm.events = vm.eventsList;
      }else{
        $scope.toggleView = true;
        //vm.events = vm.events;
      }
    }


  }

})();


