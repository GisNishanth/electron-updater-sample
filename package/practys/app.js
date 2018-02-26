/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   practysApp
 *
 *  Description :  practysApp
 *
 *  Developer   :   Karthick
 * 
 *  Date        :   19/08/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

 var __env = {};
 // var DB_CONFIG = {};

// Import variables if present (from env.js)
if(window){  
  // Object.assign(__env, window.__env);
}


// Register environment in AngularJS as constant
app.constant('__env', __env);  
// app.constant('DB_CONFIG', DB_CONFIG);

var app = angular
         .module('practysApp', ['ui.router','ngSQLite','autocomplete','ngResource','chart.js','ngCookies','colorpicker.module','toastr','ui.bootstrap','ngScrollbars','ngAnimate','mwl.calendar','commonDirective','AxelSoft','ngDialog','ngFileUpload','angucomplete-alt','luegg.directives','multipleSelect','angular-timeline','angular.filter','slickCarousel','toggle-switch','angular-websql','am.multiselect','datatables'
    ])
.run([ '$rootScope','toastr','$state','$stateParams','$window','$http','$SQLite','$location','$interval',
  function($rootScope,toastr,$state , $stateParams,$window,$http,$SQLite,$location,$interval) {

    $SQLite.dbConfig({
            name: 'practys',
            description: 'Sync Demo DB',
            version: '1.0'
        });
   $SQLite.init(function (init) {
            angular.forEach($window.DB_CONFIG, function (config, name) {
                init.step();
                $SQLite.createTable(name, config).then(init.done);
            });
            init.finish();
        });
   $rootScope.inventoryPopup = false;

   // alert("every");
   // console.log($state.current);
   // alert($location.path());

   // console.log($rootScope.inventoryPopup,'apppppppppppppppppp');
   if($location.path() != '/login'){
     var stringtoken  = $window.localStorage.getItem('token');
     var stringKey   = $window.localStorage.getItem('referKey');
      console.log(stringtoken);
      console.log(stringKey);  
     if(stringtoken && stringKey ){
        var token    = stringtoken.replace(/"/g,"");
        var key      = stringKey.replace(/"/g, "");
     }
     var data = token+' '+key;
     console.log(data);
     $http.defaults.headers.common.Authorization = 'Basic '+data;
     // $http.defaults.headers.common.AuthorizationKey = key;
   }
  
  

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  
    $rootScope.$on( "$stateChangeStart", function(event, toState, toParams, fromState, fromParams)
    {  
        // alert("change");
        // console.log(fromState);
        // console.log(toState);
     	$('.popover').popover('destroy');

      
        $rootScope.imagePreview = false;
        var toState    =  toState.name;
        var user_level =  JSON.parse($window.localStorage.getItem('user'))["user_level"];
        console.log(toState);
        if(toState != 'appointment' && toState != 'viewAppointment'){
        	$rootScope.dateDisplay = undefined;
        }
        if(user_level == 'clinic'){
             $state.current = toState;
             $rootScope.currentstate =  $state.current.name;
        }else{
          if($rootScope.online || toState == 'login' ){
             $state.current = toState;
             $rootScope.currentstate =  $state.current.name;
          }else{ 
             toastr.error("No Internet Connection");
            event.preventDefault();
          }
        }

    });

    $rootScope.online = navigator.onLine;
   
}]).config(function ($httpProvider,ScrollBarsProvider,toastrConfig,ngDialogProvider,ChartJsProvider) {
    ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
      showLines: true
    });  
   
    ScrollBarsProvider.defaults = {
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed
            enable: true // enable scrolling buttons by default
        },
        advanced:{
            updateOnContentResize:true,   
            updateOnBrowserResize:true  
        },
        scrollInertia: 400, // adjust however you want
        axis: 'yx', // enable 2 axis scrollbars by default,
        theme: 'light',
        autoHideScrollbar: false
    };

    angular.extend(toastrConfig, {
      autoDismiss: true,
      containerId: 'toast-container',
      maxOpened: 0,    
      newestOnTop: true,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      preventOpenDuplicates: true,
      target: 'body'
  });

   

    ngDialogProvider.setDefaults({
                className: 'ngdialog-theme-default',
                plain: false,
                showClose: true,
                closeByDocument: true,
                closeByEscape: true,
                appendTo: false
        });
       $httpProvider.defaults.useXDomain = true;
       delete $httpProvider.defaults.headers.common['X-Requested-With'];
       $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;        charset=UTF-8';
       $httpProvider.interceptors.push('Interceptor');
   
}).filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
}).filter('invoiceFilter', function(){
  // Just add arguments to your HTML separated by :
  // And add them as parameters here, for example:
  // return function(dataArray, searchTerm, argumentTwo, argumentThree) {
  return function(dataArray, searchTerm) {
      // If no array is given, exit.
      if (!dataArray) {
          return;
      }
      // If no search term exists, return the array unfiltered.
      else if (!searchTerm) {
          return dataArray;
      }
      // Otherwise, continue.
      else {
           // Convert filter text to lower case.
           var term = angular.isDefined(searchTerm) &&  searchTerm.toLowerCase();
           // Return the array and filter it by looking for any occurrences of the search term in each items id or name. 
           return dataArray.filter(function(item){
           	console.log(item);
              var invoiceDate = angular.isDefined(item.invoiceDate) && item.invoiceDate.toLowerCase().indexOf(term) > -1;
              var paymentStatus = angular.isDefined(item.paymentStatus) && item.paymentStatus.toLowerCase().indexOf(term) > -1;
              var patientUsername = angular.isDefined(item.patientName) && item.patientName.toLowerCase().indexOf(term) > -1;
              var doctorUsername = angular.isDefined(item.doctorName) && item.doctorName.toLowerCase().indexOf(term) > -1;
              // var description = angular.isDefined(item.description) && item.description.toLowerCase().indexOf(term) > -1;
              var amount = angular.isDefined(item.amount) && item.amount.toLowerCase().indexOf(term) > -1;
              var pendingAmount = angular.isDefined(item.pendingAmount) && item.pendingAmount.toLowerCase().indexOf(term) > -1;
              return invoiceDate || paymentStatus || patientUsername|| doctorUsername || amount || pendingAmount;
           });
      } 
  }    
}).filter('customizeDate', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
 
  var _date = $filter('date')(new Date(input), 'dd-MM-yyyy');
 
  return _date.toUpperCase();

 };
}).factory('$remember', function() {
            function fetchValue(name) {
                var gCookieVal = document.cookie.split("; ");
                for (var i=0; i < gCookieVal.length; i++)
                {
                    // a name/value pair (a crumb) is separated by an equal sign
                    var gCrumb = gCookieVal[i].split("=");
                    if (name === gCrumb[0])
                    {
                        var value = '';
                        try {
                            value = angular.fromJson(gCrumb[1]);
                        } catch(e) {
                            value = unescape(gCrumb[1]);
                        }
                        return value;
                    }
                }
                // a cookie with the requested name does not exist
                return null;
            }
            return function(name, values) {
                if(arguments.length === 1) return fetchValue(name);
                var cookie = name + '=';
                if(typeof values === 'object') {
                    var expires = '';
                    cookie += (typeof values.value === 'object') ? angular.toJson(values.value) + ';' : values.value + ';';
                    if(values.expires) {
                        var date = new Date();
                        date.setTime( date.getTime() + (values.expires * 24 *60 * 60 * 1000));
                        expires = date.toGMTString();
                    }
                    cookie += (!values.session) ? 'expires=' + expires + ';' : '';
                    cookie += (values.path) ? 'path=' + values.path + ';' : '';
                    cookie += (values.secure) ? 'secure;' : '';
                } else {
                    cookie += values + ';';
                }
                document.cookie = cookie;
            }
});



