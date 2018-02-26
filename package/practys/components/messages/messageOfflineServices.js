(function() {
    'use strict';

    angular
        .module('practysApp')
        .factory('messageOfflineService', messageOfflineService);

    messageOfflineService.$inject = ['$q','$SQLite'];

    function messageOfflineService($q,$SQLite) {

    	var messageService                    = {};
    	var message                           = {};
    	messageService.getClinicDoctor        = getClinicDoctor;
        messageService.getClinicPatient       = getClinicPatient;
        messageService.getClinicAnnouncement  = getClinicAnnouncement;
        messageService.getClinicMessage       = getClinicMessage;
    	return messageService;

    	function getClinicDoctor(clinicId){
    		var deferred              = $q.defer();
    		message.getDoctorDetails  = [];
    		message.getDoctorCount    = '';
    		 $SQLite.ready(function() {
                    this.select('SELECT * FROM practysapp_specialityUserMaps LEFT JOIN practysapp_users ON practysapp_specialityUserMaps.userId = practysapp_users.id WHERE practysapp_specialityUserMaps.clinicId = ? AND practysapp_users.user_level = ? AND practysapp_specialityUserMaps.specialityId != ? GROUP BY practysapp_specialityUserMaps.userId', [clinicId, 'doctor', "0"]).then(function() {
                    	deferred.resolve("NoRecords");
                        }, function() {
                        	deferred.reject("error");
                        }, function(data) {
                            message.getDoctorDetails.push(data.item);
                            message.getDoctorCount   =  data.count;
                            if((message.getDoctorDetails.length) == message.getDoctorCount){
	                        	deferred.resolve(message);
	                        }
                        });
                 });
            return deferred.promise;
    	}

        function getClinicPatient(clinicId){
            var deferred               = $q.defer();
            message.getPatinetDetails  = [];
            message.getPatinetCount    = '';
            $SQLite.ready(function() {
                        this.select('SELECT * FROM practysapp_specialityUserMaps LEFT JOIN practysapp_users ON practysapp_specialityUserMaps.userId = practysapp_users.id WHERE practysapp_specialityUserMaps.clinicId = ? AND practysapp_users.user_level = ? GROUP BY practysapp_specialityUserMaps.userId', [clinicId,'patient']).then(function() {
                            deferred.resolve("NoRecords");
                        }, function() {
                            deferred.reject("error");
                        }, function(data) {
                           message.getPatinetDetails.push(data.item);
                           message.getPatinetCount   =  data.count;
                           if((message.getPatinetDetails.length) == message.getPatinetCount){
                                deferred.resolve(message);
                            }
                        });
                });
            return deferred.promise;
        }

        function getClinicAnnouncement(clinicId){
            var deferred                   = $q.defer();
            message.getAnnouncementDetails  = [];
            message.getAnnouncementCount    = '';

             $SQLite.ready(function() {
                        this.select('SELECT * FROM practysapp_announcements WHERE practysapp_announcements.isDeleted = ? AND practysapp_announcements.clinicId = ?', ['0',clinicId]).then(function() {
                            console.log("empty result");
                            deferred.resolve("NoRecords");
                        }, function() {
                            console.log("error");
                            deferred.reject("error");
                        }, function(data) {
                            message.getAnnouncementDetails.push(data.item);
                            message.getAnnouncementCount  =  data.count;
                            if((message.getAnnouncementDetails.length) == message.getAnnouncementCount){
                                deferred.resolve(message);
                            }
                        });
                    });
             return deferred.promise;
        }


        function getClinicMessage(senderId, receiverId){
             var deferred                    = $q.defer();
            message.getclinicMessage         = [];
            message.getclinicMessageCount    = '';
            $SQLite.ready(function() {
                this.select('SELECT * FROM practysapp_messages WHERE (practysapp_messages.receiverId = ? AND practysapp_messages.senderId = ?) OR (practysapp_messages.receiverId = ? AND practysapp_messages.senderId = ?) ',[senderId, receiverId, receiverId, senderId]).then(function() {
                        console.log("empty result");
                        message.getclinicMessage = [];
                        deferred.resolve("NoRecords");
                        }, function() {
                            deferred.reject("error");
                        }, function(data) {
                            message.getclinicMessage.push(data.item);
                            message.getclinicMessageCount        =  data.count;
                            if((message.getclinicMessage.length+1) == message.getclinicMessageCount){
                                deferred.resolve(message);
                            }
                        });
                    });
            return deferred.promise;
        }

    }


})();