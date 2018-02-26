/*********************************************************************
 *
 *	Great Innovus Solutions Private Limited
 *
 *	Module			: 	Messages
 *
 *	Description 	: 	Message handling service part
 *
 *	Developer		: 	karthick
 * 
 *	Date 			: 	20/09/2016
 *
 *	Version 		: 	1.0
 *
 **********************************************************************/


(function() {
    'use strict';

    angular
        .module('practysApp')
        .factory('messageService', messageService);

    messageService.$inject = ['$q', '$window', '$location', 'commonService', '__env'];

    function messageService($q, $window, $location, commonService, __env) {

        var service = {
            getMessage: getMessage,
            createMessage: createMessage,
            getImage: getImage,
            createAnnouncement: createAnnouncement,
            getAnnouncement: getAnnouncement,
            sendSms: sendSms,
            updateMessageCount: updateMessageCount,
            getUnreadCount: getUnreadCount

        };

        var url = __env.apiUrl;

        return service;

        /* get Message details of doctor or patient */

        function getMessage(senderId, userId, lastId,clinicId) {

            var deferred = $q.defer();
            if (lastId == undefined) {
                var serviceCall = commonService.GetAll(url + 'messages/get?senderId=' + senderId + '&receiverId=' + userId + '&clinicId=' + clinicId);
            } else {
                var serviceCall = commonService.GetAll(url + 'messages/get?senderId=' + senderId + '&receiverId=' + userId + '&lastId=' + lastId + '&clinicId=' + clinicId);
            }
            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : message retrive failed ");
                console.log(response);
                deferred.reject(response);
            });

            return deferred.promise;

        }

        /*getting image file for download*/
        function getImage(image) {

            var deferred = $q.defer();

            var serviceCall = commonService.Get(url + 'messages/getImage?image=' + image);

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : message retrive failed ");
                console.log(response);
                deferred.reject(response);
            });

            return deferred.promise;

        }


        /* save message  */
        function createMessage(obj) {
            var deferred = $q.defer();

            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'messages/create', dataObj);

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : message save failed ");
                console.log(response);
                deferred.reject(response.data);
            });

            return deferred.promise;
        }

        /* create Announcements  */

        function createAnnouncement(obj) {
            var deferred = $q.defer();

            var dataObj = $.param(obj);

            var serviceCall = commonService.Create(url + 'messages/announcement', dataObj);

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : message save failed ");
                console.log(response);
                deferred.reject(response.data);
            });

            return deferred.promise;
        }

        /* get Announcements  */

        function getAnnouncement(clinicId, type) {

            var deferred = $q.defer();
            var obj = { clinicId: clinicId, type: type };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'messages/announcement', dataObj);

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : message retrive failed ");
                console.log(response);
                deferred.reject(response);
            });

            return deferred.promise;

        }

        function sendSms(obj) {

            var deferred = $q.defer();
            var obj = { message: obj.msg, receiverId: obj.receiverId, type: obj.type, senderId: obj.senderId, clinicId: obj.clinicId };
            var dataObj = $.param(obj);
            var serviceCall = commonService.Create(url + 'messages/create', dataObj);

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : message retrive failed ");
                console.log(response);
                deferred.reject(response);
            });

            return deferred.promise;

        }

        function updateMessageCount(recieverId, senderId) {

            var deferred = $q.defer();

            var serviceCall = commonService.GetAll(url + 'messages/updateCount?recieverId=' + recieverId + '&senderId=' + senderId);

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : message retrive failed ");
                console.log(response);
                deferred.reject(response);
            });

            return deferred.promise;

        }

        function getUnreadCount(clinicId){
        	 var deferred = $q.defer();
        	
        	var serviceCall = commonService.GetAll(url + 'messages/getUnreadCount?clinicId=' + clinicId);
        	 
            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
            error(function(response) {
                console.log("Error : message retrive failed ");
                console.log(response);
                deferred.reject(response);
            });

            return deferred.promise;
        }

    }

})();
