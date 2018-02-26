(function () {
   'use strict';

angular
   .module('practysApp')
   .factory('invoiceOfflineService', invoiceOfflineService);

   invoiceOfflineService.$inject = ['$q','$SQLite','utilService'];

   function invoiceOfflineService ($q,$SQLite,utilService) {
   	            var invoiceServices 	= {};
                var invoiceData     	= {};
                invoiceServices.getInvoices  	= getInvoices;
                invoiceServices.searchFilter	= searchFilter;
                invoiceServices.editInvoices    = editInvoices;
                return invoiceServices;


                function getInvoices(id){
                	var deferred                 = $q.defer();
                	invoiceData.getInvoicesData   = [];
                	invoiceData.getInvoicesCount  = '';
                	 $SQLite.ready(function() {
                    	this.select('SELECT * FROM practysapp_invoices WHERE practysapp_invoices.clinicId= ? GROUP BY practysapp_invoices.id',[id]).then(function() {
                        console.log("empty result");
                        deferred.resolve(invoiceData);
                    	}, function() {
                        console.log("error");
                        deferred.reject("error");
                    	}, function(data) {
                    	utilService.getUserDetails(data.item.patientId).then(function(response) {
                                                data.item.patient = response;
                            });
                         utilService.getUserDetails(data.item.doctorId).then(function(response) {
                                                data.item.doctor = response;
                                  });
                         data.item.billStatus  = JSON.parse(data.item.billStatus);
                         invoiceData.getInvoicesData.push(data.item);
                         invoiceData.getInvoicesCount  = data.count;
                         if((invoiceData.getInvoicesData.length) == invoiceData.getInvoicesCount){
                                    deferred.resolve(invoiceData);
                             }
                           
                    });
                });
                	 return deferred.promise;
                }


                function searchFilter(fromDate,toDate,id){
                	var deferred	                    = $q.defer();
                	invoiceData.getInvoicesSearchData   = [];
                	invoiceData.getInvoicesSearchCount  = '';
                	$SQLite.ready(function() {
	                    this.select('SELECT * FROM practysapp_invoices WHERE (practysapp_invoices.invoiceDate BETWEEN ? AND ?) AND practysapp_invoices.clinicId = ?',[fromDate,toDate,id]).then(function() {
	                        console.log("empty result");
	                        deferred.resolve(invoiceData);
	                    }, function() {
	                        console.log("error");
	                         deferred.reject("error");
	                    }, function(data) {
	                        utilService.getUserDetails(data.item.patientId).then(function(response) {
                                                data.item.patient = response;
                            });
                         	utilService.getUserDetails(data.item.doctorId).then(function(response) {
                                                data.item.doctor = response;
                                  });
                          invoiceData.getInvoicesSearchData.push(data.item);
                          invoiceData.getInvoicesSearchCount  = data.count;
	                       if((invoiceData.getInvoicesSearchData.length) == invoiceData.getInvoicesSearchCount){
                                    deferred.resolve(invoiceData);
                             }
	                    });
                	});
					return deferred.promise;
                }


                function editInvoices(id){
                	var deferred	                  = $q.defer();
                	invoiceData.geteditInvoicesData   = {};
                	invoiceData.geteditInvoicesCount  = '';
                	$SQLite.ready(function() {
        				this.select('SELECT * FROM practysapp_invoices WHERE practysapp_invoices.id=?', [id]).then(function() {
        					console.log("empty result");
        					deferred.resolve(invoiceData);
        				}, function() {
        					console.log("error");
	                         deferred.reject("error");
        				}, function(data) {
        					console.log(data.item);
        					utilService.getUserDetails(data.item.patientId).then(function(response) {
                                data.item.patient = response;
                            utilService.getUserDetails(data.item.doctorId).then(function(response) {
                                    data.item.doctor = response;
                            utilService.getAppointment(data.item.appointmentId).then(function(response){
                                     data.item.Appointment  = response;
                                    invoiceData.geteditInvoicesData = (data.item);
                                    deferred.resolve(invoiceData);
                                     });        
                                });
                            });
        				});
        			});
        			return deferred.promise;
                }



   	   }
})();