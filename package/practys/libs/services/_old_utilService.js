/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module          :   Util
 *
 *  Description     :   Util Service
 *
 *  Developer       :   karthick
 * 
 *  Date            :   14/09/2016
 *
 *  Version         :   1.0
 *
 **********************************************************************/
 

 (function () {
    'use strict';

 angular
    .module('practysApp')
    .factory('utilService', utilService);

    utilService.$inject = ['$q', '$window','$location','commonService','__env'];

    function utilService ($q, $window,$location,commonService,__env) {

          var service = {
            SaveStateObj: SaveStateObj,
            RestoreStateObj: RestoreStateObj,
            getItem: getItem,
            saveItem: saveItem,
            getDoctors: getDoctors,
            getUsers: getUsers,
            getSpecialities: getSpecialities

          };

          var url = __env.apiUrl;

        return service;

        /* functions to save and retrieve object in localstorage */

        function SaveStateObj(obj) {
            return angular.toJson(obj);
        }

        function RestoreStateObj(obj) {
            return angular.fromJson(obj);
        }

        function getItem(name) 
        {
            return $window.localStorage.getItem(name);
        }

        function saveItem(name, config_data) 
        {
            if(config_data)
                $window.localStorage.setItem(name, SaveStateObj(config_data));
            else
                $window.localStorage.removeItem(name);

        }

        /*  function to get all doctors */
        function getDoctors(obj){
            console.log(obj);
            if(obj != undefined){
                var serviceCall =  commonService.GetAll(url+'doctors?specialityId='+obj.id);
            }else{
                var serviceCall =  commonService.GetAll(url+'doctors');
            }

            var deferred = $q.defer();

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
                error(function(response){
                    console.log("Error : doctor failed ");
                    console.log(response);
                    deferred.reject(response.data);
                });

            return deferred.promise;
 
        }


        /*  function to get all patient or users specific to that clinic */
        function getUsers(){
            var serviceCall =  commonService.GetAll(url+'users');

            var deferred = $q.defer();

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
                error(function(response){
                    console.log("Error : users failed ");
                    console.log(response);
                    deferred.reject(response.data);
                });

            return deferred.promise;
 
        }

        /*  get all specialities and save it in localstorage*/
        function getSpecialities(){
            var deferred = $q.defer();
            //saveItem('speciality');
            if (getItem("speciality") === null) {
                var serviceCall =  commonService.GetAll(url+'specialities');

                serviceCall
                .success(function(data) {
                    console.log(data.data);
                    saveItem('speciality',data.data);
                    deferred.resolve(data.data);
                }).
                error(function(response){
                    console.log(response);
                    deferred.reject(response);
                });
            }else{
                alert('in');
                var data = RestoreStateObj(getItem("speciality"));
                console.log(data);
                deferred.resolve(data);
            }

            return deferred.promise;
 
        }

    }
})();

