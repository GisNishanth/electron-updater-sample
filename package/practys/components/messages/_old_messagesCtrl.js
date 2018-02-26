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

(function () {
    'use strict';

 angular
    .module('practysApp')
    .controller('messagesController', messagesController);

    messagesController.$inject = ['$scope','Auth','toastr','$state', '$timeout', 'utilService', 'messageService', '$http','$window','ngDialog'];

    function messagesController ($scope, Auth, toastr, $state, $timeout, Utils, messageService, $http,$window,ngDialog) {

	
        var vm = this;

        $scope.userObj = angular.fromJson(Utils.getItem('user'));

        vm.getAllDoctorsUsers = getAllDoctorsUsers;
        vm.getMessages = getMessages;
        vm.sendMessage = sendMessage;
        vm.sendImage = sendImage;
        vm.download = download;

        vm.doctorLists = [];
        vm.patientLists = [];
        vm.messageLists = [];
        vm.tab = 1;
        vm.msgShow = false;
        vm.receiverId = '';
        vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];

        var senderId = $scope.userObj.id;

        vm.setTab = function (tabId) {
            vm.tab = tabId;
        };

        vm.isSet = function (tabId) {
            return vm.tab === tabId;
        };

        function getAllDoctorsUsers(name){

            vm.messageLists = [];
            if(name == 'doctor'){
                Utils.getDoctors(null,vm.clinicId).then(function(resp) {
                    console.log(resp.data.message);

                    if(resp.data.status == 'success'){
                        vm.doctorLists = resp.data.message;
                    }
                  
                });
            }

            if(name == 'patient'){
              
                Utils.getUsers().then(function(resp) {
                    console.log(resp.data.message);

                    if(resp.data.status == 'success'){
                        vm.doctorLists = resp.data.message;
                    }
                  
                });
            }  
        }


        /* get messages based on tab selected doctor, patient */
        function getMessages(name,receiverId,username){
            console.log(receiverId);
            //if(name != undefined && name != null){
                $scope.userName = username;
                vm.msgShow = true;

                if(name == 'doctor'){
                    
                }

                if(name == 'patient'){

                }

                messageService.getMessage(senderId,receiverId).then(function(resp) {
                    console.log(resp.data.message);
                  if(resp.data.status == 'success'){
                      $timeout(function () {
                          vm.messageLists = resp.data.message;
                          $scope.$apply(); //this triggers a $digest
                          //console.log(resp.data.message); // Yes it shows JSON data
                        }, 100);
                   }else{
                        vm.messageLists = [];
                        toastr.error(resp.data.message);
                   }
                });

                vm.receiverId = receiverId;
            //}   
        }

        vm.isTrigger = function (tabName) {
            vm.getAllDoctorsUsers(tabName);
        };

        function sendMessage(msg){
            console.log(vm.receiverId);

            if(msg == null || msg == undefined){
                toastr.error('Enter text before send');
                return false;
            }

            var obj = {senderId: senderId, receiverId: vm.receiverId, message: msg, type: 'message'};

            messageService.createMessage(obj).then(function(resp) {
                    console.log(resp.data.message);
                  if(resp.data.status == 'success'){

                      $timeout(function () {
                          vm.messageLists.push(resp.data.message);
                          $scope.$apply(); //this triggers a $digest
                          //console.log(resp.data.message); // Yes it shows JSON data
                        }, 100);
                   }else{
                     toastr.error(resp.data.message);
                   }
                });

            console.log('298374987234');
            console.log(msg);
        }

        function sendImage(msg){
            console.log(msg);
            if(msg == null || msg == undefined){
                toastr.error('Select Image before send');
                return false;
            }

            var obj = {senderId: senderId, receiverId: vm.receiverId, image: msg, type: 'image'};

            messageService.createMessage(obj).then(function(resp) {
                    console.log(resp);
                  if(resp.data.status == 'success'){
                    ngDialog.close();
                      $timeout(function () {
                          vm.messageLists.push(resp.data.message);
                          $scope.$apply(); //this triggers a $digest
                          //console.log(resp.data.message); // Yes it shows JSON data
                        }, 100);
                   }else{
                     toastr.error(resp.data.message);
                   }
                });

        }


        if($scope.userObj.user_level != 'clinic'){
            vm.getMessages(null,1,'Clinic');
            //vm.receiverId = 1;
        }else{
            $timeout(function () {
                vm.getAllDoctorsUsers('doctor');
            });

        }


		function download(image) {
            console.log(image);
            var link = document.createElement("a");
            link.download = 'images.jpg';
            link.href = image;
            link.click();
        }

       

        $scope.thumbnail = {
            dataUrl: 'adsfas'
        };
        $scope.fileReaderSupported = window.FileReader != null;
        $scope.photoChanged = function(files){
            console.log("hi");
            if (files != null) {
                var file = files[0];
            if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                $timeout(function() {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function(){
							$scope.thumbnail.dataUrl = e.target.result;
                        });
                    }
                });
            }
        }
        };
   
  }

})();