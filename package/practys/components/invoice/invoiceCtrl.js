/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   invoiceCtrl
 *
 *  Description :   invoice
 *
 *  Developer   :   Nishanth
 *
 *  Date        :   19/09/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

(function() {
    'use strict';

    angular
        .module('practysApp').controller('invoiceController', invoiceController);

    invoiceController.$inject = ['$rootScope', '$scope', '$SQLite', '$timeout', 'Auth', 'utilService', '$location', 'invoiceService',
    'invoiceOfflineService','toastr', '$state', '$window', 'ngDialog','$stateParams','appointmentService'];

    function invoiceController($rootScope, $scope, $SQLite, $timeout, Auth, utilService, $location, invoiceService,invoiceOfflineService,toastr, $state, $window, ngDialog,$stateParams,appointmentService) {
        if (!Auth.isLoggedIn()) {
            $location.path('/login');
            return false;
        }
        /*
            It connectes the book appoitnment controller, after booking appointment by ryt clicking the particular Time slot , returning to get particular appointment on calender.
        */
        // $scope.$on('someEve', function(event, data) { console.log(data,"invoice controller"); });

        $rootScope.$on("checkInvoice", function (event, args) {
          console.log(args);
        });

   





        //Inject Services for DI
        //$scope is standard service provided by framework
        //If we want to use standard $Filter, It also needs to be injected
        //filteredService - custom created by me
        // TableCtrl.$inject = ['$scope', '$filter','filteredListService'];

        $scope.searchUtil = function(item, toSearch) {
            /* Search Text in all 3 fields */
            return (item.name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Email.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.EmpId == toSearch) ? true : false;
        }


        /*
          Finalization of print option
        */
        $scope.printToCart = function(printSectionId) {
          	var printContents = document.getElementById(printSectionId).innerHTML;
     	    window.print();
        }

        $scope.cancel = function() {
            ngDialog.close();
            vm.drugSuggest = [{drugName: '', qty: '' , note:''}];
            vm.productSuggest = [{productName: '', qty: '',usage:'' }];
            vm.billingItem = [{billingItem:'',amount:''}];
            vm.drugShow = false;
            vm.otherShow = false;
        }

        $scope.keyup = function(vals) {
            console.log(vals,'vvvvv')
            vm.totalItems = vals.length;
        }




        /*
        Declaration Part
        */


        $scope.currentPage = 1;
        $scope.maxSize = 10;

        var vm = this;
        vm.invoiceDatas = [];
        vm.invoice = {};
        vm.change = change;
        vm.check =check;
        vm.unpaid = unpaid;
        vm.discount = discount;
        vm.editInvoice = editInvoice;
        vm.printInvoice = printInvoice;
        vm.printTabLoad = printTabLoad;


        vm.editSpecificInvoice = editSpecificInvoice;
        vm.calculateTaxDiscount = calculateTaxDiscount;
        vm.updateSpecificInvoice = updateSpecificInvoice;
        vm.balanceDeductionCalculate = balanceDeductionCalculate;
        vm.addAmounts = addAmounts;
        vm.printShow = printShow;
        vm.taxCal = taxCal;




        // vm.viewInvoice = viewInvoice;
        vm.updateInvoice = updateInvoice;
        vm.searchFilter = searchFilter;
        vm.getInvoice = getInvoice;
        vm.saveServiceCashChange = saveServiceCashChange;
        vm.balanceDeduction = balanceDeduction;
        vm.payPopup = payPopup;
        vm.init = init;
        vm.print = print;
        vm.subTotalCalculation = subTotalCalculation;
        vm.installmentPayment = installmentPayment;
        vm.previousAppPaymentCal = previousAppPaymentCal;
        // vm.popover = popover;
        vm.getInventoryProduct = getInventoryProduct;
        vm.addPop = addPop;
        vm.editPop = editPop;

        vm.addDrugsRow = addDrugsRow;  // selecting drugs list
        vm.delDrugsRow = delDrugsRow; // removing drugs list
        vm.delProdRow =  delProdRow; // selecting product list
        vm.addProdRow = addProdRow; //selecting product list
        vm.addBillingList = addBillingList;//selecting billing list
        vm.removingBillingList = removingBillingList;//removing billing list
        vm.createInvoice = createInvoice; // creating invoice
        vm.addInvoiceCalc = addInvoiceCalc;
        vm.changeSpecificInvoice = changeSpecificInvoice;
        vm.subDummy = subDummy;
        vm.balancepayment = balancepayment;
        vm.deleteInvoice = deleteInvoice;

        vm.format = "yyyy-MM-dd";
        vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];
        vm.clinicDetails = JSON.parse($window.localStorage.getItem('user'));
        $scope.doctors = [];
        vm.resetEnable = true;
        $scope.tableView = false;
        $scope.printView = false;
        $scope.costCollector = [];
        $scope.date = new Date();
        vm.sendDetails   = {};

        vm.drugs = []; //  getDrugsItem
        vm.others = [];// other products

        vm.drugSuggest = [{drugName: '', qty: '' , note:''}];
        vm.productSuggest = [{productName: '', qty: '',usage:'' }];
        vm.billingItem = [{billingItem:'',amount:''}];

        vm.drugShow = false;//check for drugs selected
        vm.otherShow = false;//check for other product  selected

        $scope.additionalElementsArray = [{ name: '', amount: '',productPaymentStatus: 'false'}];
        $scope.reverse = false;
        $scope.additElements = [];
        $scope.invoiceEdited = false;
        // $scope.additionalInTable = [];


        $scope.sort = function(keyname) {
        	console.log($scope.reverse);
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
        }

        $scope.addRow = function(){
            $scope.additionalElementsArray.push({ name: '', amount: '',productPaymentStatus:'false'});
        }
        $scope.delRow = function(index) {
            $scope.additionalElementsArray.splice(index, 1);
        }

        $scope.dateFormat = function(date){
        	alert(date);
        	console.log(date);
        	console.log(new Date(date));
        	return moment(new Date(date)).format("MMM Do, YYYY");
      	}

        function addAmounts(pendingAmount,appointmentBalanceAmount){
        	//alert(pendingAmount+ ''+ appointmentBalanceAmount);
        	// alert("success");
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
	          return total;
        	}

        }



        /*
          PDF Generation
        */
        $scope.createPDF = function(id) {
            $scope.invoicePdfLoader = true;
            html2canvas(document.getElementById(id), {
                onrendered: function(canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,

                              }]
                    };
                    console.log(docDefinition);
                    $scope.invoicePdfLoader = false;
                    // alert("download");
                    vm.getInvoice();
                    vm.check();
                    console.log(docDefinition);
                    pdfMake.createPdf(docDefinition).download("Invoice.pdf");

                }
            });
        };
        function check(){
        	$scope.tableView = false;
        				$scope.printView = false;
        }


        /*
        Date Picker Functionalities
        */

        $scope.openDatePickers = [];

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

        $scope.openDatePicker = [];
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

        if ($rootScope.online) {
            utilService.getUsers(vm.clinicId).then(function(resp) {
                if (resp.data.status == 'success') {
                    vm.patients = resp.data.message;
                }
            });
        } else if ($rootScope.userLevel == 'clinic') {
            vm.patients = [];
            $SQLite.ready(function() {
                this.select('SELECT * FROM practysapp_specialityUserMaps INNER JOIN practysapp_users ON practysapp_specialityUserMaps.userId = practysapp_users.id WHERE practysapp_specialityUserMaps.clinicId = ? AND practysapp_users.user_level = ?', [vm.clinicId, 'patient']).then(function() {
                    console.log("empty result");
                    toastr.error("No Data Found");
                }, function() {
                    console.log("error");
                }, function(data) {
                    vm.patients.push(data.item);
                });
            });
        }


        function previousAppPaymentCal(cost,type){
        	if(type){
        		$scope.costCollector.push(parseInt(cost));

        		// console.log(costCollector);
        		console.log(arraySum);
        	}else{
        		var index = $scope.costCollector.indexOf(cost);
        		$scope.costCollector.splice(index,1);
        		// console.log(costCollector);
        	}
        	var arraySum = $scope.costCollector.reduce(function(acc, val) {
                      return acc + val;
                    },0);

        	if($scope.invoice.currentAppStatus){
        		if(type){
        			$scope.invoice.balanceAmount = $scope.invoice.balanceAmount - arraySum;

        		}else{
        			$scope.invoice.balanceAmount = $scope.invoice.balanceAmount + parseInt(cost);
        			// $scope.invoice.pendingAmount = $scope.invoice.balanceAmount;
        		}
        		$scope.invoice.remainingBalance = $scope.invoice.balanceAmount;
        		$scope.invoice.payment = 0;

        	}else{
        		var remainAmount = $scope.invoice.subTotal - arraySum;
				var tax     =   ($scope.invoice.tax != '' && $scope.invoice.tax != undefined) ? parseFloat(remainAmount * ($scope.invoice.tax/100)) : 0;
				$scope.invoice.amount = $scope.invoice.subTotal + tax;
				$scope.invoice.remainingBalance = $scope.invoice.subTotal + tax;
				$scope.invoice.payment = $scope.invoice.subTotal + tax;
				// if($scope.costCollector == ''){
					$scope.invoice.balanceAmount = ($scope.invoice.appointmentBalanceAmount + $scope.invoice.amount).toFixed(2);
				// }else{
					// $scope.invoice.balanceAmount = $scope.invoice.appointmentBalanceAmount;
				// }
        	}


        }

        /*
        	PaymentPopup
        */

        function payPopup(obj,form){
        	console.log(obj);
        		$scope.obj = obj;
        		ngDialog.open({
	                template: 'payPopup',
	                controller: 'invoiceController',
	                scope: $scope

            	});

        }
        


        function discount(obj,type) {

            vm.change('edit', obj);
            return false;

            console.log("not happend");
            // return false;
            $scope.invoice.remainingBalance = "";
            $scope.invoice.payment = "";
           if(obj.discount == undefined && (obj.tax == undefined ||obj.tax == null)){
           		$scope.disDiscountAmount = undefined;
           		$scope.taxDiscountAmount = undefined;
           		$scope.invoice.discountAmount = obj.pendingAmount;
           		$scope.invoice.remainingBalance = obj.pendingAmount;
           }
           if(type == 'discount'){
           		if(obj.discount != undefined){
	           		if($scope.taxDiscountAmount != undefined){
	           			$scope.discountedAmount = $scope.taxDiscountAmount * (obj.discount / 100);
	           			$scope.disDiscountAmount = Math.round($scope.taxDiscountAmount - $scope.discountedAmount);
	           		}else{
	           			$scope.discountedAmount = obj.amount * (obj.discount / 100);
	           			$scope.disDiscountAmount = Math.round(obj.amount - $scope.discountedAmount);
	           		}


                // $scope.invoice.remainingBalance = Math.round($scope.invoice.discountAmount);
           		}
           }

           if(type == 'tax'){
	            if(obj.tax != undefined){
	           		if($scope.disDiscountAmount != undefined){
	           			$scope.discountedAmount = $scope.disDiscountAmount * (obj.tax / 100);
	           			$scope.taxDiscountAmount = Math.round(JSON.parse($scope.disDiscountAmount) + JSON.parse($scope.discountedAmount));
	           		}else{
	           			$scope.discountedAmount = obj.amount * (obj.tax / 100);
	           			$scope.taxDiscountAmount = Math.round(JSON.parse(obj.amount) + JSON.parse($scope.discountedAmount));
	           		}


	           }
	       }
           // console.log($scope.taxDiscountAmount,"tax Discount");
           // console.log($scope.disDiscountAmount,"dis discount");
           // return false;
           if(type == "tax"){
           	$scope.invoice.discountAmount = $scope.taxDiscountAmount;
           }else{
           	$scope.invoice.discountAmount = $scope.disDiscountAmount;
           }

           $scope.invoice.remainingBalance = $scope.invoice.discountAmount;
           // if(paymentType == "installment"){
            //     // alert("installment");
            //     if(type == 'discount'){
            //         // alert("discount");
            //         $scope.discountedAmount = obj.amount * (obj.discount / 100);
            //         $scope.invoice.discountAmount = obj.amount - $scope.discountedAmount;
            //         $scope.invoice.remainingBalance = $scope.invoice.discountAmount;
            //     }else{
            //         // alert("tax");
            //         $scope.discountedAmount = obj.amount * (obj.tax / 100);
            //         $scope.invoice.discountAmount = JSON.parse(obj.amount) + JSON.parse($scope.discountedAmount);
            //         $scope.invoice.remainingBalance = $scope.invoice.discountAmount;
            //     }

            // }else{
            //     // alert("unpaid");
            //      $scope.discountedAmount = obj.amount * (obj.discount / 100);
            //     $scope.invoice.discountAmount = obj.amount - $scope.discountedAmount;
            // }
            console.log($scope.invoice.discountAmount, "disscc amount");
        }

        function installmentPayment(obj){
        	console.log(obj.payment);
        	if(obj.payment != undefined){
        		$scope.invoice.remainingBalance = obj.balanceAmount - obj.payment;
        		$scope.invoice.balanceAmount = parseInt(obj.pendingAmount) - parseInt(obj.payment);
        	}else{
        		$scope.invoice.balanceAmount = parseInt(obj.pendingAmount) - 0;
        	}

        }

        /*
          function to get remaining balance for installment flow
        */

        function change(type, obj) {
            console.log(obj);
            // alert("success");
            if (type == 'add') {
                vm.invoice.remainingBalance = obj.amount - obj.payment;

            }

            console.log("type" , type);
            console.log("obj" , obj);

            console.log("dfasdfsdf");

            if (type == 'edit') {
              //   if (obj.discount != undefined && obj.discount != 0) {
              //       $scope.invoice.remainingBalance = obj.discountAmount - obj.payment;
              //   }
              //   else {
              //   	// alert("else");
            		// console.log($scope.invoice.dummyRemaining);
            		// console.log($scope.invoice.pendingAmount);
              //   	console.log($scope.invoice.remainingBalance);
              //   	console.log(obj.payment);
              //   	if($scope.invoice.dummyRemaining != undefined){
              //   		// alert("if");
              //   		 $scope.invoice.remainingBalance = $scope.invoice.dummyRemaining - JSON.parse(obj.payment);
            		// }else{
            		// 	// alert("success");
            		// 	 $scope.invoice.remainingBalance = $scope.invoice.pendingAmount - JSON.parse(obj.payment);
            		// }

              //   }
              // if(invoice.previousAppPaymentCheck){
              // 	console.log($scope.invoice.serviceDetails);
              // 	console.log($scope.invoice.prescriptionDetails);
              // 	console.log($scope.additionalInTable);
              // }else{
              	 console.log("installment begin");

              console.log(obj);
              console.log($scope.invoice);
              if(obj.previousAppPaymentCheck){
              	var arraySum = $scope.costCollector.reduce(function(acc, val) {
                      return acc + val;
                    },0);
	    		var remainAmount = $scope.invoice.subTotal - arraySum;
				var tax     =   ($scope.invoice.tax != '' && $scope.invoice.tax != undefined) ? parseFloat(remainAmount * ($scope.invoice.tax/100)) : 0;
				$scope.invoice.amount = $scope.invoice.subTotal + tax;
				$scope.invoice.balanceAmount = (parseInt($scope.invoice.appointmentBalanceAmount) + parseInt($scope.invoice.amount)).toFixed(2);
				return false;
              }

                var amt =   parseFloat(obj.subTotal);

                var discount     =   (obj.discount != undefined && obj.discount != '') ? parseFloat(amt * (obj.discount/100)) : 0;

                var tax     =   (obj.tax != '' && obj.tax != undefined) ? parseFloat(amt * (obj.tax/100)) : 0;

                var payment     =   (obj.payment != '' && obj.payment != undefined) ? parseFloat(obj.payment) : 0;

                var total = (amt  - discount - payment + tax).toFixed(2);
                var amountTotal = (amt  - discount + tax).toFixed(2);
                $scope.invoice.remainingBalance =   total;

                if(obj.installments && ($scope.invoice.previousAppointmentBalanceAmount == 0 || $scope.invoice.previousAppointmentBalanceAmount == null)){
                	// alert("reduce");
                	$scope.invoice.amount = amountTotal;
                	$scope.invoice.balanceAmount = total;
                	return false;
                }
                if(!obj.installments && !obj.previousAppPaymentCheck){
                	// alert("reduce");
                	$scope.invoice.amount = amountTotal;
                	$scope.invoice.balanceAmount = total;
                	return false;
                }
                // else{
                // 	alert("default");
                // 	$scope.invoice.balanceAmount = total;
                // 	return false;
                // }

                // if(obj.installments && ($scope.invoice.previousAppointmentBalanceAmount == 0 || $scope.invoice.previousAppointmentBalanceAmount == null)){

                // }
                if(payment == 0){
                    $scope.invoice.amount =   total;
                }
                $scope.invoice.balanceAmount = parseInt($scope.invoice.remainingBalance) + parseInt($scope.invoice.previousAppointmentBalanceAmount);

                console.log($scope.invoice.remainingBalance);
              // }



            }
        }

        /*
           Print Confirmation popup
        */
        function print(obj) {
            console.log(obj);
            $scope.tableView = true;
            $scope.printView = true;
            // vm.printView = true;
            $rootScope.inventoryPopup = true;
            // return false;
            // if(!$rootScope.online){
            obj.clinic = JSON.parse(utilService.getItem("user"));
            // }
            $scope.obj = obj;
            if(obj.serviceList !=undefined){
                vm.serviceList = JSON.parse(obj.serviceList);
            }
            if(obj.Appointment != undefined){
                 vm.prescriptionList = JSON.parse(obj.Appointment.prescription);
            }

            if(obj.manualInvoiceItems){
               vm.prescriptionList = JSON.parse(obj.manualInvoiceItems);
            }
            if(obj.additionalItems != undefined){
                vm.additionalItemList = JSON.parse(obj.additionalItems);
            }

            $scope.obj.paidDate = moment(new Date($scope.obj.modified)).format('ll');
             console.log($scope.obj);

        }

        /*
          Add Invoice popup
       */

        function addPop() {
            $rootScope.inventoryPopup = false;
            // var id = JSON.parse($window.localStorage.getItem('user'))["id"];
            if ($rootScope.online) {
                $scope.patients = [];
                $scope.doctors = [];
                vm.invoice = "";
                utilService.getUsers(vm.clinicId).then(function(resp) {
                    if (resp.data.status == 'success') {
                        $scope.patients = resp.data.message;
                    }
                });
                utilService.getDoctors(null, vm.clinicId).then(function(resp) {
                    if (resp.data.status == 'success') {
                        $scope.doctors = resp.data.message;
                    }
                });
            } else if ($rootScope.userLevel == 'clinic') {
                $scope.patients = [];
                $scope.doctors = [];
                vm.invoice = "";
                vm.data = [];
                $SQLite.ready(function() {
                    this.select('SELECT * FROM practysapp_specialityUserMaps INNER JOIN practysapp_users ON practysapp_specialityUserMaps.userId = practysapp_users.id WHERE practysapp_specialityUserMaps.clinicId = ? AND practysapp_users.user_level = ?', [vm.clinicId, 'patient']).then(function() {
                        console.log("empty result");
                        toastr.error("No Data Found");
                    }, function() {
                        console.log("error");
                    }, function(data) {
                        $scope.patients.push(data.item);
                    });
                });

                $SQLite.ready(function() {
                    this.select('SELECT * FROM practysapp_specialityUserMaps WHERE practysapp_specialityUserMaps.clinicId = ?  AND practysapp_specialityUserMaps.specialityId != ? GROUP BY practysapp_specialityUserMaps.userId', [vm.clinicId, 0]).then(function() {
                        console.log("empty result");
                    }, function() {
                        console.log("error");
                    }, function(data) {
                        vm.data.push(data.item);
                    });
                });
                $timeout(function() {
                    angular.forEach(vm.data, function(value, key) {
                        utilService.getUserDetails(value.userId).then(function(response) {
                            $scope.doctors.push(response);
                        });
                    });
                }, 2000);
            }


            $rootScope.popup = false;
            // $rootScope.popup = true;
            ngDialog.open({
                template: 'firstDialogId',
                scope: $scope,
                // className:'ngdialog-theme-default'

            });
        }


        /* Sheema */
        $scope.specificCost = 0 ;
        $scope.minusAmount ;

        function balanceDeductionCalculate(cost,checkStatus,type,index){


        	 if(checkStatus    === true)
        	 {
        	 	$scope.specificCost = parseFloat($scope.specificCost) + parseFloat(cost);
        	 }
        	 else if(checkStatus === false)
        	 {
        	 	$scope.specificCost = ($scope.specificCost != 0)?(parseFloat($scope.specificCost) - parseFloat(cost)):parseFloat(cost);


        	 }
        	 console.log($scope.specificCost);


        	  var prevAmountBalance = $scope.invoice.appointmentBalanceAmount;

		      var minusAmount =  parseFloat($scope.invoice.defaultPreviousAppBalanceAmount) -  parseFloat($scope.specificCost);




        	 if(minusAmount < 0){

        	 	// alert(index);
        	 	if(type == 'service'){
        				$scope.invoice.checkService[index] = false;
    			}else if(type == 'product'){
    				$scope.invoice.checkProduct[index] = false;
    			}else if(type == 'additional'){
    				$scope.invoice.checkAdditionalStatus[index] = false;
    			}

        	 	// $scope.invoice.checkService[index] = false;

        	 	$scope.specificCost = parseFloat($scope.specificCost) - parseFloat(cost);

        	 	$scope.enoughBalance = parseFloat($scope.invoice.subTotal) - parseFloat($scope.specificCost);

        	 	$scope.minusAmount =  parseFloat(prevAmountBalance) -  parseFloat($scope.specificCost);



        	 	toastr.error("Total is High Please Add Additional Elements");
        	 	vm.calculateTaxDiscount($scope.invoice);
        	 	return false;

        	 }else{
        	 	$scope.minusAmount = minusAmount;
        	 	$scope.enoughBalance   = parseFloat($scope.invoice.subTotal) - parseFloat($scope.specificCost);
                // if(!$scope.enoughBalance)
                // {

                // 	// alert(index);
                //     if(type == 'service'){
                //         $scope.invoice.checkService[index] = false;
                //     }else if(type == 'product'){
                //         $scope.invoice.checkProduct[index] = false;
                //     }else if(type == 'additional'){
                //         $scope.invoice.checkAdditionalStatus[index] = false;
                //     }
                //     // $scope.specificCost = 0;
                //     // toastr.error("Please Check Boxes in List To Continue or You Checked all Boxes");
                //     // $scope.invoice.tax = '';
                //     // $scope.invoice.discount = '';
                //     // return false;
                // }
        	 	vm.calculateTaxDiscount($scope.invoice);
        	 }

    	  	if(checkStatus === true){
	      	  	$scope.invoice.appointmentBalanceAmount =  parseFloat($scope.invoice.defaultPreviousAppBalanceAmount) -  parseFloat($scope.specificCost);
	      	}else if(checkStatus === false){
	      		$scope.invoice.appointmentBalanceAmount =  parseFloat($scope.invoice.defaultPreviousAppBalanceAmount) -  parseFloat($scope.specificCost);
	      	}



        	 if($scope.invoice.previousAppPaymentCheck  &&  $scope.invoice.currentAppStatus  === true){
        	 	    $scope.invoice.amount     = parseFloat($scope.invoice.subTotal) - parseFloat($scope.enoughBalance);
            	    $scope.invoice.payment    = parseFloat($scope.invoice.subTotal) - parseFloat($scope.enoughBalance);
            	    $scope.invoice.balanceAmount = $scope.minusAmount;
            	    $scope.invoice.tax = 0;
            	    $scope.invoice.discount = 0;


        	 }



        }
        $scope.dateFormat = function(createdDate){

          return moment(new Date(createdDate)).format("YYYY-MM-DD");

        }
        function printShow(id)
        {
         	$rootScope.practysloader = true;
            invoiceService.editInvoice(id,'list').then(function(resp) {
              console.log(resp.data.message);
              //vm.print(resp.data.message);



               $rootScope.inventoryPopup = true;
                // return false;
                $scope.obj = resp.data.message;
                $scope.obj.Clinic = JSON.parse(utilService.getItem("user"));
	               if($scope.obj.Invoice.serviceList != null && $scope.obj.Invoice.serviceList != ''){
	                	vm.serviceList = JSON.parse($scope.obj.Invoice.serviceList);
	                }else{
	              		vm.serviceList = '';
	              	}
	              	if($scope.obj.Appointment){
	              		 vm.prescriptionList = JSON.parse($scope.obj.Appointment.prescription);
	              	}
                  if($scope.obj.Invoice.manualInvoiceItems){
                     vm.prescriptionList = JSON.parse($scope.obj.Invoice.manualInvoiceItems);
                  }
	              	if($scope.obj.Invoice.additionalItems != null && $scope.obj.Invoice.additionalItems != ''){
	              		vm.additionalItemList = JSON.parse($scope.obj.Invoice.additionalItems);
	              	}else{
	              		vm.additionalItemList = '';
	              	}
                console.log(vm.serviceList);
                console.log(vm.prescriptionList);
                console.log(vm.additionalItemList);
                 $scope.obj.Invoice.paidDate = moment(new Date($scope.obj.Invoice.modified)).format('ll');

               // $scope.obj.Invoice.currentBalance = parseFloat($scope.obj.Invoice.pendingAmount)+parseFloat($scope.obj.Invoice.appointmentBalanceAmount);
                //alert($scope.obj.Invoice.currentBalance );

               $scope.tableView = true;
               $scope.printView = true;
               $rootScope.practysloader = false;

            });

        }

        function changeSpecificInvoice(invoice,invoiceForm){
        	// var paymentStat =  invoice.paymentStatus;
        	$rootScope.practysLoader = true;
            invoice.paymentStatus = 'unpaid';
            invoice.currentAppStatus = 0;
            invoice.billStatus = 0;
            // invoice.payment = 0;
            // invoice.amount = invoice.pendingAmount;
            invoice.paymentType = null;
            var subTotal = parseInt(invoice.subTotal);
            // var defSubtotal = parseInt(invoice.defaultAmountForBalanceInPaid);
            // if(paymentStat == 'paid' && (invoice.appointmentBalanceAmount == 0 || invoice.appointmentBalanceAmount == null)){
			invoice.sketchData = subTotal;
			invoice.pendingAmount = subTotal;
			invoice.amount = subTotal;
			invoice.payment = 0;
			invoice.tax = 0;
			invoice.discount = 0;
			invoice.total = 0;
            // }
            // invoice.tax = 0;
            // invoice.discount = 0;
            if(vm.additionalDatass != ""){
                invoice.additionalElements = vm.additionalDatass;
            }
            if(invoice.manualInvoiceItems){
                invoice.manualInvoiceItems = invoice.prescriptionDetails;
            }
            invoice.invoiceDate = moment(new Date(invoice.invoiceDate)).format("YYYY-MM-DD");
            var invoiceId = invoice.id;
            invoiceService.changeInvoice(invoice).then(function(resp) {
                    if(resp.data.status == "success") {
                        toastr.success("updated successfully");
                        $rootScope.practysLoader = false;
                        vm.editSpecificInvoice(invoiceId)
                       	$scope.invoiceEdited = false;
                       	$scope.specificCost = 0;
                    } else {
                        $rootScope.practysLoader = false;
                        toastr.error(resp.data.message);
                    }
            });
        }

        function updateSpecificInvoice(invoice,invoiceForm){
        	console.log(invoice);
       	$rootScope.practysLoader = true;


        	if(!invoice.payment ){
        		toastr.error("Enter the amount for payment ");
        		return false;
        	}else if(invoice.payment == 0){
	            toastr.error("Enter payment not equal to zero");
	            return false;
	        }
          else if(invoice.payment > invoice.amount ){
        		toastr.error("Payment Amount Exceeds the Bill Amount ");
        		return false;

        	}else if(parseInt(invoice.balanceAmount) != 0 && invoice.payment < invoice.amount && invoice.installment != true ){
               toastr.error("Enter the full amount or go with installment ");
               return false;
        	}else{


                var editSave  = {};

                editSave  = invoice;
                var paymentStat = invoice.paymentStatus;
                // console.log(editSave);return false;

        	    if(invoice.installment == true)  // For I APP Installment and II APP Installment
        	    {
        	    	// console.log(editSave);return false;

            	    if(parseInt(editSave.balanceAmount) === 0){
            	    	editSave.paymentStatus = 'paid';
            	    	editSave.currentAppStatus         =  1;
            	   	} else{
            	   		editSave.paymentStatus = 'installment';
            	   		editSave.currentAppStatus         =  0;
            	   	}

        	    	// editSave.currentAppStatus         =  0;
        	    	editSave.pendingAmount            = invoice.balanceAmount;
        	    	editSave.appointmentBalanceAmount = 0;

                    //editSave.appointmentBalanceAmount  = 0
                   // alert(editSave.appointmentBalanceAmount);

                     //alert(editSave.pendingAmount);


                  //  debugger;

                   if(invoice.balanceAmount < 0)
                   {
                   toastr.error("Installment Amount exceeds more than previous balance"+ invoice.remainingBalance);
                   return false;
                   }
        	    }
        	    else if(invoice.installment != true && invoice.appointmentBalanceAmount == null || invoice.appointmentBalanceAmount == 0) // For I APP Full Payment
        	    {

        	    	editSave.paymentStatus            = 'paid';
        	    	editSave.currentAppStatus         =  1;
        	    	editSave.pendingAmount            = invoice.balanceAmount;

        	    }else if(invoice.installment != true  && !invoice.previousAppPaymentCheck){ // For II APP Full Payment

        	    	editSave.paymentStatus = 'paid';
        	    	editSave.currentAppStatus         =  1;
        	    	editSave.pendingAmount            = 0;//*
        	    	editSave.appointmentBalanceAmount = invoice.balanceAmount;



        	    }else if(invoice.previousAppPaymentCheck){  // For II APP Previous Payment

        	    	if(editSave.pendingAmounts == 0){ //dec 26 nishant
        	    		editSave.total =  0;
                    	editSave.payment = parseFloat($scope.specificCost);
                	}else{
                		editSave.total =  invoice.amount;
                		editSave.payment = parseFloat(editSave.amount); //dec 26 nishant
                		 // + parseInt($scope.specificCost)
                	}
                    // var subTotal = parseInt(editSave.subTotal);
                    // var defSubtotal = parseInt(editSave.defaultSubTotal); //dec 26 nishant
                    // if(subTotal > defSubtotal){
                    //     editSave.payment = (subTotal - defSubtotal) + parseInt($scope.specificCost);//dec 26 nishant
                    // }
        	    	// if(editSave.balanceAmount === 0){

        	    	   editSave.paymentStatus = 'paid'; //dec 26 nishant
        	    	// }else{

        	    	// editSave.paymentStatus = 'unpaid';
        	    	// }



        	    	editSave.currentAppStatus         =  1;
        	    	editSave.pendingAmount            = 0;

                    editSave.appointmentBalanceAmount = invoice.balanceAmount;

                    // Payment set for previous appointment check...
                    console.log(editSave);




        	    }
        	    if(!invoice.previousAppPaymentCheck){
        	    	editSave.total =  0;
        	    }
        	   
               editSave.amount = editSave.subTotal;


        	    if(vm.additionalDatass != ""){
			    	editSave.additionalElements = vm.additionalDatass;
                }

                if(invoice.manualInvoiceItems){
                  editSave.manualInvoiceItems = invoice.prescriptionDetails;
                }

                // for sketch datas
                if($scope.invoice.defaultSubTotal){
                	var subTotal = parseInt($scope.invoice.subTotal);
                	var defSubtotal = parseInt($scope.invoice.defaultSubTotal);
                	if(subTotal > defSubtotal){
                		if(paymentStat == 'unpaid'){
                			editSave.sketchData = (subTotal - defSubtotal) + parseInt(editSave.sketchData);
                		}else{
                			editSave.sketchData = subTotal - defSubtotal ;
                		}
                		
                	}
                }

                editSave.patientId = invoice.patient.id;
                editSave.doctorId = invoice.doctor.id;
                editSave.invoiceDate = moment(new Date(invoice.invoiceDate)).format("YYYY-MM-DD");
                



                var invoiceId = editSave.id ;

        	    invoiceService.updateInvoice(editSave).then(function(resp) {
                    if(resp.data.status == "success") {
	                    toastr.success("updated successfully");
	                    $rootScope.practysLoader = false;
	                    var id = resp.data.id;
	                    vm.printShow(id);
                    } else {
                        $rootScope.practysLoader = false;
                        toastr.error(resp.data.message);
                    }
                });

        	}
        }

        function calculateTaxDiscount(obj)
        {

            if(!obj.previousAppPaymentCheck)
            {


               //For Full Payment and Installment
               // if(obj.subTotal > obj.amount){
              	// 	var subamt       =  parseFloat(obj.defaultAmount);
               //  }else{
                    var subamt       =   parseFloat(obj.subTotal) || parseFloat(obj.amount);
                // }
            	
            	var discount     =   (obj.discount != undefined && obj.discount != '') ? parseFloat(subamt * (obj.discount/100)) : 0;

                // var amt          =   (subamt - discount).toFixed(2);
            	var tax          =   (obj.tax != '' && obj.tax != undefined) ? parseFloat(subamt * (obj.tax/100)) : 0;
            	var payment      =   (obj.payment != '' && obj.payment != undefined) ? parseFloat(obj.payment) : 0;



            	if($scope.invoice.paymentStatus === 'installment')
            	{

            		//$scope.invoice.payment = ($scope.invoice.payment)?$scope.invoice.payment:'';

                   $scope.invoice.balanceAmount = (parseFloat($scope.invoice.pendingAmount) - parseFloat(payment)).toFixed(2);
                   $scope.invoice.amount = $scope.invoice.payment;
                    var amountTotal = (subamt - discount + tax).toFixed(2);
                    $scope.invoice.totalAmount = amountTotal;

            	}else{

                    if($scope.invoice.defaultAmount == $scope.invoice.pendingAmount){
                        var finalamount = (subamt - payment + tax - discount).toFixed(2);
                        $scope.invoice.balanceAmount  =  parseFloat(finalamount);
                    }else{
                        var finalamount = ($scope.invoice.pendingAmount - payment + tax - discount).toFixed(2);
                        $scope.invoice.balanceAmount  =  parseFloat(finalamount);
                    }

                    var amountTotal = (subamt - discount + tax).toFixed(2);
                    $scope.invoice.totalAmount = amountTotal;
                    $scope.invoice.amount  = parseFloat(amountTotal);
                    
                   

	            	// if($scope.invoice.appointmentBalanceAmount != null && $scope.invoice.appointmentBalanceAmount != 0){
	            	// 	var appointmentBalanceAmount = parseFloat($scope.invoice.appointmentBalanceAmount);
	            	// 	$scope.invoice.balanceAmount = (parseFloat(appointmentBalanceAmount) + parseFloat($scope.invoice.balanceAmount)).toFixed(2);

	            	// }

            	}

            }else{

            	//For Previous Appointment Checking
            	console.log($scope.enoughBalance);

	            		// if(!$scope.enoughBalance)
	            		// {
		            	// 	 toastr.error("Please Check Boxes in List To Continue or You Checked all Boxes");
		            	// 	 $scope.invoice.tax = '';
		            	// 	 $scope.invoice.discount = '';
		            	// 	 return false;
		            	// }
		            	// if($scope)

		            	if($scope.enoughBalance != undefined){
		            		var subamt          =   parseFloat($scope.enoughBalance);
		            	}else{
		            		var subamt          =   obj.subTotal;
		            	}
		            	if($scope.minusAmount == undefined){
		            		$scope.minusAmount    =   obj.subTotal + parseInt(obj.appointmentBalanceAmount);
		            	}

		             
		               var discount        =   (obj.discount != undefined && obj.discount != '') ? parseFloat(subamt * (obj.discount/100)) : 0;

                         var amt          =   (subamt - discount).toFixed(2);
			             var tax          =   (obj.tax != '' && obj.tax != undefined) ? parseFloat(amt * (obj.tax/100)) : 0;
			             var payment      =   (obj.payment != '' && obj.payment != undefined) ? parseFloat(obj.payment) : 0;

		                 var amountTotal  =   (amt - 0 + tax).toFixed(2);
		                  $scope.invoice.totalAmount = amountTotal;

                        // alert(  parseFloat($scope.specificCost));


		        	   $scope.invoice.amount  = (parseFloat(amountTotal) + parseFloat($scope.specificCost)).toFixed(2);

                       // $scope.invoice.amount = parseFloat(amountTotal).toFixed(2);
	                  	    // alert("success");
		        	   $scope.invoice.balanceAmount  = (parseFloat($scope.minusAmount)).toFixed(2);
		        	   // console.log($scope.invoice.balanceAmount);
		        	   //$scope.invoice.appointmentBalanceAmount = $scope.invoice.balanceAmount;
		        	   $scope.invoice.payment = $scope.invoice.amount;




            }

        }

        function editSpecificInvoice(ids){
            $scope.invoice = [];
            var id;
            if(ids){
            	id = ids;
            }else{
            	id = $stateParams.id;
            }
        	
        	$rootScope.practysLoader = true;
        	if (id != '') {
        		$scope.expense = {};
        		if ($rootScope.online) {
        			invoiceService.editInvoice(id,'list').then(function(resp) {
        				console.log(resp);
        				if (resp.data.status == "success") {
        					$scope.invoice = resp.data.message.Invoice;
        					if(!$scope.invoice.firstPayment){
        						$scope.invoice.tax = 0;
	        					$scope.invoice.discount = 0;
	        					$scope.invoice.paymentType = '';
        					}
        					
        					$scope.invoice.pendingAmounts = resp.data.message.Invoice.pendingAmount;
        					$scope.invoice.defaultAmountForBalanceInPaid = resp.data.message.Invoice.amount;
        					$scope.invoice.defaultAmount = resp.data.message.Invoice.amount;
        					$scope.invoice.defaultPreviousAppBalanceAmount = resp.data.message.Invoice.appointmentBalanceAmount;


        					$scope.invoice.previousAppPaymentCheck = false;
        					$scope.invoice.patient = resp.data.message.Patient;
        					$scope.invoice.doctor = resp.data.message.Doctor;
        					$scope.invoice.previousAppointmentBalanceAmount = resp.data.message.Invoice.appointmentBalanceAmount;
        					$scope.invoice.remainingBalance = resp.data.message.Invoice.pendingAmount;
        					$scope.additionalInTable = JSON.parse(resp.data.message.Invoice.additionalItems);
        					vm.additionalDatass = JSON.parse(resp.data.message.Invoice.additionalItems);
        					$scope.invoice.currentAppStatus =  resp.data.message.Invoice.currentAppStatus;


        					if($scope.invoice.currentAppStatus){

        						$scope.invoice.balanceAmount =  parseInt($scope.invoice.previousAppointmentBalanceAmount);
        					}
        					else
        					{

        						$scope.invoice.previousAppointmentBalanceAmount = ($scope.invoice.previousAppointmentBalanceAmount)?$scope.invoice.previousAppointmentBalanceAmount:0;

        					    $scope.invoice.balanceAmount = parseInt($scope.invoice.remainingBalance) + parseInt($scope.invoice.previousAppointmentBalanceAmount);
        					}



        					if($scope.invoice.paymentStatus === 'installment')
        					{
        						$scope.invoice.AlreadyPaidInstallment = $scope.invoice.payment;
        						$scope.invoice.appointmentBalanceAmount = 0;
        						$scope.invoice.previousAppointmentBalanceAmount = 0;
        						$scope.invoice.balanceAmount  = $scope.invoice.pendingAmount;
        					}else if($scope.invoice.paymentStatus === 'paid'){
        						$scope.invoice.balanceAmount  = 0;

        					}
        					$scope.invoice.payment = 0;


        					if(resp.data.message.Appointment != undefined){
        						$scope.invoice.AppointmentDetails = resp.data.message.Appointment;
        						$scope.invoice.prescriptionDetails = JSON.parse(resp.data.message.Appointment.prescription);
        					}else{
        						$scope.invoice.AppointmentDetails = "";
        						$scope.invoice.prescriptionDetails = "";
        					}

                  			if(resp.data.message.Invoice){
				                if(resp.data.message.Invoice.manualInvoiceItems){
				                    $scope.invoice.prescriptionDetails = JSON.parse(resp.data.message.Invoice.manualInvoiceItems);
				                }
                 			}	

        					if(resp.data.message.Invoice.serviceList != null){
        						$scope.invoice.serviceDetails = JSON.parse(resp.data.message.Invoice.serviceList);

        					}else{
        						$scope.invoice.serviceDetails = "";

        					}
        					vm.subDummy();
        					vm.subTotalCalculation();
                            // vm.calculateTaxDiscount($scope.invoice);

        					$scope.invoice.paymentStatus = resp.data.message.Invoice.paymentStatus;
        					if ($scope.invoice.paymentStatus == 'installment') {
        						$scope.invoice.installment = true;
        						$scope.invoice.payment = 0;
        						$scope.invoice.discount = 0;
        						$scope.invoice.tax = 0;

        					}
        					if ($scope.invoice.paymentStatus == 'unpaid') {
        						$scope.invoice.unpaid = true;
        						$scope.invoice.checked = false;
        					}
        					if ($scope.invoice.paymentStatus == 'paid') {
        						$scope.invoice.paid = true;
        					}

        					$rootScope.practysLoader = false;


        				} else {
        					$rootScope.practysLoader = false;
        					toastr.error(resp.data.message);
        				}

        			});
        			// $rootScope.practysLoader = false;


        		} else if ($rootScope.userLevel == 'clinic') {
                    $scope.invoice  = {};
                    invoiceOfflineService.editInvoices(id).then(function(resp){
                        if(resp){

                            if(resp.geteditInvoicesData){
                                $scope.invoice =  resp.geteditInvoicesData;
                                vm.calculateTaxDiscount($scope.invoice);

                                $scope.invoice.previousAppPaymentCheck = false;
                                $scope.invoice.defaultAmount = $scope.invoice.amount;
                                $scope.invoice.defaultPreviousAppBalanceAmount = $scope.invoice.appointmentBalanceAmount;
                                $scope.invoice.patient = $scope.invoice.Patient;
                                $scope.invoice.doctor = $scope.invoice.Doctor;
                                $scope.invoice.previousAppointmentBalanceAmount = $scope.invoice.appointmentBalanceAmount;
                                $scope.invoice.remainingBalance = $scope.invoice.pendingAmount;
                                $scope.additionalInTable = JSON.parse($scope.invoice.additionalItems);
                                vm.additionalDatass = JSON.parse($scope.invoice.additionalItems);
                                $scope.invoice.currentAppStatus =  JSON.parse($scope.invoice.currentAppStatus);
                                if($scope.invoice.currentAppStatus){
                                        $scope.invoice.balanceAmount =  parseInt($scope.invoice.previousAppointmentBalanceAmount);
                                }else{
                                    $scope.invoice.previousAppointmentBalanceAmount = ($scope.invoice.previousAppointmentBalanceAmount)?$scope.invoice.previousAppointmentBalanceAmount:0;
                                        $scope.invoice.balanceAmount = parseInt($scope.invoice.remainingBalance) + parseInt($scope.invoice.previousAppointmentBalanceAmount);
                                    }

                                 if($scope.invoice.paymentStatus === 'installment'){
                                        $scope.invoice.AlreadyPaidInstallment = $scope.invoice.payment;
                                        $scope.invoice.appointmentBalanceAmount = 0;
                                        $scope.invoice.previousAppointmentBalanceAmount = 0;
                                        $scope.invoice.balanceAmount  = $scope.invoice.pendingAmount;
                                    }else if($scope.invoice.paymentStatus === 'paid'){
                                        $scope.invoice.balanceAmount  = 0;

                                    }
                                    $scope.invoice.payment = 0;
                                    if($scope.invoice.Appointment != undefined){
                                            $scope.invoice.AppointmentDetails = $scope.invoice.Appointment;
                                            $scope.invoice.prescriptionDetails = JSON.parse($scope.invoice.Appointment.prescription);
                                        }else{
                                            $scope.invoice.AppointmentDetails = "";
                                            $scope.invoice.prescriptionDetails = "";
                                        }
                                        if($scope.invoice.serviceList != null){
                                            $scope.invoice.serviceDetails = JSON.parse($scope.invoice.serviceList);

                                        }else{
                                            $scope.invoice.serviceDetails = "";

                                        }
                                       vm.subTotalCalculation();
                                       $scope.invoice.paymentStatus = $scope.invoice.paymentStatus;
                                        if ($scope.invoice.paymentStatus == 'installment') {
                                            $scope.invoice.installment = true;
                                            $scope.invoice.payment = 0;
                                            $scope.invoice.discount = 0;
                                            $scope.invoice.tax = 0;

                                        }
                                        if ($scope.invoice.paymentStatus == 'unpaid') {
                                            $scope.invoice.unpaid = true;
                                            $scope.invoice.checked = false;
                                        }
                                        if ($scope.invoice.paymentStatus == 'paid') {
                                            $scope.invoice.paid = true;
                                        }


                                    } else {
                                        $rootScope.practysLoader = false;
                                        toastr.error(resp.data.message);
                                    }
                            }
                    });

        		}

        	}else{
        		toastr.error("Id is missing");
        	}


        }


        function printInvoice(){
        	var id = $stateParams.id;
        	// alert(id);
        	// return false;
        	 $rootScope.practysLoader = true;
            if (id != '') {
                // $scope.expense = {};
                    invoiceService.editInvoice(id).then(function(resp) {
                        console.log(resp);
                        if (resp.data.status == "success") {
                             $rootScope.practysLoader = false;
                             vm.print(resp);
                        } else {
                            $rootScope.practysLoader = false;
                            toastr.error(resp.data.message);
                        }

                    });




            }else{
            	toastr.error("Id is missing");
            }
        }

        function printTabLoad(id){
        	var url = "http:54.169.106.151/#/printInvoice/"+id;
        	  window.open(url, '_blank');
        }


        /* sheema */

        function editInvoice(){
        	var id = $stateParams.id;
        	 // $rootScope.popup = false;
          //   $rootScope.inventoryPopup = false;
            //vm.invoiceLoader = [];
            $rootScope.practysLoader = true;
            if (id != '') {
                $scope.expense = {};
                if ($rootScope.online) {
                    invoiceService.editInvoice(id).then(function(resp) {
                        console.log(resp);
                        if (resp.data.status == "success") {
                            $scope.invoice = resp.data.message.Invoice;
                            $scope.invoice.defaultAmount = resp.data.message.Invoice.amount;
                            $scope.invoice.defaultPreviousAppBalanceAmount = resp.data.message.Invoice.appointmentBalanceAmount;
                            // $scope.invoice.previousAppDetails = JSON.parse(resp.data.message.Invoice.appointmentBalanceDetails);
                            $rootScope.practysLoader = false;
                            $scope.invoice.previousAppPaymentCheck = false;
                            $scope.invoice.patient = resp.data.message.Patient;
                            $scope.invoice.doctor = resp.data.message.Doctor;
                            $scope.invoice.previousAppointmentBalanceAmount = resp.data.message.Invoice.appointmentBalanceAmount;
                            $scope.invoice.remainingBalance = resp.data.message.Invoice.pendingAmount;
                            $scope.additionalInTable = JSON.parse(resp.data.message.Invoice.additionalItems);
                            vm.additionalDatass = JSON.parse(resp.data.message.Invoice.additionalItems);
                            $scope.invoice.currentAppStatus =  resp.data.message.Invoice.currentAppStatus;
                            // alert($scope.invoice.currentAppStatus);
                            if($scope.invoice.currentAppStatus){
                            	// alert("if");
                            	 $scope.invoice.balanceAmount =  parseInt($scope.invoice.previousAppointmentBalanceAmount);
                            }else{
                            	// alert("else");
                            	 $scope.invoice.balanceAmount = parseInt($scope.invoice.remainingBalance) + parseInt($scope.invoice.previousAppointmentBalanceAmount);
                            }



                            // if($scope.additionalInTable != ""){
                            // 	// alert("success");
                            // 	 $scope.additionalElementsArray = JSON.parse(resp.data.message.Invoice.additionalItems);
                            // }
                            if(resp.data.message.Appointment != undefined){
                            	 $scope.invoice.AppointmentDetails = resp.data.message.Appointment;
                            	 $scope.invoice.prescriptionDetails = JSON.parse(resp.data.message.Appointment.prescription);
                            }else{
                            	 $scope.invoice.AppointmentDetails = "";
                            	 $scope.invoice.prescriptionDetails = "";
                            }
                            if(resp.data.message.Invoice.serviceList != null){
                            	 $scope.invoice.serviceDetails = JSON.parse(resp.data.message.Invoice.serviceList);
                            	 // $scope.invoice.prescriptionDetails = Json.parse(resp.data.message.Appointment.prescription);
                            }else{
                            	 $scope.invoice.serviceDetails = "";
                            	 // $scope.invoice.prescriptionDetails = "";
                            }
                            // alert($scope.invoice.remainingBalance);
                            console.log($scope.additionalInTable);
                            console.log($scope.invoice.serviceDetails);
                           console.log($scope.invoice.prescriptionDetails);
                           vm.subTotalCalculation();

                            $scope.invoice.paymentStatus = resp.data.message.Invoice.paymentStatus;
                            if ($scope.invoice.paymentStatus == 'installment') {
                                $scope.invoice.installment = true;
                                $scope.invoice.payment = 0;
                                $scope.invoice.discount = 0;
                                $scope.invoice.tax = 0;
                               // vm.change('edit', $scope.invoice);
                            }
                            if ($scope.invoice.paymentStatus == 'unpaid') {
                                $scope.invoice.unpaid = true;
                                $scope.invoice.checked = false;
                            }
                            if ($scope.invoice.paymentStatus == 'paid') {
                                $scope.invoice.paid = true;
                            }

                            // vm.invoice.fromDate = resp.data.message.Invoice.invoiceDate;
                            // vm.select = resp.data.message.Patient;
                            // vm.selectId = resp.data.message.Patient.id;
                            // vm.docSelect = resp.data.message.Doctor.firstName;
                            // vm.docSelectId = resp.data.message.Doctor.id;
                        } else {
                            $rootScope.practysLoader = false;
                            toastr.error(resp.data.message);
                        }

                    });



                } else if ($rootScope.userLevel == 'clinic') {
                    // $SQLite.ready(function() {
                    //     this.select('SELECT * FROM practysapp_invoices WHERE practysapp_invoices.id=?', [id]).then(function() {
                    //         console.log("empty result");
                    //         toastr.error("No Data Found");
                    //     }, function() {
                    //         console.log("error");
                    //     }, function(data) {
                    //         console.log(data.item);
                    //         $scope.invoice = data.item;

                    //         if ($scope.invoice.paymentStatus == 'installment') {
                    //             $scope.invoice.installment = true;
                    //         }
                    //         if ($scope.invoice.paymentStatus == 'unpaid') {
                    //             $scope.invoice.unpaid = true;
                    //             $scope.invoice.checked = false;
                    //         }
                    //         if ($scope.invoice.paymentStatus == 'paid') {
                    //             $scope.invoice.paid = true;
                    //         }

                    //         $rootScope.practysLoader = false;
                    //         // vm.invoice.fromDate = data.item.invoiceDate;
                    //         // vm.docSelectId      = data.item.doctorId;
                    //     });
                    // });
                    // $timeout(function() {
                    //     if ($scope.invoice) {
                    //         utilService.getUserDetails($scope.invoice.patientId).then(function(response) {
                    //             $scope.invoice.patient = response;
                    //         });
                    //         utilService.getUserDetails($scope.invoice.doctorId).then(function(response) {
                    //             $scope.invoice.doctor = response;
                    //         });
                    //     }
                    // }, 1500);
                }
                // ngDialog.open({
                //     template: 'editPopUp',
                //     controller: 'invoiceController',
                //     scope: $scope
                // });
            }else{
            	toastr.error("Id is missing");
            }
        }

        /*
          Edit Invoice popup
       */
        function editPop(id) {
            $rootScope.popup = false;
            $rootScope.inventoryPopup = false;
            //vm.invoiceLoader = [];
            $rootScope.practysLoader = true;
            if (id != '') {
                $scope.expense = {};
                if ($rootScope.online) {
                    invoiceService.editInvoice(id).then(function(resp) {
                        if (resp.data.status == "success") {
                            $scope.invoice = resp.data.message.Invoice;
                            $rootScope.practysLoader = false;
                            $scope.invoice.previousAppPaymentCheck = false;
                            $scope.invoice.patient = resp.data.message.Patient;
                            $scope.invoice.doctor = resp.data.message.Doctor;
                            $scope.invoice.remainingBalance = resp.data.message.Invoice.pendingAmount;
                            $scope.additionalInTable = JSON.parse(resp.data.message.Invoice.additionalItems);
                            vm.additionalDatass = JSON.parse(resp.data.message.Invoice.additionalItems);
                            // if($scope.additionalInTable != ""){
                            // 	// alert("success");
                            // 	 $scope.additionalElementsArray = JSON.parse(resp.data.message.Invoice.additionalItems);
                            // }
                            if(resp.data.message.Appointment != undefined){
                            	 $scope.invoice.AppointmentDetails = resp.data.message.Appointment;
                            	 $scope.invoice.prescriptionDetails = JSON.parse(resp.data.message.Appointment.prescription);
                            }else{
                            	 $scope.invoice.AppointmentDetails = "";
                            	 $scope.invoice.prescriptionDetails = "";
                            }
                            if(resp.data.message.Invoice.serviceList != null){
                            	 $scope.invoice.serviceDetails = JSON.parse(resp.data.message.Invoice.serviceList);
                            	 // $scope.invoice.prescriptionDetails = Json.parse(resp.data.message.Appointment.prescription);
                            }else{
                            	 $scope.invoice.serviceDetails = "";
                            	 // $scope.invoice.prescriptionDetails = "";
                            }
                            console.log($scope.invoice.serviceList,"serviceListssss");
                            console.log($scope.invoice.prescriptionDetails,"prescriptionsListttttsss");

                            $scope.invoice.paymentStatus = resp.data.message.Invoice.paymentStatus;
                            if ($scope.invoice.paymentStatus == 'installment') {
                                $scope.invoice.installment = true;
                                $scope.invoice.payment = 0;
                                vm.change('edit', $scope.invoice);
                            }
                            if ($scope.invoice.paymentStatus == 'unpaid') {
                                $scope.invoice.unpaid = true;
                                $scope.invoice.checked = false;
                            }
                            if ($scope.invoice.paymentStatus == 'paid') {
                                $scope.invoice.paid = true;
                            }
                            // vm.invoice.fromDate = resp.data.message.Invoice.invoiceDate;
                            // vm.select = resp.data.message.Patient;
                            // vm.selectId = resp.data.message.Patient.id;
                            // vm.docSelect = resp.data.message.Doctor.firstName;
                            // vm.docSelectId = resp.data.message.Doctor.id;
                        } else {
                            $rootScope.practysLoader = false;
                            toastr.error(resp.data.message);
                        }

                    });



                } else if ($rootScope.userLevel == 'clinic') {
                    $SQLite.ready(function() {
                        this.select('SELECT * FROM practysapp_invoices WHERE practysapp_invoices.id=?', [id]).then(function() {
                            console.log("empty result");
                            toastr.error("No Data Found");
                        }, function() {
                            console.log("error");
                        }, function(data) {
                            console.log(data.item);
                            $scope.invoice = data.item;

                            if ($scope.invoice.paymentStatus == 'installment') {
                                $scope.invoice.installment = true;
                            }
                            if ($scope.invoice.paymentStatus == 'unpaid') {
                                $scope.invoice.unpaid = true;
                                $scope.invoice.checked = false;
                            }
                            if ($scope.invoice.paymentStatus == 'paid') {
                                $scope.invoice.paid = true;
                            }

                            $rootScope.practysLoader = false;
                            // vm.invoice.fromDate = data.item.invoiceDate;
                            // vm.docSelectId      = data.item.doctorId;
                        });
                    });
                    $timeout(function() {
                        if ($scope.invoice) {
                            utilService.getUserDetails($scope.invoice.patientId).then(function(response) {
                                $scope.invoice.patient = response;
                            });
                            utilService.getUserDetails($scope.invoice.doctorId).then(function(response) {
                                $scope.invoice.doctor = response;
                            });
                        }
                    }, 1500);
                }
                ngDialog.open({
                    template: 'editPopUp',
                    controller: 'invoiceController',
                    scope: $scope
                });
            }
        }

        function subDummy(){
            if($scope.invoice.serviceDetails != null && $scope.invoice.serviceDetails != ''){
                var sum1 = $scope.invoice.serviceDetails.reduce(function(prevVal, elem) {

                    return prevVal + parseInt(elem.cost);
                }, 0);
                var service = (sum1 != '')  ? sum1 : 0;
                console.log(service);
            }else{
                var service = 0 ;
            }
            if($scope.invoice.prescriptionDetails != null && $scope.invoice.prescriptionDetails != ''){
                var sum2 = $scope.invoice.prescriptionDetails.reduce(function(prevVal, elem) {
                	if(elem.amount != ""){
                		return prevVal + parseInt(elem.amount);
                	}

                }, 0);
                 var prescription = (sum2 != '')  ? sum2 : 0;
                 console.log(prescription);
            }else{
                var prescription = 0 ;
            }
            if(vm.additionalDatass != null  && vm.additionalDatass != ''){
                var sum3 = vm.additionalDatass.reduce(function(prevVal, elem) {
                    return prevVal + parseInt(elem.amount);
                }, 0);
                 var additional = (sum3 != '')  ? sum3 : 0;
                 console.log(additional);
            }else{
                var additional = 0;
            }
            // $scope.invoice.subTotal = service + prescription + additional;
            $scope.invoice.defaultSubTotal = service + prescription + additional;
            // vm.calculateTaxDiscount($scope.invoice);
            // console.log($scope.invoice.subTotal);
        }

        function subTotalCalculation(){
            // alert("success");
            console.log($scope.invoice.serviceDetails);
            console.log($scope.invoice.prescriptionDetails);
            console.log(vm.additionalDatass,"addition datssssss");
            if($scope.invoice.serviceDetails != null && $scope.invoice.serviceDetails != ''){
                var sum1 = $scope.invoice.serviceDetails.reduce(function(prevVal, elem) {

                    return prevVal + parseInt(elem.cost);
                }, 0);
                var service = (sum1 != '')  ? sum1 : 0;
                console.log(service);
            }else{
                var service = 0 ;
            }
            if($scope.invoice.prescriptionDetails != null && $scope.invoice.prescriptionDetails != ''){
                var sum2 = $scope.invoice.prescriptionDetails.reduce(function(prevVal, elem) {
                	if(elem.amount != ""){
                		return prevVal + parseInt(elem.amount);
                	}

                }, 0);
                 var prescription = (sum2 != '')  ? sum2 : 0;
                 console.log(prescription);
            }else{
                var prescription = 0 ;
            }
            if(vm.additionalDatass != null  && vm.additionalDatass != ''){
                var sum3 = vm.additionalDatass.reduce(function(prevVal, elem) {
                    return prevVal + parseInt(elem.amount);
                }, 0);
                 var additional = (sum3 != '')  ? sum3 : 0;
                 console.log(additional);
            }else{
                var additional = 0;
            }
            $scope.invoice.subTotal = service + prescription + additional;
            if($scope.invoice.paidPayment == 0 && ($scope.invoice.appointmentBalanceAmount == 0 ||$scope.invoice.appointmentBalanceAmount == null)){
            	$scope.invoice.defaultAmount = $scope.invoice.subTotal;
            }

             // if($scope.invoice.pendingAmount){
                if($scope.invoice.appointmentBalanceAmount){
                    $scope.invoice.pendingAmount = parseInt($scope.invoice.pendingAmounts) + (parseInt($scope.invoice.subTotal) - parseInt($scope.invoice.defaultSubTotal)) + parseInt($scope.invoice.appointmentBalanceAmount);
                }else{
                    $scope.invoice.pendingAmount = parseInt($scope.invoice.pendingAmounts) + (parseInt($scope.invoice.subTotal) - parseInt($scope.invoice.defaultSubTotal));
                }
            // }
            // $scope.invoice.defaultSubTotal = service + prescription + additional;
            vm.calculateTaxDiscount($scope.invoice);
            console.log($scope.invoice.subTotal);
        }

        /*
        	Saving the amount changes while editing the invoice
        */
        function saveServiceCashChange(index,type,cost,obj){
        	var serviceCostList = [];
        	var aditionalCostList = [];
        	var serviceCostListUnpaid = [];
        	var productCostListUnpaid = [];
        	var additionalCostListUnpaid = [];
        	var productCostList = [];
        	$scope.invoiceEdited = true;
        	if(index != undefined && cost != ''){
        		if(type == 'service'){
        			angular.forEach($scope.invoice.serviceDetails,function(value,key){
	        			if(key == index){
	        				value.cost = cost;
	        			}
        			});

        		}else if(type == 'product'){
        			angular.forEach($scope.invoice.prescriptionDetails,function(value,key){
	        			if(key == index){
	        				if(value.drugName != undefined){
	        					value.amount = cost;
	        				}else{
	        					value.amount = cost;
	        				}

	        			}
        			});

        		}else{
        			angular.forEach(obj,function(value,key){
	        			if(key == index){
	        				value.amount = cost;
	        			}
        			});
        			vm.additionalDatass = obj;
        			$scope.invoice.additionalItems = JSON.stringify(vm.additionalDatass);
        			console.log(vm.additionalDatass,"addition datssssss");
        		}
        		angular.forEach($scope.invoice.serviceDetails,function(value,key){
        				serviceCostList.push(value.cost);
        				if(value.productPaymentStatus == "false"){
        					serviceCostListUnpaid.push(value.cost);
        				}
        		});
        		angular.forEach($scope.invoice.prescriptionDetails,function(value,key){
	        			if(value.drugName != undefined){
	        				productCostList.push(value.amount);
	        				if(value.productPaymentStatus == "false"){
        						productCostListUnpaid.push(value.amount);
        					}
	        			}else{
	        				productCostList.push(value.amount);
	        				if(value.productPaymentStatus == "false"){
        						productCostListUnpaid.push(value.amount);
        					}
	        			}
        		});
        		angular.forEach(vm.additionalDatass,function(value,key){
        				aditionalCostList.push(value.amount);
        				if(value.productPaymentStatus == "false"){
        					additionalCostListUnpaid.push(value.amount);
        				}
        		});
        		console.log(vm.additionalDatass,"tables valuesss");
        		console.log(additionalCostListUnpaid,"costtttststts");
        		// if(productCostList != ''){
        			var serviceCostNumbers = serviceCostList.map(Number);
        			var productCostNumbers = productCostList.map(Number);
        			var aditionalCostNumbers = aditionalCostList.map(Number);
        			var serviceCostUnpaidNumbers = serviceCostListUnpaid.map(Number);
        			var productCostUnpaidNumbers = productCostListUnpaid.map(Number);
        			var additionalCostUnpaidNumbers = additionalCostListUnpaid.map(Number);
        			console.log(aditionalCostNumbers);
        			console.log(additionalCostUnpaidNumbers);
        			var array1 = serviceCostNumbers.reduce(function(acc, val) {
					  return acc + val;
					},0);
					var array2 = productCostNumbers.reduce(function(acc, val) {
					  return acc + val;
					},0);
					var array3 = serviceCostUnpaidNumbers.reduce(function(acc, val) {
					  return acc + val;
					},0);
					var array4 = productCostUnpaidNumbers.reduce(function(acc, val) {
					  return acc + val;
					},0);
					var array5 = aditionalCostNumbers.reduce(function(acc, val) {
					  return acc + val;
					},0);
					var array6 = additionalCostUnpaidNumbers.reduce(function(acc, val) {
					  return acc + val;
					},0);
					console.log(array5);
					console.log(array6);
					// if($scope.invoice.previousAppPaymentCheck != true){
						$scope.invoice.subTotal = array3 + array4 + array6;
						$scope.invoice.dummyRemaining = array3 + array4 + array6;
						$scope.invoice.amount = array1 + array2 + array5;
						// $scope.invoice.defaultAmount = $scope.invoice.subTotal;
					// }
					if($scope.invoice.paidPayment == 0 && ($scope.invoice.appointmentBalanceAmount == 0 ||$scope.invoice.appointmentBalanceAmount == null)){
		            	$scope.invoice.defaultAmount = $scope.invoice.subTotal;
		            }

                    //Dec 7 Nishant
                    // if($scope.invoice.pendingAmount){
                        if($scope.invoice.appointmentBalanceAmount){
                            $scope.invoice.pendingAmount = parseInt($scope.invoice.pendingAmounts) + (parseInt($scope.invoice.subTotal) - parseInt($scope.invoice.defaultSubTotal)) + parseInt($scope.invoice.appointmentBalanceAmount);
                        }else{
                            $scope.invoice.pendingAmount = parseInt($scope.invoice.pendingAmounts) + (parseInt($scope.invoice.subTotal) - parseInt($scope.invoice.defaultSubTotal));
                        }
                    // }

                    vm.calculateTaxDiscount($scope.invoice);

                   
        		toastr.success("Changes made successfully");
        		console.log($scope.invoice.serviceDetails);
        		console.log($scope.invoice.prescriptionDetails);
        	}else{
        		toastr.error("Cannot Edit amount is missing");
        	}

        }



        /*
			balance payment uncheck
        */
        function balancepayment(status){

        	if(!status){
        		if($scope.invoice.serviceDetails){
        			angular.forEach($scope.invoice.serviceDetails,function(value,key){
	       
	        				$scope.invoice.checkService[key] = false;

        			});

        		}else if($scope.invoice.prescriptionDetails){
        			angular.forEach($scope.invoice.prescriptionDetails,function(value,key){
	        			$scope.invoice.checkProduct[key] = false;
        			});

        		}else if($scope.additionalInTable){
        			
        			angular.forEach($scope.additionalInTable,function(value,key){
	        			$scope.invoice.checkAdditionalStatus[key] = false;
        			});
        		}

        		$scope.invoice.appointmentBalanceAmount = $scope.invoice.defaultPreviousAppBalanceAmount;
        		$scope.invoice.balanceAmount 			= $scope.invoice.appointmentBalanceAmount;
        		$scope.specificCost = 0 ;
        	
        	}

        }

        /*
			Balance Deduction While checking the service check box
        */

        function balanceDeduction(cost,checkStatus,type,index){
        	// alert(cost);

        	// return false;
        	// alert($scope.invoice.appointmentBalanceAmount);
        	if(checkStatus == true){
        		// var checkedArray = [];
       			// var uncheckedArray = [];
               // alert('bal'+$scope.invoice.appointmentBalanceAmount+ '  cost'+ cost);
               // alert(   $scope.invoice.appointmentBalanceAmount > 0 && (parseInt($scope.invoice.appointmentBalanceAmount) >= parseInt(cost) )  );
        		if($scope.invoice.appointmentBalanceAmount > 0 && (parseInt($scope.invoice.appointmentBalanceAmount) >= parseInt(cost) )){


    //     			var array1 = costs.reduce(function(acc, val) {
				// 	  return acc + val;
				// },0);
        			console.log($scope.invoice.serviceDetails);
	              	console.log($scope.invoice.prescriptionDetails);
	              	console.log($scope.additionalInTable);
        			$scope.invoice.amount = JSON.parse($scope.invoice.amount) - JSON.parse(cost);
        			$scope.invoice.appointmentBalanceAmount = $scope.invoice.appointmentBalanceAmount -  JSON.parse(cost);
        			// $scope.invoice.previousAppPayment = JSON.parse($scope.invoice.defaultPreviousAppBalanceAmount) - JSON.parse($scope.invoice.appointmentBalanceAmount);
        		}else{
        			if(type == 'service'){
        				$scope.invoice.checkService[index] = false;
        			}
        			if(type == 'product'){
        				$scope.invoice.checkProduct[index] = false;
        			}
        			if(type == 'additional'){
        				$scope.invoice.checkAdditionalStatus[index] = false;
        			}

        			toastr.error("Payment Exceeds the previous appointment cost");
        			return false;
        		}

        	}else{
        		$scope.invoice.amount = JSON.parse($scope.invoice.amount) + JSON.parse(cost);
        		$scope.invoice.appointmentBalanceAmount = JSON.parse($scope.invoice.appointmentBalanceAmount) + JSON.parse(cost);

        	}
        	$scope.invoice.previousAppPayment = JSON.parse($scope.invoice.defaultPreviousAppBalanceAmount) - JSON.parse($scope.invoice.appointmentBalanceAmount);
        	// alert($scope.invoice.previousAppPayment);
        	vm.previousAppPaymentCal(cost,checkStatus);


        }

        $scope.$watch('vm.invoice.paymentStatus',function(newValue){
            if(newValue == 'installment'){
                $scope.isOpenPayment    =   true;
            }
            else{
                $scope.isOpenPayment    =   false;
            }
        });

     

        /*
          Getting total invoice by clinic Id
        */
        function getInvoice() {
            var id = JSON.parse($window.localStorage.getItem('user'))["id"];
            vm.invoiceDatas = [];
            if ($rootScope.online) {
                $rootScope.practysLoader = true;
                invoiceService.getInvoice(id).then(function(response) {
                    console.log(response.data.message);
                    if (response.data.status == "success") {
                    	$scope.tableView = false;
            			$scope.printView = false;
                        // $scope.refresh();
                        $rootScope.practysLoader = false;
                        vm.resetEnable = true;
                        $timeout(function() {
                                vm.invoiceDatas = response.data.message;
                                vm.totalItems = vm.invoiceDatas.length;
                        }, 10);
                    } else {
                        $rootScope.practysLoader = false;
                        toastr.error(response.data.message);
                        vm.totalItems = 0;
                        vm.invoiceDatas = [];
                        // console.log("server error");
                    }

                });
            } else if ($rootScope.userLevel == 'clinic') {


                invoiceOfflineService.getInvoices(id).then(function(resp){
                    if(resp){
                        if(resp.getInvoicesData.length > 0){
                            vm.invoiceDatas = resp.getInvoicesData;
                            vm.totalItems   = vm.invoiceDatas.length;
                            $scope.tableView = false;
                            $scope.printView = false;
                            $rootScope.practysLoader = false;
                            vm.resetEnable = true;
                        }else{
                             $rootScope.practysLoader = false;
                            toastr.error(response.data.message);
                            vm.totalItems = 0;
                            vm.invoiceDatas = [];;
                        }
                    }
                });

            }
        }

        /*
          search by dates
        */
        function searchFilter() {
            vm.invoice.id = JSON.parse($window.localStorage.getItem('user'))["id"];

                if (vm.invoice.toDate != undefined && vm.invoice.toDate != '' && vm.invoice.toDate != 'Invalid date' && vm.invoice.fromDate != undefined && vm.invoice.fromDate != '' && vm.invoice.fromDate != 'Invalid date') {
                    vm.invoice.toDate = moment(new Date(vm.invoice.toDate)).format("YYYY-MM-DD");
                    vm.invoice.fromDate = moment(new Date(vm.invoice.fromDate)).format("YYYY-MM-DD");
                    console.log(vm.invoice);
                     if ($rootScope.online) {
                            invoiceService.searchFilter(vm.invoice).then(function(response) {
                                if (response.data.status == "success") {
                                    vm.resetEnable = false;
                                    // vm.invoice.toDate = "";
                                    // vm.invoice.fromDate = "";
                                    vm.invoiceDatas = response.data.message;
                                    vm.totalItems = vm.invoiceDatas.length;
                                } else {
                                    vm.resetEnable = false;
                                    vm.invoiceDatas = "";
                                     vm.totalItems = 0;
                                    console.log("server error");
                                }
                            });
                        }else if ($rootScope.userLevel == 'clinic') {
                            vm.invoiceDatas = [];

                            invoiceOfflineService.searchFilter(vm.invoice.fromDate,vm.invoice.toDate,vm.invoice.id).then(function(resp){
                                    if(resp){
                                        if(resp.getInvoicesSearchData.length > 0){
                                            vm.invoiceDatas = resp.getInvoicesSearchData;
                                            vm.totalItems   = vm.invoiceDatas.length;
                                            $scope.tableView = false;
                                            $scope.printView = false;
                                            $rootScope.practysLoader = false;
                                            vm.resetEnable = false;
                                        }else{
                                             $rootScope.practysLoader = false;
                                            toastr.error(response.data.message);
                                            vm.totalItems = 0;
                                            vm.invoiceDatas = [];;
                                        }
                                    }
                            });
                        }
                    } else {
                            toastr.error("Select the From & to date")
                        }

                }
                // $SQLite.ready(function() {
                //     this.select('SELECT * FROM practysapp_invoices WHERE (practysapp_invoices.invoiceDate BETWEEN ? AND ?) AND practysapp_invoices.clinicId = ?', [vm.invoice.fromDate, vm.invoice.toDate, vm.invoice.id]).then(function() {
                //         console.log("empty result");
                //         toastr.error("No Data Found");
                //     }, function() {
                //         console.log("error");
                //     }, function(data) {
                //         // console.log(data.item);
                //         vm.resetEnable = false;
                //         vm.invoiceDatas.push(data.item);
                //         $scope.totalItems = data.count;
                //     });
                // });
                // $timeout(function() {
                //     angular.forEach(vm.invoiceDatas, function(value, key) {
                //         utilService.getUserDetails(value.patientId).then(function(response) {
                //             vm.invoiceDatas[key].patient = response;
                //         });
                //         utilService.getUserDetails(value.doctorId).then(function(response) {
                //             vm.invoiceDatas[key].doctor = response;
                //         });
                //     });
                // }, 3000);

        //     }
        // }

        function unpaid(obj,invoice) {
        	// alert("check");
        	console.log(obj);
        	console.log(invoice);
            console.log(obj.amount);
            console.log(obj.payment);
            console.log(obj.amount - obj.payment);
            // return false;

          if(obj.paymentType == 'cash'){
            // alert("cash");
              if (obj.checked == false) {
                obj.paymentStatus = 'unpaid';
                if(obj.previousAppPaymentCheck != true){
                    alert("prev payment true");
                	if (parseInt(obj.payment) == undefined) {
	                    toastr.error("Enter the amount for payment");
	                    return false;
                	}
                }

                if (obj.discountAmount != undefined) {
                    // alert("if");
                    if (parseInt(obj.amount) > parseInt(obj.payment)) {
                        toastr.error("Enter the full amount or go with installment");
                        return false;
                    } else if (parseInt(obj.amount) < parseInt(obj.payment)) {
                        toastr.error("Payment amount is greater than the service cost");
                        return false;
                    } else {
                        vm.updateInvoice(obj);
                    }
                } else {
                    // alert("else");
                	if(obj.previousAppPaymentCheck != true){
	                    if (parseInt(obj.amount) > parseInt(obj.payment)) {
	                        toastr.error("Enter the full amount or go with installment");
	                        return false;
	                    }else if(parseInt(obj.amount) < parseInt(obj.payment)){
	                    	toastr.error("Payment Amount Exceeds the Bill Amount");
	                        return false;
	                    }else {
	                        vm.updateInvoice(obj);
	                    }
                	}else{
                		vm.updateInvoice(obj);
                	}
                }

            } else {
                invoice.paymentStatus = 'installment';
                vm.updateInvoice(obj);
            }
          }
          else{
            invoice.paymentStatus = 'unpaid';
            vm.updateInvoice(obj);
          }

        }

        $scope.installmentUpdate = function(checked){
          // $scope.invoice.discount = undefined;
          // $scope.invoice.discountAmount = undefined;
          $scope.invoice.payment  = 0;
          vm.change('edit',$scope.invoice);
        }


        $scope.addElements =function(obj){


        	$scope.invoiceEdited = true;
        	var additionalElementCost = [];

        	  //$scope.additionalInTable = obj;
             // console.log($scope.invoice.additionalItems);

             // console.log(obj);

             // console.log(JSON.parse($scope.invoice.additionalItems));
             console.log(vm.additionalDatass);

             var alreadyPresentDatas = JSON.parse($scope.invoice.additionalItems);

             if($scope.invoice.additionalItems)
             {
             	// var alreadyPresentDatas = alreadyPresentDatas.concat(obj);
             	if($scope.additElements == ''){
             		$scope.additElements = alreadyPresentDatas;
             	}
             	

             	// $scope.additionalInTable =  alreadyPresentDatas;
             	// $scope.additElements = alreadyPresentDatas;
             }
             // else{
             	
             // 	if(obj.length > 1){
             // 		angular.forEach(obj,function(value,key){
             // 			$scope.additElements.push(value);
             // 		});
             // 	}else{
             // 		$scope.additElements.push(obj[0]);
             // 	}
            	// // $scope.additionalInTable = obj;
             // }
             if(obj.length > 1){
         		angular.forEach(obj,function(value,key){
         			$scope.additElements.push(value);
         		});
         	}else{
         		$scope.additElements.push(obj[0]);
         	}


        	angular.forEach($scope.additElements,function(value,key){
        		additionalElementCost.push(value.amount);
        	});
        	if(additionalElementCost != ""){
        		var costs = additionalElementCost.map(Number);

        		// for calculating the remaining balance

        		var lastCost = costs[costs.length - 1];
				var array1 = costs.reduce(function(acc, val) {
					  return acc + val;
				},0);
				// alert(array1);
				// alert($scope.invoice.amount);
				$scope.invoice.amount = JSON.parse($scope.invoice.amount) + array1;
				if($scope.invoice.previousAppPaymentCheck != true){

					$scope.invoice.remainingBalance = JSON.parse($scope.invoice.amount) + array1;
				}

        	}

             // if($scope.invoice.additionalItems)
             // {
           	    // vm.additionalDatass = $scope.additionalInTable;
            // }else{
            	vm.additionalDatass  = $scope.additElements;
            // }

            $scope.additionalInTable = $scope.additElements;


        	// $scope.additionalElementsArray = [{ name: '', amount: '',productPaymentStatus: 'false'}];
        	$scope.invoice.additionalShow = false;
        	$scope.invoice.additionalCheckShow = false;

        	vm.subTotalCalculation();
        	$scope.additionalElementsArray = [{ name: '', amount: '',productPaymentStatus: 'false'}];

        	// when the additional element is added the balance amount is to incre or decre
        	// $scope.invoice.balanceAmount = (JSON.parse($scope.invoice.balanceAmount) + parseInt(lastCost)).toFixed(2);
        	// $scope.invoice.pendingAmount = $scope.invoice.balanceAmount;
            // $scope.additionalElementsArray = [{ name: '', amount: '',productPaymentStatus: 'false'}];
            //After payment completion, while the status is paid and there is no pending amounts, if the patient was to add additional items in the billing
            // if($scope.invoice.paymentStatus == 'paid' && ($scope.invoice.appointmentBalanceAmount == 0 || $scope.invoice.appointmentBalanceAmount == null)){
            //     $scope.invoice.paymentStatus = 0;
            //     $scope.invoice.pendingAmount = 0;
            // }
        }

        /*
          Updating invoice
        */
        function updateInvoice(invoice) {


           // console.log(Math.round(invoice.remainingBalance));
           // return false;
            // return false;
            // if (form.$dirty && form.$valid) {
                if (invoice.patient == '' && invoice.doctor == '') {
                    return false;
                } else {

                    if (invoice.paymentStatus != 'paid') {
                        if (invoice.remainingBalance != undefined) {
                            if (Math.round(invoice.remainingBalance) != 0) {
                                if (Math.round(invoice.remainingBalance) < 0) {
                                    toastr.error("Payment amount is greater than the service cost");
                                    return false;
                                } else {
                                	// alert("else");
                                	if(invoice.installments){
                                		invoice.paymentStatus = 'installment';
                                	}
                                	invoice.pendingAmount = parseInt(invoice.remainingBalance);
                                	if(invoice.currentAppStatus){
                                		invoice.pendingAmount = invoice.balanceAmount;
                                	}
                                }
                            } else {
                            	if(!invoice.installments && !invoice.previousAppPaymentCheck){
                            		invoice.pendingAmount = invoice.appointmentBalanceAmount;
                            		invoice.currentAppStatus = true;
                                	invoice.paymentStatus = 'unpaid';
                                }else{
                                	invoice.pendingAmount = parseInt(invoice.remainingBalance) ;
                                	invoice.paymentStatus = 'paid';
                                }

                                if(invoice.currentAppStatus && invoice.appointmentBalanceAmount == 0){
                                		invoice.pendingAmount = 0;
                                		invoice.paymentStatus = 'paid';
                                }


                            }
                        }
                        // else {
                        //     toastr.error("Enter the amount for payment");
                        //     return false;
                        // }
                    }





                    // if(invoice.checkProduct != ""){
                    // 	// alert("inside");
                    // 	angular.forEach(invoice.checkProduct,function(value1,key1){
                    // 		// console.log(key1);
                    // 		if(value1 == true){
                    // 			angular.forEach($scope.invoice.prescriptionDetails,function(value,key){
	                   //  			if(key1 == key){
	                   //  				// alert("success");
	                   //  				value.productPaymentStatus = true;
	                   //  			}
	                   //  		});
                    // 		}
                    // 	})

                    // }
                    // if(invoice.checkService != ""){
                    // 	// alert("inside service");
                    // 	angular.forEach(invoice.checkService,function(value1,key1){
                    // 		// alert(value1);
                    // 		if(value1 == true){
                    // 			angular.forEach($scope.invoice.serviceDetails,function(value,key){
	                   //  			if(key1 == key){
	                   //  				value.productPaymentStatus = true;
	                   //  			}
	                   //  		});
                    // 		}
                    // 	})
                    // }

                    if(vm.additionalDatass != ""){
                    	console.log(vm.additionalDatass);
                    	angular.forEach(invoice.checkAdditionalStatus,function(value1,key1){
                    		// alert(value1);
                    		if(value1 == true){
                    			angular.forEach(vm.additionalDatass,function(value,key){
	                    			if(key1 == key){
	                    				value.productPaymentStatus = true;
	                    			}
	                    		});
                    		}
                    	})
                    	invoice.additionalElements = vm.additionalDatass;
                    	console.log(invoice.additionalElements);
                    }
                    // if(invoice.previousAppDetails != ""){
                    //     console.log(invoice.previousAppDetails);
                    //     angular.forEach(invoice.checkPreviousAmppointment,function(value1,key1){
                    //         // alert(value1);
                    //         if(value1 == true){
                    //             angular.forEach(invoice.previousAppDetails,function(value,key){
                    //                 if(key1 == key){
                    //                     value.productPaymentStatus = true;
                    //                 }
                    //             });
                    //         }
                    //     })
                        // invoice.additionalElements = vm.additionalDatass;
                        // console.log(invoice.additionalElements);
                    // }



                   // return false;
                    if(invoice.previousAppointmentBalanceAmount != null && invoice.previousAppointmentBalanceAmount != 0){
                    	if(invoice.previousAppPaymentCheck == true){
                    		invoice.amount = $scope.invoice.defaultAmount;
	                    	// if(invoice.installment == true){
	                    	// 	invoice.amount = $scope.invoice.defaultAmount;
				            	// invoice.pendingAmount = parseInt($scope.invoice.remainingBalance) - invoice.previousAppPayment ;
				            	// invoice.paymentStatus = 'installment';
	                    	// }else{
	                    	// 	invoice.amount = $scope.invoice.defaultAmount;
				            	// invoice.pendingAmount = parseInt($scope.invoice.defaultPreviousAppBalanceAmount) - invoice.previousAppPayment;
				            	// invoice.paymentStatus = 'paid';
	                    	// }

			            }
			            // if(invoice.installments == true || (invoice.paymentStatus == 'paid' && invoice.previousAppPaymentCheck != true)){

			            // 	invoice.amount = $scope.invoice.defaultAmount;
			            // 	invoice.pendingAmount = (parseInt($scope.invoice.defaultPreviousAppBalanceAmount) + JSON.parse(invoice.defaultAmount)) - JSON.parse(invoice.payment);
			            // 	// invoice.paymentStatus = 'paid';
			            // }
                    }


		            // if(invoice.paymentStatus == 'paid'){
		            // 	invoice.amount = $scope.invoice.defaultAmount;
		            // 	invoice.pendingAmount = (JSON.parse($scope.invoice.defaultPreviousAppBalanceAmount) + JSON.parse(invoice.defaultAmount)) - JSON.parse(invoice.payment);
		            // }

                    // return false;
                    invoice.amount = $scope.invoice.subTotal;
                    invoice.patientId = invoice.patient.id;
                    invoice.doctorId = invoice.doctor.id;
                    invoice.invoiceDate = moment(new Date(invoice.invoiceDate)).format("YYYY-MM-DD");


                    if ($rootScope.online) {


                        invoiceService.updateInvoice(invoice).then(function(resp) {
                            if (resp.data.status == "success") {
                                vm.getInvoice();

                                $state.go("invoice");
                                toastr.success("updated successfully");
                                // ngDialog.close();
                                 // vm.print(x);
                            } else {
                                $rootScope.practysLoader = false;
                                toastr.error(resp.data.message);
                            }
                        });
                    } else {
                        vm.data = {};
                        vm.data.id = invoice.id;
                        vm.data.invoiceDate = invoice.invoiceDate;
                        vm.data.clinicId = invoice.clinicId;
                        vm.data.invoiceId = invoice.invoiceId;
                        vm.data.patientId = invoice.patientId;
                        vm.data.description = invoice.description;
                        vm.data.doctorId = invoice.doctorId;
                        vm.data.amount = invoice.amount;
                        vm.data.paymentStatus = invoice.paymentStatus;
                        vm.data.created = invoice.created;
                        vm.data.modified = invoice.modified;
                        vm.data.isDeleted = invoice.isDeleted;
                        vm.data.is_sync = 0;
                        utilService.getInvoice(invoice.id).then(function(resp) {
                            if (resp.is_Created == 0) {
                                vm.data.is_Created = 0;
                            } else {
                                vm.data.is_Created = 1;
                            }
                        });
                        $SQLite.ready(function() {
                            this.replace('practysapp_invoices', vm.data)
                                .then(
                                    function(updatedId) {
                                        if (updatedId) {
                                            toastr.success('updated in Offline Database');
                                            vm.getInvoice();
                                        }
                                    },
                                    function(err) {
                                        console.log(err);
                                        toastr.error('error updating in local database ');
                                    })
                        });
                        ngDialog.close();
                    }
                }
            // } else {
            //     toastr.error("Change Fields Before Submit");
            //     return false;
            // }
        }



        $scope.patientSelection = {
            onSelect: function(item) {
                console.log(item);
                console.log(item.id);


            }
        };
        $scope.doctorSelection = {
            onSelect: function(item) {
                console.log(item);
                console.log(item.id);


            }
        };


        /*
            Function that Initially run when the controller loads at first
        */

        function init() {
            vm.getInvoice();
            vm.getInventoryProduct();
            var id = JSON.parse($window.localStorage.getItem('user'))["id"];
            if ($rootScope.online) {
                utilService.getDoctors(null, id).then(function(resp) {
                    if (resp.data.status == 'success') {
                        vm.doctors = resp.data.message;
                    }
                });
            } else if ($rootScope.userLevel == 'clinic') {
                vm.doctors = [];
                vm.data = [];
                $SQLite.ready(function() {
                    this.select('SELECT * FROM practysapp_specialityUserMaps WHERE practysapp_specialityUserMaps.clinicId = ?  AND practysapp_specialityUserMaps.specialityId != ? GROUP BY practysapp_specialityUserMaps.userId', [id, 0]).then(function() {
                        console.log("empty result");
                    }, function() {
                        console.log("error");
                    }, function(data) {
                        vm.data.push(data.item);
                    });
                });
                $timeout(function() {
                    angular.forEach(vm.data, function(value, key) {
                        utilService.getUserDetails(value.userId).then(function(response) {
                            vm.doctors.push(response);
                        });
                    });
                }, 2000);
            }
            if ($state.current.method != undefined) {
            	console.log($stateParams.id);
                vm[$state.current.method]();
            }
        }


        //get Product and other details
        function getInventoryProduct(){
          vm.drugs = [];
          vm.others = [];
            appointmentService.getInventoryProduct(vm.clinicId).then(function(resp){
                if(resp.data.status == "success"){
                  angular.forEach(resp.data.message, function(Value, Key) {
                    if(Value.productType == 'Drug'){
                      vm.drugs.push(Value);
                    }
                    if(Value.productType == 'Other'){
                      vm.others.push(Value);
                    }
                  });
                }
            });
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

        function addDrugsRow(){


          if(vm.drugSuggest[vm.drugSuggest.length-1].drugName == '' || vm.drugSuggest[vm.drugSuggest.length-1].drugName == null || vm.drugSuggest[vm.drugSuggest.length-1].qty == '' || vm.drugSuggest[vm.drugSuggest.length-1].qty == null ){
          	toastr.error("Select the Drug and Quantity,..");
          	return false;
          }

          vm.drugSuggest.push({ drugName: '', qty: '',note:'' });


        }

        function delDrugsRow(index) {

            vm.drugSuggest.splice(index, 1);
        }

        function delProdRow(index) {
            vm.productSuggest.splice(index, 1);
        }

        function addProdRow(){
          if(vm.productSuggest[vm.productSuggest.length-1].productName == '' || vm.productSuggest[vm.productSuggest.length-1].productName == null || vm.productSuggest[vm.productSuggest.length-1].qty == '' || vm.productSuggest[vm.productSuggest.length-1].qty == null ){
            toastr.error("Select the product and Quantity,..");
            return false;
          }
              vm.productSuggest.push({ productName: '', qty: '',usage:'' });
        }

        function addBillingList() {
        	console.log(vm.billingItem);
          if(vm.billingItem[vm.billingItem.length-1].billingItem == '' || vm.billingItem[vm.billingItem.length-1].billingItem == null || vm.billingItem[vm.billingItem.length-1].amount == '' || vm.billingItem[vm.billingItem.length-1].amount == null ){
              toastr.error("Select Name and Price");
              return false;
          }else{
          	 vm.billingItem.push({billingItem:'',amount:''});
          	}
        }

        function  removingBillingList(index) {
            vm.billingItem.splice(index, 1);
        }

        function createInvoice(formDetails){
            $rootScope.practysloader = true;
            vm.sendDetails.invoiceItems = [];
          if(vm.invoice.patient && vm.invoice.invoiceDate && vm.invoice.doctor && vm.clinicId){
            if(vm.billingItem[vm.billingItem.length-1]['billingItem'] == '' || vm.billingItem[vm.billingItem.length-1]['billingItem'] == null || vm.billingItem[vm.billingItem.length-1]['amount']  == '' || vm.billingItem[vm.billingItem.length-1]['amount'] == null){
              toastr.error("Billing Details Required");
              return false;
            }else{
              if(vm.otherShow){
                if(vm.productSuggest[vm.productSuggest.length-1].productName == '' || vm.productSuggest[vm.productSuggest.length-1].productName == null || vm.productSuggest[vm.productSuggest.length-1].qty == '' || vm.productSuggest[vm.productSuggest.length-1].qty == null){
                  toastr.error("Other Product Required");
                  return false;
                }else{
                   angular.forEach(vm.productSuggest, function(Value, Key) {
                    if(Value.qty != ''){
                        Value.productPaymentStatus = false;
                        Value.amount =  Value.productName.sellingPrice * Value.qty;
                        vm.sendDetails.invoiceItems.push(Value);
                    }

                  });
                }
              }
              if(vm.drugShow){
                if(vm.drugSuggest[vm.drugSuggest.length-1].drugName == '' || vm.drugSuggest[vm.drugSuggest.length-1].drugName == null || vm.drugSuggest[vm.drugSuggest.length-1].qty == '' || vm.drugSuggest[vm.drugSuggest.length-1].qty == null){
                  toastr.error("Drugs Details  Required");
                  return false;
                }else{
                    angular.forEach(vm.drugSuggest, function(Value, Key) {
                        if(Value.qty != ''){
                            Value.productPaymentStatus = false;
                            Value.amount =  Value.drugName.sellingPrice * Value.qty;
                            vm.sendDetails.invoiceItems.push(Value);
                        }

                    });
                }
              }
              if(vm.billingItem != ''){
                angular.forEach(vm.billingItem, function(Value, Key) {
                    Value.productPaymentStatus = false;
                    vm.sendDetails.invoiceItems.push(Value);
                });
              }
              vm.sendDetails.patientId                    = vm.invoice.patient.id;
              vm.sendDetails.doctorId                     = vm.invoice.doctor.id;
              vm.sendDetails.clinicId                     = vm.clinicId;
              vm.sendDetails.invoiceDate                  = moment(vm.invoice.invoiceDate).format("YYYY-MM-DD");
              vm.sendDetails.tax                          = vm.invoice.tax;
              vm.sendDetails.discount                     = vm.invoice.discount;
              vm.sendDetails.description                  = vm.invoice.description;
              vm.sendDetails.total                  	  = 0;
            
             if ($rootScope.online) {
                invoiceService.addInvoice(vm.sendDetails).then(function(resp) {
                    if (resp.data.status == "success") {
                        // vm.getInvoice();
                        $rootScope.practysloader = false;
                        ngDialog.close();
                        toastr.success(resp.data.message);
                        // After Creating manual invoice redirect page to print option
                        if(resp.data.lastInsertedId){
                           
                           $state.go('editSpecificInvoice',{id: resp.data.lastInsertedId });
                            
                        }
                        vm.drugSuggest = [{drugName: '', qty: '' , note:''}];
			            vm.productSuggest = [{productName: '', qty: '',usage:'' }];
			            vm.billingItem = [{billingItem:'',amount:''}];
			            vm.drugShow = false;
			            vm.otherShow = false;
                    }else {
                        $rootScope.practysloader = false;
                        toastr.error(resp.data.message);
                    }
                });
            }else if ($rootScope.userLevel == 'clinic') {
                var data = {};
                data.amount = vm.invoice.amount;
                data.clinicId = vm.invoice.clinicId;
                data.doctorId = vm.invoice.doctorId;
                data.invoiceDate = vm.invoice.invoiceDate;
                data.is_sync = 0;
                data.is_Created = 0;
                data.patientId = vm.invoice.patientId;
                data.paymentStatus = vm.invoice.paymentStatus;
                data.description = vm.invoice.description;
                $SQLite.ready(function() {
                    this.insert('practysapp_invoices', data).then(function(data) {
                        console.log(data);
                        toastr.success("Invoice Created in offline");
                        vm.getInvoice();
                    }, function(error) {
                        console.log(err)
                    });
                });
                ngDialog.close();
            }

            }
          }
        }
        function addInvoiceCalc(invoiceDetails){
        	vm.sendDetails.amount   = 0;
        	if(vm.billingItem.length > 0){
                angular.forEach(vm.billingItem,function(value,key){
                    console.log(value);
                    if(value.amount){
                      vm.sendDetails.amount = vm.sendDetails.amount + parseInt(value.amount);
                    }
                });
              }
              if(vm.productSuggest.length > 0 && invoiceDetails.otherShowModel){
                var productSuggestAmount  =  0;
                  angular.forEach(vm.productSuggest,function(value,key){
                    if(value.productName.sellingPrice && value.qty){
                      vm.sendDetails.amount =  vm.sendDetails.amount + parseInt(value.productName.sellingPrice * value.qty);
                    }
                  });
              }
              if(vm.drugSuggest.length > 0 && invoiceDetails.drugShowModel){
                angular.forEach(vm.drugSuggest,function(value,key){
                    console.log(value);
                    if(value.drugName.sellingPrice && value.qty){
                      vm.sendDetails.amount =  vm.sendDetails.amount + parseInt(value.drugName.sellingPrice * value.qty);
                    }
                });
              }

              	invoiceDetails.tax = (invoiceDetails.tax != '' && invoiceDetails.tax != null) ? invoiceDetails.tax : '';
              	invoiceDetails.discount = (invoiceDetails.discount != '' && invoiceDetails.discount != null) ? invoiceDetails.discount : '';
              	invoiceDetails.amount = vm.sendDetails.amount;
              	vm.invoice.totalAmount = vm.taxCal(invoiceDetails);

              console.log(vm.sendDetails);

        }

        //deleting the invoice by id....
        function deleteInvoice(id){
        	if(id){
        		$rootScope.practysloader = true;
        		invoiceService.deleteInvoice(id).then(function(resp){
        			if(resp.data.status == 'success'){
        				$rootScope.practysloader = false;
        				vm.getInvoice();
        			}else{
        				$rootScope.practysloader = false;
        				toastr.error(resp.data.message);
        			}
        		});
        	}else{
				toastr.error("Id is missing");
        	}
        }

        vm.init();
    }


})();

