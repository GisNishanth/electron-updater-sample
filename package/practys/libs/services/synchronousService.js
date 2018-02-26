/*********************************************************************
 *
 *	Great Innovus Solutions Private Limited
 *
 *	Module			: 	Online Function Calls
 *
 *	Description 	: 	Multiple Service Calls During Synchronization
 *
 *	Developer		: 	Sheema
 * 
 *	Date 			: 	29/12/2016
 *
 *	Version 		: 	1.0
 *
 **********************************************************************/

 (function () {
    'use strict';
    /* global $ */

 angular
    .module('practysApp')
    .factory('synchronousService', synchronousService);

    synchronousService.$inject = ['$q', '$window','$location','commonService','__env','$rootScope','$http'];

    function synchronousService ($q, $window,$location,commonService,__env,$rootScope,$http)
    {
	    var service  =  {};
        service.Sync =  Sync;
        var url      =  __env.apiUrl;
        var setUp = false;
	    var db;

 
        return service;

        function Sync()
        {
        	var deferred = $q.defer();

        
        	init().then(function() {

            // Read All Datas From Browser DB ...
            var transaction ;  
		    var objectStore = db.transaction("appointments").objectStore("appointments");
		    var appointments = [];



			console.log(objectStore);
    	    var valueStore  = [];
    	        objectStore.openCursor().onsuccess = function(event) {
			      var cursor = event.target.result;
			      if (cursor) {
			           //var dataObj = cursor.value.appointmentValue);
						appointments.push(cursor.value);
			            cursor.continue();
			      }else{
			      	   console.log(appointments);


			      	   angular.forEach(appointments, function(value, key) {
			      	   	console.log(key   +  ' entered  ' + value);
                            var apiUrl       =  value.apiUrl;
			                var insertId     =  value.id;
			                var Obj          =  value.appointmentValue;
			                var dataObj      =  $.param(Obj);
				    	    var serviceCall	 =	commonService.Create(apiUrl, dataObj);
								serviceCall
									.success(function(data) {
										deferred.resolve(data);
										console.log('success');
										console.log(data);
									

									 var request = db.transaction(["appointments"], "readwrite")
   							         .objectStore("appointments")
   							         .delete(insertId);
										
									}).
									error(function(response){
										console.log(response);
										console.log('failure');

										deferred.reject(response.data);
										
									});
                       });


			      	  // db.deleteObjectStore("appointments");
			      	   deferred.resolve(appointments);
			      }
			     
			   };
			});
			return deferred.promise;
        };

        function init() 
	    {
			var deferred = $q.defer();

			if(setUp) {
				deferred.resolve(true);
				return deferred.promise;
			}
			
			var openRequest = window.indexedDB.open("indexeddb_angular",1);
		
			openRequest.onerror = function(e) {
				console.log("Error opening db");
				console.dir(e);
				deferred.reject(e.toString());
			};

			openRequest.onupgradeneeded = function(e) {
		
				var thisDb = e.target.result;
				var objectStore;
				//Create Note OS
				if(!thisDb.objectStoreNames.contains("appointments"))
				{
					objectStore = thisDb.createObjectStore("appointments", { keyPath: "id", autoIncrement:true });
					//objectStore.createIndex("patientId", "patientId", { unique: false });
			
				}
			};

			openRequest.onsuccess = function(e) {
				db = e.target.result;
				
				db.onerror = function(event) {
					// Generic error handler for all errors targeted at this database's
					// requests!
					deferred.reject("Database error: " + event.target.errorCode);
				};
		
				    setUp=true;
				    deferred.resolve(true);
			
			};	

			return deferred.promise;
	    };
	


    }

})();



