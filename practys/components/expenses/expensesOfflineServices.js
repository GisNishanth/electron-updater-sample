(function() {
    'use strict';

    angular
        .module('practysApp')
        .factory('expenseOfflineService', expenseOfflineService);

    expenseOfflineService.$inject = ['$q','$SQLite'];

    function expenseOfflineService($q,$SQLite) {
    			var expensesService = {};
    			var Expense  = {};
    			expensesService.viewExpenses         = viewExpenses;
    			expensesService.serachExpensesFilter = serachExpensesFilter
    			expensesService.getClinicExpenses    = getClinicExpenses;
    			return expensesService;

    			function viewExpenses(id){
    				var deferred              = $q.defer();
    				Expense.viewExpenseData   = {};
	    			   $SQLite.ready(function(){
	                      this.select('SELECT * FROM practysapp_expenses WHERE practysapp_expenses.id =?',[id]).then(function(){
	                         console.log("empty result");
	                         deferred.resolve("NoRecords");
	                      },function(){
	                     console.log("error");
	                     deferred.reject("error");
	                    },function(data){
	                        Expense.viewExpenseData.data  = data.item;
	                        deferred.resolve(Expense.viewExpenseData);
	                      });
	                  });
	    			   return deferred.promise;
    		   }

    		   function serachExpensesFilter(fromDate,toDate){
    		   	   var deferred              = $q.defer();
    		   	   Expense.serachFilter      = [];
    		   	   Expense.serachFilterCount = '';
    		   		$SQLite.ready(function(){
	                  this.select('SELECT * FROM practysapp_expenses WHERE practysapp_expenses.expenseDate BETWEEN ? AND ?',[fromDate,toDate]).then(function(){
	                       console.log("empty result");
	                       deferred.resolve("NoRecords");
	                        },function(){
	                        console.log("error");
	                        deferred.reject("error");
	                        },function(data){
	                        Expense.serachFilter.push(data.item);
	                        Expense.serachExpensesFilter = data.count;
	                        if((Expense.serachFilter.length) == Expense.serachExpensesFilter){
	                        	deferred.resolve(Expense);
	                        }
	                    });
                 });
    		   		return deferred.promise;
    		   }

    		   function getClinicExpenses(){
    		   	    var deferred                = $q.defer();
    		   	    Expense.expensesData        = [];
    		   	    Expense.expensesFilterCount = '';
    		   		$SQLite.ready(function(){
                     this.select('SELECT * FROM practysapp_expenses').then(function(){
                       console.log("empty result");
                       deferred.resolve("NoRecords");
                      },function(){
                        console.log("error");
                        deferred.reject("error");
                      },function(data){
                          Expense.expensesData.push(data.item);
                          Expense.expensesFilterCount = data.count;
                          if((Expense.expensesData.length) == Expense.expensesFilterCount){
	                        	deferred.resolve(Expense);
	                        }
                       });
                   });
    		   		return deferred.promise;
    		   }

    }

})();

