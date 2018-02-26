/*********************************************************************
 *
 *	Great Innovus Solutions Private Limited
 *
 *	Module			: 	Finance Service
 *
 *	Description 	: 	Finance Service
 *
 *	Developer		: 	Nishanth
 * 
 *	Date 			: 	21/09/2016
 *
 *	Version 		: 	1.0
 *
 **********************************************************************/
 // <file-field ng-model="uploadFile">Add File</file-field>
 (function () {
   'use strict';

angular
   .module('practysApp')
   .factory('financeService', financeService);

   financeService.$inject = ['$q','$location','commonService','__env'];

   function financeService ($q,$location,commonService,__env) {
   	

        /*
        Declaration part
        */ 

   		var url = __env.apiUrl;
   		var service = {};
   		service.financeLogin = financeLogin;
      service.getMonth = getMonth;
      service.getYear = getYear;
      service.getTotalRevenue = getTotalRevenue;
      service.getDays = getDays;
      service.changePassword = changePassword;
      service.resetPassword = resetPassword;
		
		return service;


		function resetPassword(email) {

            var obj = { email: email };
            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'finances/forgotPassword', dataObj);
            var deferred = $q.defer();

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : Request failed ");
                console.log(response);
                deferred.reject(response.data);
            });

            return deferred.promise;


        }


		function changePassword(id, data) {

            var obj = { id: id, oldPassword: data.oldPassword, newPassword: data.newPassword };
            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'finances/changePassword', dataObj);
            var deferred = $q.defer();

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : Request failed ");
                console.log(response);
                deferred.reject(response.data);
            });

            return deferred.promise;


        }

       /*
        Service functions to get days for particular month
        */ 

      function getDays(clinicId,month){
        var serviceCall =   commonService.Create(url+'finances/getDays?clinicId='+clinicId+'&month='+month);
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
        /*
        Service functions to create or get or update the finance details
        */ 

      function financeLogin(id,password,callback){
        var obj        = {id: id,password:password };
        var dataObj    =   $.param(obj);
        var serviceCall =   commonService.Create(url+'finances/login',dataObj);
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

      function getTotalRevenue(id){
        var serviceCall =   commonService.GetAll(url+'finances/getTotalRevenue?clinicId='+id);
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

      function getMonth(id,year){
        if(year == null){
            var serviceCall =    commonService.GetAll(url+'finances/getMonth?clinicId='+id);
        }else{
            var serviceCall =    commonService.GetAll(url+'finances/getMonth?clinicId='+id+'&year='+year);
        }
       
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

      function getYear(id){
        var serviceCall = commonService.GetAll(url+'finances/getYear?clinicId='+id);
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

	 }
})();