(function() {
    'use strict';

    angular
        .module('practysApp')
        .factory('patientOfflineDataService', patientOfflineDataService);

    patientOfflineDataService.$inject = ['$q','$SQLite'];

    function patientOfflineDataService($q,$SQLite) {
    	var patientService         = {};
    	var patientData            = {};

    	patientService.getClinicPatient  =  getClinicPatient;
      patientService.getPatientDetails =  getPatientDetails;
      patientService.getPatientReports =  getPatientReports;
      patientService.getRecordDetails  =  getRecordDetails;
      patientService.getInvoiceDetails =  getInvoiceDetails;

    	return patientService;

    	function getClinicPatient(clinicId){
    		var deferred              = $q.defer();
    		 $SQLite.ready(function(){
    		 	patientData.patientDataDetails   = [];
    		 	patientData.patientDataCount     =  '';
                    this.select('SELECT *,practysapp_specialityUserMaps.userId AS id FROM practysapp_users INNER JOIN practysapp_specialityUserMaps  ON practysapp_users.id = practysapp_specialityUserMaps.userId  WHERE practysapp_users.user_level="patient" AND practysapp_specialityUserMaps.clinicId=?',[clinicId]).then(function(){
                      console.log("empty result");
                      deferred.resolve(patientData);
                    },function(){
                      console.log("error");
                      deferred.reject("error");
                    },function(data){
                      patientData.patientDataDetails.push(data.item);
                      patientData.patientDataCount  =  data.count;
                      if((patientData.patientDataDetails.length) == patientData.patientDataCount){
	                        	deferred.resolve(patientData);
	                        }
                    });
                  });
			return deferred.promise;
    	}

      function getPatientDetails(id){
          var deferred                    = $q.defer();
          patientData.clinicPatientData   = [];
          patientData.clinicPatientCount  = '';
        $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_users WHERE practysapp_users.user_level="patient" AND practysapp_users.id=?',[id]).then(function(){
                   deferred.resolve(patientData);
                },function(){
                   deferred.reject("error");
                },function(data){
                       patientData.clinicPatientData.push(data.item);
                       patientData.clinicPatientCount = data.count;
                       if((patientData.clinicPatientData.length) == patientData.clinicPatientCount){
                            deferred.resolve(patientData);
                          }
                });
            });
        return deferred.promise;
      }


      function getPatientReports(id,clinicId){
          var deferred                    = $q.defer();
          patientData.patientReportData   = [];
          patientData.patientReportCount  = '';

         $SQLite.ready(function(){
            this.select('SELECT * , practysapp_appointments.id AS id,practysapp_services.name AS serviceName, practysapp_services.id AS serviceId, practysapp_users.id AS doctorId, practysapp_users.username AS doctorName,practysapp_appointments.drugId As drugId, practysapp_appointments.startDate AS date,practysapp_appointments.id AS appointmentId, strftime("%Y",practysapp_appointments.startDate) AS YEAR FROM practysapp_appointments INNER JOIN practysapp_services ON practysapp_appointments.serviceId = practysapp_services.id INNER JOIN practysapp_users ON practysapp_users.id = practysapp_appointments.patientId WHERE practysapp_appointments.patientId=? AND practysapp_appointments.clinicId=?  GROUP BY practysapp_appointments.id',[id,clinicId]).then(function(){
                deferred.resolve(patientData);
                },function(){
                         deferred.reject("error");
                    },function(data){
                        data.item.year  =  data.item.YEAR;
                       patientData.patientReportData.push(data.item); 
                        patientData.patientReportCount = data.count;
                        if((patientData.patientReportData.length) == patientData.patientReportCount){
                            deferred.resolve(patientData);
                          }
                    });
            });
          return deferred.promise;
      }


      function getRecordDetails(id,clinicId,patientId){
          var deferred                     = $q.defer();
          patientData.reportsDetailsData   = [];
          patientData.reportsDetailsCount  = '';

        $SQLite.ready(function(){
          this.select('SELECT * FROM practysapp_invoices AS I INNER JOIN  practysapp_patientReports AS PR ON I.patientId = PR.patientId INNER JOIN practysapp_appointments AS A ON A.id = PR.appointmentId WHERE PR.appointmentId =? AND PR.clinicId =? AND PR.patientId =? GROUP BY PR.image',[id,clinicId,patientId]).then(function(){
                      console.log("empty result");
                     deferred.resolve(patientData);
                    },function(){
                      console.log("error");
                      deferred.reject("error");
                    },function(data){
                      patientData.reportsDetailsData.push(data.item);
                      patientData.reportsDetailsCount  =  data.count;
                      if((patientData.reportsDetailsData.length) == patientData.reportsDetailsCount){
                            deferred.resolve(patientData);
                        }
                 });
            });
        return deferred.promise;
      }


      function getInvoiceDetails(id){
         var deferred = $q.defer();
         patientData.getInvoiceDetails  = {};
            $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_invoices WHERE appointmentId = ?',[id]).then(function(){
                        console.log('empty result');
                         deferred.resolve(patientData);
                    },function(){
                        console.log("error");
                        deferred.reject("error");
                    },function(data){
                       patientData.getInvoiceDetails = data.item;
                       deferred.resolve(patientData);
                });
            });
            return deferred.promise;
      }
  
    }
})();

