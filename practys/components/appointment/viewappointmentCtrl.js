/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   Appointment
 *
 *  Description :   Appointment controller
 *
 *  Developer   :   Karthick
 * 
 *  Date        :   20/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/


(function () {
    'use strict';

 angular
    .module('practysApp')
    .controller('viewappointmentController', viewappointmentController);

    viewappointmentController.$inject = ['$scope','$rootScope','$SQLite','Auth','toastr','$state','appointmentService','appointmentOfflineService','$timeout','$window','utilService','$compile','ngDialog'];

    function viewappointmentController ($scope,$rootScope,$SQLite,Auth,toastr,$state,appointmentService,appointmentOfflineService,$timeout,$window, Utils,$compile,ngDialog) {

        
      
        if(!$state.params){
            $state.go('appointment');
            return false;
        }

        var files = [];
        var appointmentId = $state.params.appointmentId;
        $scope.filesInfo = [];
       
      

        if(appointmentId == undefined || appointmentId == '' || appointmentId == null){
            $state.go('appointment');
            return false;
        }


        /*$rootScope.$root.$broadcast("myEvent", {
            value: "From controller 2"
        });
*/
        /*
          function for Date picker
       */
      $scope.open = function($event, datePickerIndex) {
              $event.preventDefault();
              $event.stopPropagation();

              if ($scope.openDatePickers[datePickerIndex] === true) {
                $scope.openDatePickers.length = 0;
              } else {
                $scope.openDatePickers.length = 0;
                $scope.openDatePickers[datePickerIndex] = true;
              }
      }; 


      var vm = this;
      vm.getAppointment = getAppointment;
      vm.updateStatus = updateStatus;
      vm.updateAppointment = updateAppointment;
      vm.addFile = addFile;
      vm.removeFile = removeFile;
      vm.change = change;
      vm.openDefault = openDefault;
      vm.getInventoryProduct = getInventoryProduct;
      vm.drugServiceCal = drugServiceCal;
      vm.getDetails = getDetails;
      vm.addRow = addRow;
      vm.delRow = delRow;
      vm.addProdRow = addProdRow;
      vm.delProdRow = delProdRow;
      vm.getSum = getSum;
      vm.addCash = addCash;
      vm.upload = upload;

      vm.drugShow = false;
      vm.otherShow = false;
      vm.userLevel = JSON.parse($window.localStorage.getItem('user'))["user_level"];
      if(vm.userLevel == 'clinic'){
          vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
      }else{
          vm.clinicId = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
      }
      vm.format = "yyyy-MM-dd";
      vm.drugSuggest = [{ drugName: '', qty: '' , note:''}];
      vm.productSuggest = [{ productName: '', qty: '',usage:'' }];
      vm.appointment = {};
      vm.appointments = {};
      vm.events = [];
      vm.viewDate = new Date();
      $rootScope.utilsFileArr = [];



      function addRow(){
      

        if(vm.drugSuggest[vm.drugSuggest.length-1].drugName == '' || vm.drugSuggest[vm.drugSuggest.length-1].drugName == null || vm.drugSuggest[vm.drugSuggest.length-1].qty == '' || vm.drugSuggest[vm.drugSuggest.length-1].qty == null ){
        	toastr.error("Select the Drug and Quantity,..");
        	return false;
        }
     
        vm.drugSuggest.push({ drugName: '', qty: '',note:'' });
   
       
      }
       $scope.drugsSelect  =   function(e, index){
           var count   =   0;
           angular.forEach(vm.drugSuggest, function(values){
               if(values.drugName && (values.drugName.productName == e.productName)){
                   count++;
               }
           })
           if(count != 1){
               vm.drugSuggest[index].drugName  =   undefined;
               toastr.error("Drug is Already Selected,... kindly select any other drug!");
           }
       };

      function delRow(index) {
      
          vm.drugSuggest.splice(index, 1);
      }

      function addProdRow(){
      	if(vm.productSuggest[vm.productSuggest.length-1].productName == '' || vm.productSuggest[vm.productSuggest.length-1].productName == null || vm.productSuggest[vm.productSuggest.length-1].qty == '' || vm.productSuggest[vm.productSuggest.length-1].qty == null ){
        	toastr.error("Select the product and Quantity,..");
        	return false;
        }
            vm.productSuggest.push({ productName: '', qty: '',usage:'' });
      }
       $scope.otherProductChanges  =   function(event, index){
           var countProduct   =   0;
           angular.forEach(vm.productSuggest, function(values){
               if(values.productName && (values.productName.productName == event.productName)){
                   countProduct++;
               }
           })
           if(countProduct != 1){
               vm.productSuggest[index].productName  =   undefined;
               toastr.error("Product is Already Selected,... kindly select any other product!");
           }
       };

      function delProdRow(index) {
          vm.productSuggest.splice(index, 1);
      }

        // if($state.params.status == true){
        //   // console.log("true");

        //   appointmentService.updateCount($rootScope.appIds).then(function(resp){
        //     if(resp.data.status == "success"){

        //     }else{
        //       toastr.error("connection error");
        //     }

        //   });
        // }
        vm.additionalServiceCost = [];
        vm.additionalServices = [];
        function addCash(type,datas){
        	// alert("enter");
       

        	if(type == true){
        		vm.additionalServiceCost.push(datas.cost);
        		vm.additionalServices.push(datas);
        	}else{
        		// var arrayOfObjIndex = vm.additionalServices.findIndex(x => x.cost==datas.cost);

        		var index = vm.additionalServiceCost.indexOf(datas.cost);
        	
        		vm.additionalServices.splice(index,1);
        		vm.additionalServiceCost.splice(index,1);
        	}
       
        
        }
      function drugServiceCal(){
        vm.appointments.totAmount = (vm.appointments.drugQty * vm.appointments.drugCost) + JSON.parse(vm.appointments.serviceCost);
      }

        /*CLinic Drugs*/
      function getInventoryProduct(){
        vm.drugs = [];
        // vm.alternateDrug = [];
        // vm.otherAlternate = [];
        vm.others = [];
          appointmentService.getInventoryProduct(vm.clinicId).then(function(resp){
              
              if(resp.data.status == "success"){  
                // ngDialog.close();
                angular.forEach(resp.data.message, function(Value, Key) {
                  if(Value.productType == 'Drug'){
                    vm.drugs.push(Value);
                    // vm.alternateDrug.push(Value);
                  }

                  if(Value.productType == 'Other'){
                    vm.others.push(Value);
                    // vm.otherAlternate.push(Value);
                  }
                });
               
              // $scope.totalItems =vm.drugs.length;
              }

          });
      }

       $scope.drugSelect = {
        onSelect: function (item) {
          vm.appointments.drugId = item.id;
          vm.appointments.drugCost = item.cost;
       
        
      }
    }
        /*
           function to upload the file 
        */

        function upload(file) {
 
          $scope.fileName = file.name;
              files.push(file.name);
            
              vm.appointments.browse = files.toString();
         
               // Upload.upload({
               //      url: url+'/upload.php',
               //      data: {file: file, 'username': $scope.username}

               //  }).then(function (resp) {
               //    //console.log(resp);
               //      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
               //  }, function (resp) {
               //      console.log('Error status: ' + resp.status);
               //  }, function (evt) {
               //      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
               //      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
               //  });

        }

        var count = 2;
       // function to append file when plus icon clicked 
        function addFile (){
         
       
            count++;
            $rootScope.fileCount = count;
           // var fileHtml = '<input id="a_'+count+'_pics" accept="image/*" type="file" class="file" my-file-upload="a_'+count+'_pics" required/>';

            angular.element(document.getElementById('appendFile')).append($compile('<div class ="col-md-12 padding-zro browse-add" id= "rem_'+count+'"><div class="fileUpload btn btn-primary"><span>Browse</span><input id="a_'+count+'_pics" size="40"  accept="image/*" type="file" class="upload" my-file-upload="a_'+count+'_pics" required></div> <input type="text" disabled ng-model="utilsFileArr['+count+'].name"> <span class="btn btn-danger btn-style" ng-click = "vm.removeFile(\''+count+'\')" ><i class = "fa fa-trash" style= "color: #fff;"></i>  </span></div>')($scope));

        }

        function change(id){
        
        angular.element(document.getElementById('b_'+id+'_pics')).append();

        //Utils.removeFile('a_'+id+'_pics');
      }

      function removeFile(id){
      	$rootScope.fileCount = id;
        angular.element(document.getElementById('rem_'+id)).remove();

        Utils.removeFile('a_'+id+'_pics');
      }

    // function to get appointments for month , week and day


    function getAppointment(){
      // alert("jxb dhv");
      if(vm.userLevel == 'clinic'){
        var id =JSON.parse($window.localStorage.getItem('user'))["id"];
      }else{
        var id = JSON.parse($window.localStorage.getItem('doctor'))["clinic"]["id"];
      }
      if($rootScope.online){
        vm.appointmentLoader = true;
           appointmentService.getAppointments(appointmentId,id).then(function(resp) {
         
          if(resp.data.status == 'success'){
            vm.appointmentLoader = false;
              vm.appointment = resp.data.message[0];
              vm.appointment.specialityName = resp.data.message[0].speciality.name;
              vm.appointment.doctorName = resp.data.message[0].doctor.firstName+' '+resp.data.message[0].doctor.lastName;
              vm.appointment.patientName = resp.data.message[0].patient.firstName+' '+resp.data.message[0].patient.lastName;
              vm.appointments = resp.data.message[0].patient;
              // vm.appointment.appointmentService = resp.data.message[0].SpecialityServices;
              vm.appointments.startDate = resp.data.message[0].startDate;
              vm.appointments.startTime = resp.data.message[0].startTime;
              vm.appointments.doctorId = resp.data.message[0].doctor.id;
              vm.appointments.serviceCost = resp.data.message[0].SpecialityServices.cost;
              vm.appointments.serviceMins = resp.data.message[0].serviceTime;
              vm.appointments.serviceName = resp.data.message[0].SpecialityServices.name;
               vm.appointments.serviceId = resp.data.message[0].SpecialityServices.id;
              vm.appointments.serviceList = resp.data.message[0].serviceList;
            
          }
          
      });
      }else if(vm.userLevel == 'clinic'){
         vm.appointment = {};
         vm.appointments = {};
           // $SQLite.ready(function(){
           //        this.select('SELECT * FROM practysapp_appointments   WHERE practysapp_appointments.id = ? AND practysapp_appointments.clinicId = ?  GROUP BY practysapp_appointments.id',[appointmentId,id]).then(function(){
           //             console.log("empty result");
           //             toastr.error("No Data Found");
           //          },function(){
           //         console.log("error");
           //      },function(data){
           //        console.log(data.item);
           //           vm.appointment = data.item;  
           //       });
           // });
          appointmentOfflineService.getAppointmentDetails(appointmentId,id).then(function(resp){
            if(resp){
              if(resp.getAppointmentDetailsData){
                   vm.appointment = resp.getAppointmentDetailsData;
                   vm.getDetails(vm.appointment);
              }
            }
          });
      }
    }


    function getDetails(data){
       Utils.getUserDetails(data.patientId).then(function(response){
          vm.appointment.patientName = response.firstName+' '+response.lastName;
       });
       Utils.getUserDetails(data.doctorId).then(function(response){
          vm.appointment.doctorName = response.firstName+' '+response.lastName;
       });
       Utils.getSpeciality(data.specialityId).then(function(response){
          vm.appointment.specialityName  = response.name;
          vm.appointment.speciality      = response;
          
       });
       Utils.getService(data.serviceId).then(function(resp){
             vm.appointments.serviceName =  resp.name;
             vm.appointments.serviceMins =  resp.mins;
          });
    }


    vm.getAppointment();
    vm.getInventoryProduct();
   
    $scope.$emit('someEvent');
    $scope.$emit('someEvents');

      function getSum(total, num) {
          return total + num;
      }

    function updateStatus(vals){
    
      vm.checkoutBtn = true;
      // return false;
      // alert(appointmentId);
      
     
      if(vals == 'cancel'){
        // alert("if");
        if(vm.popup == undefined  ){
           toastr.error("Enter the reason");
           return false;
        }else{
          if(vm.popup.reason == ""){
            toastr.error("Enter the reason");
           return false;
          }
        }
      }
      // return false;
       vm.appointmentLoader = true;
      
      if(vals == undefined || vals == '' || vals == null){
        toastr.success("enter the valid reason");
        return false;
      }
      if(vm.userLevel == 'clinic'){
        var id =JSON.parse($window.localStorage.getItem('user'))["id"];
      }else{
         var id =JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
      }

      if(vm.popup != undefined){
        var reason =vm.popup.reason;
        var obj = {id:appointmentId, status: vals,reason:reason, clinicId: id};
      }else{
        var obj = {id:appointmentId, status: vals, clinicId: id};
      }
      if($rootScope.online){
         appointmentService.updateAppointmentStatus(obj).then(function(resp) {
            if(resp.data.status == 'success'){
              ngDialog.close();
              vm.appointmentLoader = false;
              vm.checkoutBtn = false;
              toastr.success(resp.data.message);
              $state.go('appointment');
            }else{
              vm.checkoutBtn = false;
              vm.appointmentLoader = false;
              toastr.error(resp.data.message);
            }
        });
      }else if(vm.userLevel == 'clinic'){
        obj.reason = obj.reason ? obj.reason : null;
        $SQLite.ready(function () {
              this.execute('UPDATE practysapp_appointments  SET status = ?,cancellationReason = ?,is_sync = ? WHERE id = ?', [obj.status,obj.reason,'0',obj.id]).then(function(resp){
              
                    toastr.success("Appointment updated successfully");
                    obj = {};
                     $state.go('appointment');
                },function(error){
                    
                  })
            });
      } 
    }

   

  
    function updateAppointment (objs,formName){
    	$rootScope.practysLoader = true;
       if(vm.userLevel == 'clinic'){
        objs.clinicId =JSON.parse($window.localStorage.getItem('user'))["id"];
      }else{
         objs.clinicId=JSON.parse($window.localStorage.getItem('doctor'))["clinic"]['id'];
      }
      
      if(formName.$pristine && formName.$invalid){
        toastr.error("Make Changes and Submit the Form");
        return false;
      }
 	 
      var filesArr = Utils.getFile();
      var filesData = [];
      var total = [];

      var option = {
          transformRequest: angular.identity,
          headers: {'Content-Type': false}
      };
     
      angular.forEach(filesArr, function (value, key) {
          filesData.push(value[0]);
      });

      //Multiple file Upload Sheema
       var fileTag = angular.element(document.getElementById('fileTag'));
       $scope.filesInfo = fileTag[0].files;
       filesData = $scope.filesInfo;
      //Multiple file Upload Sheema

      objs.prescription = [];
      if(filesData != '')
      {
      	if(objs.drugShowModel == true){
      		if(vm.drugSuggest[0].drugName != ''){
              angular.forEach(vm.drugSuggest, function(Value, Key) {
              	if(Value.qty != ''){
              		Value.productPaymentStatus = false;
                    objs.prescription.push(Value);
                }
              });
            }else{
            	toastr.error("Add Drugs, Otherwise uncheck it");
            	return false;
            }
      	}
         
      	if(objs.otherShowModel == true){
      		if(vm.productSuggest[0].productName != ''){
              angular.forEach(vm.productSuggest, function(Value, Key) {
              	if(Value.qty != ''){
              		Value.productPaymentStatus = false;
                   	objs.prescription.push(Value);
              	}
              		
              });
            }else{
            	toastr.error("Add Products, Otherwise uncheck it");
            	return false;
            }	
      	}
            

            if(objs.prescription != ''){
            
              
              angular.forEach(objs.prescription, function(Value, Key) {
                if(Value.drugName){
                  total.push(Value.drugName.sellingPrice * Value.qty);
                  Value.amount = Value.drugName.sellingPrice * Value.qty;
                }
                 if(Value.productName){
                  total.push(Value.productName.sellingPrice * Value.qty);
                  Value.amount = Value.productName.sellingPrice * Value.qty;
                }   
              });
            }

            if(total != ''){
              var validTot = total.reduce(function(prev, cur) {
                  return parseInt(prev) + parseInt(cur);
              });
              objs.totalAmount = validTot + JSON.parse(objs.serviceCost);
            }else{
            	 objs.totalAmount =JSON.parse(objs.serviceCost);
            }
           

            if((objs.otherShowModel == undefined || objs.otherShowModel == false) && (objs.drugShowModel == undefined || objs.drugShowModel == false)){
            	objs.totalAmount = objs.serviceCost;
            	objs.prescription = [];
            }


            objs.serviceListss = [];
            if(objs.specialityShowModel == true){

	            if(vm.additionalServices != ""){
	            	angular.forEach(vm.appointments.serviceList, function(Value, Key) {
	                  if(Value.id == vm.appointments.serviceId){
	                  	Value.productPaymentStatus = false;
	                  	objs.serviceListss.push(Value);
	                  }
	            	});
	            	angular.forEach(vm.additionalServices, function(Value, Key) {
	                  // if(Value.id == vm.appointments.serviceId){
	                  	Value.productPaymentStatus = false;
	                  	objs.serviceListss.push(Value);
	                  // }
	            	});
	            }
            	
            
            	
	            if(vm.additionalServiceCost != "" ){
	             	// var totals = objs.totalAmount 

	             	// objs.serviceListss.push(vm.additionalServices);
	            	var sum = vm.additionalServiceCost.reduce(function(prev, cur) {
		                  return parseInt(prev) + parseInt(cur);
		            });
	            	// reduce((a, b) => JSON.parse(a) + JSON.parse(b));
	           
	            	objs.totalAmount = JSON.parse(objs.totalAmount) + JSON.parse(sum);
	            }
        	}else{
        		angular.forEach(vm.appointments.serviceList, function(Value, Key) {
                  	if(Value.id == vm.appointments.serviceId){
	                  	Value.productPaymentStatus = false;
	                  	objs.serviceListss.push(Value);
                 	}
            	});
            	// if(vm.additionalServiceCost.length == 1){
            	
	            	// objs.totalAmount = JSON.parse(objs.totalAmount) + JSON.parse(vm.additionalServiceCost[0]);
	            // }
        	}

        		
          
           

           // console.log(filesData);

       
        
        Utils.handleFileUpload(filesData,vm.clinicId).then(function(resp){
        console.log(resp);
    

        if(resp.data.status == 'success'){

            objs.appointmentId = appointmentId;
            objs.patientId = vm.appointments.id;
            objs.doctorId = vm.appointments.doctorId;
            objs.images = resp.data.names;
            appointmentService.updateAppointmentDetails(objs).then(function(resp) {
              console.log(resp);
              if(resp.data.status == 'success'){
              	 // appointmentService.recordSave(objs).then(function(resp) {
              	 // 	if(resp.data.status == 'success'){
	          	 		$rootScope.practysLoader = false;
	            		toastr.success("Appointment updated successfully");
	            		$state.go('appointment');
              	 // 	}else{
              	 // 		$rootScope.practysLoader = false;
                // 		toastr.error(resp.data.message);
              	 // 	}
              	 // });
              	
              }else{
              	$rootScope.practysLoader = false;
                toastr.error(resp.data.message);
              }

            });
         
        }else{
          $rootScope.practysLoader = false;
          toastr.error(resp.data.message);
        }

      });
      }else{
      	if(objs.drugShowModel == true){
          // alert("drug true");

            if(vm.drugSuggest[0].drugName != ''){

              angular.forEach(vm.drugSuggest, function(Value, Key) {
              	if(Value.qty != ''){
              	   Value.productPaymentStatus = false;
                   objs.prescription.push(Value);
                }
              });
            }else{
            	toastr.error("Add Drugs, Otherwise uncheck it");
            	return false;
            }
        }
        if(objs.otherShowModel == true){
            if(vm.productSuggest[0].productName != ''){
              angular.forEach(vm.productSuggest, function(Value, Key) {
              	if(Value.qty != ''){
              	   Value.productPaymentStatus = false;
                   objs.prescription.push(Value);
                }
              });
            }else{
            	toastr.error("Add Products, Otherwise uncheck it");
            	return false;
            }
        }

            if(objs.prescription != ''){
            
              var total = [];
              angular.forEach(objs.prescription, function(Value, Key) {
                if(Value.drugName){
                  total.push(Value.drugName.sellingPrice * Value.qty);
                  Value.amount = Value.drugName.sellingPrice * Value.qty;
                }
                 if(Value.productName){
                  total.push(Value.productName.sellingPrice * Value.qty);
                  Value.amount = Value.productName.sellingPrice * Value.qty;
                }   
              });
            }
// console.log();
            if(total != ''){
              var validTot = total.reduce(function(prev, cur) {
                  return parseInt(prev) + parseInt(cur);
              });
              objs.totalAmount = validTot + JSON.parse(objs.serviceCost);
            }else{
            	 objs.totalAmount = JSON.parse(objs.serviceCost);
            }

             if((objs.otherShowModel == undefined || objs.otherShowModel == false) && (objs.drugShowModel == undefined || objs.drugShowModel == false)){
            	// objs.totalAmount = objs.serviceCost;
            	objs.prescription = [];
            }
            objs.serviceListss = [];
            if(objs.specialityShowModel == true){
            	// alert("true");
            if(vm.additionalServices != ""){
            	angular.forEach(vm.appointments.serviceList, function(Value, Key) {
                  if(Value.id == vm.appointments.serviceId){
                  	Value.productPaymentStatus = false;
                  	objs.serviceListss.push(Value);
                  }
            	});
            	angular.forEach(vm.additionalServices, function(Value, Key) {
                  // if(Value.id == vm.appointments.serviceId){
                  	Value.productPaymentStatus = false;
                  	objs.serviceListss.push(Value);
                  // }
            	});
            }

            
            if(vm.additionalServiceCost != "" ){
            	var sum = vm.additionalServiceCost.reduce(function(prev, cur) {
                  	return parseInt(prev) + parseInt(cur);
              	});
            	// reduce((a, b) => JSON.parse(a) + JSON.parse(b));
           
            	objs.totalAmount = JSON.parse(objs.totalAmount) + JSON.parse(sum);
            }
             
        }else{
        	// alert("false");
        	angular.forEach(vm.appointments.serviceList, function(Value, Key) {
                  if(Value.id == vm.appointments.serviceId){
                  	Value.productPaymentStatus = false;
                  	objs.serviceListss.push(Value);
                  }
            });
         
        }

        	
            
      
            // return false;
            // console.log(objs);
            //  console.log(total);
            //   return false;
            objs.appointmentId = appointmentId;
            objs.patientId = vm.appointments.id;
            objs.doctorId = vm.appointments.doctorId;
            // objs.images = resp.data.names;
            // console.log(objs);
            //   return false;
            appointmentService.updateAppointmentDetails(objs).then(function(resp) {
              console.log(resp);
              if(resp.data.status == 'success'){
              	$rootScope.practysLoader = false;
                toastr.success("Appointment updated successfully");
                $state.go('appointment');
              }else{
              	$rootScope.practysLoader = false;
                toastr.error(resp.data.message);
              }

            });

      }
      

    }
 

    function openDefault(){ 
           if($rootScope.online){
               ngDialog.open({
                    template: 'firstDialogId',
                    controller:'viewappointmentController'
                    // className:'ngdialog-theme-default'
                
                });

        }else{
        toastr.error("No Internet connection");
      }
    }
          
  }

})();


