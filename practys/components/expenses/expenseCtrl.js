/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   expenseCtrl
 *
 *  Description :   Expenses
 *
 *  Developer   :   Nishanth
 * 
 *  Date        :   12/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

(function () {
    'use strict';

 angular
    .module('practysApp')
    .controller('expenseController', expenseController);

    expenseController.$inject = ['$rootScope','$scope','$SQLite','expenseService','expenseOfflineService','$state','$window','$timeout','Auth','$log','Upload','__env','toastr','utilService','$http','$sce','ngDialog','$interval'];


    function expenseController ($rootScope,$scope,$SQLite,expenseService,expenseOfflineService,$state,$window,$timeout,Auth,$log,Upload,__env,toastr,Utils,$http,$sce,ngDialog,$interval) {

       
        /*
        Declaration part
        */ 

      var url = __env.apiUrl;
      $scope.currentPage = 1;
      $scope.maxSize = 10;

      $scope.userObj = angular.fromJson(Utils.getItem('user'));
      
      $scope.addExpensedata   = [];

      var vmExpenses = this;
      vmExpenses.format = 'yyyy-MM-dd';
      vmExpenses.expense = {};

      vmExpenses.increment=increment;
      vmExpenses.change=change;
      vmExpenses.addExpenses=addExpenses;
      vmExpenses.searchFilter=searchFilter;
      vmExpenses.viewExpense=viewExpense;
      vmExpenses.updateExpenses=updateExpenses;
      vmExpenses.getExpense=getExpense;
      vmExpenses.init = init;
      vmExpenses.upload = upload;
      vmExpenses.addPop = addPop;
      vmExpenses.editPop = editPop;
      vmExpenses.viewPop = viewPop;
      vmExpenses.uploadFile = uploadFile;
      vmExpenses.productCheck = productCheck;
      vmExpenses.check = check;
      vmExpenses.deleteExpense = deleteExpense;
      vmExpenses.deleteFile = deleteFile;
      vmExpenses.enableReset = true;
      vmExpenses.costEnable = true; 
      $rootScope.practysLoader = false;
      vmExpenses.expense.total_amt = 0;
      vmExpenses.expense.cost_per_unit = 0;
      vmExpenses.expense.no_of_item = 0;
      vmExpenses.deleteFlag = false;
      vmExpenses.format = "yyyy-MM-dd";
      $scope.items  = [];
      vmExpenses.expenseDatas = [];
      $scope.expenseDrugs = [];
      // vmExpenses.disable = true;
      // vmExpenses.disables = true;
     
      vmExpenses.clinicId = $scope.userObj.id;

      $scope.cancel = function(){
            ngDialog.close();
          }
         $scope.openFile = function (filePath,name) {
          var fileLink = filePath+name;
               $window.open(fileLink, "popup", "width=500,height=500,left=500,top=100");
           }


           $scope.keyup =function(vals){
              $scope.totalItems = vals.length;
            }
        /*
        functionalaties for date picker
        */
		$scope.reverse = false;

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
        } 
 
       $scope.openDatePickers = [];
       $scope.openDatePicker = [];
       $scope.opendate = [];
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
      
              $scope.openFrom = function($event, datePickerIndex) {
              $event.preventDefault();
              $event.stopPropagation();

              if ($scope.openDatePicker[datePickerIndex] === true) {
                $scope.openDatePicker.length = 0;
              } else {
                $scope.openDatePicker.length = 0;
                $scope.openDatePicker[datePickerIndex] = true;
              }
            };
            $scope.opens = function($event, datePickerIndex) {
              $event.preventDefault();
              $event.stopPropagation();
              // console.log($event);
              // console.log($scope.opendate);
              // return false;

              if ($scope.opendate[datePickerIndex] === true) {
                $scope.opendate.length = 0;
              } else {
              	 $scope.opendate.length = 0;
                $scope.opendate[datePickerIndex] = true;
              }
            };



            function deleteExpense(id){
            	if(id){
            		$rootScope.practysLoader = true;
	            	expenseService.deleteExpense(id).then(function (resp) {
	                    if(resp.data.status == "success"){
	                        vmExpenses.getExpense();
	                        $rootScope.practysLoader = false;
	                    }else{
	                     	toastr.error(resp.data.message);
	                     	$rootScope.practysLoader = false;
	                    }
	                 });	
            	}
            }


            //delete uploaded file  jan 17 (2018)

            function deleteFile(id,fileName){
            	if(!vmExpenses.deleteFlag){
            		if(fileName){
	            		$scope.loader = true;
	            		var clinicId = $scope.userObj.id;
	            		expenseService.deleteFile(id,clinicId,fileName).then(function (resp) {
		                    if(resp.data.status == "success"){
		                    	$scope.loader = true;
		                    	vmExpenses.deleteFlag = true;
		                    	$scope.expense.fileName = "";
		                    }else{
		                    	toastr.error("Error in deleting the file..");
		                    	$scope.loader = true;
		                    }
		                 });
	            	}else{
	            		toastr.error('file name is missing');
	            		return false;
	            	}
            	}else{
            		$scope.expense.fileName = "";
            	}
            	
            }


            /*Function to check the selected product cost is presented or not*/
            function productCheck(name){
              console.log(name);
              // if(name != undefined){
              //   vmExpenses.disables = false;
              //   if($scope.addExpenseform.costPerItem == undefined){
              //     vmExpenses.disable = false;
              //   }else{
              //     vmExpenses.disable = true;
              //   }
              // }else{
              //   vmExpenses.disables = true;
              // }
              
                $scope.addExpenseform.costPerItem = "";
                // vmExpenses.expense.drugs     = resp.data.message;
                 // $scope.addExpensedata  = resp.data.message;
                  angular.forEach(vmExpenses.expense.drugs,function(value,key){
                   
                    if(name == value.name){
                      // // alert("success");
                      // vmExpenses.costEnable = true;
                      $scope.addExpenseform.costPerItem = value.cost;
                      return false;
                    }

                    // else{
                    //    if(key == vmExpenses.expense.drugs.length - 1){
                    //       if(name != value.name){
                    //             alert("fails");
                    //         vmExpenses.costEnable = false;
                    //         return false;
                    //       }
                    //     }
                    // }

                  });
            }
               /*
                function to upload the file 
             }
              */
            var files = [];  

            function upload(file) {
              vmExpenses.expense.fileName = file.name;
              // $scope.expense.fileName = file.name;
              $scope.addExpenseform.fileName  = file.name;
              $scope.files = file;

            }

            function check(){
              console.log($scope.addExpenseform.productName);
              
              if($scope.addExpenseform.productName == undefined){
                $scope.addExpenseform.noOfItem = '';
                $scope.addExpenseform.costPerItem = '';
                toastr.error("Select the Product");
              }
            }

            function uploadFile(file,form){
              form.file.$setDirty();
              form.$setDirty();
              $scope.expense.fileName = file.name;
              $scope.filess  = file; 
            }

            /*
                function for popup occurence
            */
            function addPop(){
              $scope.files = "";
              $rootScope.popup = false;
              $scope.addExpenseform   = {};

                ngDialog.open({
                    template: 'firstDialogId',
                    scope :$scope,
                    preCloseCallback: function() {
       					$scope.opendate.length = 0;
    				}
                });

            }
            
        //            preCloseCallback: function() {
       	// 				$scope.opendate.length = 0;
    				// }

            function editPop(id){
              $scope.filess            = "";
              $scope.expense           = {};
              $rootScope.popup         = false;
              $rootScope.practysLoader = true;
              if($rootScope.online){
                  if(id != ''){
                 $scope.expense = {};
                 var clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
                 expenseService.editExpense(id,clinicId).then(function (resp) {
                    if(resp.data.status == "success"){
                       $rootScope.practysLoader = false;
                        $scope.expense = resp.data.message[0];
                      }
                  });
                }
              }else{
                 expenseOfflineService.viewExpenses(id).then(function(res){ 
                   if(res){
                    $scope.expense = res.data;
                   }
                  });
                
                }
                ngDialog.open({
                      template: 'editPopUp',
                      scope :$scope,
                    preCloseCallback: function() {
       					$scope.opendate.length = 0;
       					vmExpenses.getExpense();
    				}
                  });
            }

             function viewPop(id){
              $rootScope.popup         = false;
              $rootScope.practysLoader = true;
              $scope.expense = {};
              if($rootScope.online){
                  if(id != ''){
                 $scope.expense = {};
                 var clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
                 expenseService.editExpense(id,clinicId).then(function (resp) {
                    if(resp.data.status == "success"){
                       $rootScope.practysLoader = false;
                        $scope.expense = resp.data.message[0];
                      }
                  });
                }
              }else{
                expenseOfflineService.viewExpenses(id).then(function(res){ 
                   if(res){
                    $scope.expense = res.data;
                   }
                  });
              }
                ngDialog.open({
                      template: 'viewPopUp',
                      controller:'expenseController',
                      scope :$scope
                  });
            }

            function getExpense(){
             	  vmExpenses.expense.toDate = '';
                vmExpenses.expense.fromDate = '';
            	   vmExpenses.expenseDatas = [];
               var clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
              if($rootScope.online){
               $rootScope.practysLoader = true;
                expenseService.getExpense(clinicId).then(function(resp) {
                  $rootScope.practysLoader = false;
                  vmExpenses.enableReset = true;
                  if(resp.data.status == "success"){
                    $timeout(function(){
                      $scope.$apply(function(){
                        vmExpenses.expenseDatas= resp.data.message;
                        $scope.totalItems = resp.data.message.length;
                      });
                    },10);
                }else{
                  $rootScope.practysLoader = false;
                  toastr.error(resp.data.message);
                  $scope.totalItems = 0;
                   vmExpenses.expenseDatas = [];
                  
                }
                });
              }else{
                vmExpenses.expenseDatas = [];
                 $SQLite.ready(function(){
                    this.select('SELECT * FROM practysapp_expenses WHERE practysapp_expenses.clinicId=?',[clinicId]).then(function(){
                       toastr.error("No Data Found");
                      },function(){
                      },function(data){
                        vmExpenses.enableReset = true;
                        vmExpenses.expenseDatas.push(data.item);
                    });
                   });
                 $timeout(function(){
                    $scope.$apply(function(){
                       $scope.totalItems = vmExpenses.expenseDatas.length;
                       angular.forEach(vmExpenses.expenseDatas,function(value,key){
                          if(value){
                            Utils.getDrugsDetails(value.drugId).then(function(resp){
                                value.Drug = resp;
                            });
                          }
                       });
                    });
                 },2000);
              }
            }

            /*
                Calculating the totalAmount
            */
            function change(type,obj){
              if(type == 'add'){
              
                 vmExpenses.expense.totalAmount = obj.costPerItem * obj.noOfItem;
              }
              if(type == 'edit'){
          
                 $scope.expense.totalAmount = obj.costPerItem * obj.noOfItem;
              }
            }
            $scope.calculateBaseditems  = function(type,obj){
              if(type == 'add'){
                 $scope.addExpenseform.totalAmount = obj.costPerItem * obj.noOfItem;
              }
            }


            /*
                seraching the datas in table by FROM TO dates 
            */
            function searchFilter(){
              if(vmExpenses.expense.toDate == ''||vmExpenses.expense.fromDate == '' ||vmExpenses.expense.toDate == undefined || vmExpenses.expense.fromDate == undefined ||vmExpenses.expense.toDate == 'Invalid date'|| vmExpenses.expense.fromDate == 'Invalid date'){
                  toastr.error("Enter the From and To Date");
              }else{
              vmExpenses.expense.clinicId = vmExpenses.clinicId;
              vmExpenses.expense.toDate  = moment(new Date(vmExpenses.expense.toDate)).format("YYYY-MM-DD");
              vmExpenses.expense.fromDate  = moment(new Date(vmExpenses.expense.fromDate)).format("YYYY-MM-DD");
              if($rootScope.online){
                  expenseService.searchFilter(vmExpenses.expense).then(function (resp) {
                    vmExpenses.enableReset = false;
                      if(resp.data.status == "success"){
                        vmExpenses.expenseDatas = [];
                        // vmExpenses.expense.toDate ='';
                        // vmExpenses.expense.fromDate ='';
                        $scope.totalItems = resp.data.message.length;
                        vmExpenses.expenseDatas = resp.data.message;
                      }else{
                        vmExpenses.enableReset = false;
                        $scope.totalItems = 0;
                        vmExpenses.expenseDatas = [];
                   
                      }
                    });
                }else{
                   vmExpenses.expenseDatas = [];
                   expenseOfflineService.serachExpensesFilter(vmExpenses.expense.fromDate,vmExpenses.expense.toDate).then(function(res){ 
                     console.log(res);
                     if(res){
                       vmExpenses.expenseDatas = (res.serachFilter);
                       $scope.totalItems = vmExpenses.expenseDatas.length;
                       vmExpenses.enableReset = false;
                     }
                  });
                }
              }
            }

            function addExpenses  (form){
              // console.log(form);
              // return false;
              if(form.$dirty && form.$valid){
                if($scope.addExpenseform.productName == undefined || $scope.addExpenseform.supplierName == undefined  || $scope.addExpenseform.expenseDate == undefined || $scope.addExpenseform.noOfItem == undefined || $scope.addExpenseform.costPerItem == undefined ){
                  // toastr.error('All fields are mandatory');
                  return false;
                }else{
                  $rootScope.practysLoader = true;
                  // $scope.addExpenseform.drugId = $scope.addExpenseform.drug.id; 
                  $scope.addExpenseform.clinicId = vmExpenses.clinicId;
                  $scope.addExpenseform.expenseDate  = moment(new Date($scope.addExpenseform.expenseDate)).format("YYYY/MM/DD");
                  if($rootScope.online){
                      Upload.upload({
                          url: url+'expenses/create',
                          data: {file: $scope.files, 'postDatas': $scope.addExpenseform}

                  }).then(function (resp) {
                    console.log(resp);
                    if(resp.data.data.status == 'error'){
                      ngDialog.close();
                      toastr.error(resp.data.data.message);
                      return false;
                    }
                    files = [];
                    $rootScope.practysLoader =false;
                    $scope.files = "";
                    vmExpenses.getExpense();
                    ngDialog.close();
                      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    
                  }, function (resp) {
                      console.log('Error status: ' + resp.status);
                  }, function (evt) {
                      $rootScope.practysLoader =true;

                      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                      if(progressPercentage == 100){
                        $rootScope.practysLoader =false;
                      }
                      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.name);
                  });
                    // $state.go('expenses');
                  }else{  
                    ngDialog.close();
                     toastr.error("No Internet Connection");
                  
                  }
                }
              }
            }


            function viewExpense(){
                var id = $state.params.id;
                if($rootScope.online){
                     expenseService.editExpense(id).then(function (resp) {
                    if(resp.data.status == "success"){
                        vmExpenses.expense = resp.data.message[0];
                    }else{
                      console.log("server error");
                    }
                 });
                }else{
                   vmExpenses.expense = {};
                  //  $SQLite.ready(function(){
                  //     this.select('SELECT * FROM practysapp_expenses WHERE practysapp_expenses.id =?',[id]).then(function(){
                  //        console.log("empty result");
                  //     },function(){
                  //    console.log("error");
                  //   },function(data){
                  //       vmExpenses.expense  = data.item;
                  //     });
                  // });
                  expenseOfflineService.viewExpenses(id).then(function(res){ 
                    
                  });
                }
            }

            function updateExpenses(form,obj){
              console.log(obj);
              // return false;
              // if(form.$dirty && form.$valid){
                // alert("form if");
                if(obj.productName == undefined || obj.supplierName == undefined  || obj.expenseDate == undefined || obj.noOfItem == undefined || obj.costPerItem == undefined){
                 // alert("if");
                 // toastr.error('Change or Fill Required Fields Before Submit');
                  return false;
                }
                else{
                  // alert("else");
                  obj.clinicId = vmExpenses.clinicId;
                  obj.expenseDate  = moment(new Date(obj.expenseDate)).format("YYYY-MM-DD");
                  if($rootScope.online){
                    if($scope.filess == ''){
                      // alert("normal");
                           expenseService.updateExpense(obj).then(function (resp) {
                          if(resp.data.status == "success")
                          {
                            ngDialog.close();
                            toastr.success(resp.data.message);
                            vmExpenses.getExpense();
                          }else{
                            toastr.error(resp.data.message);
                          }
                       });
                     }else{
                      // alert("upload");
                      Upload.upload({
                          url: url+'expenses/update',
                          data: {file: $scope.filess, 'postDatas': obj}

                        }).then(function (resp) {
                          // console.log(resp);return false;
                            ngDialog.close();
                            toastr.success(resp.data.data.message);
                            vmExpenses.getExpense();
                            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                          
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                        }, function (evt) {
                            $rootScope.practysLoader =true;

                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                            if(progressPercentage == 100){
                              $rootScope.practysLoader =false;
                            }
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.name);
                        });
                     }
                  }
                  else{
                    toastr.error("No Internet Connection");
                    ngDialog.close();
                  }
                }
              // }
              // else{
              //   toastr.error('Change or Fill Required Fields Before Submit');
              //   return false;
              // }
            }

      function increment(){
        
      }

       $scope.drugSelection = {
              onSelect: function (item) {
                 $scope.addExpenseform.drug  = angular.copy(item);
                $scope.addExpenseform.costPerItem   = angular.copy(item.cost);
                }
            }

      /*
          Function that Initially run when the controller loads at first
      */
      function init(){
        if($rootScope.online){
           Utils.getDrugs(vmExpenses.clinicId).then(function (resp) {
            console.log(resp.data.message);
                if(resp.data.status == "success"){
                 vmExpenses.expense.drugs     = resp.data.message;
                 // $scope.addExpensedata  = resp.data.message;
                  angular.forEach(resp.data.message,function(value,key){
                       $scope.expenseDrugs.push(value.name);
                  });
                }
          });
         }else{
          vmExpenses.expense.drugs = [];
          $scope.addExpensedata   = [];
          expenseOfflineService.getClinicExpenses().then(function(resp){
            if(resp){
              console.log(resp);
              vmExpenses.expense   =  resp.expensesData;
              $scope.totalItems    =  vmExpenses.expense.length;
            }
          });
         }
        vmExpenses.getExpense();
       
        if($state.current.method != undefined){
            vmExpenses[$state.current.method]();
        }
      }


      vmExpenses.init();
      

    }

})();