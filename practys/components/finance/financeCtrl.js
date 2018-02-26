/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   financeCtrl
 *
 *  Description :   Finance
 *
 *  Developer   :   Nishanth
 * 
 *  Date        :   21/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

(function () {
    'use strict';

 angular
    .module('practysApp')
    .controller('financeController', financeController);

    financeController.$inject = ['$rootScope','$scope','financeService','$location','toastr','$window','$state','Auth','$filter','$timeout','ngDialog','utilService'];


    function financeController ($rootScope,$scope,financeService,$location,toastr,$window,$state,Auth,$filter,$timeout,ngDialog,utilService) {
     
     if(!Auth.isLoggedIn())
        {
            $location.path('/login');
            return false;
        }   

     if($window.sessionStorage.getItem('finance') == undefined){
         $location.path("/financeLogin"); 
        }


      
  
      /*
        Declaration part
      */ 
  
   $scope.expenseMonthlabel = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July","Aug","Sep","Oct","Nov","Dec"];
 
   $scope.invoiceMonthLabel = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July","Aug","Sep","Oct","Nov","Dec"];
   $scope.monthsInYear = [{"id":1,"month":"Jan"},{"id":2,"month":"Feb"},{"id":3,"month":"Mar"},{"id":4,"month":"Apr"},{"id":5,"month":"May"},{"id":6,"month":"Jun"},{"id":7,"month":"Jul"},{"id":8,"month":"Aug"},{"id":9,"month":"Sep"},{"id":10,"month":"Oct"},{"id":11,"month":"Nov"},{"id":12,"month":"Dec"}];
        
        var vm = this;
        // vm.reportLoader = [];
        vm.reportInvoiceLoader= false;
        vm.reportExpenseLoader= false;
        vm.init = init;
        vm.financeLogin = financeLogin;
        vm.getMonth = getMonth;
        // vm.getYear = getYear;
        vm.totalRevenue = totalRevenue;
        vm.searchByYear = searchByYear;
        vm.searchByMonth = searchByMonth;
        vm.daysInMonth = daysInMonth;
        vm.getDays = getDays;
        vm.printChart = printChart;
        vm.openDefault = openDefault;
        vm.changePassword = changePassword;
        vm.resetPopup = resetPopup;
  //       vm.createPDF = createPDF;
		// vm.getCanvas = getCanvas;

        vm.expenseMonthData =[];
        vm.expenseMonthDatas =[];
        vm.invoiceMonthData = [];
        vm.invoiceMonthDatas = [];
        vm.finance = [];
        vm.clinicDetails = utilService.RestoreStateObj(utilService.getItem('user'));
        vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
        vm.clinicName = JSON.parse($window.localStorage.getItem('user'))["username"];
        vm.selectedYear = {};
        $scope.expenseYearData = [];
        $scope.expenseYearDatas = [];
        $scope.invoiceYearData = [];
        $scope.invoiceYearDatas = [];
        $scope.expenseYearLabel = [];
        $scope.invoiceYearLabel = [];

        vm.tab = 1;
        // for a4 size paper width and height

      //   if(!vm.financeLogin())
      // {
      //     $state.go('financeProtected');
      //     return false;
      // } 



        /* Functionaty for popup changing password
        */
        function openDefault(templates) {
            $rootScope.popup = true;
            if($rootScope.online){
                ngDialog.open({
                template: templates,
                scope: $scope
              });
            }
        };

        function resetPopup(){
        	if(vm.clinicDetails.email){
        		$scope.loader = true;
        		financeService.resetPassword(vm.clinicDetails.email).then(function(resp) {
	                if (resp.data.status == "success") {
	                    toastr.success(resp.data.message);
	                    ngDialog.close();
	                    $scope.loader = false;
	                } else {
	                    toastr.error(resp.data.message);
	                    $scope.loader = false;
	                    return false;
	                }
           		});
        	}else{
        		toastr.error("Error in founding clinic email");
        		return false;
        	}
            
        }

        function changePassword(formName) {
            console.log(formName);
            if(formName.$pristine && formName.$invalid){
                toastr.error("Please Enter the Password");
                return false;
            }
            if (vm.popup.newPassword == vm.popup.confirmPassword) {
              var id = JSON.parse($window.localStorage.getItem('user'))["id"];
                

                financeService.changePassword(id, vm.popup).then(function(resp) {
                    if (resp.data.status == "success") {
                    	vm.popup = "";
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


      function printChart(id,title){
      	$scope.repPro = true;
      	$rootScope.practysLoader = true;
      	// if(title == 'Invoices'){
      	// 	$scope.reportInvoiceLoader = true;
      	// }else if(title == 'Expenses'){
      	// 	$scope.reportExpenseLoader = true;
      	// }
      	// $scope.reportLoader = true;
      	$timeout(function() {

      		 html2canvas($('#'+id), {
            onrendered: function(canvas) {         
                var imgData = canvas.toDataURL(
                    'image/png');              
                var doc = new jsPDF('p', 'mm', [400, 330]);
                doc.addImage(imgData, 'PNG', 10, 10);
                doc.save(title+'.pdf');
         //        if(title == 'Invoices'){
		      	// 	$scope.reportInvoiceLoader = false;
		      	// }else if(title == 'Expenses'){
		      	// 	$scope.reportExpenseLoader = false;
		      	// }

		      	$scope.repPro = false;
		      	$rootScope.practysLoader = false;
                // $scope.reportLoader = false;
            }
        	});
      	}, 500);
      	  
     
      }



      // $scope.createPDF =function(year,id,contentDetails){
      // // alert("pdf");
      // console.log(id);
      
      //   // vm.pdfLoaders = true;
      //   // $scope.report = true;
      //   $scope.reportLoader = true;
      //   // return false;
      //   // var displayYear =  year ? ' '+ 'for'+' '+year : ''; 
      //   html2canvas(document.getElementById(id), {

      //     onrendered: function (canvas) {
      //       console.log(canvas);
          
      //       var data = canvas.toDataURL('image/jpeg',1);
      //      console.log(data);
      //       var docDefinition = {
      //       content: [
      //           contentDetails,
      //           {
      //           image: data,
      //           style:'imageAlign'
      //                 }],
      //                 styles:{
      //                   imageAlign:{
      //                     alignment:'centre',
      //                     margin:[20,50,0,50]
      //                   }
      //                 }
      //       };
      //       console.log(docDefinition);
      //       // $scope.report = false;
      //       $scope.reportLoader = false;
      //       pdfMake.createPdf(docDefinition).download(contentDetails+".pdf");

      // // pdfMake.createPdf(docDefinition).open();
      //     }
      //   });
      // };
      
        /*
        Tab functionalities
        */ 

        vm.setMonth = function (type) {
           vm.tab = 1;
          if(type == "expense"){
             var d = new Date();
             vm.currentYear = d.getFullYear();
             vm.currentMonth = moment().format('M');
             vm.searchByMonth(vm.currentMonth,'expense','init');
          }
          if(type == "invoice"){
             var d = new Date();
             vm.currentYear = d.getFullYear();
             vm.currentMonth = moment().format('M');
             vm.searchByMonth(vm.currentMonth,'invoice','init');
          }
         

        };

        vm.setYear = function () {
         vm.getMonth();
         vm.tab = 2;

        };
        vm.isSet = function (tabId) {
            return vm.tab === tabId;
        };

    


        /*
        Graph functionalities
        */ 

         $scope.onClick = function (points, evt) {
            console.log(points, evt);
          };
          $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
          $scope.options = {
            scales: {
              yAxes: [
                {
                  id: 'y-axis-1',
                  type: 'linear',
                  display: true,
                  position: 'left'
                }
              ]
            }
          };

        /* Functionality for getting the previous four years 
          from the current year
          */
       
          for(var i=4 ; i>=0 ; i--){
              var myDate = new Date();
              var previousYear = new Date(myDate);
              
              var prev = previousYear.setYear(myDate.getFullYear()-i);
              $scope.prevYear = $filter('date')(previousYear,'yyyy'); 
              $scope.expenseYearLabel.push($scope.prevYear);
              $scope.invoiceYearLabel.push($scope.prevYear);  
              
          }


          function searchByMonth(month,type,shift){
            var d = new Date();
             vm.currentYear = d.getFullYear();
            
           
            if(type == 'expense'){
              vm.selectedExpenseYear = vm.currentYear;
              if(shift == 'filter'){
                 vm.tempMonth = moment().month(month.id - 1).format('MMMM');
                  vm.selectedExpenseMonth = vm.tempMonth;
                  vm.month = moment().month(month.id - 1).format('MMM');
                  var noOfDays = vm.daysInMonth(month.id);
                  vm.getDays(month.id,type,noOfDays);
                }
                if(shift == 'init'){
                  vm.tempMonth = moment().month(month - 1).format('MMMM');
                  vm.month = moment().month(month - 1).format('MMM');
                   vm.selectedExpenseMonth = vm.tempMonth;
                    // vm.selectedExpenseYear = vm.currentYear;
                  var noOfDays = vm.daysInMonth(month);
                  vm.getDays(month,type,noOfDays);
                }
                

                
                vm.exDaysPush = [];
                vm.exDaysTable = [];
                // vm.daysPushh = [];
                for(var i = 1; i <= noOfDays ; i++){
                  // vm.exDaysPush.push(vm.month+' '+i);
                  vm.exDaysPush.push(i);
                  vm.exDaysTable.push(i+' '+vm.month);
                }
              }else{
                vm.selectedInvoiceYear = vm.currentYear;
                if(shift == 'filter'){
                   vm.tempMonth = moment().month(month.id - 1).format('MMMM');
                  vm.selectedInvoiceMonth = vm.tempMonth;
                  vm.month = moment().month(month.id - 1).format('MMM');
                  var noOfDays = vm.daysInMonth(month.id);
                  vm.getDays(month.id,type,noOfDays);
                }
                if(shift == 'init'){
                  vm.tempMonth = moment().month(month - 1).format('MMMM');
                  vm.month = moment().month(month - 1).format('MMM');
                  vm.selectedInvoiceMonth =vm.tempMonth;
                  var noOfDays = vm.daysInMonth(month);
                  vm.getDays(month,type,noOfDays);
                }
                

                
                vm.inDaysPush = [];
                vm.inDaysTable = [];
                // vm.daysPushh = [];
                for(var i = 1; i <= noOfDays ; i++){
                  // vm.inDaysPush.push(vm.month +' '+i);
                   vm.inDaysPush.push(i);
                   vm.inDaysTable.push(i+' '+vm.month);
                }
              }
            
            // vm.daysPushh.push(vm.daysPush);
            // vm.getDays(month,type);
          }

          /*
              Expense and Invoice datas search by years
          */

          function searchByYear(year,type){
            vm.selectedYear.year = parseInt(year);
            vm.getMonth(year,type);
          }

        /*
        functions to create or get or create Finance Details
        */ 


        function financeLogin(pass){
          if(!$rootScope.online){
            toastr.error("No Internet Connection");
            return false;
          }
          if(pass == undefined){
            toastr.error("Enter the password");
          }else{
            // var password = pass;
            var id =JSON.parse($window.localStorage.getItem('user'))["id"];
            financeService.financeLogin(id,pass).then(function(response){
              if(response.data.status == "success"){
                $window.sessionStorage.setItem('finance',response.data.message);
                $state.go("finance");
              }else{
               toastr.error(response.data.message);
                }
            });
          }
        }

        function totalRevenue(){
          $rootScope.practysLoader = true;
          financeService.getTotalRevenue(vm.clinicId).then(function(response){
            if(response.data.status == "success"){
              $rootScope.practysLoader = false;
              //console.log(response.data.message.expense);
              vm.expenseValue = response.data.message.expense;
              vm.invoiceValue = response.data.message.invoice;
            }else{
              console.log("server error");
            }
          });

        }

        //Month is 1 based
        function daysInMonth(month) {
            return new Date(vm.currentYear, month, 0).getDate();
        }
       

        function getDays(month,type,noOfDays){
          $rootScope.practysLoader = true;
          // alert(type);
          if(type == 'expense'){
                      // alert("year")
                         financeService.getDays(vm.clinicId,month).then(function(resp){
                          console.log(resp);
                          $rootScope.practysLoader = false;
                          vm.expenseMonthDatas = [];
                           vm.expenseMonthData = [];
                          if(resp.data.status == "success"){
                            vm.expenseDatas = resp.data.message.expense;
                            console.log(vm.expenseDatas);
                            // vm.invoiceDatas = response.data.message.invoice;
                          for(var i = 0 ; i < noOfDays ; i++){
                                                  vm.expenseMonthData.push("");
                                                  // vm.invoiceMonthData.push("");
                          }      
                          console.log(vm.expenseMonthData,"EMPTYYYYYYYYYYYYYY");  
                          vm.expenseTableReference = [];
                            angular.forEach(vm.expenseDatas, function(value, key) {
                                      vm.day = $filter('date')(value.expenseDate,'dd'); 
                                          vm.expenseMonthData[vm.day-1] = value.expenseDatas;
                                          vm.expenseTableReference.push({'month':vm.exDaysTable[vm.day-1],'datas':vm.expenseMonthData[vm.day-1]})

                                });
                            console.log(vm.expenseTableReference,"table datas filledddddddddd");

                            //   angular.forEach(vm.invoiceDatas, function(value, key) {
                            //         vm.invoiceMonthData[value.invoicemonth-1] = value.invoicedatas;
                                
                                 
                            // });
                           if(vm.expenseDatas != undefined){
                              vm.expenseMonthDatas.push(vm.expenseMonthData); 
                            }else{
                              vm.expenseMonthDatas = []
                            } 
                            // vm.invoiceMonthDatas.push(vm.invoiceMonthData); 
                            console.log(vm.expenseMonthDatas,'eeeeeeeeee');
                            // console.log(vm.invoiceMonthDatas,'iiiiiiii');
                          }else{
                            vm.expenseMonthDatas = [];
                            // vm.invoiceMonthDatas = [];
                            console.log(vm.expenseMonthDatas,'eeeeeeeeee');
                            // console.log(vm.invoiceMonthDatas,'iiiiiiii');
                          }
                        });
                    
          }else{
               financeService.getDays(vm.clinicId,month).then(function(resp){
                $rootScope.practysLoader = false;
                console.log(resp);
                vm.invoiceMonthDatas = [];
                vm.invoiceMonthData = [];
                // vm.invoiceMonthData = [];
                if(resp.data.status == "success"){
                  // vm.expenseDatas = response.data.message.expense;
                  vm.invoiceDatas = resp.data.message.invoice;
                for(var i = 0 ; i < noOfDays ; i++){
                                            vm.invoiceMonthData.push("");
                                            // vm.invoiceMonthData.push("");
                    }      
                    console.log(vm.invoiceMonthData);  
                vm.invoiceTableReference = [];
                angular.forEach(vm.invoiceDatas, function(value, key) {
                          vm.day = $filter('date')(value.invoiceDate,'dd'); 
                              vm.invoiceMonthData[vm.day-1] = value.invoiceDatas;
                              vm.invoiceTableReference.push({'month':vm.inDaysTable[vm.day-1],'datas':vm.invoiceMonthData[vm.day-1]})

                });
                  // vm.expenseMonthDatas.push(vm.expenseMonthData); 
                 if(vm.invoiceDatas != undefined){
                    vm.invoiceMonthDatas.push(vm.invoiceMonthData); 
                  }else{
                    vm.invoiceMonthDatas = []
                  }
                  // console.log(vm.expenseMonthDatas,'eeeeeeeeee');
                  console.log(vm.invoiceMonthDatas,'iiiiiiii');
                }else{
                  // vm.expenseMonthDatas = [];
                  vm.invoiceMonthDatas = [];
                  // console.log(vm.expenseMonthDatas,'eeeeeeeeee');
                  console.log(vm.invoiceMonthDatas,'iiiiiiii');
                }
              });
          
          }
          

        }

        function getMonth(year,type){
          $rootScope.practysLoader = true;
          // alert(type);
          if(type == 'expense'){
                        if(year == null){
                          vm.expenseYear = moment().format('YYYY');
                          // alert("year null")
                        financeService.getMonth(vm.clinicId,null).then(function(response){
                          $rootScope.practysLoader = false;
                          console.log(response);
                          vm.expenseYearDatas = [];
                          vm.expenseYearData = [];
                          if(response.data.status == "success"){
                            vm.expenseDatas = response.data.message.expense;
                            
                          for(var i = 0 ; i < 12 ; i++){
                                                  vm.expenseYearData.push("");
                                                  // vm.invoiceMonthData.push("");
                          } 
                          vm.expenseYearTableReference = [];            
                            angular.forEach(vm.expenseDatas, function(value, key) {

                                          vm.expenseYearData[value.expensemonth-1] = value.expensedatas;
                                          vm.expenseYearTableReference.push({'year':$scope.expenseMonthlabel[value.expensemonth-1],'datas':vm.expenseYearData[value.expensemonth-1]});

                                });

                            //   angular.forEach(vm.invoiceDatas, function(value, key) {
                            //         vm.invoiceMonthData[value.invoicemonth-1] = value.invoicedatas;
                                
                                 
                            // });
                            if(vm.expenseDatas != undefined){
                              vm.expenseYearDatas.push(vm.expenseYearData); 
                            }else{
                              vm.expenseYearDatas = []
                            }  
                            // vm.invoiceMonthDatas.push(vm.invoiceMonthData); 
                            /*console.log(vm.expenseMonthDatas,'eeeeeeeeee');*/
                            // console.log(vm.invoiceMonthDatas,'iiiiiiii');
                          
                          }else{
                            vm.expenseYearDatas = [];
                            // vm.invoiceMonthDatas = [];
                            console.log(vm.expenseYearDatas,'eeeeeeeeee');
                            // console.log(vm.invoiceMonthDatas,'iiiiiiii');
                            // console.log("server error");
                          }
                        });
                    }else{
                      $rootScope.practysLoader =  true;
                      vm.expenseYear = year;
                      // alert("year")
                         financeService.getMonth(vm.clinicId,year).then(function(response){
                          console.log(response);
                          $rootScope.practysLoader = false;
                          vm.expenseYearDatas = [];
                           vm.expenseYearData = [];
                          if(response.data.status == "success"){
                            vm.expenseDatas = response.data.message.expense;
                            console.log(vm.expenseDatas);
                            // vm.invoiceDatas = response.data.message.invoice;
                          for(var i = 0 ; i < 12 ; i++){
                                                  vm.expenseYearData.push("");
                                                  // vm.invoiceMonthData.push("");
                          }      
                          console.log(vm.expenseYearData);   
                               vm.expenseYearTableReference = [];
                            angular.forEach(vm.expenseDatas, function(value, key) {

                                          vm.expenseYearData[value.expensemonth-1] = value.expensedatas;
                                           vm.expenseYearTableReference.push({'year':$scope.expenseMonthlabel[value.expensemonth-1],'datas':vm.expenseYearData[value.expensemonth-1]});

                                });
                            console.log(vm.expenseYearData);

                            //   angular.forEach(vm.invoiceDatas, function(value, key) {
                            //         vm.invoiceMonthData[value.invoicemonth-1] = value.invoicedatas;
                                
                                 
                            // });
                           if(vm.expenseDatas != undefined){
                              vm.expenseYearDatas.push(vm.expenseYearData); 
                            }else{
                              vm.expenseYearDatas = []
                            } 
                            // vm.invoiceMonthDatas.push(vm.invoiceMonthData); 
                            console.log(vm.expenseYearDatas,'eeeeeeeeee');
                            // console.log(vm.invoiceMonthDatas,'iiiiiiii');
                          }else{
                            vm.expenseYearDatas = [];
                            // vm.invoiceMonthDatas = [];
                            console.log(vm.expenseYearDatas,'eeeeeeeeee');
                            // console.log(vm.invoiceMonthDatas,'iiiiiiii');
                          }
                        });
                    }
          }else{
            if(year == null){
              vm.invoiceYear = moment().format('YYYY');
              financeService.getMonth(vm.clinicId,null).then(function(response){
                console.log(response);
                $rootScope.practysLoader = false;
                vm.invoiceYearData = [];
                if(response.data.status == "success"){
                  // vm.expenseDatas = response.data.message.expense;
                  vm.invoiceDatas = response.data.message.invoice;
                  // console.log(vm.expenseDatas);
                  console.log(vm.invoiceDatas);
                  // return false;
                for(var i = 0 ; i < 12 ; i++){
                                        // vm.expenseMonthData.push("");
                                        vm.invoiceYearData.push("");
                }             
                  // angular.forEach(vm.expenseDatas, function(value, key) {

                  //               vm.expenseMonthData[value.expensemonth-1] = value.expensedatas;
                            

                  //     });
                  vm.invoiceYearTableReference = [];
                    angular.forEach(vm.invoiceDatas, function(value, key) {
                          vm.invoiceYearData[value.invoicemonth-1] = value.invoicedatas;
                          vm.invoiceYearTableReference.push({'year':$scope.expenseMonthlabel[value.invoicemonth-1],'datas':vm.invoiceYearData[value.invoicemonth-1]});
                       
                  });
                    vm.invoiceYearDatas = [];
                  // vm.expenseMonthDatas.push(vm.expenseMonthData);
                  if(vm.invoiceDatas != undefined){
                    vm.invoiceYearDatas.push(vm.invoiceYearData); 
                  }else{
                    vm.invoiceYearDatas = []
                  }
                  
                  // console.log(vm.expenseMonthDatas,'eeeeeeeeee');
                  console.log(vm.invoiceYearDatas,'iiiiiiii');
                
                }else{
                  // vm.expenseMonthDatas = [];
                  vm.invoiceYearDatas = [];
                  // console.log(vm.expenseMonthDatas,'eeeeeeeeee');
                  console.log(vm.invoiceYearDatas,'iiiiiiii');
                  // console.log("server error");
                }
              });
          }else{
            vm.invoiceYear = year;
               financeService.getMonth(vm.clinicId,year).then(function(response){
                $rootScope.practysLoader = false;
                console.log(response);
                vm.invoiceYearDatas = [];
                vm.invoiceYearData = [];
                // vm.invoiceMonthData = [];
                if(response.data.status == "success"){
                  // vm.expenseDatas = response.data.message.expense;
                  vm.invoiceDatas = response.data.message.invoice;
                   console.log(vm.invoiceDatas);
                for(var i = 0 ; i < 12 ; i++){
                                        // vm.expenseMonthData.push("");
                                        vm.invoiceYearData.push("");
                }             
                  // angular.forEach(vm.expenseDatas, function(value, key) {

                  //               vm.expenseMonthData[value.expensemonth-1] = value.expensedatas;
                            

                  //     });
                  vm.invoiceYearTableReference = []
                    angular.forEach(vm.invoiceDatas, function(value, key) {
                          vm.invoiceYearData[value.invoicemonth-1] = value.invoicedatas;
                           vm.invoiceYearTableReference.push({'year':$scope.expenseMonthlabel[value.invoicemonth-1],'datas':vm.invoiceYearData[value.invoicemonth-1]});
                       
                  });
                  // vm.expenseMonthDatas.push(vm.expenseMonthData); 
                 if(vm.invoiceDatas != undefined){
                    vm.invoiceYearDatas.push(vm.invoiceYearData); 
                  }else{
                    vm.invoiceYearDatas = []
                  }
                  // console.log(vm.expenseMonthDatas,'eeeeeeeeee');
                  console.log(vm.invoiceYearDatas,'iiiiiiii');
                }else{
                  // vm.expenseMonthDatas = [];
                  vm.invoiceYearDatas = [];
                  // console.log(vm.expenseMonthDatas,'eeeeeeeeee');
                  console.log(vm.invoiceYearDatas,'iiiiiiii');
                }
              });
          }
          }
          

        }

        // function getYear(){
        //   vm.financeLoader = true;
        //   // debugger;
        //   $scope.expenseYearData = [];
        //   $scope.invoiceYearData = [];
          
        //   financeService.getYear(vm.clinicId).then(function(response){
        //     if(response.data.status == "success"){
        //       vm.financeLoader = false;
        //     vm.expenseDatas = response.data.message.expense;
        //     vm.invoiceDatas = response.data.message.invoice;

        //     // angular.forEach(vm.expenseDatas, function(value, key) {
        //     //                 $scope.expenseYearData.push(value.expensedatas);
                        

        //     //       });
        //     // $scope.expenseYearData = [];
        //      for(var i=0 ;i < $scope.expenseYearLabel.length ;i++){
        //           for(var j = 0 ;j < vm.expenseDatas.length ;j++){
        //            if($scope.expenseYearLabel[i] == vm.expenseDatas[j].expenseyear){
        //                  $scope.expenseYearData.push(vm.expenseDatas[j].expensedatas);
        //                  break;
        //                }else if(j == vm.expenseDatas.length-1){
        //                   $scope.expenseYearData.push(0);
        //                   // break;
        //                }
        //          }
        //      }
        //      // console.log($scope.expenseYearData);
        //      // console.log($scope.expenseYearLabel);
        //      // angular.forEach($scope.invoiceYearLabel, function(values, keys) {
        //      //  console.log(values,'frst');
        //      //  var  temp =true;
        //      //        angular.forEach(vm.invoiceDatas, function(value, key) {
        //      //          console.log(value,'sec');
        //      //            if(values == value.invoiceyear){
        //      //              console.log(value.invoicedatas,'selected');
        //      //             $scope.invoiceYearData.push(value.invoicedatas);
        //      //             console.log($scope.invoiceYearData);
        //      //            temp =false;
        //      //           }else if(key == vm.invoiceDatas.length-1){
        //      //            console.log(value.invoicedatas.length,'length');
        //      //              $scope.invoiceYearData.push(0);
        //      //               temp =false;
        //      //           }
                       
                  
        //      //       });
        //      //  });
        //      $scope.invoiceYearData = [];
        //      for(var i=0 ;i < $scope.invoiceYearLabel.length ;i++){
        //           for(var j = 0 ;j < vm.invoiceDatas.length ;j++){
        //            if($scope.invoiceYearLabel[i] == vm.invoiceDatas[j].invoiceyear){
        //                  $scope.invoiceYearData.push(vm.invoiceDatas[j].invoicedatas);
        //                  break;
        //                }else if(j == vm.invoiceDatas.length-1){
        //                   $scope.invoiceYearData.push(0);
        //                   // break;
        //                }
        //          }
        //      }
        //      // console.log($scope.invoiceYearData);
        //      // console.log($scope.invoiceYearLabel);
        //      // console.log($scope.invoiceYearData);
        //      // console.log($scope.invoiceYearLabel);
        //       // $scope.expenseYearLabel.push($scope.prevYear);
        //       // $scope.invoiceYearLabel.push($scope.prevYear);
        //    $scope.expenseYearDatas.push($scope.expenseYearData);
        //    $scope.invoiceYearDatas.push($scope.invoiceYearData);
        //     }else{
        //       console.log("server error");
        //     }
        //   });
          
        // }


      function init(){
         if($window.sessionStorage.getItem('finance') == undefined){
         }else{
           //getting current year and month
        var d = new Date();
        vm.currentYear = d.getFullYear();
        vm.currentMonth = moment().format('M');
        vm.searchByMonth(vm.currentMonth,'expense','init');
        vm.searchByMonth(vm.currentMonth,'invoice','init');
        // console.log(noOfDays); 
        // console.log(vm.daysPushh,'arraypushhhhhhhhhhh');
                  vm.totalRevenue();
                  vm.getMonth(null,'expense');
                  vm.getMonth(null,'invoice');
          }
      }


      vm.init();
      

    }

})();