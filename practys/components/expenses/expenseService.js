/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   Expense Service
 *
 *  Description   :   Expense Service
 *
 *  Developer   :   Nishanth
 * 
 *  Date      :   15/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/
(function() {
    'use strict';

    angular
        .module('practysApp')
        .factory('expenseService', expenseService);

    expenseService.$inject = ['$q', '$location', 'commonService', '__env'];

    function expenseService($q, $location, commonService, __env) {

        /*
          Declaration part
        */

        var url = __env.apiUrl;
        var service = {};
        service.getExpense = getExpense;
        service.addExpense = addExpense;
        service.editExpense = editExpense;
        service.updateExpense = updateExpense;
        service.getItemId = getItemId;
        service.searchFilter = searchFilter;
        service.deleteExpense = deleteExpense;
        service.deleteFile = deleteFile;

        return service;

        function deleteFile(id,clinicId,file){
        	var obj = {id: id,clinicId: clinicId, fileName: file};
        	var dataObj = $.param(obj);
        	var serviceCall = commonService.Create(url +'expenses/delete_file',dataObj);
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


        function deleteExpense(id){
        	var obj = {id: id};
        	var dataObj = $.param(obj);
        	var serviceCall = commonService.Create(url +'expenses/delete',dataObj);
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
        service functions to create or update or get Expense details
      */

        function getExpense(id) {
            var serviceCall = commonService.GetAll(url + 'expenses/get?clinicId=' + id);
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

        function searchFilter(data) {
            var serviceCall = commonService.GetAll(url + 'expenses/get?fromDate=' + data.fromDate + '&toDate=' + data.toDate + '&clinicId=' + data.clinicId);
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

        function getItemId() {
            var serviceCall = commonService.GetAll(url + 'expenses/ListOfItems');
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

        function addExpense(data) {
            console.log(data);
            console.log(data.fileContent);
            var serviceCall = commonService.Create(url + 'expenses/create', data);
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

        function editExpense(id,clinicId) {
            var serviceCall = commonService.GetAll(url + 'expenses/get?id=' + id + '&clinicId='+ clinicId);
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

        function updateExpense(data) {

            var dataObj = $.param(data);
            var serviceCall = commonService.Create(url + 'expenses/update', dataObj);
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
