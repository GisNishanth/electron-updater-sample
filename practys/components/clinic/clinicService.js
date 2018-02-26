/*********************************************************************
 *
 *	Great Innovus Solutions Private Limited
 *
 *	Module			: 	clinic Service
 *
 *	Description 	: 	clinic Service
 *
 *	Developer		: 	Nishanth
 * 
 *	Date 			: 	05/10/2016
 *
 *	Version 		: 	1.0
 *
 **********************************************************************/
 // <file-field ng-model="uploadFile">Add File</file-field>
 (function () {
   'use strict';

angular
   .module('practysApp')
   .factory('clinicService', clinicService);

   clinicService.$inject = ['$q','$location','commonService','__env'];

   function clinicService ($q,$location,commonService,__env) {
   	

        /*
        Declaration part
        */ 

   		var url = __env.apiUrl;
   		var service = {};
   	  service.getClinic = getClinic;
     //  service.getMonth = getMonth;
     //  service.getYear = getYear;
     //  service.getTotalRevenue = getTotalRevenue;
		
		return service;


        /*
        Service functions to create or get or update the finance details
        */ 

      function getClinic(id){
        // var obj        = {userId: id};
        // var dataObj    =   $.param(obj);
        var serviceCall =   commonService.GetAll(url+'doctors/getClinicUsers?userId='+id);
        var deferred = $q.defer();

          serviceCall
               .success(function(data) {
                   console.log(data);
                   deferred.resolve(data);
               }).
               error(function(response){
                   console.log("Error : Request failed ");
                   console.log(response);
                   deferred.reject(response.data);
               });

           return deferred.promise;
      }

      // function getTotalRevenue(){
      //   var serviceCall =   commonService.GetAll(url+'finances/getTotalRevenue');
      //   var deferred = $q.defer();

      //     serviceCall
      //          .success(function(data) {
      //              console.log(data);
      //              deferred.resolve(data);
      //          }).
      //          error(function(response){
      //              console.log("Error : Request failed ");
      //              console.log(response);
      //              deferred.reject(response.data);
      //          });

      //      return deferred.promise;
      // }

      // function getMonth(){
      //   var serviceCall =    commonService.GetAll(url+'finances/getMonth');
      //   var deferred = $q.defer();

      //     serviceCall
      //          .success(function(data) {
      //              console.log(data);
      //              deferred.resolve(data);
      //          }).
      //          error(function(response){
      //              console.log("Error : Request failed ");
      //              console.log(response);
      //              deferred.reject(response.data);
      //          });

      //      return deferred.promise;
      // }

      // function getYear(){
      //   var serviceCall = commonService.GetAll(url+'finances/getYear');
      //   var deferred = $q.defer();

      //     serviceCall
      //          .success(function(data) {
      //              console.log(data);
      //              deferred.resolve(data);
      //          }).
      //          error(function(response){
      //              console.log("Error : Request failed ");
      //              console.log(response);
      //              deferred.reject(response.data);
      //          });

      //      return deferred.promise;
        
      // }

	 }
})();