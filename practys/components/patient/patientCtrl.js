/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   patientDataCtrl
 *
 *  Description :   patientData
 *
 *  Developer   :   Nishanth
 * 
 *  Date        :   22/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

(function () {
    'use strict';

 angular
    .module('practysApp')
    .controller('patientController',patientController);

    patientController.$inject = ['$scope','$rootScope','$SQLite','$timeout','Auth','patientDataService','patientOfflineDataService','toastr','$state','$window','ngDialog','$location','utilService'];
function patientController($scope,$rootScope,$SQLite,$timeout,Auth,patientDataService,patientOfflineDataService,toastr,$state,$window,ngDialog,$location,utilService) {
      


      if(!Auth.isLoggedIn())
      {
          $state.go('login');
          return false;
      }


     
      /*
        Pagination predefined declaration
      */

      $scope.currentPage = 1;
      $scope.maxSize =10; 
      $scope.currentPages = 1;
      $scope.maxSizes = 10 ;

      /*
        Date pickers functionality
      */

      $scope.openDatePickers = [];
      $scope.openDatePicker =[];
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

       $scope.openTo= function($event, datePickerIndex) {
        $event.preventDefault();
        $event.stopPropagation();

        if ($scope.openDatePicker[datePickerIndex] === true) {
          $scope.openDatePicker.length = 0;
        } else {
          $scope.openDatePicker.length = 0;
          $scope.openDatePicker[datePickerIndex] = true;
        }
      };

      $scope.add = function(pend, preBal){
      	return parseInt(pend) + parseInt(preBal);
      }

      $scope.dateFormat = function(date){
        return moment(new Date(date)).format("MMM Do, YYYY");
      }

      /*
        Declaration part
      */
      

      var vm = this;
      vm.init = init;
      vm.patientList = patientList;
      vm.particularPatientDetails = particularPatientDetails;
      vm.patientAppointmentDetails = patientAppointmentDetails;
      vm.patientPaymentDetails = patientPaymentDetails;
      vm.patientTreatmentDetails = patientTreatmentDetails;
      vm.treatmentDateDetails = treatmentDateDetails;
      vm.getRecords = getRecords;
      vm.openDefault = openDefault;
      vm.addPatient = addPatient;
      vm.editPatient = editPatient;
      vm.updatePatient = updatePatient;
      vm.addPatientDetails = addPatientDetails;
      vm.insertLocaLSpecialityUserMaps = insertLocaLSpecialityUserMaps;
      vm.patientDetailsUpdate = patientDetailsUpdate;
      vm.callInvoices = callInvoices;
      vm.bookPop = bookPop;
      vm.addAmounts = addAmounts;
      vm.taxCal = taxCal;
      vm.amountCalculation = amountCalculation;

      vm.tab = 1;
      vm.patientLists = [];
      vm.patient = {};
      vm.timelineShift =false;
      vm.loaders = false;
      vm.recordPage = false;
      vm.timelineShow = false;
      vm.editLoader = false;
      vm.params = $state.params.id;
      $rootScope.inventoryPopup = false;
      vm.type = JSON.parse($window.localStorage.getItem('user'))["user_level"];
      
      vm.userLevel = JSON.parse($window.localStorage.getItem('user'))["user_level"];
      if(vm.userLevel == 'doctor'){
      	   vm.clinicDetails =  JSON.parse($window.localStorage.getItem('doctor'))["clinic"];
           vm.clinicId = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]["id"];
      }else{
	      	vm.clinicDetails =  JSON.parse($window.localStorage.getItem('user'));
	        vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
      }


      function amountCalculation(datas){
      	console.log(datas);
      	var subamt       =   parseFloat(datas.amount);
    	var discount     =   (datas.discount != undefined && datas.discount != '') ? parseFloat(subamt * (datas.discount/100)) : 0;

        var amt          =   (subamt - discount).toFixed(2);
    	var tax          =   (datas.tax != '' && datas.tax != undefined) ? parseFloat(subamt * (datas.tax/100)) : 0;
    	var balance      =   parseFloat(amt) + parseFloat(tax);
    	return balance;
    	// var payment      =   (obj.payment != '' && obj.payment != undefined) ? parseFloat(datas.payment) : 0;
      }

      /*
        Book an appointment by double clicking the calender in day view
      */
      function bookPop(datas,id){
        // alert("enter");
        $rootScope.popup = false;
        $scope.patientBookObj = {};
        $scope.patientBookObj.patientName = datas.username;
        $scope.patientBookObj.patient = datas;
        $scope.patientBookObj.patientId = id;
        $scope.patientBookApp = true;
                  ngDialog.open({
                      template: 'components/appointment/book_appointment.html',
                      controller:'bookAppointmentController',
                      scope :$scope
                      // className:'ngdialog-theme-default'
                  
                  });

      }

      function addAmounts(pendingAmount,appointmentBalanceAmount){
        	//alert(pendingAmount+ ''+ appointmentBalanceAmount);
          return parseFloat(pendingAmount)+parseFloat(appointmentBalanceAmount);
       }

       function taxCal(obj){
        	console.log(obj);
        	if(obj != undefined){
        		var tx = (obj.tax != '' && obj.tax != undefined) ? parseFloat(obj.amount * (obj.tax/100)) : 0;
	        	var disc = (obj.discount != '' && obj.discount != undefined) ? parseFloat(obj.amount * (obj.discount/100)) : 0;
	        	var taxdiscValue = (obj.amount  - disc + tx).toFixed(2);
	        	// if(obj.appointmentBalanceAmount){
	        	// 	var total = parseFloat(taxdiscValue)+parseFloat(obj.appointmentBalanceAmount);
	        	// }else{
	        		var total = parseFloat(taxdiscValue);
	        	// }
	        	console.log(total);
	          return total;
        	}
        	
        }

	 function callInvoices(id){
	 	// alert(id);
	 	// debugger;
	 	 $scope.$broadcast("checkInvoice", {
	            value: "From controller 2"
	        });
	 }


       // $scope.call = function(id) {
       // 	console.log("controller calll");
       //      $rootScope.$root.$broadcast("setReady");
       //  }


      
      /*
        Tab functionalities
      
      
        vm.setTreatment = function () {
          vm.patientTreatmentDetails();
            vm.tab = 1;
        };

        vm.setAppointment = function () {
          vm.patientAppointmentDetails();
            vm.tab = 2;
        };

        vm.setPayment = function () {
          vm.patientPaymentDetails();
            vm.tab = 3;
        };

        vm.isSet = function (tabId) {
            return vm.tab === tabId;
        };

        
   /*
          Finalization of print option
        */
     //    $scope.printToCart = function(printSectionId) {
     //      // alert("hiii");
     //      // alert("finalPrint");
     //      // var innerContents = document.getElementById(printSectionId).innerHTML;
     //      // var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
     //      // popupWinindow.document.open();
     //      // popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
     //      // popupWinindow.document.close();
     //       var printContents = document.getElementById(printSectionId).innerHTML;
     // // var originalContents = document.body.innerHTML;

     // // document.body.innerHTML = printContents;

     // window.print();

     // // document.body.innerHTML = originalContents;
     //    }
        /*
          generating pdf
        */

      $scope.createPDF =function(id){
        $rootScope.practysLoader = true;
        // html2canvas(document.getElementById(id), {
        //   onrendered: function (canvas) {
        //     var data = canvas.toDataURL();
        //     var docDefinition = {
        //     content: [{
        //         image: data,
        //         width: 500,

        //               }]
        //     };
        //     console.log(docDefinition);
        //     $rootScope.practysLoader = false;

        //     pdfMake.createPdf(docDefinition).download("Records.pdf");
            
        //   }
        // });
        html2canvas(document.getElementById(id), {
                onrendered: function(canvas) {
                    var data = canvas.toDataURL('image/jpeg',0.8

                      );
                    var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,

                              }]
                    };
                    console.log(docDefinition);
                    $rootScope.practysLoader = false;

                    pdfMake.createPdf(docDefinition).download("Records.pdf");

                }
            });

      };


      // function addAmounts(pendingAmount,appointmentBalanceAmount){
      //     return parseFloat(pendingAmount)+parseFloat(appointmentBalanceAmount);
      // }


      /*
        function to create or update or get patient details
      */


     function editPatient(data){
      vm.editLoader =true;
      $rootScope.imagePreview = false
        var id = data;
        if($rootScope.online){
            patientDataService.getPatientDetails(id).then(function(resp){
              if(resp.data.status == "success"){
                // alert("success");
                console.log(resp,"ftghndrthsrthsrth");
                $window.localStorage.removeItem('patient');
                $scope.patient = resp.data.message[0];
                $window.localStorage.setItem('patient',JSON.stringify($scope.patient));
                  vm.addPatientDetails();
                  // return false;
              }else{
                toastr.error(resp.data.message);
              }
          });
        }else{
          $SQLite.ready(function(){
                  this.select('SELECT *,practysapp_specialityUserMaps.userId AS id FROM practysapp_users INNER JOIN practysapp_specialityUserMaps  ON practysapp_users.id = practysapp_specialityUserMaps.userId  WHERE practysapp_users.user_level="patient" AND practysapp_users.id=?',[id]).then(function(){
                          console.log("empty result");
                      },function(){
                          console.log("error");
                       },function(data){
                         $window.localStorage.removeItem('patient');
                          $scope.patient = data.item;
                          $scope.patient.comments = vm.patients.otherComments;
                      });
                 });
              $timeout(function(){
                 $window.localStorage.setItem('patient',JSON.stringify($scope.patient));
                vm.addPatientDetails();
              },1000);
        }
      }

     function updatePatient(data){
      // console.log(data.birthday);
        vm.patient = {};
        if((data.firstName == null || data.firstName == undefined) || (data.lastName == null || data.lastName == undefined) || (data.gender == null || data.gender == undefined)|| (data.birthday == null || data.birthday == undefined) || (data.age == null || data.age == undefined) || (data.mobile == null || data.mobile == undefined) || (data.email == null || data.email == undefined) || (data.occupation == null || data.occupation == undefined)|| (data.address == null || data.address == undefined)|| (data.drugAllergy == null || data.drugAllergy == undefined)|| (data.otherAllergy == null || data.otherAllergy == undefined) || (data.emergencyContactName == null || data.emergencyContactName == undefined)  || (data.emergencyRelationship == null || data.emergencyRelationship == undefined) || (data.emergencyContactNumber == undefined || data.emergencyContactNumber == null)){
          // toastr.error("Fields Are Mandatory");
              return false;
        }else{
          
            vm.patient.id=JSON.parse($window.localStorage.getItem('patient'))["id"];
            var type = "patient";
            vm.patient.type = "patient";
            vm.patient = data;
            vm.patient.dob  = moment(new Date(data.birthday)).format("YYYY-MM-DD");
            // console.log(vm.patient);return false;
            if($rootScope.online){
              patientDataService.updateDetails(type,vm.patient).then(function(resp){
                if(resp.data.status == "success"){
                	$timeout(function() {
                		ngDialog.close();
		                toastr.success(resp.data.message);
		                $window.localStorage.removeItem('patient');
		                $window.localStorage.setItem('patient',JSON.stringify(vm.patient));
		                $state.go("patient");
		                // vm.particularPatientDetails();
                	}, 100);
                  
                  // $state.go("patientDetails",{id:vm.patient.id});
                }else{
                  toastr.error(resp.data.message);
                }
             });
            }else{
                 vm.patient.otherComments   = data.comments;
                delete vm.patient.type;
                delete vm.patient.userId;
                delete vm.patient.comments;
                delete vm.patient.status;
                vm.patient.is_sync         = 0;
                utilService.getUserDetails(vm.patient.id).then(function(response){
                    if(response.email != vm.patient.email){
                        utilService.distinctUserName(vm.patient.email).then(function(response){
                          if(response.Emailcount == 0 && response.email != vm.patient.email){
                                vm.patientDetailsUpdate(vm.patient);
                          }else{
                                toastr.error("Email Already Exits");
                          }
                        });
                    }else{
                      vm.patientDetailsUpdate(vm.patient);
                    }
                });
            }    
        }
      }


      function patientDetailsUpdate(obj){
        if(obj){
          $SQLite.ready(function(){
              this.replace('practysapp_users',obj) 
                  .then(function(updatedId){
                          if(updatedId){
                             toastr.success('Updated Successfully');
                             ngDialog.close();
                              vm.getPatDetails();
                          }
                         }, 
                         function(err){
                           toastr.error('doctors  error updating in local database ');
                    }); 
                });
        }      
      }


        /*Edit Patient*/
    function addPatientDetails(){
      vm.editLoader =false;
      $rootScope.popup = false;
        ngDialog.close();
        ngDialog.open({
          templateUrl:'components/patient/addPatientDetails.html',
          controller:'patientController as vm',
          scope:$scope
        });

    }
      

       /*
          Functionaty for Getting the patient List by clinic Id
        */

      function patientList(){
        $rootScope.practysLoader = true;
        var type =JSON.parse($window.localStorage.getItem('user'))["user_level"];
        var id =JSON.parse($window.localStorage.getItem('user'))["id"];
        if(type == "clinic"){
            if($rootScope.online){
                 utilService.getPatients(id).then(function(resp){
                   if(resp.data.status == "success"){
                    $rootScope.practysLoader = false;
                       vm.patientLists  = resp.data.message;
                      }else{
                      	$rootScope.practysLoader = false;
                    toastr.error(resp.data.message);

                   }
                });
            }else{
                vm.patientLists = [];
                   patientOfflineDataService.getClinicPatient(id).then(function(resp){
                      if(resp){
                          if(resp.patientDataDetails){
                            vm.patientLists = resp.patientDataDetails;
                          }
                      }
                    });
                   $rootScope.practysLoader = false;
                 }
        }else if(type == "doctor"){
             $rootScope.practysLoader = true;
              patientDataService.patientList(id,type).then(function(resp){
                if(resp.data.status == "success"){
                  $rootScope.practysLoader =false;
                 vm.patientLists  = resp.data.message;
                }else{
                   $rootScope.practysLoader =false;
                   toastr.error(resp.data.message);
                }
              });
        }
      }

      /*
          Getting particular patient by patientId
      */

      function particularPatientDetails(){
        var id = $state.params.id;
        var data = {};
        data.id = id;
        data.clinicId = vm.clinicId;
        if($rootScope.online){
          $rootScope.practysLoader = true;
          console.log(vm.patientDetails,"brfoeeeeeee");
             patientDataService.patientDetails(data).then(function(resp){
                if(resp.data.status == "success"){
                	$timeout(function() {
                		 $rootScope.practysLoader = false;
                		 // $scope.username    = resp.data.message[0].username;
		                 vm.patientDetails  = resp.data.message[0];
		                 console.log(vm.patientDetails,"aFTERRRR");
		                 $window.localStorage.setItem('patient',JSON.stringify(vm.patientDetails));
		                 vm.patientTreatmentDetails();
		                 // $state.go("patient");
                	}, 500);
                
                 // $state.go("patientDetails");
                }else{
                	$rootScope.practysLoader = false;
                	toastr.error(resp.data.message);
                }
          });
        }else{
            vm.patientDetails = [];
            patientOfflineDataService.getPatientDetails(id).then(function(resp){
              if(resp){
                  if(resp.clinicPatientData){
                    vm.patientDetails = resp.clinicPatientData[0];
                    $window.localStorage.setItem('patient',JSON.stringify(vm.patientDetails));
                    vm.patientTreatmentDetails();
                   // $state.go("patientDetails");
                  }
              }
            });
        }
      }

       /*
          Functionaty for creating new patient 
        */
       function addPatient(){
// alert("controller");

         if(vm.patient.firstName == undefined || vm.patient.lastName == undefined || vm.patient.nric == undefined || vm.patient.age == undefined ||  vm.patient.contactNumber == undefined || vm.patient.birthday == undefined || vm.patient.emergencyContactNumber == undefined ||vm.patient.gender == undefined  || vm.patient.occupation == undefined || vm.patient.address == undefined  ||  vm.patient.emergencyContactName == undefined || vm.patient.emergencyRelationship == undefined ){
             toastr.error(" Fields Are Mandatory");
             return false;
        }else{
          // if(vm.patient.password != vm.patient.cpassword){
          //       toastr.error("Password Didnot match");
          //     }else{
                $rootScope.practysLoader = true;
                vm.patient.password = vm.patient.nric;
                // vm.patient.email = vm.patient.nric;
                  vm.patient.clinicId =JSON.parse($window.localStorage.getItem('user'))["id"];
                  vm.patient.type ="patient";
                  vm.patient.dob  = moment(new Date(vm.patient.birthday)).format("YYYY-MM-DD");
                  console.log(vm.patient);
                  // return false;
                  if($rootScope.online){
                       patientDataService.addPatient(vm.patient).then(function(resp){
                        if(resp.data.status == "success"){
                          $rootScope.practysLoader = false;
                            ngDialog.close();
                          toastr.success(resp.data.message);
                         if($rootScope.addPatientSetting == 1){
                          $rootScope.$broadcast("myEvent");
                         }
                        }else{
                          $rootScope.practysLoader = false;
                          toastr.error(resp.data.message);
                        }
                  });
                  }else{
                  vm.addPatientLocal                              =  {};
                  utilService.distinctUserName(vm.patient.email).then(function(resp){
                    if(resp.Emailcount == 0){
                      utilService.getPatientCount(vm.clinicId).then(function(resp){
                        if(resp.UserCount <= resp.PatientCount){
                          vm.addPatientLocal['email']                     =  vm.patient.email;
                          vm.addPatientLocal['firstName']                 =  vm.patient.firstName;
                          vm.addPatientLocal['lastName']                  =  vm.patient.lastName;
                          vm.addPatientLocal['username']                  =  vm.patient.firstName + '' + vm.patient.lastName;
                          vm.addPatientLocal['password']                  =  vm.patient.password;
                          vm.addPatientLocal['address']                   =  vm.patient.address;
                          vm.addPatientLocal['age']                       =  vm.patient.age;
                          vm.addPatientLocal['birthday']                  =   moment(new Date(vm.patient.birthday)).format("YYYY-MM-DD");
                          vm.addPatientLocal['gender']                    =  vm.patient.gender;
                          vm.addPatientLocal['occupation']                =  vm.patient.occupation;
                          vm.addPatientLocal['drugAllergy']               =  vm.patient.drugAllergy;
                          vm.addPatientLocal['otherAllergy']              =  vm.patient.otherAllergy;
                          vm.addPatientLocal['reference']                 =  vm.patient.reference;
                          vm.addPatientLocal['emergencyRelationship']     =  vm.patient.emergencyRelationship;
                          vm.addPatientLocal['emergencyContactName']      =  vm.patient.emergencyContactName;
                          vm.addPatientLocal['mobile']                    =  vm.patient.contactNumber;
                          vm.addPatientLocal['guardianName']              =  vm.patient.guardianName;
                          vm.addPatientLocal['guardianContactNumber']     =  vm.patient.guardianContactNumber;
                          vm.addPatientLocal['guardianRelationship']      =  vm.patient.guardianRelationship;
                          vm.addPatientLocal['otherComments']             =  vm.patient.otherComments;
                          vm.addPatientLocal['user_level']                =  vm.patient.type;
                          vm.addPatientLocal['clinicId']                  =  vm.clinicId;
                          vm.addPatientLocal['is_sync']                   =  0;
                          vm.addPatientLocal['is_Created']                =  0;
                          vm.addPatientUserMap = {};
                           $SQLite.ready(function(){
                                this.insert('practysapp_users',vm.addPatientLocal) 
                                .then(
                                   function(insertId){
                                    console.log(insertId);
                                    vm.lastPatientId  =  insertId;
                                    vm.insertLocaLSpecialityUserMaps(insertId);
                                   }, 
                                   function(err){
                                    console.log(err);
                                   }) 
                           });
                        }else{
                          toastr.error("cannot create patient your limit has exits");
                        }
                      });
                     }else{
                        toastr.error("Email  Alerady Exits");
                        return false;
                     }
                  });
              }
            // }
        }
        
      }

       function  insertLocaLSpecialityUserMaps(lastPatientId){
         if(lastPatientId)
         {
                  vm.addPatientUserMap['userId']       = lastPatientId;
                  vm.addPatientUserMap['specialityId'] = 0;
                  vm.addPatientUserMap['serviceId']    = 0;
                  vm.addPatientUserMap['clinicId']     = vm.clinicId;
                  vm.addPatientUserMap['is_sync']      = 0;
                  vm.addPatientUserMap['is_Created']   = 0;


                  $SQLite.ready(function(){
                      this.insert('practysapp_specialityUserMaps',vm.addPatientUserMap) 
                      .then(
                         function(insertId){
                          vm.lastPatientUsermapId  =  insertId;
                          if(insertId){
                             toastr.success('Patient Created Successfully');
                              ngDialog.close();
                              $rootScope.$broadcast("myEvent");
                                if($state.params.id == 2)
                                {
                                  $state.go("settings",{id:2});
                                  vm.tab = 2;
                                }else{
                                   $state.go("patient");
                                }
                          }
                         }, 
                         function(err){
                           toastr.error('Patient datas error saving in local database ');
                         }) 
                 });
         }
      }


      function patientAppointmentDetails(){
       var id =JSON.parse($window.localStorage.getItem('patient'))["id"];
        patientDataService.patientAppointmentDetails(id).then(function(resp){
          if(resp.data.status == "success"){
            vm.table = true;
            vm.tableError = true;
           vm.appointmentDetails  = resp.data.message;
           $scope.totalItems = resp.data.message.length;
          }else{
            vm.table = false;
            vm.tableError = false;
          }
        });
      }

      function patientTreatmentDetails(){
          vm.folder = true;
          vm.treatmentDate = false;
          vm.treatmentDates = [];
          var id =JSON.parse($window.localStorage.getItem('patient'))["id"];
          if(vm.userLevel == 'doctor'){
            vm.doctorId = JSON.parse($window.localStorage.getItem('user'))["id"];
            vm.clinicId = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]["id"];
          }
          
          if($rootScope.online){
            $rootScope.practysLoader = true;
               patientDataService.patientTreatmentDetails({id:id,clinicId:vm.clinicId,doctorId:vm.doctorId,userLevel:vm.userLevel }).then(function(resp){
                  if(resp.data.status == "success"){
                    $rootScope.practysLoader = false;
                    vm.folderError = true;
                    vm.treatmentError = true;
                   vm.treatmentDates  = resp.data.message;
                   console.log(vm.treatmentDates,"treatment datessss");
                  }else{
                     $rootScope.practysLoader = false;
                    vm.treatmentDates  ="";
                     vm.loaders = false;
                   vm.folderError = false;
                    vm.treatmentError = true;
                  }
             });
          }else{
              vm.treatmentDates = [];
               
                patientOfflineDataService.getPatientReports(id,vm.clinicId).then(function(resp){
                  if(resp){
                    if(resp.patientReportData.length > 0){
                      vm.treatmentDates = resp.patientReportData;
                       $rootScope.practysLoader = false;
                       vm.treatmentError = true;
                       vm.folderError = true;
                    }else{
                       $rootScope.practysLoader = false;
                        vm.treatmentDates  = [];
                         vm.loaders = false;
                       vm.folderError = false;
                        vm.treatmentError = true;

                    }
                  }
                });
          }        
      }


      /*
          Getting records by appointment Id, patient Id &clinic Id
      */

      function getRecords(id,index){
        if(id.toString() && index.toString()){
        $scope.slickConfig3Loaded = false;
         vm.recordsArr = [];
         vm.timelineShift = true;
         vm.border = id;
         vm.loaders = true;
         var patientId =JSON.parse($window.localStorage.getItem('patient'))["id"];
         if($rootScope.online){
            patientDataService.getRecords({id:id,clinicId:vm.clinicId,patientId:patientId}).then(function(resp){
              if(resp.data.status == "success"){
                vm.recordImages =[];
                vm.loaders = false;
               angular.forEach(resp.data.message, function(value, key) {
                  this.push(value);
                }, vm.recordsArr);
                  vm.recordPage = true;
                  
                if(vm.recordsArr != ''){
                  vm.billRecords =vm.recordsArr[0].Invoice;
                  vm.additionalElements = JSON.parse(vm.recordsArr[0].Invoice.additionalItems);
                  vm.serviceList = vm.recordsArr[0].serviceList;
                  vm.prescription =vm.recordsArr[0].Appointment;
	                if(vm.recordsArr[0].Invoice.manualInvoiceItems){
	                  	vm.prescriptions =JSON.parse(vm.recordsArr[0].Invoice.manualInvoiceItems); 
	                }else{
						vm.prescriptions =JSON.parse(vm.recordsArr[0].Appointment.prescription); 
	                }
                 
                  console.log(vm.prescriptions);
                  vm.doctorDetails =vm.recordsArr[0].Doctor;
                  vm.speciality =vm.recordsArr[0].Speciality;
                  vm.SpecialityServices =vm.recordsArr[0].SpecialityServices;
                  if(vm.recordsArr[0].Reports){
                     vm.recordImages  = vm.recordsArr[0].Reports;
                   

                     $scope.slickConfig3Loaded = true;
                 }else{
                      vm.recordImages  = [];
                      $scope.slickConfig3Loaded = true;
                 }
                 
                  vm.drug  = vm.recordsArr[0].Drug;
                  if(vm.recordsArr[0].ReportPath)
                  {
                     vm.thumbImage  = vm.recordsArr[0].ReportPath.origImage;
                     vm.origImage  = vm.recordsArr[0].ReportPath.origImage;
                  }
                }
                console.log(vm.additionalElements,"elementssss");
              }else{
                vm.loaders = false;
                vm.recordPage = true;
                vm.serviceList = "";
                vm.prescription =""; 
                vm.prescriptions =""; 
                vm.doctorDetails ="";
                vm.additionalElements = "";
                vm.speciality ="";
                vm.SpecialityServices = "";
                vm.billRecords = "";
                vm.recordImages =[];
                
              }
            });
         }else{
             vm.recordsArr    =  [];
             vm.drug          = {};
             vm.billRecords   = {};
             vm.prescription  = {};
             vm.doctorDetails =  {};
             vm.SpecialityServices = {};
                   patientOfflineDataService.getRecordDetails(id,vm.clinicId,patientId).then(function(resp){
                      if(resp){
                          if(resp.reportsDetailsData.length > 0){
                            vm.recordsArr = resp.reportsDetailsData;
                            angular.forEach(vm.recordsArr,function(value,key){
                                 patientOfflineDataService.getInvoiceDetails(value.id).then(function(resp){
                                  if(resp){
                                    if(resp.getInvoiceDetails){
                                      vm.billRecords = resp.getInvoiceDetails;
                                      console.log(JSON.parse(vm.billRecords.serviceList));
                                      vm.serviceList = (JSON.parse(vm.billRecords.serviceList));
                                    }
                                  }
                                 }) 
                                utilService.getAppointment(value.appointmentId).then(function(resp){
                                  vm.prescription  = (resp);
                                  vm.prescriptions = JSON.parse(resp.prescription);
                                });
                                utilService.getUserDetails(value.doctorId).then(function(resp){
                                  vm.doctorDetails = resp;
                                });
                                utilService.getSpeciality(value.specialityId).then(function(resp){
                                  vm.speciality = resp;
                                });
                                utilService.getService(value.serviceId).then(function(resp){
                                  vm.SpecialityServices = resp;
                                });
                                // utilService.getDrugsDetails(value.drugId).then(function(resp){
                                //   vm.drug = resp;
                                // });
                             vm.recordPage = true;
                             vm.loaders = false;
                            });
                          }else{
                            vm.loaders = false;
                              vm.recordPage = true;
                              vm.serviceList = "";
                              vm.prescription =""; 
                              vm.prescriptions =""; 
                              vm.doctorDetails ="";
                              vm.additionalElements = "";
                              vm.speciality ="";
                              vm.SpecialityServices = "";
                              vm.billRecords = "";
                              vm.recordImages =[];

                          }
                      }
                    });
            }
                
         }else{
          $window.location.reload();
         }
      }

      function patientPaymentDetails(){
       var id =JSON.parse($window.localStorage.getItem('patient'))["id"];
        patientDataService.patientPaymentDetails(id).then(function(resp){
          if(resp.data.status == "success"){
            vm.table = true;
            vm.tableError = true;
           vm.paymentDetails  = resp.data.message;
           $scope.totalItem = resp.data.message.length;
          }else{
            vm.table = false;
            vm.tableError = false;
          }
        });
      }

      function treatmentDateDetails(id){
        patientDataService.treatmentDateDetails(id).then(function(resp){
          if(resp.data.status == "success"){
            vm.folder = false;
            vm.treatmentDate = true;
            vm.treatmentError = true;
           vm.treatmentDetails  = resp.data.message;
          }else{
            vm.folder = false;
            vm.treatmentError = false;
          }
        });
      }

      function openDefault(path,image){ 
      $rootScope.imagePreview = true;
       $scope.img = image;
       $scope.path = path;

        ngDialog.open({
            template: 'firstDialogId',
            scope: $scope
        
        });

      };
       /*
          Initial function
      */
      function init(){
        vm.patientList();
         console.log($state.params.id);
         if($state.params.id == ''){
          $state.go('patient');
         }

        if($state.current.method != undefined){
              vm[$state.current.method]();
         }
      }
    vm.init();
  }

})();
  
