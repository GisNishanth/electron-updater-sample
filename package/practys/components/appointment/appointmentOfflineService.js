(function () {
    'use strict';

 angular
    .module('practysApp')
    .factory('appointmentOfflineService', appointmentOfflineService);
    appointmentOfflineService.$inject = ['$q','$SQLite','utilService'];

    function appointmentOfflineService ($q,$SQLite,utilService) {
    			var appointmentServices = {};
                var appointmentData     = {};

                appointmentServices.getWaitingListByDoctor = getWaitingListByDoctor;
                appointmentServices.getWaitingList         = getWaitingList;
                appointmentServices.getEngageList          = getEngageList;
                appointmentServices.getAppointment         = getAppointment;
                appointmentServices.getAppointmentDetails  = getAppointmentDetails;
                appointmentServices.getDoctorDetails       = getDoctorDetails;
                return appointmentServices;




                function getAppointmentDetails(appointmentId,id){
                    var deferred                               = $q.defer();
                    appointmentData.getAppointmentDetailsData  = [];
                    appointmentData.getAppointmentDetailsCount = '';

                    $SQLite.ready(function(){
                          this.select('SELECT * FROM practysapp_appointments   WHERE practysapp_appointments.id = ? AND practysapp_appointments.clinicId = ?  GROUP BY practysapp_appointments.id',[appointmentId,id]).then(function(){
                                console.log("empty result");
                                deferred.resolve(appointmentData);
                            },function(){
                           console.log("error");
                            deferred.reject("error");
                        },function(data){

                                 appointmentData.getAppointmentDetailsData = data.item;
                                deferred.resolve(appointmentData);

                         });
                     });
                    return deferred.promise;
                }

                function getAppointment(id){
                     var deferred                        = $q.defer();
                     var getAppointmentDetails           = [];
                     appointmentData.getAppointmentData  = [];
                     appointmentData.getAppointmentCount = '';
                    $SQLite.ready(function(){
                       this.select('SELECT * FROM practysapp_appointments  WHERE clinicId = ? ',[id]).then(function(){
                                       console.log("empty result");
                                       deferred.resolve(appointmentData);
                                    },function(){
                                   console.log("error");
                                    deferred.reject("error");
                                },function(data){
                                  getAppointmentDetails.push(data.item);
                                  if((getAppointmentDetails.length) == data.count){
                                    utilService.getAllAppointmentData().then(function(resp){
                                      getDoctorDetails(getAppointmentDetails,resp,function(doctorDetail){
                                          getPatientDetails(doctorDetail,resp,function(getAppointmentData){
                                            appointmentData.getAppointmentData = getAppointmentData;
                                            deferred.resolve(appointmentData);
                                          })
                                          });
                                      });
                                  }

                               });
                       });
                       return deferred.promise;
                }


                function getWaitingListByDoctor(id,docId,type){
                    // console.log(docId.split(","));

                	 var deferred                   = $q.defer();
                	 appointmentData.getWaitingData = [];
                	 appointmentData.getWaitingCount = '';
                	  $SQLite.ready(function(){
		                  this.select('SELECT * FROM practysapp_appointments WHERE practysapp_appointments.clinicId = ? AND practysapp_appointments.doctorId IN ? AND practysapp_appointments.status = ? GROUP BY practysapp_appointments.id',[id,"("+docId+")",type]).then(function(){
		                        console.log('empty result');
		                         deferred.resolve(appointmentData);
		                    },function(){
		                     console.log("error");
		                     deferred.reject("error");
		                  },function(data){
		                  	 appointmentData.getWaitingData.push(data.item);
                             appointmentData.getWaitingCount  = data.count;
                             if((appointmentData.getWaitingData.length) == appointmentData.getWaitingCount){
                                            deferred.resolve(appointmentData);
                                        }
		                })
		            });
                	   return deferred.promise;
                }

                function getWaitingList(id,type){
                	var deferred                         = $q.defer();
                	 appointmentData.getWaitingList      = [];
                	 appointmentData.getWaitingListCount = '';
                	  $SQLite.ready(function(){
			              this.select('SELECT * FROM practysapp_appointments WHERE practysapp_appointments.clinicId = ? AND practysapp_appointments.status = ? GROUP BY practysapp_appointments.id',[id,type]).then(function(){
			              		deferred.resolve(appointmentData);
			                    console.log('empty result');
			                },function(){
			                 console.log("error");
			                 deferred.reject("error");
			              },function(data){
			               	 appointmentData.getWaitingList.push(data.item);
                             appointmentData.getWaitingListCount  = data.count;
                             if((appointmentData.getWaitingList.length) == appointmentData.getWaitingListCount){
                                            deferred.resolve(appointmentData);
                                        }
			            });
			        });
                	  return deferred.promise;
                }

                 function getEngageList(id,type){
                	var deferred                         = $q.defer();
                	 appointmentData.getEngageList      = [];
                	 appointmentData.getEngageListCount = '';
                	  $SQLite.ready(function(){
			              this.select('SELECT * FROM practysapp_appointments WHERE practysapp_appointments.clinicId = ? AND practysapp_appointments.status = ? GROUP BY practysapp_appointments.id',[id,type]).then(function(){
			              		deferred.resolve(appointmentData);
			                    console.log('empty result');
			                },function(){
			                 console.log("error");
			                 deferred.reject("error");
			              },function(data){
			               	 appointmentData.getEngageList.push(data.item);
                             appointmentData.getEngageListCount  = data.count;
                             if((appointmentData.getEngageList.length) == appointmentData.getEngageListCount){
                                            deferred.resolve(appointmentData);
                                        }
			            });
			        });
                	  return deferred.promise;
          }

            function getDoctorDetails(appData,userData,callback) {
              var data  = [];
              angular.forEach(appData,function(value,key){
                  angular.forEach(userData,function(val,key1){
                        if(value.doctorId == val.id){
                          value.doctor = val;
                          data.push(value);
                        }
                  });
              });
              callback(data);
            }


            function getPatientDetails(appData,userData,callback){
              var data  = [];
              angular.forEach(appData,function(value,key){
                  angular.forEach(userData,function(val,key1){
                        if(value.patientId == val.id){
                          value.patient = val;
                          data.push(value);
                        }
                  });
              });
              callback(data);
            }

	}
 })();
