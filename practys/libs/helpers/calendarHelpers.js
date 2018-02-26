/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   Calendar Helper
 *
 *  Description :   Helper file for calendar alert
 *
 *  Developer   :   Nishant
 * 
 *  Date        :   12/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/


(function () {
    'use strict';

angular
  .module('practysApp')
  .factory('calendarAlert', function($uibModal) {

    function show(action, event) {
      return $uibModal.open({
        templateUrl: 'modalContent.html',
        controller: function() {
          var vm = this;
          vm.action = action;
          vm.event = event;
        },
        controllerAs: 'vm'
      });
    }

    return {
      show: show
    };

  })


 }) ();


