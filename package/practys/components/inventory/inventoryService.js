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
        .factory('inventoryService', inventoryService);

    inventoryService.$inject = ['$q', '$location', 'commonService', '__env'];

    function inventoryService($q, $location, commonService, __env) {


        /*
        eclaration part
      */
        var url = __env.apiUrl;
        var service = {};
        service.getInventory = getInventory;
        service.addInventory = addInventory;
        service.editInventory = editInventory;
        service.updateInventory = updateInventory;
        service.getInventoryUsage = getInventoryUsage;
        service.dateFilter = dateFilter;
        service.getInventoryAudits = getInventoryAudits;
        service.deleteInventory = deleteInventory;

        return service;

        function deleteInventory(id) {
        	var obj = {id: id};
        	var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'inventories/deleteInventory', dataObj);
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


        function getInventoryAudits(id) {
            var serviceCall = commonService.GetAll(url + 'inventories/getInventoryAudits?id=' + id);
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
          Service functions for  create or update or get Inventory details
        */

        function getInventory(id) {
            var serviceCall = commonService.GetAll(url + 'inventories/get?clinicId=' + id);
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

        function getInventoryUsage(data, id) {
            // var obj = {type :data,};
            // var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'inventories/getHistory?type=' + data + '&clinicId=' + id);
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

        function dateFilter(fromDate, toDate) {
            var serviceCall = commonService.GetAll(url + 'inventories/get?fromDate=' + fromDate + '&toDate=' + toDate);
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

        function addInventory(data) {
            var dataObj = $.param(data);
            var serviceCall = commonService.Create(url + 'inventories/create', dataObj);
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

        function editInventory(id) {
            var serviceCall = commonService.GetAll(url + 'inventories/get?id=' + id);
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

        function updateInventory(data) {
            // var obj = { clinicId: data.clinicId, clinicName: data.clinicName, id: data.id, supplierName: data.supplierName, date: data.date, drugId: data.drugId, balanceQty: data.balanceQty, description: data.description };
            var dataObj = $.param(data);
            var serviceCall = commonService.Create(url + 'inventories/update', dataObj);
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
