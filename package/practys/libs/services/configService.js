/*********************************************************************
 *
 *	Great Innovus Solutions Private Limited
 *
 *	Module			: 	Config Service
 *
 *	Description 	: 	Config Service
 *
 *	Developer		: 	Sheema
 * 
 *	Date 			: 	30/08/2016
 *
 *	Version 		: 	1.0
 *
 **********************************************************************/
 
 (function () {
 	'use strict';
 	angular
 	.module('practysApp')
 	.factory('Config', Config);

 	Config.$inject = ['$http', '$timeout', '$filter', '$q','commonService'];

 	function Config($http,$timeout,$filter,$q,commonService){
 		var Service ={
 			getConfig : getConfig
 		};

 		return Service;


 		function getConfig() {

 			var  deferred = $q.defer();

 			var serviceCall	= commonService.GetAll('config/config.json');

 			return serviceCall
	 			.success(function(data) {
				console.log(data);
				deferred.resolve(data);
		     }).
 			error(function(response){
 				console.log("Error : /config/config.json");
 				console.log(response);
 				deferred.reject(response.data);
 			});


 			return deferred.promise;
 		};
 	}


 })();