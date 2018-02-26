/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   companyCtrl
 *
 *  Description :   Company
 *
 *  Developer   :   Karthick
 * 
 *  Date        :   16/08/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

(function() {
    'use strict';

    angular
        .module('practysApp')
        .controller('messagesController', messagesController);

    messagesController.$inject = ['$rootScope', '$scope', '$SQLite', 'Auth', 'toastr', '$state', '$timeout', 'utilService', 'messageService',
    'messageOfflineService', '$http', '$window', 'ngDialog', 'Upload', '__env', '$interval', '$location'];

    function messagesController($rootScope, $scope, $SQLite, Auth, toastr, $state, $timeout, Utils, messageService,messageOfflineService,$http, $window, ngDialog, Upload, __env, $interval, $location) {

        $scope.model = {};
       
        $scope.model.allItemsSelected = false;

        $scope.model.entities = [
            { "key": 1, "value": "Java Honk" },
            { "key": 2, "value": "Angular JS" },
            { "key": 3, "value": "Multiple Check box" }
        ];

        $scope.selectEntity = function() {
            // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
            for (var i = 0; i < $scope.model.entities.length; i++) {
                if (!$scope.model.entities[i].isChecked) {
                    // $scope.model.allItemsSelected = false;
                    $scope.model.entities[i](index, 1);
                    console.log($scope.model.entities);
                    return;
                }
            }

            //If not the check the "allItemsSelected" checkbox
            $scope.model.allItemsSelected = true;
        };

        // This executes when checkbox in table header is checked
        $scope.selectAll = function() {
            // Loop through all the entities and set their isChecked property
            for (var i = 0; i < $scope.model.entities.length; i++) {
                $scope.model.entities[i].isChecked = $scope.model.allItemsSelected;
            }
            console.log($scope.model.entities);
        };
        $scope.SelectedUser = [];
        $scope.UserOptions = [{
            "id": 1,
            "name": "Doctor"
        }, {
            "id": 2,
            "name": "Patient"
        }];




        var vm = this;

        $scope.userObj = angular.fromJson(Utils.getItem('user'));
        vm.Level = $scope.userObj.user_level;
        vm.imagePath = $scope.userObj.thumbImage;
        vm.image = $scope.userObj.image;

        vm.getAllDoctorsUsers = getAllDoctorsUsers;
        vm.getMessages = getMessages;
        vm.sendMessage = sendMessage;
        vm.sendImage = sendImage;
        vm.download = download;
        vm.openDefault = openDefault;
        vm.addRemoveItem = addRemoveItem;
        vm.sendusSms = sendusSms;
        vm.updateCount = updateCount;
        vm.selectEntity = selectEntity;
        vm.sequenceChat = sequenceChat;
        vm.dateFormatting = dateFormatting;
        vm.getUnreadCount = getUnreadCount;

        vm.doctorLists = [];
        vm.patientLists = [];
        vm.messageLists = [];
        vm.checkDoctor = [];
         vm.commandBox = false;
        $scope.SelectedUser = [];
        $scope.checkedDoctors = [];
        var url = __env.apiUrl;

        vm.patients = [];
        vm.doctors = [];

        vm.tab = 1;
        vm.msgShow = false;
        vm.border = false;
        vm.receiverId = '';
        vm.unreadCountinterval;

        vm.userLevel = $scope.userObj.user_level;
        if (vm.userLevel == "clinic") {
            vm.clinicId = $scope.userObj.id;
        } else {
            vm.clinicId = JSON.parse(localStorage.getItem('doctor'))['clinic']['id'];
            vm.clinicName = JSON.parse(localStorage.getItem('doctor'))['clinic']['username'];
        }
        vm.userName = $scope.userObj.user;

        var senderId = $scope.userObj.id;

        if (vm.userLevel == 'doctor') {
        	// vm.getUnreadCount(vm.clinicId, senderId);

            messageService.updateMessageCount(senderId, vm.clinicId).then(function(resp) {
                console.log(resp);
            });
        }

        vm.setTab = function(tabId) {
        	// alert(tabId);
            vm.tab = tabId;
            $interval.cancel(vm.initialMessage);  
            $interval.cancel(vm.sequenceChats);
        };

        vm.isSet = function(tabId) {
            return vm.tab === tabId;
        };

        console.log($rootScope.messageCount);
        if ($rootScope.messageCount != 0) {
            vm.unseen = [];
            vm.unseen = localStorage.getItem('unSeenMsg');
        }


       function dateFormatting(date){
        	var res = moment(date).format('MMM d, Y hh:mm:ss a');
        	return res;
        }




        function selectEntity(isChecked) {
            $scope.checkedDoctors = [];
            if (isChecked == true) {
                angular.forEach(vm.patients, function(value, key) {
                    $scope.checkedDoctors.push(value.id);
                    vm.checkDoctor[value.id] = true;
                });
            } else {
                angular.forEach(vm.patients, function(value, key) {

                    vm.checkDoctor[value.id] = false;
                });
            }
        }


        /*
            Add or Remove the doctors or patient from the announcement
        */

        function addRemoveItem(checked, id, mobile) {
            if (checked == true) {
                $scope.checkedDoctors.push(id);
                console.log($scope.checkedDoctors);
                if (vm.patients.length == $scope.checkedDoctors.length) {
                    vm.isChecked = true;
                } else {
                    vm.isChecked = false;
                }
            } else {
                var index = $scope.checkedDoctors.indexOf(id);
                $scope.checkedDoctors.splice(index, 1);
                if (vm.patients.length == $scope.checkedDoctors.length) {
                    vm.isChecked = true;
                } else {
                    vm.isChecked = false;
                }
            }
            // alert($scope.checkedDoctors);
        };


        function getAllDoctorsUsers(name) {

            
            // vm.receiverId      = '';
            if(!$rootScope.messageNewMessageAlert){
            	vm.messageLists    = [];
                 vm.doctorLists     = [];
            }
           
            var type = "msg";
            if (name == 'doctor') {
            	if(!$rootScope.messageNewMessageAlert){
                	vm.commandBox = false;
                }
                if ($rootScope.online) {
                	if(!$rootScope.messageNewMessageAlert){
                		$rootScope.practysLoader = true;
                	}
                    Utils.getDoctors(null, vm.clinicId, type).then(function(resp) {
                        if (resp.data.status == 'success') {
                            $rootScope.practysLoader = false;
                            vm.doctorLists = resp.data.message;
                        } else {
                            $rootScope.practysLoader = false;
                            toastr.error(resp.data.message);
                        }
                    });
                } else if ($rootScope.userLevel == 'clinic') {
                    messageOfflineService.getClinicDoctor(vm.clinicId).then(function(resp){
                        $rootScope.practysLoader = false;
                        if(resp.getDoctorDetails.length > 0){
                            vm.doctorLists = resp.getDoctorDetails;
                            $rootScope.practysLoader = false;
                        }else{
                            $rootScope.practysLoader = false;
                        }
                    });
                }
            }


            if (name == 'patient') {
            	if(!$rootScope.messageNewMessageAlert){
                    vm.commandBox = false;
                }
                    
                if ($rootScope.online) {
                   	if(!$rootScope.messageNewMessageAlert){
                		$rootScope.practysLoader = true;
                	}
                    Utils.getUsers(vm.clinicId, type).then(function(resp) {
                        if (resp.data.status == 'success') {
                            $rootScope.practysLoader = false;
                            vm.doctorLists = resp.data.message;
                        } else {
                            $rootScope.practysLoader = false;
                            toastr.error(resp.data.message);
                        }
                    });
                } else if ($rootScope.userLevel == 'clinic') {
                    messageOfflineService.getClinicPatient(vm.clinicId).then(function(resp){
                        $rootScope.practysLoader = false;
                        if(resp.getPatinetDetails.length > 0){
                            vm.doctorLists = resp.getPatinetDetails;
                            $rootScope.practysLoader = false;
                        }else{
                            $rootScope.practysLoader = false;
                        }
                    });
                    
                }
            }

            if (name == 'announcements') {
                // vm.commandBox = false;
                vm.patients = [];
                vm.options = [];
                if ($rootScope.online) {
                    $rootScope.practysLoader = true;
                    /*
                        Getting all patients by the clinicId
                    */
                    Utils.getUsers(vm.clinicId).then(function(resp) {
                        if (resp.data.status == 'success') {
                            $rootScope.practysLoader = false;
                            vm.patients = [];
                            vm.getMessages(name, null, null);
                            vm.patients = resp.data.message;
                            
                            // toastr.succe(resp.data.message);
                        }else{
                            toastr.error(resp.data.message);
                            $rootScope.practysLoader = false;
                        }

                    });
                } else if ($rootScope.userLevel == 'clinic') {
                     messageOfflineService.getClinicPatient(vm.clinicId).then(function(resp){
                        $rootScope.practysLoader = false;
                        if(resp.getPatinetDetails.length > 0){
                            vm.patients = resp.getPatinetDetails;
                        }
                    });
                    vm.getMessages(name, null, null);
                }
            }


        }





        /* get messages based on tab selected doctor, patient */
        function getMessages(name, receiverId, username, mobile) {
            vm.loaders = true;
            vm.border = true;
            $rootScope.lId = "";
            $rootScope.rId = receiverId;
            vm.receiverId = receiverId;
            vm.messageLists = [];
            vm.messageList = [];
            console.log(receiverId);
            $interval.cancel(vm.sequenceChats);
            $interval.cancel(vm.initialMessage); 


            $scope.userName = username;
            vm.msgShow = true;

            if (name == 'doctor') {

            }

            if (name == 'patient') {

            }

            if (name == 'announcements') {
                vm.commandBox = false;
                if ($rootScope.online) {
                    var type = "all";
                    messageService.getAnnouncement(vm.clinicId, type).then(function(resp) {
                        if (resp.data.status == 'success') {
                            vm.loaders = false;
                            vm.messageList = resp.data.message;

                        } else {
                             vm.loaders = false;
                            vm.messageList = [];
                            toastr.error(resp.data.message);
                        }
                    });
                } else if ($rootScope.userLevel == 'clinic') {
                    vm.messageList = [];
                     messageOfflineService.getClinicAnnouncement(vm.clinicId).then(function(resp){
                        vm.loaders = false;
                        if(resp){
                             if(resp.getAnnouncementDetails.length > 0){
                            vm.messageList = resp.getAnnouncementDetails;
                         }
                        }
                    });
                }
            } else {
                console.log("here");

                // $interval.cancel(vm.sequenceChats);
                $scope.lastId = null;
                // $scope.lastId = "";
                if ($rootScope.online) {
                    vm.commandBox = true;
                    // $rootScope.messageUpdateCount = true;
                    // $scope.lastId = "";
                    // $interval(function () {
                    messageService.getMessage(senderId, $rootScope.rId,undefined,vm.clinicId).then(function(resp) {
                            console.log(resp.data.message);
                        if (resp.data.status == 'success') {

                            vm.loaders = false;
                            vm.updateCount(vm.receiverId);
                            var type = "push";

                            angular.forEach(resp.data.message, function(value, key) {
                                $scope.lastId = value.id;
                            });
                            
                            $timeout(function() {
                                vm.messageLists = resp.data.message;
                            }, 100);

                            vm.sequenceChat();

                        } else {
                            vm.loaders = false;
                            
                            toastr.error("No Messages to Read...");
                            vm.initialMessage = $interval(function() {
                                vm.messageLists = [];
                                messageService.getMessage(senderId, $rootScope.rId,undefined,vm.clinicId).then(function(resp) {
                                    console.log(resp.data.message);
                                    if (resp.data.status == 'success') {
                                        vm.messageLists.push(resp.data.message[0]);
                                        $scope.lastId = resp.data.message[0].id;
                                        vm.updateCount(vm.receiverId);
                                        vm.sequenceChat();

                                    }
                                });
                            }, 10000);
                           
                        }
                    });
                    
                    
                } else if ($rootScope.userLevel == 'clinic') {
                    messageOfflineService.getClinicMessage(senderId,receiverId).then(function(resp) {
                       if(resp){
                         if(resp.getclinicMessage){
                                if(resp.getclinicMessage.length > 0){
                                vm.messageLists = resp.getclinicMessage;
                            }
                         } 
                       }
                    });
                  vm.loaders = false;
                  vm.commandBox  = true;
                }
            }
        }

        /*
            functionality to getting the frequent messages from the users
        */

        function sequenceChat(){
            $interval.cancel(vm.initialMessage);         
            var senderId = $scope.userObj.id;
            // alert(sendId);
            // alert(recieverId);
            console.log($state.current,"state namessss");
            vm.sequenceChats = $interval(function() {
                console.log("cominbg in");
               if($state.current.name == "messages"){
                // if ($scope.lastId != undefined) {
                //         alert("if");
                //         // alert("undefined");
                //         $rootScope.lId = $scope.lastId;
                        
                //     } else {
                //         alert("else");
                //         console.log(vm.messageLists.length);
                //         console.log(vm.messageLists[vm.messageLists.length - 1].id,"recurring message");
                //         console.log(vm.messageLists.length - 1,"indexxxxxxxx");
                //         // alert("not undefined");
                //         // console.log(vm.messageLists[vm.messageLists.length - 1].id,"message listssssssssss");
                //         $rootScope.lId = vm.messageLists[vm.messageLists.length - 1].id;
                //     }


                    messageService.getMessage(senderId, $rootScope.rId, $scope.lastId,vm.clinicId).then(function(resp) {

                        if (resp.data.status == "success") {
                            console.log(resp);
                            vm.messageLists.push(resp.data.message[0]);
                            $scope.lastId = resp.data.message[0].id;
                        }else{

                        }
                    });
                }else{
                    $interval.cancel(vm.sequenceChats);
                }
                    
                
            }, 10000);
                
        }

        vm.isTrigger = function(tabName) {
            vm.getAllDoctorsUsers(tabName);
        };

        function sendMessage(msg) {

            $interval.cancel(vm.sequenceChats);
            vm.created = moment().format('YYYY-MM-DD HH:mm:ss');
            if (msg == null || msg == undefined || msg == '') {
                toastr.error('Enter text before send');
                return false;
            }
            if (vm.receiverId != undefined || vm.receiverId != null) {
                var obj = {clinicId:vm.clinicId, senderId: senderId, receiverId: vm.receiverId, message: msg, created: vm.created, type: 'message', isView: 0 };
                if ($rootScope.online) {
                    messageService.createMessage(obj).then(function(resp) {
                        if (resp.data.status == 'success') {
                            console.log(resp.data.message,"created Messageeeeee");
                            $timeout(function() {
                                $rootScope.lId = "";
                                vm.messageLists.push(resp.data.message);
                                $scope.lastId = resp.data.message.id;
                                vm.sequenceChat();
                                $scope.$apply(); //this triggers a $digest
                            }, 100);
                        } else {
                            toastr.error(resp.data.message);
                        }
                    });
                } else if ($rootScope.userLevel == 'clinic') {
                  toastr.error("No Internet Connection");
                }
            } else {
                if ($scope.checkedDoctors == '' || $scope.checkedDoctors == undefined || $scope.checkedDoctors == null) {
                    toastr.error("Select the users to whom an announcement is to be passed");
                    return false;
                } else {
                    // var id = JSON.parse($window.localStorage.getItem('user'))["id"];
                    var obj = { clinicId: vm.clinicId, messageText: msg, type: 'create', created: vm.created, receiverId: $scope.checkedDoctors };
                    if ($rootScope.online) {
                        messageService.createAnnouncement(obj).then(function(resp) {
                            if (resp.data.status == 'success') {
                                vm.msg = "";
                                $scope.checkedDoctors = [];
                                 angular.forEach(vm.patients, function(value, key) {
                    					vm.checkDoctor[value.id] = false;
                				});
                                vm.isChecked = "";
                                toastr.success("Announcement sent successfully");
                                $timeout(function() {
                                    vm.messageList.push(resp.data.message);
                                   

                                }, 100);
                            } else {
                                toastr.error(resp.data.message);
                            }
                        });
                    } else if ($rootScope.userLevel == 'clinic') {
                        var data = {};
                        var count = [];
                        data.isView = [];
                        data.clinicId = id;
                        data.messageText = msg;
                        data.receiverId = $scope.checkedDoctors;
                        data.is_sync = 0;
                        data.is_Created = 0;
                        angular.forEach($scope.checkedDoctors, function(value, key) {
                            if (value) {
                                count.push({ 'id': (value), 'isView': 0 });
                            }
                        });
                        data.isView = JSON.stringify(count);
                        console.log(data);
                        $SQLite.ready(function() {
                            this.insert('practysapp_announcements', [data]).then(function(data) {
                                $timeout(function() {
                                    $scope.msg = '';
                                    toastr.info("Message Saved In Offline");
                                    vm.messageList.push(obj);
                                }, 100);
                            }, function(error) {
                                console.log(error);
                            });
                        });
                    }
                }

            }
        }


        function sendusSms(msg) {
        	// console.log(vm.msg);
        	// vm.msg = '';

        	if(msg){
        		if($rootScope.online){
	                var obj = {};
	                obj.type ="sms";
	                obj.msg = msg;
	                obj.senderId = senderId;
	                obj.clinicId = vm.clinicId;

	                    obj.receiverId = vm.receiverId;

	                    messageService.sendSms(obj).then(function(resp) {
	                        console.log(resp.data.message);
	                        if (resp.data.status == 'success') {
	                        	vm.messageLists.push(resp.data.message);
	                            // toastr.success("Message Sent Successfully");
	                            // msg = '';
	                        } else {
	                            // $scope.msg = "";
	                            toastr.error(resp.data.message);
	                        }
	                    });
	                   
	            }else{
	                toastr.error("No Internet Connections");
	            }
        	}else{
        		toastr.error('Enter the text before sent');
        		return false;
        	}
        	
        }

        function updateCount(senderId) {
            messageService.updateMessageCount(vm.clinicId, senderId).then(function(resp) {
                console.log(resp);
                if(resp.data.status == 'success'){
                	if(vm.userLevel == 'clinic'){
                    	vm.getUnreadCount(vm.clinicId);
                    }
                }
            });
        }

        function sendImage(imageData, imageDetails, imageName) {
            vm.created = moment().format('YYYY-MM-DD HH:mm:ss');

            if (imageData == null || imageData == undefined) {
                toastr.error('Select Image before send');
                return false;
            }

            var obj = { senderId: senderId, receiverId: vm.receiverId, created: vm.created, image: imageData, type: 'image' };
            if ($rootScope.online) {
                Upload.upload({
                    url: url + 'messages/create',
                    data: { image: imageData, senderId: senderId, created: vm.created, receiverId: vm.receiverId,clinicId:vm.clinicId, type: 'image', isView: 0 }

                }).then(function(resp) {
                    console.log(resp);
                    if (resp.data.data.status == 'success') {
                        ngDialog.close();
                        $timeout(function() {
                            vm.messageLists.push(resp.data.data.message);
                            $scope.$apply(); //this triggers a $digest
                        }, 100);
                    } else {
                        toastr.error(resp.data.message);
                    }
                    console.log('Success ' + resp.config.data.image.name + 'uploaded. Response: ' + resp.data);

                }, function(resp) {
                    console.log('Error status: ' + resp.status);
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.name);
                });
            } else{
               toastr.error("No Internet Connections");
            }
        }


        if ($scope.userObj.user_level != 'clinic') {
            // alert(vm.clinicId);
            vm.getMessages(null, vm.clinicId,vm.clinicName);
            
        } else {
        	vm.getUnreadCount(vm.clinicId);

            $timeout(function() {
                vm.getAllDoctorsUsers('doctor');
            });

        }



        function download(image, name) {
            // alert(image);
            var link = document.createElement("a");
            link.download = 'chatImages';
            link.href = image;
            link.click();
        }




        $scope.fileReaderSupported = window.FileReader != null;
        $scope.photoChanged = function(files) {
            if($rootScope.online){
                console.log(files);
                $scope.files = files[0];
                if (files != null) {
                    var file = files[0];
                    if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    $scope.thumbnail_url = e.target.result;
                                    vm.openDefault($scope.thumbnail_url, files, 'send');
                                });
                            }
                        });

                    }
                } 
            }else{
                toastr.error("No Internet Connections");
            }
            
        };

        function openDefault(image, file , type) {
            $scope.image = image;
            $scope.file = file;
            if(type == 'preview'){
            	$rootScope.imagePreview = true;
            	$scope.btnShow = false;
            }else{
            	$scope.btnShow = true;
            }

            ngDialog.open({
                template: 'firstDialog',
                scope: $scope,

            });

        };

        //getting msg unread count to display the count at the tab of doctor, patient(Used in only clinic flow)

        function getUnreadCount(clinicId){
        	messageService.getUnreadCount(clinicId).then(function(resp) {
                console.log(resp);
                $timeout(function() {  vm.unreadCount = resp.data.message; }, 10);
               
            });
        }



    if(vm.userLevel == "clinic"){

    	vm.unreadCountinterval = $interval(function(){
      	console.log(vm.tab);
      	if($rootScope.messageNewMessageAlert){
      		// console.log("message intervallllllll");
      		if(vm.tab ==1){
	      		vm.getUnreadCount(vm.clinicId);
	      		vm.getAllDoctorsUsers('doctor');
	      	}else if(vm.tab == 2){
	      		vm.getUnreadCount(vm.clinicId);
	      		vm.getAllDoctorsUsers('patient');
	      	}
	      	// else if(vm.tab == 3){
	      	// 	vm.getUnreadCount(vm.clinicId);
	      	// }
	      	$rootScope.messageNewMessageAlert = false;
	      	// clear();
      	}


      	
      },1000);
    }   

    $scope.$on("$destroy", function(){
        $interval.cancel(vm.unreadCountinterval);
    }); 
      

    }

})();
