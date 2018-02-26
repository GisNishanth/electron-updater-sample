/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   companyCtrl
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
    .controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$scope','Auth','$location','toastr','$state'];

    function dashboardCtrl ($scope,Auth,$location,toastr,$state) {
       $scope.type = JSON.parse(localStorage.getItem('user'))["user_level"];
    

      // if(!Auth.isLoggedIn())
      // {
      //     $location.path('/login');
      //     return false;
      // }
      

  }


  
})();

 


