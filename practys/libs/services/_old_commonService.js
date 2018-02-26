(function () {
    'use strict';
 
   app.factory('commonService', commonService);
 
    commonService.$inject = ['$http', '$timeout', '$filter', '$q'];
    function commonService($http, $timeout, $filter, $q) {
 
        var service = {};
 
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByKey = GetByKey;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.Get = Get;
 
        return service;
 
        function GetAll(url) {
            console.log(url);
            //return $http.get(url).then(handleSuccess, handleError('Error getting all datas'));
            return $http.get(url);
        }
 
        function GetById(url,id) {
            //return $http.get(url + "/" + id).then(handleSuccess, handleError('Error getting user by id'));
            return $http.get(url + "/" + id);
        }
        
        function Get(url,data) {
            //return $http.post(url,data).then(handleSuccess, handleError('Error creating data'));
            return $http.get(url,data);
        }

        function GetByKey(url,username) {
            //return $http.get(url + "/" + username).then(handleSuccess, handleError('Error getting user by username'));
            return $http.get(url + "/" + username);
        }
 
        function Create(url,data) {
            //console.log(data);
            //return $http.post(url,data).then(handleSuccess, handleError('Error creating data'));
            return $http.post(url,data);
        }
 
        function Update(url,data) {
            //return $http.put(url + "/" + data.id, data).then(handleSuccess, handleError('Error updating data'));
            return $http.put(url + "/" + data.id, data);
        }
 
        function Delete(id) {
            //return $http.delete(url + "/" + id).then(handleSuccess, handleError('Error deleting data'));
            return $http.delete(url + "/" + id);
        }
 
        // private functions
 
        function handleSuccess(res) {
            console.log(res);
            return res.data;
        }
 
        function handleError(error) {
            console.log(error);
            return function () {
                return { success: false, message: error };
            };
        }

        function getUsers() {
            if(!localStorage.users){
                localStorage.users = JSON.stringify([]);
            }
 
            return JSON.parse(localStorage.users);
        }
 
        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }
    }
})();