/*********************************************************************
 *
 *	Great Innovus Solutions Private Limited
 *
 *	Module			: 	Messages
 *
 *	Description 	: 	Message handling service part
 *
 *	Developer		: 	karthick
 * 
 *	Date 			: 	20/09/2016
 *
 *	Version 		: 	1.0
 *
 **********************************************************************/


 (function () {
    'use strict';

 angular
    .module('practysApp')
    .factory('appointmentService', appointmentService);

    appointmentService.$inject = ['$q', '$window','$location','commonService','__env','$rootScope'];

    function appointmentService ($q, $window,$location,commonService,__env,$rootScope) {
	      var service = {
	      	getAppointments : getAppointments,
	      	createAppointment: createAppointment,
	      	updateAppointmentStatus: updateAppointmentStatus,
	      	getengageWaitingDetails: getengageWaitingDetails,
	      	updateAppointmentDetails: updateAppointmentDetails,
	      	updateCount : updateCount,
	      	getServices:getServices,
	      	supportsIDB:supportsIDB,
	      	init:init,
	      	getAppointmentDatas:getAppointmentDatas,
	      	getDoctorsById:getDoctorsById,
	      	getServicesByDoctor:getServicesByDoctor,
	      	blockTimeSlot:blockTimeSlot,
	      	getDrug:getDrug,
	      	getSpecialitiesServiceByDocId:getSpecialitiesServiceByDocId,
	      	getInventoryProduct:getInventoryProduct,
	      	unblockTimeSlot: unblockTimeSlot
	      	// recordSave:recordSave

	      };

	      var url = __env.apiUrl;

	      var setUp = false;
	      var db;

	    return service;

	    //unblocking appointment
	    function unblockTimeSlot(id){
	    	var obj = {appointmentId: id};
	    	var dataObj    =   $.param(obj);
	    	var deferred = $q.defer();
	    	var serviceCall		=	commonService.Create(url+'appointments/unblock', dataObj);

			serviceCall
				.success(function(data) {
					console.log(data);
					deferred.resolve(data);
				}).
				error(function(response){
					console.log("Error : appointments retrive failed ");
					console.log(response);
					deferred.reject(response);
				});

			return deferred.promise;
	    }

	    function getInventoryProduct(clinicId){
	    	var deferred = $q.defer();
	    	var serviceCall		=	commonService.GetAll(url+'inventories/get?clinicId='+ clinicId);

			serviceCall
				.success(function(data) {
					console.log(data);
					deferred.resolve(data);
				}).
				error(function(response){
					console.log("Error : appointments retrive failed ");
					console.log(response);
					deferred.reject(response);
				});

			return deferred.promise;
	    }


	    function getSpecialitiesServiceByDocId(id,clinicId){
	    	var deferred = $q.defer();
	    	var serviceCall		=	commonService.GetAll(url+'doctors/getSpecialityServiceByDoctorId?userId='+ id+'&clinicId='+clinicId);

			serviceCall
				.success(function(data) {
					console.log(data);
					deferred.resolve(data);
				}).
				error(function(response){
					console.log("Error : appointments retrive failed ");
					console.log(response);
					deferred.reject(response);
				});

			return deferred.promise;
	    }
	    

	    // }else if(obj != undefined){
	    // 		dataObj = '?appointmentId='+obj;	

	    /* get  details of doctor or patient */ 

	    function getAppointments(obj,id,data,date){
	    	console.log(data);
	    	var deferred = $q.defer();

	    	console.log(obj);
	    	var dataObj = '';
	    	if(obj != undefined && id != undefined && date == null){
	    		dataObj = '?appointmentId='+obj+'&clinicId='+id;  /*getting details for particular appoitnment*/
	    	}else if(obj == null && id != undefined && data != undefined && date == undefined){
	    		dataObj = '?clinicId='+id+'&doctorId='+data;     /* getting details for current week*/	    		    		
	    	}else if(id != undefined && date != undefined && data == undefined) {
	    		dataObj = '?clinicId='+id+'&appointmentDate='+date;   /* getting particular date appointments showing for all doctors*/
	    	}else if(id != undefined && date != undefined &&  data == ''){
	    		dataObj = '?clinicId='+id+'&appointmentDate='+date;    /* getting appointmnets for particular date and particular doctor*/
	    	}else if(id != undefined && date != undefined && data != undefined ){
	    		dataObj = '?clinicId='+id+'&appointmentDate='+date+'&doctorId='+data;    /* getting appointmnets for particular date and particular doctor*/
	    	}else if(id != undefined && date == undefined && data == undefined){
	    		dataObj = '?clinicId='+id;
	    	}else if(id != undefined){
	    		dataObj = '?clinicId='+id;
	    	}

	    	console.log(dataObj);

	    	var serviceCall		=	commonService.GetAll(url+'appointments'+ dataObj);

			serviceCall
				.success(function(data) {
					console.log(data);
					deferred.resolve(data);
				}).
				error(function(response){
					console.log("Error : appointments retrive failed ");
					console.log(response);
					deferred.reject(response);
				});

			return deferred.promise;

	    }

	    /*
          Getting drugs for particular clinic 
      	*/
      function getDrug(id){
          var serviceCall =  commonService.GetAll(url+'inventories/getDrug?clinicId='+id);
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


	    function blockTimeSlot(obj){
	    	 var dataObj    =   $.param(obj);
	    	var deferred = $q.defer();

	    	var serviceCall	 =	commonService.Create(url+'appointments/block',dataObj);

			serviceCall
				.success(function(data) {
					deferred.resolve(data);
				}).
				error(function(response){
					deferred.reject(response.data);
				});

			return deferred.promise;
	    }


	    /*
	    Getting doctors by clinicId and SpecialityId
	    */
	    function getDoctorsById(clinicId,specialityId){
	    	var deferred = $q.defer();

	    	var serviceCall	 =	commonService.GetAll(url+'doctors/getDoctorsById?clinicId='+clinicId+'&specialityId='+specialityId);

			serviceCall
				.success(function(data) {
					deferred.resolve(data);
				}).
				error(function(response){
					deferred.reject(response.data);
				});

			return deferred.promise;
	    }

	      /*
	    Getting services by clinicId and SpecialityId
	    */
	    function getServicesByDoctor(clinicId,specialityId,userId){
	    	var deferred = $q.defer();

	    	var serviceCall	 =	commonService.GetAll(url+'specialities/getServices?clinicId='+clinicId+'&specialityId='+specialityId+'&userId='+userId);

			serviceCall
				.success(function(data) {
					deferred.resolve(data);
				}).
				error(function(response){
					deferred.reject(response.data);
				});

			return deferred.promise;
	    }


	    /* get  engage and waiting details of clinic */ 

	    function getengageWaitingDetails(status,id,docId){
	    	var deferred = $q.defer();
	    	if(status != undefined && id != undefined && docId != undefined){
	    	var dataObj = '?status='+status+'&clinicId='+id+'&doctorId='+docId;
	    	}else{
	    	var dataObj = '?status='+status+'&clinicId='+id;
	    	}	   

	    	var serviceCall		=	commonService.GetAll(url+'appointments'+ dataObj);

			serviceCall
				.success(function(data) {
					console.log(data);
					deferred.resolve(data);
				}).
				error(function(response){
					deferred.reject(response);
				});

			return deferred.promise;

	    }

	    /* Using Indexed DB For OfflineStorage */

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
	    }
	
		function supportsIDB() {
			return ("indexedDB" in window);		
		}

	   function getAppointmentDatas() {
			var deferred = $q.defer();
			
			init().then(function() {

				var result = [];

				var handleResult = function(event) {  
					var cursor = event.target.result;
					if (cursor) {
						///result.push({key:cursor.key, patientId:cursor.value.patientId,clinicId:cursor.value.clinicId,specialityId:cursor.value.specialityId,serviceId:cursor.value.serviceId, updated:cursor.value.updated});
						result.push({key:cursor.key,value:cursor.value});
						
						cursor.continue();
					}
				};  
				
				var transaction = db.transaction(["appointments"], "readonly");  
				//console.log(transaction);
				//alert('getinside');
				var objectStore = transaction.objectStore("appointments");
	            objectStore.openCursor().onsuccess = handleResult;

				transaction.oncomplete = function(event) {
					deferred.resolve(result);
				};
			
			});
			return deferred.promise;
	   }

	   /* Using Indexed DB For OfflineStorage */


	    /* save message  */
	    function createAppointment(obj)
	    { 
	    	   
	    	if($rootScope.online === true)
	    	{
	    	   	var deferred = $q.defer();
	    	    var dataObj = $.param(obj);
	    	    var serviceCall	 =	commonService.Create(url+'appointments/create', dataObj);
					serviceCall
						.success(function(data) {
							deferred.resolve(data);
						}).
						error(function(response){
							deferred.reject(response.data);
						});

			  
	    	}
	    	else
	    	{

	    	   	var deferred = $q.defer();
		        //if(!appointments.id) appointments.id = "";
		        var t = db.transaction(["appointments"], "readwrite");
		        var apiUrl =  url+'appointments/create';

		        //console.log(appointments.id);
		        
	            //if(appointments.id === undefined)
	            //{
	            // t.objectStore("appointments")
	                          // .add({appointmentValue:obj,patientId:obj.patientId,clinicId:obj.clinicId,specialityId:obj.specialityId,serviceId:obj.serviceId,updated:new Date().getTime()});

	               t.objectStore("appointments")
	                            .add({appointmentValue:obj,updated:new Date().getTime(),isSync:0,apiUrl:apiUrl});
	            //} 
			    //else 
			    // {
			                // t.objectStore("appointments")
			                           // .put({patientId:obj.patientId,serviceId:obj.clinicId,specialityId:obj.specialityId,serviceId:obj.serviceId,updated:new Date(),id:Number(appointments.id)});
			    // }	

				t.oncomplete = function(event) {
					alert(event);
					console.log(event);
					deferred.resolve();
				};

	    	}
	    	

			return deferred.promise;
	    }

	    /* updating the appointments  seened counts  */
	    function updateCount(appointmentId){
	    	
	    	var deferred = $q.defer();

	    	var serviceCall	 =	commonService.GetAll(url+'appointments/updateCount?appointmentId='+appointmentId);

			serviceCall
				.success(function(data) {
					deferred.resolve(data);
				}).
				error(function(response){
					deferred.reject(response.data);
				});

			return deferred.promise;
	    }
      	

      	/* update appointment status */

      	function updateAppointmentStatus (obj){

      		var deferred = $q.defer();

	    	//var dataObj = $.param(obj);

	    	var serviceCall	 =	commonService.Update(url+'appointments/updateStatus', obj);

			serviceCall
				.success(function(data) {
					deferred.resolve(data);
				}).
				error(function(response){
					deferred.reject(response.data);
				});

			return deferred.promise;
      	} 


      	// update appointment detials with images

      	function updateAppointmentDetails(obj){
      		var deferred = $q.defer();
      		var dataObj = $.param(obj);

	    	var serviceCall	 =	commonService.Create(url+'appointments/editAppointment', dataObj);

			serviceCall
				.success(function(data) {
					deferred.resolve(data);
				}).
				error(function(response){
					deferred.reject(response.data);
				});

			return deferred.promise;
      	}

      	// update appointment detials with images

   //    	function recordSave(obj){
   //    		var deferred = $q.defer();
   //    		var dataObj = $.param(obj);

	  //   	var serviceCall	 =	commonService.Create(url+'appointments/recordSave', dataObj);

			// serviceCall
			// 	.success(function(data) {
			// 		deferred.resolve(data);
			// 	}).
			// 	error(function(response){
			// 		deferred.reject(response.data);
			// 	});

			// return deferred.promise;
   //    	}

      	// getting the speciality

   //    	function getSpeciality(id){
   //    		var deferred = $q.defer();

	  //   	var serviceCall	 =	commonService.GetAll(url+'specialities/getSpecialityDetails?userId='+id);

			// serviceCall
			// 	.success(function(data) {
			// 		deferred.resolve(data);
			// 	}).
			// 	error(function(response){
			// 		deferred.reject(response.data);
			// 	});

			// return deferred.promise;
   //    	}

      	// getting the servivces

      	function getServices(id,specialityId){
      		var deferred = $q.defer();

	    	var serviceCall	 =	commonService.GetAll(url+'specialities/getSpecialityDetails?userId='+id+'&specialityId='+specialityId);

			serviceCall
				.success(function(data) {
					deferred.resolve(data);
				}).
				error(function(response){
					deferred.reject(response.data);
				});

			return deferred.promise;
      	}

      	
	   
		
	

    }

})();



