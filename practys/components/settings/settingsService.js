/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   setting Service
 *
 *  Description   :   setting Service
 *
 *  Developer   :   Nishanth
 * 
 *  Date      :   13/10/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/
// <file-field ng-model="uploadFile">Add File</file-field>
(function() {
    'use strict';

    angular
        .module('practysApp')
        .factory('settingService', settingService);

    settingService.$inject = ['$q', '$location', 'commonService', '__env', '$window'];

    function settingService($q, $location, commonService, __env, $window) {

        var url = __env.apiUrl;
        var service = {};
        service.getDetails = getDetails;
        service.updateDetails = updateDetails;
        service.changePassword = changePassword;
        service.addDoctor = addDoctor;
        service.getDoctor = getDoctor;
        service.getPatient = getPatient;
        service.getPatientDetails = getPatientDetails;
        service.getSpecialityServices = getSpecialityServices;
        service.updateCardDetails = updateCardDetails;
        service.addSpecialityServices = addSpecialityServices;
        service.addClinic = addClinic;
        service.getSpeciality = getSpeciality;
        service.subscriptionPlan = subscriptionPlan;
        service.getPlans = getPlans;
        service.updatePlan = updatePlan;
        service.getServices = getServices;
        service.subscribe = subscribe;
        service.deleteUser = deleteUser;
        service.getColorCode = getColorCode;
        service.getDrug = getDrug;
        service.addDrug = addDrug;
        service.editDrug = editDrug;
        service.getServiceById = getServiceById;
        service.deleteService = deleteService;
        service.updateService = updateService;
        service.autoRenewal = autoRenewal;
        service.renewalOff = renewalOff;
        service.getClinicDetails = getClinicDetails;
        service.resetClinicPassword = resetClinicPassword;
        service.updateClinicPlan = updateClinicPlan;
        service.getInvoiceHistory = getInvoiceHistory;
        service.deleteDrug = deleteDrug;
        service.clinicLink = clinicLink;

        return service;

        function clinicLink(obj){
        	var dataObj = $.param(obj);
           	var serviceCall = commonService.Create(url + 'users/linkClinic', dataObj);
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

        function deleteDrug(id){
        	var obj = {drugId: id};
        	var dataObj = $.param(obj);
           var serviceCall = commonService.Create(url + 'inventories/delete', dataObj);
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

        function getInvoiceHistory(id){
            var serviceCall = commonService.GetAll(url + 'subscriptions/getInvoiceHistory?clinicId='+id);
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

        function updateClinicPlan(obj){
        	var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'subscriptions/updateClinicPlan',dataObj);
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

        function resetClinicPassword(obj){
        	var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'clinics/resetPassword', dataObj);
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


        function getClinicDetails(){
        	var serviceCall = commonService.GetAll(url + 'clinics/getClinicDetails');
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


        function renewalOff(obj){
              var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'subscriptions/updateRecurringProfile', dataObj);
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

        function autoRenewal(obj){
            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'subscriptions/setExpressCheckout', dataObj);
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

        function updateService(obj) {
            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'specialities/updateService', dataObj);
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

        function deleteService(id, specId) {
        	var obj = { serviceId: id, specialityId: specId};
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'specialities/deleteService', dataObj);
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



        function getServiceById(id) {
            var serviceCall = commonService.GetAll(url + 'specialities/getServiceDetails?serviceId=' + id);
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
            Getting drugs for particular clinic 
        */
        function getDrug(id) {
            var serviceCall = commonService.GetAll(url + 'inventories/getDrug?clinicId=' + id);
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
            Adding drugs for particular clinic 
        */
        function addDrug(data) {
            var dataObj = $.param(data);

            var serviceCall = commonService.Create(url + 'inventories/createDrug', dataObj);
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
            Getting drug details by drugId
        */
        function editDrug(id) {
            var serviceCall = commonService.GetAll(url + 'inventories/getDrug?drugId=' + id);
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
         Getting colors of doctor that has been using 
        */

        function getColorCode(id) {
            var serviceCall = commonService.GetAll(url + 'doctors/getColor?clinicId=' + id);
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
         Getting the serives by speciality id
        */

        function getSpecialityServices(id) {

            var serviceCall = commonService.GetAll(url + 'specialities/getSpecialityServices?specialityId=' + id);
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

        function subscribe(obj) {
            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'subscriptions/paypalpost', dataObj);
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
         Getting the serives by speciality id and clinicId
        */

        function getServices(specialityId, clinicId) {

            var serviceCall = commonService.GetAll(url + 'specialities/getSpecialityServices?specialityId=18?specialityId=' + specialityId + '&clinicId=' + clinicId);
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

        function getDetails(id, type,clinicId) {
            if (type == 'clinic') {

                var serviceCall = commonService.GetAll(url + 'users');
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

                var serviceCall = commonService.Get(url + 'doctors/get?userId=' + id + '&clinicId='+ clinicId);
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

        function updateDetails(type, data) {
            if (type == 'clinic') {

            } else if (type == 'doctor') {


                var dataObj = $.param(data);

                var serviceCall = commonService.Create(url + 'doctors/doctorUpdate', dataObj);
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

            } else if (type == 'patient') {


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

        }


        function changePassword(id, type, data) {

            var obj = { id: id, oldPassword: data.oldPassword, newPassword: data.newPassword };
            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'users/changePassword', dataObj);
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

        function addClinic(data) {

            var dataObj = $.param(data);
            var serviceCall = commonService.Create(url + 'clinics/create', dataObj);
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


        function addSpecialityServices(datas) {
            var obj = { specialityServices: datas };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'specialities/create', dataObj);
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

        //service for adding new doctor
        function addDoctor(data,type) {
            var dataObj = $.param(data);
            if(type == 'add'){
            	var serviceCall = commonService.Create(url + 'doctors/add', dataObj);
        	}else if(type == 'link'){
        		var serviceCall = commonService.Create(url + 'doctors/link', dataObj);
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


        function deleteUser(id,clinicId) {
        	var obj = { userId: id, clinicId: clinicId };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'users/delete', dataObj);
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

        function getDoctor(data) {
            var serviceCall = commonService.GetAll(url + 'doctors/get?clinicId=' + data);
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


        function getPatient(data) {
            var serviceCall = commonService.Create(url + 'users?clinicId=' + data);
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


        function getPatientDetails(id,clinicId) {
        	if(clinicId != undefined){
        		var serviceCall = commonService.Create(url + 'doctors/get?userId=' + id + '&clinicId=' + clinicId);
        	}else{
        		var serviceCall = commonService.Create(url + 'doctors/get?userId=' + id );
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

        function updateCardDetails(obj) {
            var obj = { cardType: obj.cardType, accountNumber: obj.acno, cvv: obj.cvv, month: obj.monthCount, year: obj.yearCount };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'settings/autoRenewel', dataObj);
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

        // getting the speciality

        function getSpeciality(id) {
            var deferred = $q.defer();

            var serviceCall = commonService.GetAll(url + 'specialities/getSpecialityDetails?userId=' + id);

            serviceCall
                .success(function(data) {
                    deferred.resolve(data);
                }).
            error(function(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;
        }


        // getting the subscriptionPlan Creating by admin

        function subscriptionPlan(data) {
            var deferred = $q.defer();
            var obj = { plans: data };
            var dataObj = $.param(obj);
            // console.log(obj);
            // console.log(dataObj);return false;
            var serviceCall = commonService.Create(url + 'subscriptions/create', dataObj);

            serviceCall
                .success(function(data) {
                    deferred.resolve(data);
                }).
            error(function(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;
        }

        /* 
          getting the existing plans for admin
        */

        function getPlans(id, clinicId) {
            console.log(id);
            var deferred = $q.defer();
            if (clinicId) {
                var serviceCall = commonService.GetAll(url + 'subscriptions/get?clinicId=' + clinicId);
            }
            if (id != null) {
                var serviceCall = commonService.GetAll(url + 'subscriptions/get?planId=' + id);
            } else if (id == null && clinicId == null) {
                var serviceCall = commonService.GetAll(url + 'subscriptions/get');
            }
            serviceCall
                .success(function(data) {
                    deferred.resolve(data);
                }).
            error(function(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;

        }

        /* 
          updating the existing plans for admin
        */

        function updatePlan(obj) {
            var deferred = $q.defer();
            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'subscriptions/update', dataObj);

            serviceCall
                .success(function(data) {
                    deferred.resolve(data);
                }).
            error(function(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;

        }


    }
})();
