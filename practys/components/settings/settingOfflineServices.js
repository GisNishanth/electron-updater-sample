(function() {
    'use strict';

    angular
        .module('practysApp')
        .factory('settingOfflineServices', settingOfflineServices);

    settingOfflineServices.$inject = ['$q','$SQLite','utilService'];

    function settingOfflineServices($q,$SQLite,utilService) {
     			var settingServices = {};
                var settingData     = {};

     			// settingServices.getDoctorDetails   = 	getDoctorDetails;
     			settingServices.getClinicDrugs         =   getClinicDrugs;
                settingServices.getPatientDetails      =   getPatientDetails;
                settingServices.getSpecilityServices   =   getSpecilityServices;
                settingServices.getClinicServices      =   getClinicServices;
                settingServices.getClinicDoctor        =   getClinicDoctor;
                settingServices.getSpecialityServices  =   getSpecialityServices;
                settingServices.getUsersDetails        =   getUsersDetails;
     			return settingServices;


     			// function getDoctorDetails(){


     			// 
                function getUsersDetails(id){
                    var deferred                 = $q.defer();
                    settingData.userDetails      = {};
                     $SQLite.ready(function() {
                        this.select('SELECT * FROM practysapp_users WHERE practysapp_users.id=?',[id]).then(function() {
                            deferred.resolve(settingData);
                        }, function() {
                            deferred.resolve("error");
                        }, function(data) {
                            settingData.userDetails = data.item;
                            deferred.resolve(settingData);
                        });
                    });
                     return deferred.promise;
                }

                function getSpecialityServices(id){
                     var deferred                 = $q.defer();
                     settingData.editServicesData =  {};
                     $SQLite.ready(function() {
                        this.select('SELECT * FROM practysapp_services WHERE practysapp_services.id=?',[id]).then(function() {
                             deferred.resolve(settingData);
                        }, function() {
                            deferred.reject("error");
                        }, function(data) {
                            data.item.Speciality = {};
                            utilService.getSpeciality(data.item.specialityId).then(function(resp){
                                data.item.Speciality = resp;
                                 settingData.editServicesData = (data.item);
                                deferred.resolve(settingData);
                            });
                        });
                    });
                     return deferred.promise;
                }

                function getPatientDetails(id){
                    var deferred               = $q.defer();
                    settingData.patientData    = [];
                    settingData.patientCount   = '';
                    $SQLite.ready(function() {
                        this.select('SELECT *,practysapp_specialityUserMaps.userId AS id FROM practysapp_users INNER JOIN practysapp_specialityUserMaps  ON practysapp_users.id = practysapp_specialityUserMaps.userId  WHERE practysapp_users.user_level="patient" AND practysapp_specialityUserMaps.clinicId=?', [id]).then(function() {
                            deferred.resolve(settingData);
                        }, function() {
                            deferred.reject("error");
                        }, function(data) {
                             settingData.patientData.push(data.item);
                             settingData.patientCount  = data.count;
                             if((settingData.patientData.length) == settingData.patientCount){
                                            deferred.resolve(settingData);
                                        }
                        });
                  });
                    return deferred.promise;
                } 


     			function getClinicDrugs(){
     				    var deferred = $q.defer();
     					var Drugs    = {};
     					Drugs.data   = [];
     					Drugs.item   =  '';
	     				$SQLite.ready(function() {
		                    this.select('SELECT * FROM practysapp_drugs').then(function() {
		                    }, function(data) {
		                    	deferred.reject("error");
		                    }, function(data) {
		                    	Drugs.item = data.count;
		                                Drugs.data.push(data.item);
		                                if((Drugs.data.length) == Drugs.item){
		                                	deferred.resolve(Drugs);
		                                }
		                    });
                      });
	     				return deferred.promise;
     			}

                function getSpecilityServices(clinicId){
                     var deferred                = $q.defer();
                     var services                = [];
                    settingData.specilityData    = [];
                    settingData.specilityCount   = '';
                    $SQLite.ready(function() {
                    this.select('SELECT practysapp_specialities.* FROM practysapp_services INNER JOIN practysapp_specialities  ON practysapp_specialities.id = practysapp_services.specialityId  WHERE practysapp_specialities.isDeleted = ? AND practysapp_specialities.clinicId = ? GROUP BY practysapp_specialities.id', ['0',clinicId]).then(function() {
                        toastr.error("No Data Found");
                        deferred.resolve(settingData);
                    }, function() {
                        deferred.reject("error");
                    }, function(data) {
                        data.item.services     = [];
                        $SQLite.ready(function() {
                            this.select('SELECT * FROM practysapp_services WHERE practysapp_services.specialityId = ?', [data.item.id]).then(function() {
                                data.item.services = [];
                            }, function() {
                                data.item.services = [];
                            }, function(val) {
                                data.item.services.push(val.item);
                         });
                        settingData.specilityData.push(data.item);
                        settingData.specilityCount = data.count;
                        if (data.count ==  (settingData.specilityData.length)) {
                            deferred.resolve(settingData);
                        }
                     });
                  }); 
                });
                return deferred.promise;    
            }



                function getClinicServices(id){
                    var deferred                         = $q.defer();
                    settingData.specilityServicesData    = [];
                    settingData.specilityServicesCount   = '';
                    $SQLite.ready(function() {
                        this.select('SELECT * FROM practysapp_services WHERE practysapp_services.specialityId = ?',[id]).then(function() {
                            deferred.resolve(settingData);
                        }, function() {
                            deferred.reject("error");
                        }, function(data) {
                            settingData.specilityServicesData.push(data.item);
                            settingData.specilityServicesCount = data.count; 
                            if (settingData.specilityServicesCount ==  (settingData.specilityServicesData.length)) {
                            deferred.resolve(settingData);
                          }
                        });
                    });
                    return deferred.promise;
                
                }


                function getClinicDoctor(id){
                     var deferred                    =  $q.defer();
                     settingData.clinicDoctorData    = [];
                     settingData.clinicDoctorCount   = '';
                     $SQLite.ready(function() {
                        this.select('SELECT *,practysapp_specialityUserMaps.userId AS id FROM practysapp_users INNER JOIN practysapp_specialityUserMaps  ON practysapp_users.id = practysapp_specialityUserMaps.userId  WHERE practysapp_users.user_level="doctor" AND practysapp_specialityUserMaps.clinicId=? GROUP BY practysapp_users.id ', [id]).then(function(){
                            deferred.resolve(settingData);
                        }, function() {
                             deferred.reject("error");
                        }, function(data) {
                            settingData.clinicDoctorCount = data.count;
                            data.item.colorCode  = JSON.parse(data.item.colorCode);
                            settingData.clinicDoctorData.push(data.item);
                            if(settingData.clinicDoctorData.length == settingData.clinicDoctorCount){
                                deferred.resolve(settingData);
                            }
                        });
                    });
                     return deferred.promise;
                }




                // function addServicesSpeciality(item){
                //     item.services   =  [];
                //     item.services   =  getClinicServices(item.id);
                //     return item;
                // }

     }
})();