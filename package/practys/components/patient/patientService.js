/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   patientData Service
 *
 *  Description   :   patientData Service
 *
 *  Developer   :   Nishanth
 * 
 *  Date      :   22/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/
(function() {
    'use strict';

    angular
        .module('practysApp')
        .factory('patientDataService', patientDataService);

    patientDataService.$inject = ['$q', '$location', 'commonService', '__env', '$window'];

    function patientDataService($q, $location, commonService, __env, $window) {

        var url = __env.apiUrl;
        var service = {};
        service.patientList = patientList;
        service.patientDetails = patientDetails;
        service.patientAppointmentDetails = patientAppointmentDetails;
        service.patientPaymentDetails = patientPaymentDetails;
        service.patientTreatmentDetails = patientTreatmentDetails;
        service.getPatientDetails = getPatientDetails;
        service.paymentSearch = paymentSearch;
        service.appointmentSearch = appointmentSearch;
        service.treatmentDateDetails = treatmentDateDetails;
        service.addPatient = addPatient;
        service.getRecords = getRecords;
        service.updateDetails = updateDetails;

        return service;

        function updateDetails(type, data) {

            var dataObj = $.param(data);
            console.log(dataObj);
            var serviceCall = commonService.Create(url + 'users/update', dataObj);
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

        /*Get Patient Details*/

        function getPatientDetails(id) {

            var serviceCall = commonService.Create(url + 'doctors/get?userId=' + id);
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

        function patientList(id, type) {
            if (type == 'clinic') {
                var obj = { clinicId: id };
                var dataObj = $.param(obj);
                var serviceCall = commonService.Create(url + 'users', dataObj);
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

            } else if (type == 'doctor') {
                var clinicId = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]["id"];
                var doctorId = JSON.parse($window.localStorage.getItem('doctor'))["doctorId"];
                var obj = { clinicId: clinicId, doctorId: doctorId };
                var dataObj = $.param(obj);

                var serviceCall = commonService.Create(url + 'users/getPatientById', dataObj);
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

        }

        function patientDetails(data) {
            var obj = { userId: data.id, clinicId: data.clinicId };
            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'users/get', dataObj);
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


        function addPatient(data) {
            var dataObj = $.param(data);
            var serviceCall = commonService.Create(url + 'users/create', dataObj);
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


        function patientAppointmentDetails(data) {
            var obj = { userId: data };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'appointments/getAppointment', dataObj);
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

        function patientTreatmentDetails(obj) {
            if (obj.userLevel == 'doctor') {
                var serviceCall = commonService.GetAll(url + 'appointments/getTreatment?userId=' + obj.id + '&clinicId=' + obj.clinicId + '&doctorId=' + obj.doctorId);
            } else {
                var serviceCall = commonService.GetAll(url + 'appointments/getTreatment?userId=' + obj.id + '&clinicId=' + obj.clinicId);
            }
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

        function getRecords(obj) {
            var serviceCall = commonService.GetAll(url + 'appointments/getTreatmentDetails?appointmentId=' + obj.id + '&clinicId=' + obj.clinicId + "&patientId=" + obj.patientId);
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

        function treatmentDateDetails(id) {
            var obj = { appointmentId: id };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'appointments/getTreatmentDetails', dataObj);
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

        function patientPaymentDetails(data) {
            var obj = { userId: data };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'invoices/getPatientInvoice', dataObj);
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

        function paymentSearch(fromDate, toDate, id) {
            var obj = { fromDate: fromDate, toDate: toDate, userId: id };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'invoices/patientSearch', dataObj);
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

        function appointmentSearch(fromDate, toDate, id) {
            var obj = { fromDate: fromDate, toDate: toDate, userId: id };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'appointments/patientSearch', dataObj);
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
    }
})();
