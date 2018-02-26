/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   appointmentCtrl
 *
 *  Description :   Company
 *
 *  Developer   :   Karthick
 * 
 *  Date        :   31/08/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

(function () {
    'use strict';

 angular
    .module('practysApp')
    .controller('appointmentCtrl', appointmentCtrl);

    appointmentCtrl.$inject = ['$scope','Auth','$location','toastr','$state'];

    function appointmentCtrl ($scope,Auth,$location,toastr,$state) {


      // if(!Auth.isLoggedIn())
      // {
      //     $location.path('/login');
      //     return false;
      // }
      var app = this;
  }

})();


