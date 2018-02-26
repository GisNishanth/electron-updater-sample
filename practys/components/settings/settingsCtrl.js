/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   settingController
 *
 *  Description :   setting
 *
 *  Developer   :   Nishanth
 * 
 *  Date        :  13/10/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

(function() {
    'use strict';

    angular
        .module('practysApp')
       
        .controller('settingController', settingController);

    settingController.$inject = ['$scope', '$rootScope', 'Auth', 'settingService','settingOfflineServices','toastr', '$state', '$window', 'ngDialog', '$timeout', 'utilService', 'Upload', '__env', '$filter', 'utilService'];

    function settingController($scope, $rootScope, Auth, settingService, settingOfflineServices,toastr, $state, $window, ngDialog, $timeout, Utils, Upload, __env, $filter, utilService) {



        if (!Auth.isLoggedIn()) {
            $state.go('login');
            return false;
        }
        /*
            Table ascending and Descending Order
        */
        $scope.sort = function(keyname) {
                $scope.sortKey = keyname;
                $scope.reverse = !$scope.reverse;
            }
        /*
          Call from  Patient controller function
        */
        $scope.$on('myEvent', function(e) {
            vm.getPatDetails();
            vm.tab = 2;
            vm.tabs = 2;

        });

        $scope.drugType = ["Capsules", "Medicine", "Spray", "Vitamins", "Elixir", "Injection", "Pills", "Cream", "Syrup"];
        $scope.items = [{ "subscriptionPlan": "", "noOfMonth": "", "price": "", "noOfAppointment": "", "patientAccount": "unlimited", "doctorAccount": "" }];
        $rootScope.popup = false;
        $scope.serviceConfirm = "This service is linked with Doctors , Appointment and Patient data module in this clinic. If this Service deleted particular doctor will be deleted from this clinic and this service will not display in both appointment and patient data module. If you okay with this, you can proceed with Confirm?";

        /*
            Add and delete for muliple service selection for clinic flow
        */
        // $scope.addRow = function() {
        //     // for (var i = 0; i < $scope.contacts.length; i++) {
        //     //     if ($scope.contacts[i].service != '' && $scope.contacts[i].mins != '') {
        //     //         if (i == $scope.contacts.length - 1) {
        //     //             $scope.contacts.push({ service: '', mins: '' });
        //     //         }
        //     //     } else {
        //     //         return false;
        //     //     }
        //     // }
        //     $timeout(function(){
        //         $scope.$apply(function(){
        //             vm.contacts.push({ service: '', mins: '', cost: '' });
        //         });
        //     },10);

        // }

        // $scope.delRow = function(index) {
        //     vm.contacts.splice(index, 1);
        // }

        function addRow(){
            vm.contacts.push({ service: '', mins: '', cost: '' });
        }
        function delRow(index) {
            vm.contacts.splice(index, 1);
        }

        function cancelSpeciality(){
            vm.addSpecial = false;
            vm.tableSpecial = true;
            vm.generalValue.Speciality  =   '';
            vm.contacts = [{ service: '', mins: '', cost: '' }];
        }

        var owl = angular.element( document.querySelector( '.owl-carousel' ) );
            //alert('yes');
            console.log(owl);
             //var owl = $('.owl-carousel');
              owl.owlCarousel({
                margin: 10,
                nav: true,
                loop: true,
                responsive: {
                  0: {
                    items: 1
                  },
                  600: {
                    items: 3
                  },
                  1000: {
                    items: 5
                  }
                }
              });

        $scope.plans = [
            { name: "standard", id: "1" },
            { name: "basic", id: "2" },
            { name: "custom", id: "3" }
        ];

        /*
        Add and delete for muliple Subscription plan for admin flow
        */

        $scope.add = function(item) {
            $scope.items.push({
                subscriptionPlan: "",
                noOfMonth: "",
                price: "",
                noOfAppointment: "",
                costPerAppointment:"",
                patientAccount: "",
                doctorAccount: "",
                costPerDocAccount:""
            });
        };

        $scope.delete = function(key) {
            $scope.items.splice(key, 1);
        };

        //break time check

        // $scope.breakTimes = [];

        // $scope.breakTimeAdd = function(day){
        	
        // 	if(!day['breakCheck']['breakOpen'])
        // 	{
        // 		toastr.error('Select Break Start Time and Then Proceed');
        // 	}
        // 	else if(!day['breakCheck']['breakClose'])
        // 	{
        //        toastr.error('Select Break Close Time and Then Proceed');
        // 	}
        // 	else
        // 	{
        //         var Obj = {day: day.day,status :true,breakOpen:day['breakCheck']['breakOpen'],breakClose:day['breakCheck']['breakClose']};
        //         $scope.breakTimes.push(Obj);
        // 	}

        	

        // };





        /*
          Pagination predefined declaration
        */

        $scope.currentPage = 1;
        $scope.maxSize = 10;
        $scope.currentPages = 1;
        $scope.maxSizes = 10;

        /*
          Date picker Functionalities
        */

        $scope.openDatePickers = [];
        $scope.openDatePicker = [];
        $scope.openFrom = function($event, datePickerIndex) {
            $event.preventDefault();
            $event.stopPropagation();

            if ($scope.openDatePickers[datePickerIndex] === true) {
                $scope.openDatePickers.length = 0;
            } else {
                $scope.openDatePickers.length = 0;
                $scope.openDatePickers[datePickerIndex] = true;
            }
        };

        $scope.openTo = function($event, datePickerIndex) {
            $event.preventDefault();
            $event.stopPropagation();

            if ($scope.openDatePicker[datePickerIndex] === true) {
                $scope.openDatePicker.length = 0;
            } else {
                $scope.openDatePicker.length = 0;
                $scope.openDatePicker[datePickerIndex] = true;
            }
        };

        /*
          Setting the minutes as zero in the timepicker
        */
        var d = new Date();

        d.setMinutes(0);
        $scope.min = d;


        /*
          Declaration part
        */


        var vm = this;
        vm.init = init;
        vm.getDetails = getDetails;
        vm.updateDetails = updateDetails;
        vm.openDefault = openDefault;
        vm.changePassword = changePassword;
        vm.photoChanged = photoChanged;
        vm.general = general;
        vm.addDoctor = addDoctor;
        vm.getPatDetails = getPatDetails;
        vm.editPatient = editPatient;
        vm.editDoctor = editDoctor;
        vm.patientUpdate = patientUpdate;
        vm.doctorUpdate = doctorUpdate;
        vm.addNewChoice = addNewChoice;
        vm.removeChoice = removeChoice;
        vm.getServices = getServices;
        vm.findIndexInData = findIndexInData;
        vm.cardDetails = cardDetails;
        vm.increment = increment;
        vm.decrement = decrement;
        vm.confirmSubcription = confirmSubcription;
        vm.addSpecialityServices = addSpecialityServices;
        vm.addClinic = addClinic;
        vm.subscriptionPlan = subscriptionPlan;
        vm.getPlans = getPlans;
        vm.updatePlan = updatePlan;
        vm.getAllServices = getAllServices;
        vm.getExistingPlan = getExistingPlan;
        vm.subscribePlan = subscribePlan;
        vm.doctorPopup = doctorPopup;
        vm.deleteUser = deleteUser;
        vm.drugPop = drugPop;
        vm.getDrug = getDrug;
        vm.addDrug = addDrug;
        vm.editDrug = editDrug;
        vm.getColorCode = getColorCode;
        vm.addPatientDetails = addPatientDetails;
        vm.editDoctorDetails = editDoctorDetails;
        vm.editService = editService;
        vm.updateService = updateService;
        vm.deleteService = deleteService;
        vm.getSpecialityService = getSpecialityService;
        vm.getSpeciality  = getSpeciality;
        vm.upload = upload;
        vm.getColorForDoctor = getColorForDoctor;
        vm.dialogClose = dialogClose;
        vm.toTime = toTime;
        vm.additionalDialog = additionalDialog;
        vm.additionalPaymentPreview = additionalPaymentPreview;
        vm.additionalElement = additionalElement;
        vm.addRow   =   addRow;
        vm.delRow   =   delRow;
        vm.checkChild = checkChild;
        vm.keyup = keyup;
        vm.renewalOff = renewalOff;
        vm.cancelSpeciality     =   cancelSpeciality;
        vm.confirmPop = confirmPop;
        vm.getClinicDetails = getClinicDetails;
        vm.resetPopup = resetPopup;
        vm.resetPassword = resetPassword;
        vm.planChangePop = planChangePop;
        vm.updateClinicPlan = updateClinicPlan;
        vm.getInvoiceHistory = getInvoiceHistory;
        vm.deleteDrug = deleteDrug;
        vm.changeButttonProps   = changeButttonProps;
        vm.setServicesSpeciality = setServicesSpeciality;
        vm.colourNameToHex = colourNameToHex;
        vm.subscriptionPaymentPreview = subscriptionPaymentPreview;
        vm.linkPop = linkPop;
        vm.clinicLink = clinicLink;
        vm.linkDoctor = linkDoctor;

        $scope.colors = ['Blue', 'Cyan', 'Green', 'Orange', 'Pink', 'Purple', 'Red', 'Violet', 'RoyalBlue', 'PaleGreen', 'Crimson', 'Navy', 'Lime', 'LawnGreen', 'Magenta'];

        $scope.service = [];
        vm.specialitie = [];
        vm.special = [];
        vm.colors = [];
        $rootScope.changes = 0;
        vm.setting = {};
        vm.table = true;
        vm.format = "yyyy-MM-dd";
        vm.generalValue = {};
        vm.tab = 1;
        vm.tabs = 1;
        vm.type = JSON.parse($window.localStorage.getItem('user'))["user_level"];
        if(vm.type == 'clinic'){
            vm.userObj = JSON.parse($window.localStorage.getItem('user'));
             vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
         }else if(vm.type == 'doctor'){
             vm.clinicId = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]["id"];
         }
       
        vm.choices = [{ id: 1 }];
        vm.serviceData = true;
        vm.minusButton = false;
        vm.id = true;
        vm.slickPlansLoaded = false;
        vm.slickConfig3Loaded = false;
        // $scope.slickConfig3Loaded = false;
        // $scope.clinicPaymentHistory = "";

        var url = __env.apiUrl;
        vm.getSpecialitiesService = getSpecialitiesService;
        vm.contacts = [{ service: '', mins: '', cost: '' }];
        vm.child;
        vm.timer;
        vm.clinicDetails;


        function linkPop(){
        	$rootScope.popup = true;
        	ngDialog.open({
            	template: 'linkClinic',
                scope: $scope,
                preCloseCallback:function(){
                	vm.nric = "";
                	$rootScope.popup = false;
                }
            });
        }

        function clinicLink(nric){
        	console.log(nric);
        	if(nric){
        		$rootScope.practysLoader = true;
	        	var obj = {
	        		nric: nric,
	        		clinicId:  vm.clinicId
	        	}
	        	settingService.clinicLink(obj).then(function(resp) {
	                if (resp.data.status == "success") {
	                	ngDialog.close();
	                    toastr.success(resp.data.message);
	                    vm.getPatDetails();
	                    $rootScope.practysLoader = false;
	                } else {
	                    toastr.error(resp.data.message);
	                   $rootScope.practysLoader = false;
	                }
	            });
        	}
        }


        function getSpeciality(){
    		if ($rootScope.online) {
                	vm.specialities = [];
                    vm.autocompleteItems = [];
                    $scope.uiItems = [];
                    Utils.getSpecialities(vm.clinicId).then(function(resp) {
	                    if (resp.status == 'success') {
		                    vm.specialityItems = resp.message.length;
		                    angular.forEach(resp.message, function(value, key) {
			                    value.disabled = false;
			                    vm.specialities.push(value);
			                    vm.autocompleteItems.push(value.name);
			                    $scope.uiItems = vm.autocompleteItems;
		                    });
	                    	Utils.saveItem("specialityService", vm.specialities);
	                    }
                    });
            }else{
                settingOfflineServices.getSpecilityServices(vm.clinicId).then(function(resp){
                    if(resp){
                        if(resp.specilityData.length > 0){
                            vm.specialities     = resp.specilityData;
                            vm.autocompleteItems = vm.specialities;
                            $scope.uiItems       = vm.specialities; 
                            vm.specialityItems   = vm.specialities.length;
                            vm.getSpecialitiesService(function(){
                                vm.addServicesToSpecialities();
                            });
                        }
                    }
                });
             }
        }
         /*
            Deleing drug by id
        */

        function deleteDrug(id){
            // alert(id);
            $rootScope.practysLoader = true;
            if($rootScope.online){
                settingService.deleteDrug(id).then(function(resp) {
                    if (resp.data.status == "success") {
                        toastr.success(resp.data.message);
                        $rootScope.practysLoader = false;
                        vm.getDrug();
                    } else {
                        toastr.error(resp.data.message);
                       $rootScope.practysLoader = false;
                    }
                });
            }else{
                toastr.error("No Internet Connection");
            }
        }

        /*
            Getting and Showing Payment History for Clinic Flow
        */

        function getInvoiceHistory(){
        	$rootScope.imagePreview =false;
            $scope.clinicPaymentHistory = "";
            // vm.slickConfig3Loaded = false;
            $rootScope.practysLoader = true;
            settingService.getInvoiceHistory(vm.clinicId).then(function(resp) {
                if (resp.data.status == "success") {
                    $rootScope.paymentHistoryPop = true;
                    vm.slickPayment = true;
                    $rootScope.practysLoader = false;
                    $scope.clinicPaymentHistory = resp.data.message;
                    ngDialog.open({
                        template: 'showPaymentHistory',
                         scope: $scope
                    });
                } else {
                    $rootScope.paymentHistoryPop = false;
                    $scope.clinicPaymentHistory = "";
                    vm.slickPayment = false;
                    $rootScope.practysLoader = false;
                    toastr.error("No Bills Found...");
                }
            });
            if($scope.clinicPaymentHistory != ''){
                ngDialog.open({
                    template: 'showPaymentHistory',
                     scope: $scope
                });
            }
        }

        /*
            Popup for plan changes for admin flow
        */
        function planChangePop(id,clinicId){
            console.log(ngDialog);
            $scope.subscriptionId = id;
            $scope.clinicId = clinicId;
            angular.forEach(vm.clinicDetails,function(value,key){
                if(value.SubscriptionclinicMap.subscriptionId == id && value.SubscriptionclinicMap.clinicId == clinicId){
                    $scope.selectedSubscription = value.SubscriptionclinicMap.plans;
                    $scope.planStartDate = value.SubscriptionclinicMap.planStartDate;
                    // moment(date).add(value.activatedPlan.noOfMonth, 'month').format("YYYY-MM-DD");
                }
            });
            // console.log($scope.selectedSubscription,"fdthgbdytrhdrhrynry");
            angular.forEach($scope.selectedSubscription,function(value,key){
                if(value.id == id){
                    $scope.plans = value;
                    $scope.currentPlanMonth = $scope.plans.noOfMonth;
                    $scope.plans.expiryDate =  moment($scope.planStartDate).add($scope.plans.noOfMonth, 'month').format("YYYY-MM-DD");
                }
            });
            // console.log($scope.plans,"objecttttttttttt");
            
            ngDialog.open({
                template: 'planChangePop',
                 scope: $scope,
                 preCloseCallback : function() {
                    console.log('dialog closed');
                    $scope.openDatePickers[0]   =   false;
                 }
            });
        }

        function updateClinicPlan(id,clinicId,obj){
        	console.log(obj);
            var objs = {};
            // console.log($scope.selectedSubscription);
            angular.forEach($scope.selectedSubscription,function(value,key){
                if(value.id == id){
                        $scope.index = key;
                }
            });
            $scope.selectedSubscription.splice($scope.index,1);
            $scope.selectedSubscription.push(obj);
            objs.subscriptionId = id;
            objs.plans = $scope.selectedSubscription;
            objs.clinicId = clinicId;
            if($scope.currentPlanMonth){
            	 objs.planStartDate = moment(obj.expiryDate).subtract($scope.currentPlanMonth, 'month').format("YYYY-MM-DD hh:mm:ss");
            }
            // console.log($scope.selectedSubscription);
            settingService.updateClinicPlan(objs).then(function(resp) {
                if (resp.data.status == "success") {
                    ngDialog.close();
                    vm.getClinicDetails();
                    toastr.success(resp.data.message);
                } else {
                    toastr.error(resp.data.message);
                }
            });
        }

        /*
            Reset Popup for admin Side
        */
        function resetPopup(obj){
            $scope.obj = obj;
            ngDialog.open({
                template: 'resetPopup',
                 scope: $scope
            });
        }


        function resetPassword(pwd,clinicDetails){
             if(pwd.newPassword != "" || pwd.newPassword != undefined){
                var obj = {};
                obj.clinicId = clinicDetails.id;
                obj.pwd      = pwd.newPassword; 
                settingService.resetClinicPassword(obj).then(function(resp) {
                    if (resp.data.status == "success") {
                       toastr.success(resp.data.message);
                       ngDialog.close();
                    } else {
                       ngDialog.close();
                       toastr.error("Error in Setting the password");
                       return false;
                    }
                });
             }else{
                toastr.error("Enter the password..");
             }
        }
        /*
            Getting all clinic Details for admin flow
        */
        function getClinicDetails(){
            $rootScope.practysLoader = true;
            settingService.getClinicDetails().then(function(resp) {
                console.log(resp);
                if (resp.data.status == "success") {
                    $rootScope.practysLoader = false;
                   vm.clinicDetails = resp.data.message;
                   angular.forEach(resp.data.message,function(value,key){
	                    var date = new Date(value.SubscriptionclinicMap.planStartDate);
	                    var curr = new Date();
	                    value.expriyDate = moment(date).add(value.activatedPlan.noOfMonth, 'month').format("YYYY-MM-DD");
	                    var currdate 	 = moment(curr).format("YYYY-MM-DD");
	                    if(currdate > value.expriyDate){
	                    	 value.subscriptionStatus = "Expired";
	                    }else{
	                    	 value.subscriptionStatus = "Live";
	                    }
                   });
                   console.log(vm.clinicDetails);
                } else {
                    $rootScope.practysLoader = false;
                    vm.clinicDetails = "";
                    toastr.error("No Datas Found");
                }
            });
        }


        function dialogClose() {
        	$rootScope.imagePreview = false;
            ngDialog.close();
            // $scope.close();
        }

        //autorenew confirm pop
        function confirmPop(obj){
            $scope.existPlanss = obj;
            $rootScope.imagePreview = false;
            ngDialog.open({
                template: 'autoRenewOff',
	             scope: $scope,
	             preCloseCallback : function() {
	             	console.log(vm.switchStatus);
	                vm.switchStatus = true;
	             }
            }); 
        }

        function renewalOff(obj){
            // alert("success");
            $rootScope.practysLoader = true;
            console.log(obj);
             settingService.renewalOff(obj).then(function(resp) {
                if (resp.data.status == "success") {
                    vm.switchStatus = false;
                    toastr.success("Auto Renewal is OFF now..");
                    vm.getPlans(null);
                    $rootScope.practysLoader = false;
                    // vm.getSpecialityService();
                    // toastr.success(resp.data.message);
                } else {
                    vm.switchStatus = true;
                    toastr.error(resp.data.message);
                }
            });

        }


        function changeButttonProps () {
            if($rootScope.online){
                return false;
            }else{
                return true;
            }
        }



         function keyup (vals,type){
            // alert(vals.length);

            if(type == 'drug'){
                $timeout(function() {
                    $scope.$apply(function(){
                         vm.drugItems = vals.length; 
                         console.log(vm.drugItems);
                    })
                }, 10);
            }

             if(type == 'speciality'){
                $timeout(function() {
                    $scope.$apply(function(){
                         vm.specialityItems = vals.length; 
                         console.log(vm.drugItems);
                    })
                }, 10);
            }

             if(type == 'patient'){
                $timeout(function() {
                    $scope.$apply(function(){
                         vm.patientTotalItems = vals.length; 
                    })
                }, 10);
            }

             if(type == 'doctor'){
                $timeout(function() {
                    $scope.$apply(function(){
                         vm.doctorTotalItems = vals.length; 
                    })
                }, 10);
            }
           
            // vm.drugItems = vals.length;
        }

        /*
            Getting specialities by clinic Id for clinicFlow
        */
        function getSpecialityService() {
            Utils.getSpecialities(vm.clinicId).then(function(resp) {
                console.log(resp,'ssssssssssssssssssssssssssss');
                vm.specialities = [];
                vm.autocompleteItems = [];

                if (resp.status == 'success') {
                     
                    // $timeout(function() {
                    //     $scope.$apply(function() {
                           $scope.totalItemss = resp.message.length;
                            angular.forEach(resp.message, function(value, key) {
                                value.disabled = false;
                                vm.specialities.push(value);
                                vm.autocompleteItems.push(value.name);
                            });
                            Utils.saveItem("specialityService", vm.specialities);
                    //     })
                    // }, 10);
                } else {
                    toastr.error(rep.message)
                    vm.specialities = "";
                    $scope.totalItemss = 0;
                }


            });
        }

        /*
          Delete , update & update the paticular services for clinic Flow
        */

        function deleteService(id, specId) {

            $rootScope.practysLoader = true;
            if($rootScope.online){
                settingService.deleteService(id, specId).then(function(resp) {
                    if (resp.data.status == "success") {
                        $rootScope.practysLoader = false;
                        vm.getSpecialityService();
                        toastr.success(resp.data.message);
                    } else {
                        toastr.error(resp.data.message);
                    }
                });
            }else{
                toastr.error("No Internet Connection");
            }
            
        }


        function editService(id) {
            $rootScope.popup = false;
            $rootScope.practysLoader = true;
            if ($rootScope.online) {
                settingService.getServiceById(id).then(function(resp) {
                    if (resp.data.status == "success") {
                        $rootScope.practysLoader = false;
                        $scope.services = resp.data.message[0];
                    }
                });
            } else if(vm.type == 'clinic') {
                $scope.services = {};
                settingOfflineServices.getSpecialityServices(id).then(function(resp){
                    if(resp){
                        if(resp.editServicesData){
                             $rootScope.practysLoader = false;
                             $scope.services = (resp.editServicesData);
                        }
                    }
                });
            }
            ngDialog.open({
                template: 'editService',
                scope: $scope,
            });
        }

        function updateService(obj) {
            if ($rootScope.online) {
                settingService.updateService(obj).then(function(resp) {
                    if (resp.data.status == "success") {
                        vm.getSpecialityService();
                        ngDialog.close();
                        toastr.success(resp.data.message);
                    } else {
                        toastr.error(resp.data.message);
                    }
                });
            } else {
               toastr.error("No Internet Connection");
            }

        }

        function additionalDialog(datas){
            // alert(planId);
            $scope.planDetails = datas;
            $rootScope.imagePreview = false;
           $rootScope.popup = false;
            ngDialog.open({
                template: 'additionalElements',
                 scope: $scope
            });  
        }
        //FOR PREVIEWING THE BILL TO USER

        function additionalPaymentPreview(form,datas,planDetails){
            // console.log(planDetails);return false;
              var obj = {};
            // if(form.$dirty && form.$valid){
                if(datas != '' && datas != undefined){
                    if(datas.appointmentCount != undefined){
                        var appCount = datas.appointmentCount;
                        var appAmount = (planDetails.costPerAppointment * datas.appointmentCount);
                    }else{
                        var appCount = 0;
                         var appAmount =0;
                    }

                    if(datas.doctorCount != undefined){
                        var docCount = datas.doctorCount;
                         var docAccountAmount = (planDetails.costPerDocAccount * datas.doctorCount);
                    }else{
                        var docCount = 0;
                         var docAccountAmount = 0 ;
                    }

                    if(datas.storage != undefined){
                        var storageSpace = datas.storage;
                         var storageAmount = (planDetails.costOfStorage * datas.storage);
                    }else{
                        var storageSpace = 0;
                         var storageAmount = 0 ;
                    }

                    // conso
                    var totalAmount = appAmount + docAccountAmount + storageAmount;
                     
                    if(totalAmount == 0){
                        toastr.error("Without Amount We cant provide payment");
                        return false;
                    }
                   
                    obj.userDetails = JSON.parse($window.localStorage.getItem('user'));
                    obj.clinicId = obj.userDetails.id;
                    obj.appCount = appCount;
                    obj.costPerAppointment = planDetails.costPerAppointment;
                    obj.docCount = docCount;
                    obj.costPerDocAccount = planDetails.costPerDocAccount;
                    obj.storage = storageSpace;
                    obj.costOfStorage = planDetails.costOfStorage;
                    obj.price = totalAmount;
                    obj.planId = planDetails.id;
                    obj.type = 'additional';
                    obj.attempt = 0;
                    obj.colspan = 4;
                    console.log(obj);
                    $scope.paymentPreviewObj = obj;
                    $rootScope.imagePreview = true;
                    ngDialog.close();
                     ngDialog.open({
		                template: 'paymentPreview',
		                scope: $scope
		            });
                   

                }else{
                    toastr.error("Fill and Submit the Form");
                }
       
        }


        function additionalElement(datas){
    		if(datas){
                settingService.subscribe(datas).then(function(resp) {
                    if (resp.data.status == "success") {
                        ngDialog.close();
                        $scope.OpenPopupWindow(resp.data.message);
                    } else {
                        toastr.error(resp.data.message);

                    }
                });
            }else{
                toastr.error("There is no datas..");
            }
        }

        /*Edit Patient popup*/
        function addPatientDetails() {
            $rootScope.popup = false;
            ngDialog.open({
                templateUrl: 'components/patient/editPatient.html',
                scope: $scope
            });
        }

        /*
          Setting default time to the time picker
        */
        vm.viewDate = new Date();
        var startDate = new Date(vm.viewDate);
        var endDate = new Date(vm.viewDate);
        startDate.setHours(8, 0, 1);
        endDate.setHours(10, 0, 1);
        vm.generalValue.starts = moment(startDate).toDate();
        vm.generalValue.ends = moment(endDate).toDate();

        /*
          Increment and Decrement the Expiry month and years for credit card details
        */
        vm.setting.monthCount = 1;
        vm.setting.yearCount = new Date().getFullYear();

        function increment(type) {
            if (type == "month") {
                vm.setting.monthCount++;
                if (vm.setting.monthCount > 12) {
                    vm.setting.monthCount--;
                    return false;
                }
            } else {
                vm.setting.yearCount++;
                if (vm.setting.yearCount > new Date().getFullYear() + 20) {
                    vm.setting.yearCount--;
                    return false;
                }
            }
        };

        function decrement(type) {
            if (type == "month") {
                vm.setting.monthCount--
                    if (vm.setting.monthCount < 1) {
                        vm.setting.monthCount++;
                        return false;
                    }
            } else {
                vm.setting.yearCount--;
                if (vm.setting.yearCount < new Date().getFullYear()) {
                    vm.setting.yearCount++;
                    return false;
                }
            }
        };

        function getColorForDoctor() {
            console.log($scope.colors,vm.colors,'-------------------------------');
            $scope.colorss = [];
            // console.log(vm.colors.length,"color lengthhhhhhhhhhhhhhhhhhhhhh");
            // console.log(vm.colors,'colorssssssssssssssssssssssssss');
            if ($scope.colors && vm.colors.length) {
                // for (var i = 0; i < $scope.colors.length; i++) {
                //     console.log(i);
                //     console.log($scope.colors[i]);

                //     for (var j = 0; j < vm.colors.length; j++) {
                //          if($scope.colors.indexOf(vm.colors[j].colorCode) > -1){
                //                  $scope.colorss.push(vm.colors[j].colorCode);
                //             }
                //         // console.log(i+"---"+$scope.colors[i]+"=="+vm.colors[j].colorCode);
                //         // if ($scope.colors[i] != vm.colors[j].colorCode) {
                //         //     // var i=0;
                //         //     // var j=0;

                //         //     // console.log($scope.colors[i]+"="+vm.colors[j].colorCode);
                //         //     $scope.colorss.push($scope.colors[i]);
                //         //     break;
                //         // }
                //     }
                $scope.available   =   [];
                angular.forEach(vm.colors,function(value){
                    angular.forEach(value.colorCode,function(value1){
                        if(value1.clinicId == vm.clinicId){
                             $scope.available.push(value1.colorCode);
                        }
                    });
                });
                angular.forEach($scope.colors,function(value){
                    // angular.forEach($scope.colors,function(valu2){
                    //     if(value != valu2.colorCode){
                    //         $scope.colorss.push(value);
                    //     }
                    // })
                    if($scope.available.indexOf(value) == -1){
                        $scope.colorss.push(value);
                    }
                });
                console.log($scope.colorss);
                }
                console.log($scope.colorss,"finallll colorsssss");
            // }

        }

        /*
            Colorname to hexa values
        */

		function colourNameToHex(colour)
		{
		    var colours = {"blue":"#0000ff","crimson":"#dc143c","cyan":"#00ffff","green":"#008000","lawngreen":"#7cfc00","lime":"#00ff00","magenta":"#ff00ff","orange":"#ffa500","palegreen":"#98fb98","red":"#ff0000","royalblue":"#4169e1","violet":"#ee82ee","pink":"#ffc0cb","purple":"#800080","navy":"#000080"
		   };

		    if (typeof colours[colour.toLowerCase()] != 'undefined')
		        return colours[colour.toLowerCase()];

		    return false;
		}

        /*
            Default 15 colors for doctors and functionalities for splicing the colors when it was selected 
        */

        function getColorCode() {
            if ($rootScope.online) {
                settingService.getColorCode(vm.clinicId).then(function(resp) {
                    if (resp.data.status == "success") {
                        vm.colors = resp.data.message;
                        vm.getColorForDoctor();
                    } else {
                        $scope.colorss = ['Blue', 'Cyan', 'Green', 'Orange', 'Pink', 'Purple', 'Red', 'Violet', 'RoyalBlue', 'PaleGreen', 'Crimson', 'Navy', 'Lime', 'LawnGreen', 'Magenta'];
                        // toastr.error(resp.data.message);
                    }
                });
            } else {
                // vm.colors = [];
                // $SQLite.ready(function() {
                //     this.select('SELECT practysapp_users.id AS Id,colorCode,practysapp_users.clinicId AS clinicId,firstName,lastName FROM practysapp_users LEFT JOIN practysapp_specialityUserMaps ON  practysapp_specialityUserMaps.userId = practysapp_users.id WHERE practysapp_specialityUserMaps.clinicId = ? AND practysapp_specialityUserMaps.specialityId !=0 GROUP BY practysapp_users.id', [vm.clinicId]).then(function() {
                //     }, function() {
                //     }, function(data) {
                //         vm.colors.push(data.item);
                //         if (data.count == vm.colors.length) {
                //             vm.getColorForDoctor();
                //         }
                //     });
                // });
            }
        }


        /*General Setting - clinic  page*/
        function general(data,form) {
            console.log(data);
            console.log(form);
            // return false;

            if($rootScope.changes == 0 ){
                if(form.$pristine && form.$valid){
                    toastr.error("Make Changes and Submit the Form");
                    return false;
                }
            }
            var flag = {
                flagDateCheck: false,
                flagInvalidDate: false,
                flagSpeciality: false
            }
            if (data) {
                vm.generalValue.clinicTiming = [];
                var clinicTiming = angular.copy(data);
                console.log(clinicTiming);
                // return false;

                angular.forEach(clinicTiming, function(value, key) {
                    if ((new Date(value.open).getTime() < new Date(value.close).getTime()) && value.isSelected == true) {
                        // alert("if");
                        value.open = (moment(new Date(value.open)).format("HH:mm:ss"));
                        value.close = (moment(new Date(value.close)).format("HH:mm:ss"));
                        // break time flow
                        // if(value.breakCheck != undefined && value.breakCheck[value.day] == true){
                          
                        // 	value.breakCheck['breakOpen'] = (moment(new Date(value.breakCheck['breakOpen'])).format("HH:mm:ss"));
                        // 	value.breakCheck['breakClose'] = (moment(new Date(value.breakCheck['breakClose'])).format("HH:mm:ss"));
                        // }
                        
                        value.clinicOpen =  true;
                        vm.generalValue.clinicTiming.push(value);
                    } else if (value.isSelected == true && (new Date(value.open).getTime() > new Date(value.close).getTime())) {
                        // alert("elseif");
                        flag.flagInvalidDate = true;
                    } else if(value.isSelected == true && (new Date(value.open).getTime() == new Date(value.close).getTime())){
                        // alert("elseif");
                        flag.flagInvalidDate = true;
                    }
                });
                // console.log(vm.generalValue.clinicTiming);
                // return false;
                if (flag.flagSpeciality) {
                    toastr.error("Field Is Required");
                    return false;
                }
                if (flag.flagInvalidDate) {
                    toastr.error("Invalid Time");
                    return false;
                }
                if (!vm.generalValue || (vm.generalValue.clinicName == ' ' || vm.generalValue.clinicName == undefined) || (vm.generalValue.clinicImage == '' || vm.generalValue.clinicImage == undefined) || (vm.generalValue.clinicAddress == ' ' && vm.generalValue.clinicAddress == undefined) || (vm.generalValue.email == ' ' && vm.generalValue.email == undefined) || (vm.generalValue.contactNumber == '' || vm.generalValue.contactNumber == undefined) || flag.flagDateCheck) {
                    toastr.error("Field Are Mandatory");
                } else {
                    if($state.params.id != null){
                         vm.generalValue.clinicId = $state.params.id;
                    }else{
                        vm.generalValue.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
                    }
                    vm.generalValue.type = "clinic";
                    // console.log(vm.generalValue);
                    //       return false;
                    if ($rootScope.online) {
                        Upload.upload({
                            url: url + 'clinics/create',
                            data: { image: vm.generalValue.imageData, imageName: vm.generalValue.clinicImage, clinicId: vm.generalValue.clinicId, clinicTiming: vm.generalValue.clinicTiming, clinicName: vm.generalValue.clinicName, clinicAddress: vm.generalValue.clinicAddress, type: 'clinic', email: vm.generalValue.email, contactNumber: vm.generalValue.contactNumber }

                        }).then(function(resp) {
                            console.log(resp);
                            // return false;
                            if (resp.data.data.status == "success") {
                                if($state.params.id != null){
                                    toastr.success("Profile Updated Successfully");
                                    $state.go('settings');
                                    vm.tab = 3;
                                    vm.getClinicDetails();
                                    return false;
                                }
                                vm.generalValue = '';
                                Utils.saveItem('user', resp.data.data.message[0].User);
                                $window.location.reload();
                                toastr.success("updated Successfully");
                            }

                            console.log('Success ' + resp.config.data.image.name + 'uploaded. Response: ' + resp.data);

                        }, function(resp) {
                            console.log('Error status: ' + resp.status);
                        }, function(evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.name);
                        });
                    } else {
                        toastr.error("No Internet Connection");
                    }
                }
            }
        }

        /*
          Drug edit, update, add, delete & popup functionalities
        */
        function drugPop() {
            if($rootScope.online){
                 $scope.type = "add";
                $scope.drugs    =   {};
                ngDialog.open({
                    template: 'drugPop',
                    scope: $scope,

                });
            }else{
                toastr.error("No Internet Connection");
            } 
        }

        function getDrug() {
            vm.drugs = [];
            if ($rootScope.online) {
                settingService.getDrug(vm.clinicId).then(function(resp) {
                    if (resp.data.status == "success") {
                        // ngDialog.close();
                        $timeout(function() {
                            $scope.$apply(function() {
                                vm.drugs = resp.data.message;
                                vm.drugItems = vm.drugs.length;
                            })
                        }, 10);

                    } else if(vm.type == 'clinic') {
                        vm.drugs = "";
                        toastr.error(resp.data.message);
                        vm.drugItems = 0;
                    }
                });
            } else {
                vm.drugs = [];
                    settingOfflineServices.getClinicDrugs().then(function(resp){
                        vm.drugs = resp.data;
                        vm.drugItems = vm.drugs.length;
                    });
                }
           }

        function addDrug(drugForm,obj) {
            if(drugForm.$dirty && drugForm.$valid){
                obj.clinicId = vm.clinicId;
                if (obj.type != null) {
                    if ($rootScope.online) {
                        settingService.addDrug(obj).then(function(resp) {
                            if (resp.data.status == "success") {
                                vm.getDrug();
                                ngDialog.close();
                                toastr.success(resp.data.message);
                            } else {
                                toastr.error(resp.data.message);
                            }
                        });
                    } else {
                        toastr.error("No Internet Connection");
                    }
                } else {
                    return false;
                }
            }
            else{
                toastr.error('Change or Fill Required Fields before submit');
                return false;
            }
        }

        function editDrug(drugId) {
            $rootScope.popup = false;
            $rootScope.practysLoader = true;
            if ($rootScope.online) {
                settingService.editDrug(drugId).then(function(resp) {
                    if (resp.data.status == "success") {
                        $rootScope.practysLoader = false;
                        $scope.type = "edit";
                        $scope.drugs = resp.data.message[0];
                    } else {
                        toastr.error(resp.data.message);
                    }
                });
            } else if(vm.type == 'clinic') {
                $scope.drugs = [];
                utilService.getDrugsDetails(drugId).then(function(response) {
                    if (response) {
                        $rootScope.practysLoader = false;
                        $scope.drugs.type = "edit";
                        $scope.drugs = response;
                    }
                });
            }
            ngDialog.open({
                template: 'drugPop',
                controller: 'settingController',
                scope: $scope

            });
        }

        /* 
          function used to add specialities and services only used for admin login
        */

        function addSpecialityServices(data, services, form) {
            if(form.$dirty && form.$valid){
                var service = [];
                var mins = [];
                var costs = [];
                var datas = {};

                if (data.Speciality == "" || services[0].service == '') {
                    toastr.error("select service or speciality");
                } else {
                    angular.forEach(services, function(value, key) {
                        service.push(value.service);
                        mins.push(value.mins);
                        costs.push(value.cost);
                    });
                    datas.mins = mins;
                    datas.costs = costs;
                    datas.services = services;
                    datas.speciality = data.Speciality;
                    datas.clinicId = vm.clinicId;
                    if ($rootScope.online) {
                        settingService.addSpecialityServices(datas).then(function(resp) {
                            if (resp.data.status == "success") {
                                var datas = {};
                                vm.generalValue.Speciality = "";
                                // $timeout(function(){
                                //    $scope.$apply(function(){
                                //     $scope.contacts = [{ service: '', mins: '', cost: '' }];
                                //    }); 
                                // },10);
                                vm.contacts = [{ service: '', mins: '', cost: '' }];

                                vm.addSpecial = false;
                                vm.tableSpecial = true;
                                vm.getSpeciality();
                                toastr.success(resp.data.message);
                            } else {
                                toastr.error(resp.data.message);
                            }
                        });
                    } else {
                        toastr.error("No Internet Connection");
                    }
                }
            }
            else{
                toastr.error('Fill Required Fields Before Submit');
                return false;
            }
        }

        /* 
          function used to add specialities and services only used for admin login
        */

        function addClinic(data,formName) {
            console.log(formName);
            if(formName.$pristine && !formName.$invalid){
                // toastr.error("Fill and Submit the Form");
                return false;
            }
            $rootScope.practysLoader = true;

            if (data.clinicName == "" || data.address == "" || data.mobile == "" || data.email == "" || data.password == "") {
                toastr.error("All fields are mandatory");
                 $rootScope.practysLoader = false;
                return false;
            } else {
                if(data.password != data.cpassword){
                    toastr.error("Password doesnt match");
                    $rootScope.practysLoader = false;
                    return false;
                }else{
                    settingService.addClinic(data).then(function(resp) {
                        if(resp.data.status == "success"){
                            vm.generalValue = "";
                            $rootScope.practysLoader = false;
                            toastr.success(resp.data.message);
                        }else {
                            $rootScope.practysLoader = false;
                            toastr.error(resp.data.message);
                        }
                    });
                }
            }
        }

        //FOR PREVIEWING THE BILL TO USER

        function subscriptionPaymentPreview(objs){
            // console.log(planDetails);return false;
            var obj = {};
            objs.userDetails = JSON.parse($window.localStorage.getItem('user'));
            objs.clinicId = objs.userDetails.id;
            objs.appCount = 0;
            objs.docCount = 0;
            objs.storage = 0;
            objs.planId = objs.id;
            objs.attempt = 0;
            objs.colspan = 2;
            console.log(obj);
            $scope.paymentPreviewObj = objs;
            $rootScope.imagePreview = true;
            ngDialog.close();
             ngDialog.open({
                template: 'paymentPreview',
                scope: $scope
            });
                  
        }

        /*
            Proceeding the selected plan
        */

        function subscribePlan(plans) {
        	$rootScope.practysLoader = true;
            var obj = {};
            vm.userDetails = JSON.parse($window.localStorage.getItem('user'));
            // var cardholderdob     =   moment(new Date(data.dob)).format("YYYY-MM-DD")
            // var dob = cardholderdob.split("-");
            // obj.dob_yy = dob[0];
            // obj.dob_mm = dob[1];
            // obj.dob_dd = dob[2];
            obj.clinicId = vm.userDetails.id;
            // obj.address1 = vm.userDetails.address;
            // obj.city = vm.userDetails.city;
            // obj.first_name = vm.userDetails.firstName;
            // obj.last_name = vm.userDetails.lastName;
            // obj.email = vm.userDetails.email;
            // obj.cc_number = data.cc;
            // obj.cvv2_number = data.cvv;
            // obj.card_type = data.cardType;
            // obj.expdate_year = data.yearCount;
            // obj.expdate_month = data.monthCount;
            obj.price = plans.price;
            obj.planId = plans.id;
            obj.type = 'normal';
            obj.attempt = 0;
            settingService.subscribe(obj).then(function(resp) {
                if (resp.data.status == "success") {
                    ngDialog.close();
                    vm.setting     =    {};
                    $rootScope.practysLoader = false;
                    $scope.OpenPopupWindow(resp.data.message);
                } else {
                	$rootScope.practysLoader = false;
                    toastr.error(resp.data.message);

                }
            });
        }


        //listening the child window for closing process
        function checkChild() {
        	console.log(vm.child);
        	console.log(vm.timer);
            if (vm.child.closed) {
                // alert("Auto Renewal is now ON");
                vm.getPlans(null);   
                clearInterval(vm.timer);
          
            }
        }
        /*
          Poping out new tab in popup
        */
        $scope.OpenPopupWindow = function(resp) {
            vm.child = $window.open(resp, "popup", "width=600,height=400,left=400,top=150");
            vm.timer = setInterval(vm.checkChild, 500);
        }

        /* 
          function used to add subscription plans
        */

        function subscriptionPlan(plans) {
        	
            $rootScope.practysLoader = true;
            if (plans[0].subscriptionPlan == "" || (plans[0].costPerAppointment == "" && plans[0].costPerAppointment != 0) || (plans[0].costPerDocAccount == ""  && plans[0].costPerDocAccount != 0) || plans[0].noOfMonth == "" || plans[0].price == "" || plans[0].noOfAppointment == "" || plans[0].doctorAccount == "" || plans[0].storage == "" || plans[0].costOfStorage == "") {
                toastr.error("All fields are mandatory");
                $rootScope.practysLoader = false;
                return false;
            } else {
                settingService.subscriptionPlan(plans).then(function(resp) {
                    if (resp.data.status == "success") {
                        vm.getPlans(null);
                        $rootScope.practysLoader = false;
                        toastr.success(resp.data.message);
                        $timeout(function() {
                            vm.addPlans = false;
                            vm.showExistingPlans = true;
                        }, 500);
                    } else {
                        $rootScope.practysLoader = false;
                        toastr.error(resp.data.message);
                    }
                });

            }
        }


        /* 
          getting or editing the existing plans for admin
        */

        function getPlans(id, event) {
        	$rootScope.practysLoader = true;
             vm.slickConfig3Loaded = false;
            if (vm.type == 'admin') {
                if (id != null) {
                    settingService.getPlans(id).then(function(resp) {
                        if (resp.data.status == "success") {
                            vm.showExistingPlans = false;
                            vm.addPlans = false;
                            vm.editPlan = true;
                            vm.plan = resp.data.message;
                            if(vm.plan.doctorAccount == 'unlimited'){
                                vm.plan.doctorAccountCheck = true;
                            }
                            if(vm.plan.noOfAppointment == 'unlimited'){
                                vm.plan.appointmentUnlimCheck= true;
                            }
                            $rootScope.practysLoader = false;
                             // vm.slickConfig3Loaded = true;
                        } else {
                            toastr.error(resp.data.message);
                            $rootScope.practysLoader = false;

                        }
                    });
                } else {

                    settingService.getPlans(null).then(function(resp) {
                        console.log(resp,"responseeeeeeee");
                        if (resp.data.status == "success") {
                        	// vm.slickConfig3Loaded = true;
                         //    vm.slickPlansLoaded = true;
                            vm.plans = resp.data.message;
                            $rootScope.practysLoader = false;

                        } else {
                            toastr.error(resp.data.message);
                            $rootScope.practysLoader = false;
                            vm.slickConfig3Loaded = false;
                        }
                    });
                }
            }

            if (vm.type == "clinic") {
                // vm.showPlans = false;
                if (id != null) {

                } else {
                    if ($rootScope.online) {
                        vm.tab = 4;
                        vm.slickConfig3Loaded = false;
                        vm.plans = [];
                        settingService.getPlans(null, vm.clinicId).then(function(resp) {
                            if (resp.data.status == "success") {
                                 vm.slickConfig3Loaded = true;
                                console.log(resp,"subssssssssssssssssss");
                                vm.planMonth = resp.data.message.noOfMonth;
                                vm.planDate = resp.data.message.planDate;
                                var date = moment(vm.planDate).format('YYYY-MM-DD');
                                vm.existingPlanId = resp.data.message.id;
                                vm.userSubsId = resp.data.message.userSubsId;
                                vm.usedSpace = resp.data.message.usedSpace;
                                vm.expiryDuration = moment(date).add(vm.planMonth, 'month').format("YYYY-MM-DD");
                                // vm.existPlan = resp.data.message;
                                vm.autoRenewCond = resp.data.message.autoRenewal;
                                if(vm.autoRenewCond == 1){
                                    vm.switchStatus = true;
                                }else{
                                    vm.switchStatus = false;
                                }
                                vm.planList = JSON.parse(resp.data.message.plans);
                                angular.forEach(vm.planList, function(value, key) {
                                    if(value.id == resp.data.message.id){
                                        value.userSubsId = vm.userSubsId
                                        vm.existPlan =value;
                                    }
                                });
                                console.log(vm.existPlan);
                                $rootScope.practysLoader = false;
                               
                            } else {
                                toastr.error(resp.data.message);
                                $rootScope.practysLoader = false;
                            }
                        });
                    } else {
                        event.preventDefault();
                        $rootScope.practysLoader = false;
                    }
                }
            }
        }

        /*
            Getting the current plan that the clinic was engaged
        */

        function getExistingPlan() {
            // alert(vm.clinicId);
            vm.slickConfig3Loaded = false;
            settingService.getPlans(null, vm.clinicId).then(function(resp) {
                if (resp.data.status == "success") {
                     vm.slickConfig3Loaded = true;
                    console.log(resp,"subssssssssssssssssss");
                    vm.planMonth = resp.data.message.noOfMonth;
                    vm.planDate = resp.data.message.planDate;
                    var date = moment(vm.planDate).format('YYYY-MM-DD');
                    vm.existingPlanId = resp.data.message.id;
                    vm.userSubsId = resp.data.message.userSubsId;
                    // alert(vm.userSubsId);
                    vm.expiryDuration = moment(date).add(vm.planMonth, 'month').format("YYYY-MM-DD");
                    // vm.existPlan = resp.data.message;
                    vm.planList = JSON.parse(resp.data.message.plans);
                    angular.forEach(vm.planList, function(value, key) {
                       
                        if(value.id == resp.data.message.id){
                          
                            vm.existPlan =value;
                            // if
                        }
                    });
                   
                } else {
                    toastr.error(resp.data.message);
                }
            });
        }

        /* 
          updating the existing plans for admin
        */

        function updatePlan(obj) {
            // console.log(obj);
            // return false;
            if (obj != "") {
                settingService.updatePlan(obj).then(function(resp) {
                    if (resp.data.status == "success") {

                        vm.getPlans(null);
                        toastr.success(resp.data.message);
                        $timeout(function() {
                            vm.editPlan = false;
                            vm.showExistingPlans = true;
                        }, 500);
                       
                      
                    } else {
                        toastr.error(resp.data.message);
                    }
                });
            }


        }

        /*
          Tab functionalities

        */


        vm.isSet = function(tabId) {
            return vm.tab === tabId;
        };

        vm.tabClick = function(tabId) {
            return vm.tabs === tabId;
        };

        /*
          Functionality for finding index
        */

        function findIndexInData(data, property, value) {
            var result = -1;
            data.some(function(item, i) {
                if (item[property] === value) {
                    result = i;
                    return true;
                }
            });
            return result;
        }


        /*
       Functionality to all services for speciality
      */

        function getAllServices(id) {
            if (id == undefined || id == '') {
                return false;
            } else {
                settingService.getSpecialityServices(id).then(function(resp) {
                    if (resp.data.status == "success") {
                        $timeout(function() {
                            $scope.$apply(function() {
                                vm.serviceDatas = resp.data.message;
                                vm.serviceTotalItems = resp.data.message.length;
                            })
                        }, 10);

                    } else {
                        vm.serviceTotalItems = 0;
                        toastr.error(resp.data.message);
                        vm.serviceDatas = "";
                    }
                });

            }

        }


        /*
         Functionality to add new rows for speciality and services
        */

        function getServices(id , service) {
            if (id == undefined || id == '') {
                return false;
            } else {
            	if(service != undefined){
            		vm.doctorss.service = service;
            	}else{
            		vm.doctorss.service = [];
            	}

                settingService.getSpecialityServices(id).then(function(resp) {
                    if (resp.data.status == "success") {
                    	
                        vm.serviceDatas = resp.data.message
                    } else {
                        toastr.error(resp.data.message);
                    }
                });

            }

        }

        /*
         Functionality to add card details
        */

        function cardDetails(form, obj, type, plansObj) {
// alert(vm.userSubsId);
            if(form.$dirty && form.$valid){
                if (obj == null) {
                    return false;
                } 
                else {
                	$rootScope.practysLoader = true;
                    if (type == "autoRenew") {
                        obj.id = plansObj.userSubsId;
                        obj.planStarts = new Date(obj.startDate).toISOString();
                        // vm.switchStatus = true;
                        // console.log(obj);
                        // return false;
                        settingService.autoRenewal(obj).then(function(resp) {
                            console.log(resp);
                            if (resp.data.status == "success") {
                                ngDialog.close();
                                $rootScope.practysLoader = false;
                                $scope.OpenPopupWindow(resp.data.message);
                            } else {
                            	$rootScope.practysLoader = false;
                                toastr.error("Error in payment");
                            }
                        });
                    } else {
                    	$rootScope.practysLoader = false;
                        vm.subscribePlan(obj, plansObj);
                    }
                }
            }
            else{
                toastr.error('Fill Required fields');
                return false;
            }
        }

        /*
       Selecting the speciality and services
      */

        function addNewChoice(index) {
            if (vm.choices[index].service[0] == null) {
                toastr.error("Select service under the speciality");
                return false;
            } else {
                for (var i = 0; i < vm.choices.length; i++) {

                    var indexOf = vm.findIndexInData(vm.specialities, 'id', vm.choices[i].speciality);
                    vm.special.push(vm.specialities[indexOf]);

                    vm.specialities[indexOf].disabled = true;
                }
                vm.serviceDatas = [];
                var newItemNo = vm.choices.length + 1;
                vm.choices.push({ 'id': newItemNo });
            }
        };

        function removeChoice(index) {
            vm.serviceDatas = [];
            var indexOf = vm.findIndexInData(vm.specialities, 'id', vm.choices[index].speciality);
            vm.specialities[indexOf].disabled = false;
            var lastItem = vm.choices.length - 1;
            vm.choices.splice(index, 1);
            if (lastItem == 1) {
                vm.minusButton = false;
            }
        };

        /*
          function to setting the doctor or patient or clinic  details
        */

        function getDetails() {
            // alert("dfgers");

            if (vm.type == 'doctor') {

                var clinicId = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]["id"];
                 var id = JSON.parse($window.localStorage.getItem('user'))["id"];
                 // alert(clinicId);
                 // alert(id);
                settingService.getDetails(id, vm.type, clinicId).then(function(resp) {

                    if (resp.data.status == "success") {
                        vm.clinic = false;
                        vm.doctor = true;
                        vm.setting = resp.data.message[0];

                    } else {
                        toastr.error(resp.data.message);
                    }
                });
            } else if (vm.type == 'clinic') {
                vm.clinic = true;
                vm.doctor = false;
                vm.doctors = [];
                vm.doctorItemss = [];
                var id = JSON.parse($window.localStorage.getItem('user'))["id"];
                if ($rootScope.online) {
                    settingService.getDoctor(id).then(function(resp) {
                        if (resp.data.status == "success") {
                            vm.doctors = resp.data.message;
                            vm.doctorTotalItems =resp.data.message.length;
                        } else {
                            vm.doctors = "";
                            vm.doctorTotalItems = 0;
                            toastr.error(resp.data.message);
                        }
                    });
                } else if(vm.type == 'clinic'){
                    vm.doctors = [];
                    settingOfflineServices.getClinicDoctor(id).then(function(resp){
                       if(resp){
                            if(resp.clinicDoctorData.length > 0){
                                 vm.doctors = resp.clinicDoctorData;
                                 vm.doctorTotalItems = vm.doctors.length;
                            }
                       }
                    });
                }
            }
        }


        function getPatDetails() {
            vm.patientDatas = [];
            vm.patientTotalItems = '';
            var id = JSON.parse($window.localStorage.getItem('user'))["id"];
            if ($rootScope.online) {
                settingService.getPatient(id).then(function(resp) {
                    if (resp.data.status == "success") {
                        vm.patientDatas = resp.data.message;
                        vm.patientTotalItems = resp.data.message.length;
                    } else {
                        vm.patientDatas = "";
                        vm.patientTotalItems = 0;
                        toastr.error(resp.data.message);
                    }
                });
            } else if(vm.type == 'clinic'){
                  settingOfflineServices.getPatientDetails(id).then(function(resp){
                       if(resp){
                            if(resp.patientData.length > 0){
                                 vm.patientDatas = resp.patientData;
                                 vm.patientTotalItems = vm.patientDatas.length;
                            }
                       }
                    });
            }
        }


        /*
         Delete User by id
      */

        function deleteUser(id,type) {
            $rootScope.practysLoader = true;
            if ($rootScope.online) {
                settingService.deleteUser(id,vm.clinicId).then(function(resp) {
                    if (resp.data.status == "success") {
                        $rootScope.practysLoader = false;
                        if(type == 'doctor'){
                        	 vm.getDetails();
                        }else if(type == 'patient'){
                        	vm.getPatDetails();
                        }
                        toastr.success(resp.data.message);
                    } else {
                        toastr.error(resp.data.message);
                    }
                });
            } else {
               toastr.error("No Internet Connection");
            }
        }

        /*
           Edit Update patient and doctor
        */


        function editPatient(id) {
            vm.patients = [];
            $rootScope.practysLoader = true;
            if ($rootScope.online) {
                settingService.getPatientDetails(id).then(function(resp) {
                    if (resp.data.status == "success") {
                        $rootScope.practysLoader = false;
                        $window.localStorage.removeItem('patientAccount');
                        vm.patients = resp.data.message[0];
                        vm.patients.mobile = vm.patients.mobile;
                        vm.patients.comments = vm.patients.otherComments;
                        $window.localStorage.setItem('patientAccount', JSON.stringify(vm.patients));
                        vm.addPatientDetails();
                    } else {
                        toastr.error(resp.data.message);
                    }
                });
            }else if(vm.type == 'clinic'){
                 $window.localStorage.removeItem('patientAccount');
                 settingOfflineServices.getUsersDetails(id).then(function(resp){
                        if(resp){
                            if(resp.userDetails){
                                 $rootScope.practysLoader = false;
                                  vm.patients = resp.userDetails;
                                  vm.patients.comments = vm.patients.otherComments;
                                  $window.localStorage.setItem('patientAccount', JSON.stringify(vm.patients));
                            }   
                        }
                   });
                 vm.addPatientDetails();
                
            }
            
        }

        function editDoctor(id) {
            vm.doctorss = [];
            $rootScope.practysLoader = true;
            if ($rootScope.online) {
                settingService.getPatientDetails(id,vm.clinicId).then(function(resp) {
                    if (resp.data.status == "success") {
                    	console.log(resp.data.message[0]);
                        $rootScope.practysLoader = false;
                        vm.getServices(resp.data.message[0].specialityId,resp.data.message[0].service);
                        console.log(vm.serviceDatas);
                        $window.localStorage.removeItem('patientAccount');
                       	var result = $scope.colorss.indexOf(resp.data.message[0].colorCode);
                       	if(result < 0){
                       		 $scope.colorss.push(resp.data.message[0].colorCode);
                       	}
                       	$timeout(function() {
                       		vm.doctorss = resp.data.message[0];
                       	}, 100);
                        
						
                        $window.localStorage.setItem('patientAccount', JSON.stringify(vm.doctorss));
                       
                    } else {
                        toastr.error(resp.data.message);
                    }
                });
            } else if(vm.type == 'clinic') {
                $window.localStorage.removeItem('patientAccount');
                settingOfflineServices.getUsersDetails(id).then(function(resp){
                        if(resp){
                            if(resp.userDetails){
                                 $rootScope.practysLoader = false;
                                  vm.doctorss = resp.userDetails;
                                  $window.localStorage.setItem('patientAccount', JSON.stringify(vm.doctorss));
                            }   
                        }
                   });
               
            }
             vm.editDoctorDetails();
        }


        function editDoctorDetails() {
            $rootScope.popup = false;
            ngDialog.open({
                template: 'editDoctorDialog',
                scope: $scope
            });
        }


        function updateDetails(formName) {
            if(formName.$pristine && formName.$valid){
                toastr.error("Make Changes and Update the Form");
                return false;
            }
            vm.setting.type = "software";
            vm.setting.id = JSON.parse($window.localStorage.getItem('doctor'))["doctorId"];
            var type = JSON.parse($window.localStorage.getItem('user'))["user_level"];
            settingService.updateDetails(type, vm.setting).then(function(resp) {
                if (resp.data.status == "success") {
                    toastr.success(resp.data.message);
                    // vm.getDetails();
                } else {
                    toastr.error(resp.data.message);
                }
            });
        }

        function addDoctor(data,form) {
            console.log(data);
            // return false;
            if(form.$dirty){
            vm.doctorDetails = data;
            vm.doctorDetails.serviceId = [];
            vm.doctorDetails.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
            vm.doctorDetails.type = "doctor";
            if (vm.doctorDetails.service == null || vm.doctorDetails.contactNumber == undefined || vm.doctorDetails.email == undefined || vm.doctorDetails.firstName == undefined || vm.doctorDetails.lastName == undefined || vm.doctorDetails.gender == undefined || vm.doctorDetails.specialityId == undefined) {
                // toastr.error("All fields are Mandatory");
                return false;

            } else {
            	var hexValue = vm.colourNameToHex(data.colorCode);
            	vm.doctorDetails.hexValue = hexValue;
            	
                angular.forEach(vm.doctorDetails.service, function(value, key) {

                    vm.doctorDetails.serviceId.push(value.id);
                });
                if (vm.doctorDetails.password != vm.doctorDetails.cpassword) {
                    toastr.error("Password Did not match");
                } else {
                    if ($rootScope.online) {
                        settingService.addDoctor(vm.doctorDetails,'add').then(function(resp) {
                            if (resp.data.status == "success") {
                                vm.getColorCode();
                                ngDialog.close();
                                vm.doctorDetails = "";
                                toastr.success(resp.data.message);
                               vm.getDetails();
                                vm.doctor = "";
                                vm.tab = 2;
                            } else {
                                // toastr.error(resp.data.message);
                            }
                        });
                    } else {
                        toastr.error("No Internet Connection");
                        }                        
                    }
                }
            }else{
            	// toastr.error("Kindly fill all the details");
            	return false;
            }
        }


         function linkDoctor(data,form) {
            console.log(data);
            // return false;
            if(form.$dirty){
            vm.doctorDetails = data;
            vm.doctorDetails.serviceId = [];
            vm.doctorDetails.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
            vm.doctorDetails.type = "doctor";
	            if (vm.doctorDetails.service == null || vm.doctorDetails.email == undefined ||  vm.doctorDetails.specialityId == undefined) {
	                // toastr.error("All fields are Mandatory");
	                return false;

	            }else {
	            	var hexValue = vm.colourNameToHex(data.colorCode);
	            	vm.doctorDetails.hexValue = hexValue;
	            	
	                angular.forEach(vm.doctorDetails.service, function(value, key) {

	                    vm.doctorDetails.serviceId.push(value.id);
	                });
	               
	                if ($rootScope.online) {
	                        settingService.addDoctor(vm.doctorDetails,'link').then(function(resp) {
	                            if (resp.data.status == "success") {
	                                vm.getColorCode();
	                                ngDialog.close();
	                                vm.doctorDetails = "";
	                                toastr.success(resp.data.message);
	                               vm.getDetails();
	                                vm.doctor = "";
	                                vm.tab = 2;
	                            } else {
	                                toastr.error(resp.data.message);
	                            }
	                        });
	                }else{
	                    toastr.error("No Internet Connection");
	                }                        
	               
	            }

            }else{
            	// toastr.error("Kindly fill all the details");
            	return false;
            }
        }

        function patientUpdate(data) {
            // console.log(data);
            // return false;
            vm.patient = {};
            if((data.firstName == null || data.firstName == undefined) || (data.lastName == null || data.lastName == undefined) || (data.gender == null || data.gender == undefined)|| (data.birthday == null || data.birthday == undefined) || (data.age == null || data.age == undefined) || (data.mobile == null || data.mobile == undefined) || (data.email == null || data.email == undefined) || (data.occupation == null || data.occupation == undefined)|| (data.address == null || data.address == undefined)|| (data.drugAllergy == null || data.drugAllergy == undefined)|| (data.otherAllergy == null || data.otherAllergy == undefined) ||(data.reference == null || data.reference == undefined)|| (data.emergencyContactName == null || data.emergencyContactName == undefined)  || (data.emergencyRelationship == null || data.emergencyRelationship == undefined) || (data.emergencyContactNumber == undefined || data.emergencyContactNumber == null)){
              // toastr.error("Fields Are Mandatory");
                  return false;
            }else{
              
                vm.patient.id=JSON.parse($window.localStorage.getItem('patientAccount'))["id"];
                var type = "patient";
                vm.patient.type = "patient";
                vm.patient = data;
                vm.patient.dob  = moment(new Date(data.birthday)).format("YYYY-MM-DD");
                // console.log(vm.patient);return false;
                if($rootScope.online){
                  settingService.updateDetails(type,vm.patient).then(function(resp){
                    if(resp.data.status == "success"){
                      ngDialog.close();
                    vm.table = true;
                    vm.doctorEditShow = false;
                    vm.patientEditShow = false;
                    vm.getPatDetails();
                    toastr.success(resp.data.message);
                    }else{
                      toastr.error(resp.data.message);
                    }
                 });
                }else{
                  toastr.error("No Internet Connection");
                }    
            }
        }


        function doctorUpdate(form) {
        	console.log(vm.doctorss); 
        	// return false;
            if(form.$dirty){
                if ((vm.doctorss.firstName != undefined || vm.doctorss.firstName != '') && (vm.doctorss.contactNumber != undefined || vm.doctorss.contactNumber != '') && (vm.doctorss.email != undefined || vm.doctorss.email != '') ) {
                    // vm.doctorss.id = JSON.parse($window.localStorage.getItem('patientAccount'))["id"];
                    var type = "doctor";
                    vm.doctorss.user_level = "doctor";
                    vm.doctorss.serviceId = [];
                    angular.forEach(vm.doctorss.service, function(value, key) {
	                    vm.doctorss.serviceId.push(value.id);
	                });
	                var hexValue = vm.colourNameToHex(vm.doctorss.colorCode);
            		vm.doctorss.hexValue = hexValue;
                    if ($rootScope.online) {
                        settingService.updateDetails(type, vm.doctorss).then(function(resp) {
                            if (resp.data.status == "success") {
                            	vm.getColorCode();
                            	vm.getColorForDoctor();
                                vm.table = true;
                                vm.doctorEditShow = false;
                                vm.patientEditShow = false;
                                ngDialog.close();
                                vm.getDetails();
                                toastr.success(resp.data.message);
                            } else {
                            	vm.getColorCode();
                            	vm.getColorForDoctor();
                                toastr.error(resp.data.message);
                            }
                        });
                    } else {
                       toastr.error("No Internet Connection");
                    }
                } else {
                    toastr.error("Field Are Mandatory");
                    return false;
                }
            }
            else{
                toastr.error("Change or Fill Required Fields Before Submit");
                return false;
            }
        }

        /*
           Change password functionalities
        */


        function changePassword(formName) {
            console.log(formName);
            if(formName.$pristine && formName.$invalid){
                toastr.error("Please Enter the Password");
                return false;
            }
            if (vm.popup.newPassword == vm.popup.confirmPassword) {
                var type = JSON.parse($window.localStorage.getItem('user'))["user_level"];
                if (type == 'doctor') {
                    var id = JSON.parse($window.localStorage.getItem('doctor'))["doctorId"];
                } else {
                    var id = JSON.parse($window.localStorage.getItem('user'))["id"];
                }

                settingService.changePassword(id, type, vm.popup).then(function(resp) {
                    if (resp.data.status == "success") {
                        toastr.success(resp.data.message);
                        ngDialog.close();
                    } else {
                        toastr.error(resp.data.message);
                    }
                });

            } else {
                toastr.error("Password Not Matched");
            }
        }





        /*
      Functionalities to convert the image into base64 format
     */

        $scope.fileReaderSupported = window.FileReader != null;

        function photoChanged(files) {
            $rootScope.changes ++;
            vm.generalValue.clinicLogo = '';
            vm.generalValue.clinicImage = files[0].name;
            vm.generalValue.imageData = files[0];
            $scope.logo = files[0].name;
        };

        /*
            Doctor profile picture upload
        */
        function upload(file) {
            if (file != '') {
                var id = JSON.parse($window.localStorage.getItem('user'))["id"];
                Upload.upload({
                    url: url + 'doctors/imageUpload',
                    method: 'post',
                    data: { imageName: file.name, userId: id,clinicId:vm.clinicId, image: file }

                }).then(function(resp) {
                    if (resp.data.data.status == "success") {
                        Utils.saveItem('user', resp.data.data.message[0]);
                        $window.location.reload();
                        toastr.success("updated Successfully");
                    }

                    console.log('Success ' + resp.config.data.image.name + 'uploaded. Response: ' + resp.data);

                }, function(resp) {
                    console.log('Error status: ' + resp.status);
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.name);
                });
            } else {
                toastr.error("Error while uploading");
            }

        }

        /*
          Functionaty for popup changing password
        */
        function openDefault(image) {
            $rootScope.popup = true;
            if($rootScope.online){
                ngDialog.open({
                template: 'firstDialogId',
                scope: $scope
              });
            }
        };

        /*
          Functionaty for popup Doctor add
        */

        function doctorPopup(type) {
            if($rootScope.online){
                if($scope.colorss.length != 0){
	                $rootScope.popup = false;
	                if(type == 'add'){
	                	$scope.processType = 'add';
	                }else{
	                	$scope.processType = 'link';
	                }
	                ngDialog.open({
	                    template: 'secondDialogId',
	                    scope: $scope

	                });
	            }else{
	                toastr.error("15 Doctors get registered cannt register more that this,....");
	                return false;
	            }
	        }else{
	            toastr.error("No Internet Connection");
	        } 
        };

        /*
          Functionaty for popup subscription
        */


        function confirmSubcription(type, obj) {
            // alert(vm.autoRenewCond);
            // return false;
            vm.setting = {};
            if(vm.autoRenewCond != ''){
                if(vm.autoRenewCond == 1){
                    toastr.error("Auto Renewal is ON, So you can't Subscribe");
                    return false;
                }
            }
            console.log(obj);
            // return false;
            vm.setting.monthCount = 1;
            vm.planChangeConfirm = false;
            vm.setting.yearCount = new Date().getFullYear();
            $rootScope.popup = false;
            $scope.plansObj = {};
            $scope.plansObj = obj;
            var currDate = new Date();
            $scope.paymentType = type;
            if (type == "autoRenew") {
                vm.switchStatus = false;
                 ngDialog.open({
                    template: 'autoRenewal',
                    scope: $scope

                });
            }else{
                if(vm.expiryDuration != undefined){
                    $rootScope.imagePreview = false;
                    var curDate = moment(currDate).format("YYYY-MM-DD");
                    console.log(curDate,"currrr date");
                    console.log(vm.expiryDuration,"expppp date");
                    if(curDate <= vm.expiryDuration){
                         ngDialog.open({
                            template: 'planChangeConfirm',
                            scope: $scope
                        });
                     }else{
                        vm.subscriptionPaymentPreview($scope.plansObj);
                     }
                   
                }
                //  console.log(vm.planChangeConfirm);
                // if(vm.planChangeConfirm){
                //     vm.subscribePlan($scope.plansObj); 
                // }
                
            }

        };

        function getSpecialitiesService() {
            if (vm.specialities.length != 0) {
                angular.forEach(vm.specialities, function(value, key) {
                    value.services = [];
                    var index = '';
                    settingOfflineServices.getClinicServices(value.id).then(function(resp){
                        if(resp){
                            if(resp.specilityServicesData.length > 0){
                                angular.forEach(resp.specilityServicesData,function(val,key){
                                    index = vm.setServicesSpeciality(vm.specialities,val.specialityId);
                                    vm.specialities[index].services.push(val);
                                });    
                            }
                        }
                    });
                });

            }
        }

        function setServicesSpeciality(specialities,services){
            var data  = '';
            angular.forEach(specialities,function(val,key){
                    if(services == value.specialityId){
                        data = key;
                    }
            });
            return data;
        }

        function toTime(timeString,type) {
        	console.log(timeString);
        	if(timeString == '00:00:00' && type == 'open'){
        		timeString = '10:00:00';
        	}else if(timeString == '00:00:00' && type == 'close'){
        		timeString = '22:00:00'
        	}
            var timeTokens = timeString.split(':');
            console.log(timeTokens);
            return new Date(2017, 21, 2, timeTokens[0], timeTokens[1], timeTokens[2]);
        }

        function init() {

            if (vm.type == 'admin'){
            	vm.getClinicDetails();
            	console.log(vm.clinicDetails,"clinic Detailssss");
            	vm.getPlans(null);
            	console.log($state.params.id);
	            if($state.params.id != null){
	                
	                var id = $state.params.id;
	                
	                $rootScope.practysLoader = true;
	               
		            $timeout(function(){
		                
		                angular.forEach(vm.clinicDetails, function(value, key) {
		                    if(value.User.id == id){
		                    vm.clinicEditDetails = value.User;
		                    }
			            });
		                
			            $scope.days = [{
			                id: 0,
			                day: "Sun",
			                value: "Sunday",
			                isSelected: false,
			                open: '2017-02-08T04:30:01.000Z',
			                close: '2017-02-08T04:30:01.000Z'
			                }, {
			                id: 1,
			                day: "Mon",
			                value: "Monday",
			                isSelected: true,
			                open: '2017-02-08T04:30:01.000Z',
			                close: '2017-02-08T04:30:01.000Z'
			                }, {
			                id: 2,
			                day: "Tue",
			                value: "Tuesday",
			                isSelected: true,
			                open: '2017-03-28T16:18:03+05:30',
			                close: '2017-03-28T16:18:03+05:30'
			                }, {
			                id: 3,
			                day: "Wed",
			                value: "Wednesday",
			                isSelected: false,
			                open: '2017-02-08T04:30:01.000Z',
			                close: '2017-02-08T04:30:01.000Z'
			                }, {
			                id: 4,
			                day: "Thu",
			                value: "Thrusday",
			                isSelected: false,
			                open: '2017-02-08T10:30:01.000Z',
			                close: '2017-02-08T18:30:01.000Z'
			                }, {
			                id: 5,
			                day: "Fri",
			                value: "Friday",
			                isSelected: false,
			                open: '2017-02-08T04:30:01.000Z',
			                close: '2017-02-08T04:30:01.000Z'
			                }, {
			                id: 6,
			                day: "Sat",
			                value: "Saturday",
			                isSelected: false,
			                open: '2017-02-08T04:30:01.000Z',
			                close: '2017-02-08T04:30:01.000Z'
			                }
			            ];

		            	console.log(vm.clinicEditDetails,"clinic detailssssss");
		              
		                $scope.clinicTime = vm.clinicEditDetails.clinicTiming;
		                vm.generalValue.id = vm.clinicEditDetails.id;
		                vm.generalValue.clinicName = vm.clinicEditDetails.firstName;
		                // vm.generalValue.lastName = JSON.parse($window.localStorage.getItem('user'))["lastName"];
		                vm.generalValue.clinicImage = vm.clinicEditDetails.image;
		                vm.generalValue.clinicAddress = vm.clinicEditDetails.address;
		                vm.generalValue.email = vm.clinicEditDetails.email;
		                vm.generalValue.contactNumber = vm.clinicEditDetails.mobile;
		                angular.forEach(JSON.parse($scope.clinicTime), function(value, key) {
		                if (value.open != '00:00:00' && value.close != '00:00:00') {
		                    $scope.days[key]['isSelected'] = true;
		                    var dateOpen = vm.toTime(value.open,null);
		                    var dateClose = vm.toTime(value.close,null);
		                    $scope.days[key]['open'] = dateOpen;
		                    $scope.days[key]['close'] = dateClose;
		                } else {
		                    $scope.days[key]['isSelected'] = false;
		                    var dateOpen = vm.toTime(value.open,'open');
		                    var dateClose = vm.toTime(value.close,'close');
		                    $scope.days[key]['open'] = dateOpen;
		                    $scope.days[key]['close'] = dateClose;
		                }
		                });

		                $rootScope.practysLoader = false;
		            },500);  
	            }
            }

            if(vm.type == 'doctor'){
             vm.getDetails();
            }
            if (vm.type == "clinic") {
                    $scope.days = [{
                    id: 0,
                    day: "Sun",
                    value: "Sunday",
                    isSelected: false,
                    open: '2017-02-08T04:30:01.000Z',
                    close: '2017-02-08T04:30:01.000Z'
                    }, {
                    id: 1,
                    day: "Mon",
                    value: "Monday",
                    isSelected: true,
                    open: '2017-02-08T04:30:01.000Z',
                    close: '2017-02-08T04:30:01.000Z'
                    }, {
                    id: 2,
                    day: "Tue",
                    value: "Tuesday",
                    isSelected: true,
                    open: '2017-03-28T16:18:03+05:30',
                    close: '2017-03-28T16:18:03+05:30'
                    }, {
                    id: 3,
                    day: "Wed",
                    value: "Wednesday",
                    isSelected: false,
                    open: '2017-02-08T04:30:01.000Z',
                    close: '2017-02-08T04:30:01.000Z'
                    }, {
                    id: 4,
                    day: "Thu",
                    value: "Thrusday",
                    isSelected: false,
                    open: '2017-02-08T04:30:01.000Z',
                    close: '2017-02-08T04:30:01.000Z'
                    }, {
                    id: 5,
                    day: "Fri",
                    value: "Friday",
                    isSelected: false,
                    open: '2017-02-08T04:30:01.000Z',
                    close: '2017-02-08T04:30:01.000Z'
                    }, {
                    id: 6,
                    day: "Sat",
                    value: "Saturday",
                    isSelected: false,
                    open: '2017-02-08T04:30:01.000Z',
                    close: '2017-02-08T04:30:01.000Z'
                    }];

                    $scope.clinicTime = JSON.parse($window.localStorage.getItem('user'))["clinicTiming"];

                    vm.generalValue.clinicName = JSON.parse($window.localStorage.getItem('user'))["firstName"];
                    // vm.generalValue.lastName = JSON.parse($window.localStorage.getItem('user'))["lastName"];
                    vm.generalValue.clinicImage = JSON.parse($window.localStorage.getItem('user'))["image"];
                    vm.generalValue.clinicAddress = JSON.parse($window.localStorage.getItem('user'))["address"];
                    vm.generalValue.email = JSON.parse($window.localStorage.getItem('user'))["email"];
                    vm.generalValue.contactNumber = JSON.parse($window.localStorage.getItem('user'))["mobile"];
                    angular.forEach(JSON.parse($scope.clinicTime), function(value, key) {
	                    if (value.open != '00:00:00' && value.close != '00:00:00') {
	                    $scope.days[key]['isSelected'] = true;
	                    var dateOpen = vm.toTime(value.open,null);
	                    var dateClose = vm.toTime(value.close,null);
	                    $scope.days[key]['open'] = dateOpen;
	                    $scope.days[key]['close'] = dateClose;
	                    } else {
	                    $scope.days[key]['isSelected'] = false;
	                    var dateOpen = vm.toTime(value.open,'open');
	                    var dateClose = vm.toTime(value.close,'close');
	                    $scope.days[key]['open'] = dateOpen;
	                    $scope.days[key]['close'] = dateClose;
	                    }
                    });

                console.log($scope.days,"dayssssssss");
                

                        if ($state.current.method != undefined) {
                            vm[$state.current.method]();
                            }
                        if ($state.params.data) {
                            vm.patients = $state.params.data;
                            vm.patients.mobile = vm.patients.mobile;
                            vm.patients.comments = vm.patients.otherComments;
                            vm.tab = 2;
                            vm.tabs = 2;
                            vm.addPatientDetails();
                        }
                    }
                }
        vm.init();
    }

})();
