(function() {
    'use strict';

    angular
        .module('practysApp')
        .factory('inventoryOfflineService', inventoryOfflineService);

    inventoryOfflineService.$inject = ['$q','$SQLite','utilService'];

    function inventoryOfflineService($q,$SQLite,Utils) {

    	var inventory         				= {};
    	var inventoryServices 				= {};
    	inventoryServices.getInventory 		= getInventory;
    	inventoryServices.editInventory 	= editInventory;
    	inventoryServices.viewInventory 	= viewInventory;
    	inventoryServices.searchFilter		= searchFilter;
    	inventoryServices

    	return inventoryServices;

    	function searchFilter(clinicId,fromDate,toDate){
    			var deferred                = $q.defer();
    			inventory.searchFilterData  = [];
    			inventory.searchFilterCount = '';
    			$SQLite.ready(function() {
                        this.select('SELECT * FROM practysapp_inventories WHERE practysapp_inventories.clinicId = ? AND (practysapp_inventories.inventoryDate BETWEEN ? AND ?)', [clinicId,fromDate,toDate]).then(function() {
                            deferred.resolve(inventory);
                        }, function() {
                            deferred.reject("error");
                        }, function(data) {
                            inventory.searchFilterData.push(data.item);
                            inventory.searchFilterCount = data.count;
                            if((inventory.searchFilterData.length) == inventory.searchFilterCount){
	                        	deferred.resolve(inventory);
	                        }
                        });
                    });
    			return deferred.promise;
    	}

    	function getInventory(clinicId){
    		var deferred                = $q.defer();
    		inventory.getinventoryData  = [];
    		inventory.getinventoryCount = '';
    		$SQLite.ready(function() {
                this.select('SELECT * FROM practysapp_inventories WHERE practysapp_inventories.clinicId = ?',[clinicId]).then(function() {
                        console.log("empty result");
                        deferred.resolve(inventory);
                    }, function() {
                        console.log("error");
                        deferred.reject("error");
                    }, function(data) {
                        inventory.getinventoryData.push(data.item);
                        inventory.getinventoryCount = data.count;
                        if((inventory.getinventoryData.length) == inventory.getinventoryCount){
	                        	deferred.resolve(inventory);
	                        }
                 });
             });
    		 return deferred.promise;
    	}


    	function editInventory(id){
    		var deferred                 = $q.defer();
    		inventory.editInventoryData  =  {};
    		 $SQLite.ready(function() {
                    this.select('SELECT * FROM practysapp_inventories WHERE practysapp_inventories.id=?',[id]).then(function(){
                        deferred.resolve(inventory);
                    }, function() {
                        deferred.reject("error");
                    }, function(data) {
                        data.item.Drug = [];
                        inventory.editInventoryData = (data.item);
                        deferred.resolve(inventory);
                    });
                });
    		 return deferred.promise;
    	}

    	function viewInventory(clinicId){
    		var deferred                 = $q.defer();
    		inventory.viewInventoryData  = [];
    		inventory.viewInventoryCount = '';
    		$SQLite.ready(function() {
                this.select('SELECT * FROM practysapp_inventory_audits WHERE practysapp_inventory_audits.inventoryId = ?',[clinicId]).then(function() {
                        console.log("empty result");
                         deferred.resolve(inventory);
                    }, function() {
                        console.log("error");
                        deferred.reject("error");
                    }, function(data) {
                       inventory.viewInventoryData.push(data.item);
                        inventory.viewInventoryCount = data.count;
                        if((inventory.viewInventoryData.length) == inventory.viewInventoryCount){
	                        	deferred.resolve(inventory);
	                        }
                    });
                });
    		return deferred.promise;
    	}
    }



})();