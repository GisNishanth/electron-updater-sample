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

(function() {
    'use strict';

    angular
        .module('practysApp')
        .controller('inventoryController', inventoryController);

    inventoryController.$inject = ['$rootScope', '$scope', '$SQLite', 'inventoryService','inventoryOfflineService','$state', '$window', 'Auth', '$filter', 'toastr', 'ngDialog', '$timeout', 'utilService'];


    function inventoryController($rootScope, $scope, $SQLite, inventoryService,inventoryOfflineService,$state, $window, Auth, $filter, toastr, ngDialog, $timeout, Utils) {


        if (!Auth.isLoggedIn()) {
            $location.path('/login');
            return false;
        }


        /*
            Declaration Part
        */

        $scope.currentPage = 1;
        $scope.maxSize = 10;

        $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
        $scope.datasetOverride = [
            {
                label: "usage",
                borderWidth: 3,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                type: 'line'
            }
        ];
        $scope.weeklabel = ["mon", "tue", "wed", "thur", "fri", "sat", "sun"];
        $scope.weeklabels = [];
        $scope.monthlabels = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.yearlabels = [];

        $scope.keyup =function(vals){
        // console.log(vals.length);
        $scope.totalItems = vals.length;

        }



        var vm = this;
        vm.inventory = {};
        vm.addInventory = addInventory;
        vm.editInventory = editInventory;
        vm.updateInventory = updateInventory;
        vm.searchFilter = searchFilter;
        vm.getInventory = getInventory;
        vm.getInventoryUsage = getInventoryUsage;
        vm.getInventoryDrugs = getInventoryDrugs;
        vm.init = init;
        vm.setTab = setTab;
        vm.isSet = isSet;
        vm.auditPop = auditPop;
        vm.cancel = cancel;
        vm.deleteInventory = deleteInventory;

        vm.format = "yyyy-MM-dd";
        vm.searchEnable = true;
        vm.yeardata = [];
        vm.yeardatas = [];
        vm.weekdata = [];
        vm.weekdatas = [];
        vm.weekdatass = [
            [0, 0, 0, 0, 0, 0, 0]
        ];
        vm.monthdatass = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        vm.yeardatass = [
            [0, 0, 0, 0, 0]
        ];
        vm.monthdata = [];
        vm.monthdatas = [];
        vm.tab = 1;
        vm.openAddInventory = openAddInventory;
        vm.openDialogBox = openDialogBox;
        vm.clinicId = JSON.parse($window.localStorage.getItem('user'))["id"];


        $scope.reverse = false;

        $scope.sort = function(keyname) {
                $scope.sortKey = keyname;
                $scope.reverse = !$scope.reverse;
         }
            //dialog box
        function openDialogBox(id) {
            $rootScope.popup = false;
            vm.inventory.drugs = [];
            $rootScope.inventoryPopup = false;
            if ($rootScope.online) {
                Utils.getDrugs(vm.clinicId).then(function(resp) {
                    if (resp.data.status == "success") {
                        vm.inventory.drugs = resp.data.message;
                    }
                });
            } else if ($rootScope.userLevel == 'clinic') {
                $SQLite.ready(function() {
                    this.select('SELECT * FROM practysapp_drugs WHERE practysapp_drugs.clinicId = ?', [vm.clinicId]).then(function() {
                        console.log("empty result");
                        toastr.error("No Data Found");
                    }, function() {
                        console.log("error");
                    }, function(data) {
                        vm.inventory.drugs.push(data.item);
                    });
                });
            }
            vm.inventory.edit = true;
            vm.inventory.add = false;
            $rootScope.practysLoader = false;
            ngDialog.open({
                templateUrl: 'components/inventory/EditInventory.html',
                controller: 'inventoryController',
                scope: $scope
            });
        };


        function cancel() {
            ngDialog.close();
        }
        /*add inventory dialog box */
        function openAddInventory() {
            $rootScope.popup = false;
            vm.inventory = {};
            vm.inventory.add = true;
            vm.inventory.edit = false;
            $rootScope.inventoryPopup = false;
            if ($rootScope.online) {
                Utils.getDrugs(vm.clinicId).then(function(resp) {
                    if (resp.data.status == "success") {
                        vm.inventory.drugs = [];
                        vm.inventory.drugs = resp.data.message;
                        // angular.forEach(resp.data.message,function(value,key){
                        //         vm.inventory.drugs.push(value.name);
                        // });
                        console.log(vm.inventory,"checkkkkkkkkkkkkkkk");
                    } else {
                        toastr.error("No Datas Found");
                    }
                });
            } else{
                vm.inventory.drugs = [];
                $SQLite.ready(function() {
                    this.select('SELECT * FROM practysapp_drugs WHERE practysapp_drugs.clinicId = ?', [vm.clinicId]).then(function() {
                        console.log("empty result");
                    }, function() {
                        console.log("error");
                    }, function(data) {
                        console.log(data.item);
                        vm.inventory.drugs.push(data.item);

                    });
                });
            }
            ngDialog.open({
                templateUrl: 'components/inventory/addInventory.html',
                controller: 'inventoryController',
                scope: $scope
            });
        }

        /*view audits dialog box */
        function auditPop(id) {
        	// alert("xdfbvszdfv");
            $rootScope.practysLoader = true;
            $rootScope.inventoryPopup = true;
            $scope.currentPage = 1;
            if ($rootScope.online) {
                inventoryService.getInventoryAudits(id).then(function(resp) {
                    if (resp.data.status == 'success') {
                        $rootScope.practysLoader = false;
                        $scope.inventoryAudits = resp.data.message;
                        $scope.totalInventItems = resp.data.message.length;
                    } else {
                        $rootScope.practysLoader = false;
                        $scope.inventoryAudits = "";
                        $scope.totalInventItems = 0;
                        toastr.error("Datas not found");
                    }
                });
            } else {
                $scope.inventoryAudits = [];
                inventoryOfflineService.viewInventory(id).then(function(resp){
                    if(resp){
                        if(resp.viewInventoryData){
                            $scope.inventoryAudits =   (resp.viewInventoryData);
                            $scope.totalInventItems =  $scope.inventoryAudits.length;
                        }else{
                            $scope.inventoryAudits = "";
                            $scope.totalInventItems = 0;
                            toastr.error("Datas not found");
                        }
                    }
                    $rootScope.practysLoader = false;
                });
            }
            ngDialog.open({
                template: 'auditPop',
                scope: $scope
            });
        }
        function deleteInventory(id){
        	if(id){
        		$rootScope.practysLoader = true;
        		inventoryService.deleteInventory(id).then(function(resp) {
                    if (resp.data.status == 'success') {
                        vm.getInventory();
                        $rootScope.practysLoader = false;
                    } else {
                        $rootScope.practysLoader = false;
                        toastr.error(resp.data.message);
                    }
                });
        	}else{
        		toastr.error("Id is missing");
        		return false;
        	}
        }

        /* PDF Generation*/
        $scope.createPDF = function(id) {
            vm.inventoryUsageLoader = true;
            html2canvas(document.getElementById(id), {
                onrendered: function(canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [
                            'Inventory Usage For' + ' ' + id, {
                                image: data,
                                height: 400,
                                width: 500,
                                style: 'imageAlign'
                            }
                        ],
                        styles: {
                            imageAlign: {
                                margin: [0, 10, 0, 10]
                            }
                        }
                    };
                    console.log(docDefinition);
                    vm.inventoryUsageLoader = false;
                    pdfMake.createPdf(docDefinition).download("inventoryUsage.pdf");

                }
            });
        };


        /* Functionality for tabs
         */

        function setTab(tabId) {
            if (tabId == "1") {
                var data = "week";
                vm.getInventoryUsage(data, vm.clinicId);
                vm.tab = 1;
            } else if (tabId == "2") {
                var data = "month";
                vm.getInventoryUsage(data, vm.clinicId);
                vm.tab = 2;
            } else {
                var data = "year";
                vm.getInventoryUsage(data, vm.clinicId);
                vm.tab = 3;
            }
        };

        /* Functionality for getting the previous six days 
          from the current day
          */

        for (var i = 6; i >= 0; i--) {
            var cdate = new Date();
            var previousDate = new Date();
            previousDate.setDate(previousDate.getDate() - i);
            $scope.prevDay = $filter('date')(previousDate, 'EEEE');
            $scope.weeklabels.push($scope.prevDay);

        }

        /* Functionality for getting the previous four years 
         from the current year
         */

        for (var i = 4; i >= 0; i--) {
            var myDate = new Date();
            var previousYear = new Date(myDate);

            var prev = previousYear.setYear(myDate.getFullYear() - i);
            $scope.prevYear = $filter('date')(previousYear, 'yyyy');
            $scope.yearlabels.push($scope.prevYear);

        }

        function isSet(tabId) {
            return vm.tab === tabId;
        };



        /*
          functionalities for date picker
        */

        $scope.openDatePickers = [];
        $scope.openDatePicker = [];
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

        /*
          function to create or update or get Inventory details
        */

        function getInventory() {
            if ($rootScope.online) {
                $rootScope.practysLoader = true;
                inventoryService.getInventory(vm.clinicId).then(function(resp) {
                    if (resp.data.status == "success") {
                        $rootScope.practysLoader = false;
                        vm.searchEnable = true;
                        vm.inventoryDatas = resp.data.message;
                        $scope.totalItems = vm.inventoryDatas.length;
                    } else {
                        vm.inventoryDatas = "";
                        $scope.totalItems = 0;
                        $rootScope.practysLoader = false;
                        toastr.error("No Datas Found");
                    }
                });
            }else if($rootScope.userLevel == 'clinic'){
                vm.inventoryDatas = [];
                inventoryOfflineService.getInventory(vm.clinicId).then(function(resp){
                    if(resp){
                        if(resp.getinventoryData.length > 0){
                            vm.inventoryDatas = resp.getinventoryData;
                            $scope.totalItems = vm.inventoryDatas.length;
                            getInventoryDrugs();
                        }
                    }
                });
                $rootScope.practysLoader = false;
            }
        }

    function getInventoryDrugs(){
        if(vm.inventoryDatas.length > 0){
            angular.forEach(vm.inventoryDatas, function(value, key) {
                        Utils.getDrugsDetails(vm.inventoryDatas[key].drugId).then(function(response) {
                            value.Drug = (response);
                        });
                });
        }
    }





        /*
          Getting the inventory Usage
        */
        function getInventoryUsage(data, id) {
            $rootScope.practysLoader = true;
            vm.yeardatas = [];
            vm.weekdatas = [];
            vm.monthdatas = [];
            // if($rootScope.online){
            inventoryService.getInventoryUsage(data, id).then(function(response) {
                if (response.data.status == "success") {
                    if (response.data.message.Year) {
                        $rootScope.practysLoader = false;

                        vm.inventoryUsageDatas = response.data.message.Year;
                        angular.forEach(vm.inventoryUsageDatas, function(value, key) {
                            vm.yeardata.push(value.inventoryDatas);

                        });
                    } else if (response.data.message.month) {
                        $rootScope.practysLoader = false;
                        vm.inventoryUsageDatas = response.data.message.month;
                        //console.log(vm.inventoryDatas);
                        console.log(vm.inventoryUsageDatas, "qqqqqqqqqq");
                        for (var i = 0; i < 12; i++) {
                            vm.monthdata.push("");
                        }
                        angular.forEach(vm.inventoryUsageDatas, function(value, key) {

                            vm.monthdata[value.inventoryMonth - 1] = value.inventoryDatas;
                        });
                    } else if (response.data.message.week) {
                        $rootScope.practysLoader = false;
                        vm.inventoryUsageDatas = response.data.message.week;
                        console.log(vm.inventoryUsageDatas);

                        angular.forEach(vm.inventoryUsageDatas, function(value, key) {

                            vm.weekdata.push(value.inventoryDatas);
                        });
                    }
                    vm.yeardatas.push(vm.yeardata);
                    vm.weekdatas.push(vm.weekdata);
                    vm.monthdatas.push(vm.monthdata);


                } else {
                    console.log("server error");
                }
            });
        }

        /*
        Searching inventory by fromDate & toDate
      */

        function searchFilter() {
            if (vm.inventory.toDate == 'Invalid date' || vm.inventory.toDate == '' || vm.inventory.toDate == undefined || vm.inventory.fromDate == 'Invalid date' || vm.inventory.fromDate == '' || vm.inventory.fromDate == undefined) {
                // vm.inventory.toDate = "";
                // vm.inventory.fromDate = "";
                toastr.error("Enter the Date to Search");
                return false;
            } else {
                $rootScope.practysLoader = true;
                vm.inventory.toDate = moment(new Date(vm.inventory.toDate)).format("YYYY-MM-DD");
                vm.inventory.fromDate = moment(new Date(vm.inventory.fromDate)).format("YYYY-MM-DD");
                if ($rootScope.online) {
                    inventoryService.dateFilter(vm.inventory.fromDate, vm.inventory.toDate).then(function(resp) {
                        if (resp.data.status == "success") {
                            $rootScope.practysLoader = false;
                            vm.searchEnable = false;
                            $scope.totalItems = resp.data.message.length;
                            vm.inventoryDatas = resp.data.message;
                            // vm.inventory.toDate = "";
                            // vm.inventory.fromDate = "";
                        } else {
                            $rootScope.practysLoader = false;
                            vm.searchEnable = false;
                            $scope.totalItems = 0;
                            vm.inventoryDatas = "";
                            toastr.error("No Datas Found");
                        }
                    });
                }else{
                    vm.inventoryDatas = [];
                    inventoryOfflineService.searchFilter(vm.clinicId,vm.inventory.fromDate,vm.inventory.toDate).then(function(resp){
                        if(resp){
                            if(resp.searchFilterData.length > 0){
                                vm.inventoryDatas = resp.searchFilterData;
                                $scope.totalItems = vm.inventoryDatas.length;
                                vm.searchEnable = false;
                                getInventoryDrugs();
                            }else{
                                vm.searchEnable = false;
                                $scope.totalItems = 0;
                                vm.inventoryDatas = "";
                                toastr.error("No Datas Found");
                            }
                        }
                    });
                    $rootScope.practysLoader = false;
                }
            }
        }

        /*
          Add, edit, update & delete Inventories
        */

        function addInventory() {
            // console.log(vm.inventory);
            // return false;
            vm.inventory.clinicId = vm.clinicId;
            if (vm.inventory.supplierName == undefined || vm.inventory.inventoryDate == undefined || vm.inventory.productName == undefined || vm.inventory.originalQty == undefined || vm.inventory.description == undefined) {
                toastr.error("All fields are Mandatory");
                return false;
            } else {
                $rootScope.practysLoader = true;
                if(vm.inventory.productName.originalObject.name != undefined){
                    vm.inventory.prodName = vm.inventory.productName.originalObject.name;
                }else{
                    vm.inventory.prodName = vm.inventory.productName.originalObject;
                }
                
                vm.inventory.inventoryDate = moment(vm.inventory.inventoryDate).format("YYYY-MM-DD");
            //      console.log(vm.inventory);
            // return false;
                if ($rootScope.online) {
                    inventoryService.addInventory(vm.inventory).then(function(response) {
                        if (response.data.status == "success") {
                            $rootScope.practysLoader = false;
                            toastr.success("Inventory Created Successfully");
                            vm.getInventory();
                            ngDialog.close();
                        } else {
                            $rootScope.practysLoader = false;
                            toastr.error(response.data.message);
                        }
                    });
                } else if ($rootScope.userLevel == 'clinic') {
                    var data = {};
                    data.clinicId = vm.inventory.clinicId;
                    data.supplierName = vm.inventory.supplierName;
                    data.drugId = vm.inventory.drugId;
                    data.originalQty = vm.inventory.originalQty;
                    data.description = vm.inventory.description;
                    data.inventoryDate = vm.inventory.inventoryDate;
                    data.onHandQty = vm.inventory.originalQty;
                    data.is_sync = 0;
                    data.is_Created = 0;
                    $SQLite.ready(function() {
                        this.insert('practysapp_inventories', data).then(function(data) {
                            toastr.success("Inventory Created In Offline");
                            vm.getInventory();
                            ngDialog.close();
                        }, function(error) {
                            console.log(err);
                            toastr.error("Error While saving");
                        });
                    });
                }
            }
        }

        function editInventory(id) {
            $rootScope.practysLoader = true;
            if ($rootScope.online) {
                inventoryService.editInventory(id).then(function(response) {
                    if (response.data.status == "success") {
                        $timeout(function() {
                            $rootScope.practysLoader = false;
                            vm.inventory = response.data.message[0];
                            ngDialog.close();
                            $scope.$apply();
                             vm.openDialogBox();
                        }, 100);
                    } else {
                        $rootScope.practysLoader = false;
                        toastr.error(response.data.message);
                        console.log("server error");
                    }

                });
            }else if ($rootScope.userLevel == 'clinic') {
                inventoryOfflineService.editInventory(id).then(function(resp){
                    if(resp){
                        if(resp.editInventoryData){
                             vm.inventory = resp.editInventoryData;
                              $rootScope.practysLoader = false;
                               vm.openDialogBox();
                        }
                    }
                });
            }
        }

        function updateInventory() {
            // console.log(vm.inventory);return false;
            vm.inventory.clinicName = JSON.parse($window.localStorage.getItem('user'))["username"];
            if (vm.inventory.supplierName == '' || vm.inventory.inventoryDate == '' || vm.inventory.sellingPrice == ''  || vm.inventory.productName == '' || vm.inventory.balanceQty == '' || vm.inventory.description == '') {
                toastr.error("All fields are Mandatory");
                return false;
            } else {
                // vm.inventory.balanceQty = JSON.parse(vm.inventory.onHandQty) + (vm.inventory.addQty = vm.inventory.addQty ? JSON.parse(vm.inventory.addQty) : '');
                // vm.inventory.productName = vm.inventory.Drug.id;
                vm.inventory.clinicId = vm.clinicId;
                vm.inventory.date = moment(new Date(vm.inventory.inventoryDate)).format("YYYY-MM-DD");
                if ($rootScope.online) {
                    inventoryService.updateInventory(vm.inventory).then(function(response) {
                        if (response.data.status == "success") {
                            ngDialog.close();
                            vm.getInventory();
                            toastr.success("updated Successfully");
                        } else {
                            toastr.error(response.data.message);
                            return false;
                        }
                    });
                } else {
                    var data = {};
                    data.id = vm.inventory.id;
                    data.clinicId = vm.inventory.clinicId;
                    data.itemId = vm.inventory.itemId;
                    data.supplierName = vm.inventory.supplierName;
                    data.drugId = vm.inventory.drugId;
                    data.originalQty = vm.inventory.originalQty;
                    data.onHandQty = vm.inventory.onHandQty;
                    data.description = vm.inventory.description;
                    data.inventoryDate = vm.inventory.date;
                    data.created = vm.inventory.created;
                    data.modified = vm.inventory.modified;
                    data.is_sync = 0;
                    Utils.getInventory(data.id).then(function(resp) {
                        data.is_Created = resp.is_Created == 0 ? 0 : 1;
                    });
                    Utils.getInventory(data.id).then(function(response) {
                        data.onHandQty = JSON.parse(response.onHandQty) + (vm.inventory.onHandQty = vm.inventory.addQty ? vm.inventory.addQty : 0);
                        data.originalQty = JSON.parse(response.originalQty) + (vm.inventory.originalQty = vm.inventory.addQty ? vm.inventory.addQty : 0);
                        $timeout(function() {
                            $SQLite.ready(function() {
                                this.replace('practysapp_inventories', data).then(function(data) {
                                    toastr.success("Inventory Updated Successfully");
                                    ngDialog.close();
                                    vm.getInventory();
                                }, function() {
                                });
                            });
                        }, 1000);
                    });
                }
            }
        }

        function init() {
            var data = "week";
            vm.getInventory();
            if ($state.current.name == 'inventoryUsage') {
                vm.getInventoryUsage(data, vm.clinicId);
            }
            if ($state.current.method != undefined) {
                vm[$state.current.method]();
            }
        }

        vm.init();

    }

})();
