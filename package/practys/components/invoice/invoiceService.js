/*********************************************************************
 *
 *	Great Innovus Solutions Private Limited
 *
 *	Module			: 	invoice Service
 *
 *	Description 	: 	invoice Service
 *
 *	Developer		: 	Nishanth
 * 
 *	Date 			: 	19/09/2016
 *
 *	Version 		: 	1.0
 *
 **********************************************************************/
 // <file-field ng-model="uploadFile">Add File</file-field>
 (function () {
   'use strict';

angular
   .module('practysApp')
   .factory('invoiceService', invoiceService);

   invoiceService.$inject = ['$q','$location','commonService','__env'];

   function invoiceService ($q,$location,commonService,__env) {
   	

      /*
        Declaration Part
      */

   		var url = __env.apiUrl;
   		var service = {};
   		service.addInvoice = addInvoice;
      service.getInvoice = getInvoice;
      service.editInvoice = editInvoice;
      service.updateInvoice = updateInvoice;
      service.changeInvoice = changeInvoice;
      service.searchFilter = searchFilter;
      service.deleteInvoice = deleteInvoice;
		
		return service;
   
        /*
        Service call functions for get or update or create Invoice details
        */

	   	  function getInvoice(id) {
           // var obj        = {clinicId: id};
           //   var dataObj    =   $.param(obj);
          var serviceCall =  commonService.GetAll(url+'invoices/get?clinicId='+id+'&type='+'list');
          var deferred = $q.defer();

          serviceCall
               .success(function(data) {
                   deferred.resolve(data);
               }).
               error(function(response){
                   console.log("Error : Invoice details failed ");
                   console.log(response);
                   deferred.reject(response.data);
               });

           return deferred.promise;
        }

        function searchFilter(data) {
             // // var obj        = {fromDate: data.fromDate,toDate:data.toDate,clinicId:data.id};
             // var dataObj    =   $.param(data);
             var serviceCall =  commonService.GetAll(url+'invoices/get?fromDate='+data.fromDate+'&toDate='+data.toDate+'&clinicId='+data.id);
             var deferred = $q.defer();

          serviceCall
               .success(function(data) {
                   console.log(data);
                   deferred.resolve(data);
               }).
               error(function(response){
                   console.log("Error : Filtered details failed ");
                   console.log(response);
                   deferred.reject(response.data);
               });

           return deferred.promise;
        }

        function addInvoice(data) {
             
             var dataObj    =   $.param(data);
             var serviceCall =  commonService.Create(url+'invoices/create',dataObj);
             var deferred = $q.defer();

          serviceCall
               .success(function(data) {
                   console.log(data);
                   deferred.resolve(data);
               }).
               error(function(response){
                   console.log("Error : fields are not Inserted ");
                   console.log(response);
                   deferred.reject(response.data);
               });

           return deferred.promise;
 
        }

        function editInvoice(id,type) {
	    	if(type != null){
	    		 var obj        = {id: id, type:type};
	    	}else{
	    		 var obj        = {id: id};
	    	}
         
          var dataObj    =   $.param(obj);
          var serviceCall =  commonService.Create(url+'invoices/edit',dataObj);
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

        function updateInvoice(data) {
         
          var dataObj    =   $.param(data);
          var serviceCall =  commonService.Create(url+'invoices/update',dataObj);
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
        function changeInvoice(data) {
         
          var dataObj    =   $.param(data);
          var serviceCall =  commonService.Create(url+'invoices/change',dataObj);
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

        //delete service for invoice

        function deleteInvoice(id){
          var obj = {id: id};
          var dataObj    =   $.param(obj);
          var serviceCall =  commonService.Create(url+'invoices/delete',dataObj);
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