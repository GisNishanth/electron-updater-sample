// Code goes here

(function () {
  'use strict';

  // TODO: Move to polyfill?
  // app.factory('commonDirective', commonDirective);
 
 //    commonDirective.$inject = [];
 //    function commonDirective() {
  var module = angular.module('commonDirective', []);

  /*
    Confirmation dialog for deleting the datas from the all tables
  */

  module.directive('confirmClick', ['$q', 'dialogModal', function($q, dialogModal) {
      return {
          link: function (scope, element, attrs) {
              // ngClick won't wait for our modal confirmation window to resolve,
              // so we will grab the other values in the ngClick attribute, which
              // will continue after the modal resolves.
              // modify the confirmClick() action so we don't perform it again
              // looks for either confirmClick() or confirmClick('are you sure?')
              var ngClick = attrs.ngClick.replace('confirmClick()', 'true')
                  .replace('confirmClick(', 'confirmClick(true,');

              // setup a confirmation action on the scope
              scope.confirmClick = function(msg) {
                console.log(msg,'directiveeeeeeeeee');
                  // if the msg was set to true, then return it (this is a workaround to make our dialog work)
                  if (msg===true) {
                      return true;
                  }
                  // scope.switchStatus = false;
                  // alert("unclick");
                    // console.log(scope);
                    // msg.switchStatus = true;
                  // msg can be passed directly to confirmClick('are you sure?') in ng-click
                  // or through the confirm-click attribute on the <a confirm-click="Are you sure?"></a>
                  msg = msg || attrs.confirmClick || 'Are you sure?';
                  
                  // open a dialog modal, and then continue ngClick actions if it's confirmed
                  dialogModal(msg).result.then(function() {
                    
                      scope.$eval(ngClick);
                  });
                  // return false to stop the current ng-click flow and wait for our modal answer
                  return false;
              };
          }
      }
  }])

  /*
   Open a modal confirmation dialog window with the UI Bootstrap Modal service.
   This is a basic modal that can display a message with okay or cancel buttons.
   It returns a promise that is resolved or rejected based on okay/cancel clicks.
   The following settings can be passed:

      message         the message to pass to the modal body
      title           (optional) title for modal window
      okButton        text for OK button. set false to not include button
      cancelButton    text for Cancel button. ste false to not include button

   */
  module.service('dialogModal', ['$modal', function($modal) {
      return function (message, title, okButton, cancelButton) {
        // console.log(vm,"modalllllll");
          // setup default values for buttons
          // if a button value is set to false, then that button won't be included
          okButton = okButton===false ? false : (okButton || 'Confirm');
          cancelButton = cancelButton===false ? false : (cancelButton || 'Cancel');

          // setup the Controller to watch the click
          var ModalInstanceCtrl = function ($scope, $modalInstance, settings) {
              // add settings to scope
              angular.extend($scope, settings);
              // ok button clicked
              $scope.ok = function () {
                  $modalInstance.close(true);
              };
              // cancel button clicked
              $scope.cancel = function () {
                // alert("cancel");
                  $modalInstance.dismiss('cancel');
              };
          };

          // open modal and return the instance (which will resolve the promise on ok/cancel clicks)
          var modalInstance = $modal.open({
              template: '<div class="dialog-modal"> \
                  <div class="modal-header" ng-show="modalTitle"> \
                      <h3 class="modal-title">{{modalTitle}}</h3> \
                  </div> \
                  <div class="modal-body">{{modalBody}}</div> \
                  <div class="modal-footer"> \
                      <button class="btn btn-primary" ng-click="ok()" ng-show="okButton">{{okButton}}</button> \
                      <button class="btn btn-danger" ng-click="cancel()" ng-show="cancelButton">{{cancelButton}}</button> \
                  </div> \
              </div>',
              controller: ModalInstanceCtrl,
              resolve: {
                  settings: function() {
                      return {
                          modalTitle: title,
                          modalBody: message,
                          okButton: okButton,
                          cancelButton: cancelButton
                      };
                  }
              }
          });
          // return the modal instance
          return modalInstance;
      }
  }]);
   
/* directive for message content load */

    module.directive("messageRender",  ['ngDialog','$timeout','toastr', function(ngDialog,$timeout,toastr) {
      return {
        templateUrl: 'components/messages/message-list.html',
        //templateUrl: unfortunately has no access to $scope.user.type
        scope: {
            datas: '=data',
            loaders: '=loader',
            userLevel: '=userlevel',
            logUserId: '=loguserid',
            images: '=imageName',
            imagepath: '=imagePath',
            command: '=command',
            callbackFn: '&callbackFn',
            callback: '&callback',
            callsms: '&callsms',
            call: '&call',
            preview: '&preview',
            online:'=online',
            prebox:'&preBox'
        },
        restrict: 'E',
        controller: function($scope,toastr) {
        	// $scope.messageText = "";

        	 $scope.dateFormatting = function(date){
	        	var res = moment(date).format('lll');
	        	return res;
        	}

        
        	
            //console.log($scope.logUserId);
          //function used on the ng-include to resolve the template
          /*$scope.getTemplateUrl = function() {
            //basic handling. It could be delegated to different Services
            if ($scope.user.type == "twitter")
              return "twitter.tpl.html";
            if ($scope.user.type == "facebook")
              return "facebook.tpl.html";
          }*/
        },
        link: function(scope, element) {
            scope.thumbnail_url = {};
            scope.loaders = true;
            scope.value = {
            	messageText: ''
            };
            
            console.log(scope.loaderss);

           
            
            scope.openDefault = function(){ 
               // $rootScope.imagePreview = false;
                ngDialog.open({
                    template: 'firstDialogId',
                    scope: scope
                    // controller:'InsideCtrl',
                    // className:'ngdialog-theme-default'
                
                });

            };
            

         

             scope.thumbnail = {
            dataUrl: ''
        };
        scope.fileReaderSupported = window.FileReader != null;
        scope.photoChanged = function(files){
            scope.files = files[0];
            scope.Filename = files[0].name;
            if (files != null) {
                var file = files[0];
            if (scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                $timeout(function() {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function(){
                            scope.thumbnail_url = e.target.result; 
                        });
                    }
                });
                scope.openDefault(scope.thumbnail_url,scope.files,scope.Filename);
            }
        }
        };


        

            scope.$watch('user', function(newValue, oldValue) {
                if (newValue){
                    datas = newValue;
                  }  
            }, true);
 
        }

      };
   }]);


    /*
        RightClick directive
    */
    module.directive('ngRightClick', function($parse) {
        return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
        };
    });

    module.directive('image', function($q) {
        'use strict'

        var URL = window.URL || window.webkitURL;

        var getResizeArea = function () {
            var resizeAreaId = 'fileupload-resize-area';

            var resizeArea = document.getElementById(resizeAreaId);

            if (!resizeArea) {
                resizeArea = document.createElement('canvas');
                resizeArea.id = resizeAreaId;
                resizeArea.style.visibility = 'hidden';
                document.body.appendChild(resizeArea);
            }

            return resizeArea;
        }

        var resizeImage = function (origImage, options) {
            var maxHeight = options.resizeMaxHeight || 300;
            var maxWidth = options.resizeMaxWidth || 250;
            var quality = options.resizeQuality || 0.7;
            var type = options.resizeType || 'image/jpg';

            var canvas = getResizeArea();

            var height = origImage.height;
            var width = origImage.width;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            //draw image on canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(origImage, 0, 0, width, height);

            // get the data from canvas as 70% jpg (or specified type).
            return canvas.toDataURL(type, quality);
        };

        var createImage = function(url, callback) {
            var image = new Image();
            image.onload = function() {
                callback(image);
            };
            image.src = url;
        };

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
        };


        return {
            restrict: 'A',
            scope: {
                image: '=',
                resizeMaxHeight: '@?',
                resizeMaxWidth: '@?',
                resizeQuality: '@?',
                resizeType: '@?',
            },
            link: function postLink(scope, element, attrs, ctrl) {

                var doResizing = function(imageResult, callback) {
                    createImage(imageResult.url, function(image) {
                        var dataURL = resizeImage(image, scope);
                        imageResult.resized = {
                            dataURL: dataURL,
                            type: dataURL.match(/:(.+\/.+);/)[1],
                        };
                        callback(imageResult);
                    });
                };

                var applyScope = function(imageResult) {
                    scope.$apply(function() {
                        //console.log(imageResult);
                        if(attrs.multiple)
                            scope.image.push(imageResult);
                        else
                            scope.image = imageResult; 
                    });
                };


                element.bind('change', function (evt) {
                    //when multiple always return an array of images
                    if(attrs.multiple)
                        scope.image = [];

                    var files = evt.target.files;
                    for(var i = 0; i < files.length; i++) {
                        //create a result object for each file in files
                        var imageResult = {
                            file: files[i],
                            url: URL.createObjectURL(files[i])
                        };

                        fileToDataURL(files[i]).then(function (dataURL) {
                            imageResult.dataURL = dataURL;
                        });

                        if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                            doResizing(imageResult, function(imageResult) {
                                applyScope(imageResult);
                            });
                        }
                        else { //no resizing
                            applyScope(imageResult);
                        }
                    }
                });
            }
};
});

   /* inventory --> dialog directive */

    module.directive('editInventory',function(ngDialog,toastr){
      return{
        templateUrl:'shared/template/dialog/EditInventoryDialogBox.html',
        restrict : 'E',
          transclude: true,
        scope:{
          inventory      : '=',
          format         : '=',
          updateinvent   : '&inventoryupdate',
          closeDialog    : '&dialogClose'
        },
        controller : function($scope){
          
            $scope.drugSelection = {
              onSelect: function (item) {
                $scope.inventory.totalAmount = '';
                $scope.inventory.originalQty = '';
                $scope.inventory.Drug.cost = item.cost;
                 
                }
            }

            $scope.total = function(){
              $scope.inventory.totalAmount = $scope.inventory.sellingPrice * $scope.inventory.originalQty;
            }
             $scope.editCalc = function(type){
             	var handQty = ($scope.inventory.onHandQty != undefined ? parseInt($scope.inventory.onHandQty) : 0);
             	var addQty = ($scope.inventory.addQty != undefined ? parseInt($scope.inventory.addQty) : 0);
             	if(type == 'add'){
             		$scope.inventory.balanceQty = parseInt($scope.inventory.onHandQty) + parseInt($scope.inventory.addQty);
             	}else{
             		if(handQty  < addQty){
             			toastr.error('Quantity to reduce is greater than the onhand quantity');
             			return false;
             		}else{ 
             			$scope.inventory.balanceQty = handQty - addQty;
             		}
             		
             	}
             
            }
        },
        link : function(scope){
          scope.openDatePickers = [];
          scope.openDatePicker = [];
          scope.open = function($event, datePickerIndex) {
            if(event){
                event.preventDefault();
                event.stopPropagation();
                if(scope.openDatePickers[datePickerIndex] === true) {
                     scope.openDatePickers.length = 0;
                }else{
              scope.openDatePickers.length = 0;
              scope.openDatePickers[datePickerIndex] = true;
              }
            }
    }; 

    scope.cancel =function(){
       ngDialog.close();
    }
     scope.updateInventory = function(form,datas){
     	
      if(form.$dirty && form.$valid){

      	if(parseInt(datas.onHandQty) < parseInt(datas.addQty) && datas.type == 'reduce'){
      		toastr.error('Quantity to reduce is greater than the onhand quantity');
 			return false;
      	}
        scope.updateinvent();
      	
      }
    }

           scope.total = function(datas){
            if(datas.addQty != undefined){
              // console.log(datas.onHandQty,'hand');
               scope.totQty = JSON.parse(datas.onHandQty) + JSON.parse(datas.addQty);
               // console.log(scope.totQty,'add');
               scope.inventory.totalAmount = scope.totQty * datas.sellingPrice;
               // console.log(scope.inventory.totalAmount,'multiply');
            }else{
               scope.inventory.totalAmount = datas.originalQty * datas.sellingPrice;
            }
     
            // scope.updateinvent();
           }
        }
      }
    });

/*
  directive for multiselect tag 
*/
module.directive('typeahead', function ($filter) {
    return {
        restict: 'AEC',
        scope: {
          items: '='
        },
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
          var blur = false;
          var original = scope.items;
          scope.focused = false;
          scope.list = [];
          scope.lists =[];
          ngModel.$modelValue = "";
          scope.filteredItems = scope.items;
          scope.selPos = 0;
          
          scope.focusIn = function() {
            if (!scope.focused){
              scope.focused = true;
              blur = false;
              scope.selPos = 0;
            }
          };
          scope.focusOut = function() {
            if (!blur) {
              scope.focused = false;
            } else {
              angular.element(elem).find('input')[0].focus();
              blur = false;
            }
          };
          
          scope.getDisplayItem = function(item) {

            return item[attrs.displayitem];
          };
          
          scope.getDisplayTag = function(item) {
            return item[attrs.displaytag];
          };
          
          scope.addItem = function(item) {
            scope.lists = [];
            scope.idLists = [];
            scope.list.push(item);
            scope.itemsearch = "";
            blur = true;
            if (scope.selPos >= scope.filteredItems.length-1) {
              scope.selPos--;
            }
             angular.forEach(scope.list, function(value, key) {

                            scope.lists.push(value.name);
                            scope.idLists.push(value.id);
                        

                  });
            ngModel.$setViewValue(scope.idLists);
          }
          
          scope.removeItem = function(item) {
            scope.lists =[];
            scope.idLists = [];
            scope.list.splice(scope.list.indexOf(item), 1);
            scope.idLists.splice(scope.list.indexOf(item), 1);
             angular.forEach(scope.list, function(value, key) {

                            scope.lists.push(value.name);
                            scope.idLists.push(value.id);

                  });
              console.log(scope.lists);
            ngModel.$setViewValue(scope.idLists);
            
          }

          scope.hover = function(index) {
            scope.selPos = index;
          }
          scope.keyPress = function(evt) {
            console.log(evt.keyCode);
            var keys = {
              38: 'up',
              40: 'down',
              8 : 'backspace',
              13: 'enter',
              9 : 'tab',
              27: 'esc'
            };
            
            switch (evt.keyCode) {
              case 13: 
                if(scope.selPos > -1) {
                  scope.addItem(scope.filteredItems[scope.selPos]);
                }
                break;
              case 8: 
                if (!scope.itemsearch || scope.itemsearch.length == 0) {
                  if (scope.list.length > 0) {
                    scope.list.pop();
                  }
                }
                break;
              case 38: 
                if (scope.selPos > 0) {
                  scope.selPos--;
                } 
                break;
              case 40: 
                if (scope.selPos < scope.filteredItems.length-1) {
                  scope.selPos++; 
                }
                break;
              default:
                scope.selPos = 0; //clear selection
                scope.focusIn();
            }
          };
        },
          template: '<div class="typeahead">\
            <ul data-ng-class="{\'focused\': focused}" \
                class="tags" data-ng-click="focusIn()">\
              <li class="tag" data-ng-repeat="s in list track by $index">\
                {{getDisplayTag(s)}} <span data-ng-click="removeItem(s)">x</span>\
              </li> \
              <li class="inputtag">\
                <input data-ng-blur="focusOut()" focus="{{focused}}" type="text" data-ng-model="itemsearch" data-ng-keydown="keyPress($event)"/>\
              </li>\
            </ul>\
            <ul class="list" data-ng-show="focused">\
              <li data-ng-class="{\'active\': selPos == $index}" data-ng-repeat="item in (filteredItems = (items | filter: itemsearch | notin: list)) track by $index" data-ng-mousedown="addItem(item)" data-ng-mouseover="hover($index)">\
    {{getDisplayItem(item)}}</li>\
            </ul>\
          </div>'
        };
    }).directive('focus', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          attrs.$observe('focus', function (newValue) {
            if (newValue == 'true') {
              element[0].focus();
            }
          });
        }
      }
    }).filter('notin', function() {
      return function(listin, listout) {
        return listin.filter(function(el) { 
          return listout.indexOf(el) == -1 ;
        });
      };
    });

      /*Directive for accepts number alone in the text field*/

      module.directive('numbersOnly', function () {
          return {
              require: 'ngModel',
              link: function (scope, element, attr, ngModelCtrl) {
                  function fromUser(text) {
                      if (text) {
                          var transformedInput = text.replace(/[^0-9]/g, '');

                          if (transformedInput !== text) {
                              ngModelCtrl.$setViewValue(transformedInput);
                              ngModelCtrl.$render();
                          }
                          return transformedInput;
                      }
                      return undefined;
                  }            
                  ngModelCtrl.$parsers.push(fromUser);
              }
          };
      });

            /*Directive for accepts number alone in the text field*/

      module.directive('decimalNumbers', function () {
          return {
			require: 'ngModel',
			link: function (scope) {	
				scope.$watch('invoice.payment', function(newValue,oldValue) {
	                var arr = String(newValue).split("");
	                if (arr.length === 0) return;
	                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) return;
	                if (arr.length === 2 && newValue === '-.') return;
	                if (isNaN(newValue)) {
	                    scope.invoice.payment = oldValue;
	                }
	            });
			}
		};
      });
      	

      // directive for file upload // using in view appoinemnt multi upload
      module.directive('myFileUpload', function (utilService,$rootScope) {
            return function (scope, element, attrs) {
                element.bind('change', function () {
                    var index;
                    var index_file = 0;
                    // console.log(attrs,"attributessssssssssssssss");
                    for (index = 0; index < element[0].files.length; index++) {
                      utilService.setFile(element[0].files[index], index_file, attrs.myFileUpload);
                      index_file++;
                    }
                    index_file = 0;
                });
            }
        });

    // directive for message list scroll to show the new message
      module.directive('schrollBottom', function () {
          return {
            scope: {
              schrollBottom: "="
            },
            link: function (scope, element) {
              scope.$watchCollection('schrollBottom', function (newValue) {
                if (newValue)
                {
                  $(element).scrollTop($(element)[0].scrollHeight);
                }
              });
            }
          }
        });

      /*multiselect drop down*/
module.directive('multiselectDropdown', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            check: '&check',

        },
        
        template:
            "<div class='btn-group' data-ng-class='{open: open}' style='width: 200px;'>" +
            "<button class='btn btn-small' style='width: 160px;'>---Select---</button>" +
            "<button class='btn btn-small dropdown-toggle' data-ng-click='openDropdown()' style='width: 40px;' ><span class='caret'></span></button>" +
            "<ul class='dropdown-menu' aria-labelledby='dropdownMenu' style='position: relative;'>" +
            "<li style='cursor:pointer;' data-ng-repeat='option in options'><a data-ng-click='toggleSelectItem(option);check()'><span data-ng-class='getClassName(option)' aria-hidden='true'></span> {{option.name}}</a></li>" +
            "</ul>" +
            "</div>",

        controller: function ($scope) {

            $scope.openDropdown = function () {

                $scope.open = !$scope.open;

            };

            $scope.selectAll = function () {

                $scope.model = [];

                angular.forEach($scope.options, function (item, index) {

                    $scope.model.push(item);

                });

            };

            $scope.deselectAll = function () {

                $scope.model = [];

            };

            $scope.toggleSelectItem = function (option) {
             
                var intIndex = -1;

                angular.forEach($scope.model, function (item, index) {

                    if (item.id == option.id) {

                        intIndex = index;

                    }

                });

                if (intIndex >= 0) {

                    $scope.model.splice(intIndex, 1);

                } else {

                    $scope.model.push(option);

                }
             

            };

            $scope.getClassName = function (option) {

                var varClassName = 'glyphicon glyphicon-remove-circle';

                angular.forEach($scope.model, function (item, index) {

                    if (item.id == option.id) {

                        varClassName = 'glyphicon glyphicon-ok-circle';

                    }

                });

                return (varClassName);

            };

        }
    }

});

module.directive("ngWeekdaySelector", function($rootScope) {
    "use strict";
    var const_days = [{
      id: 0,
      day: "Sun",
      value :"Sunday",
      isSelected: false,
      open  :'2017-02-08T04:30:01.000Z',
      close :'2017-02-08T04:30:01.000Z'
    }, {
      id: 1,
      day: "Mon",
       value :"Monday",
      isSelected: true,
     open  :'2017-02-08T04:30:01.000Z',
      close :'2017-02-08T04:30:01.000Z'
    }, {
      id: 2,
      day: "Tue",
      value:"Tuesday",
      isSelected: false,
      open  :'2017-02-08T04:30:01.000Z',
      close :'2017-02-08T04:30:01.000Z'
    }, {
      id: 3,
      day: "Wed",
      value:"Wednesday",
      isSelected: false,
      open  :'2017-02-08T04:30:01.000Z',
      close :'2017-02-08T04:30:01.000Z'
    }, {
      id: 4,
      day: "Thu",
      value:"Thrusday",
      isSelected: false,
      open  :'2017-02-08T04:30:01.000Z',
      close :'2017-02-08T04:30:01.000Z'
    }, {
      id: 5,
      day: "Fri",
      value:"Friday",
      isSelected: false,
      open  :'2017-02-08T04:30:01.000Z',
      close :'2017-02-08T04:30:01.000Z'
    }, {
      id: 6,
      day: "Sat",
      value:"Saturday",
      isSelected: false,
      open  :'2017-02-08T04:30:01.000Z',
      close :'2017-02-08T04:30:01.000Z'
    }];

    var template = "<div class='days-container'>" +
      "<div ng-disabled='{{ngDisabled}}' class='day-circle day-0' ng-class='{\"is-selected\": ngModel[(0 + weekStartsIndex)%7].isSelected}' ng-click='ngDisabled || onDayClicked((0 + weekStartsIndex)%7)'>{{ngModel[(0 + weekStartsIndex)%7].day}}</div>" +
      "<div ng-disabled='{{ngDisabled}}' class='day-circle day-1' ng-class='{\"is-selected\": ngModel[(1 + weekStartsIndex)%7].isSelected}' ng-click='ngDisabled || onDayClicked((1 + weekStartsIndex)%7)'>{{ngModel[(1 + weekStartsIndex)%7].day}}</div>" +
      "<div ng-disabled='{{ngDisabled}}' class='day-circle day-2' ng-class='{\"is-selected\": ngModel[(2 + weekStartsIndex)%7].isSelected}' ng-click='ngDisabled || onDayClicked((2 + weekStartsIndex)%7)'>{{ngModel[(2 + weekStartsIndex)%7].day}}</div>" +
      "<div ng-disabled='{{ngDisabled}}' class='day-circle day-3' ng-class='{\"is-selected\": ngModel[(3 + weekStartsIndex)%7].isSelected}' ng-click='ngDisabled || onDayClicked((3 + weekStartsIndex)%7)'>{{ngModel[(3 + weekStartsIndex)%7].day}}</div>" +
      "<div ng-disabled='{{ngDisabled}}' class='day-circle day-4' ng-class='{\"is-selected\": ngModel[(4 + weekStartsIndex)%7].isSelected}' ng-click='ngDisabled || onDayClicked((4 + weekStartsIndex)%7)'>{{ngModel[(4 + weekStartsIndex)%7].day}}</div>" +
      "<div ng-disabled='{{ngDisabled}}' class='day-circle day-5' ng-class='{\"is-selected\": ngModel[(5 + weekStartsIndex)%7].isSelected}' ng-click='ngDisabled || onDayClicked((5 + weekStartsIndex)%7)'>{{ngModel[(5 + weekStartsIndex)%7].day}}</div>" +
      "<div ng-disabled='{{ngDisabled}}' class='day-circle day-6' ng-class='{\"is-selected\": ngModel[(6 + weekStartsIndex)%7].isSelected}' ng-click='ngDisabled || onDayClicked((6 + weekStartsIndex)%7)'>{{ngModel[(6 + weekStartsIndex)%7].day}}</div>" +
      "</div>";

    var link = function(scope) {
      var init = function(){
        if (!scope.weekStartsIndex){
          scope.weekStartsIndex = 0;
        }
        initDaysSelected();
        initControl();
      };

      var initDaysSelected = function(){
        if (!scope.ngModel){
          scope.ngModel = [];
          angular.extend(scope.ngModel, const_days);
        }
      };

      var initControl = function(){
        if (scope.control){
          scope.control.toggleDayByIndex = function(dayIndex){
            if (scope.ngModel){
              scope.ngModel[dayIndex].isSelected = !scope.ngModel[dayIndex].isSelected;
            }else{
              console.log("Error, no model to toggle for!");
            }
          };
        }
      };

      var checkCondition =  function(index){
       for(var i=0 ; i <  scope.ngModel.length ; i++){
                if(scope.ngModel[i].isSelected && (i != index))
                      return true;
        }
      }

      scope.onDayClicked = function(dayIndex){
      
      	$rootScope.changes ++;
            if(checkCondition(dayIndex)){
               scope.ngModel[dayIndex].isSelected = !scope.ngModel[dayIndex].isSelected;
              if (typeof scope.ngChange === "function"){
                scope.ngChange({newValue: {index: dayIndex, item: scope.ngModel[dayIndex]}});
              }
            }
         }

      init();
    };

    return {
      restrict: 'AE',
      scope: {
        ngModel: '=?',
        ngChange: '&',
        weekStartsIndex: '=?',
        ngDisabled: '=?',
        control: '=?'
      },
      link: link,
      template: template
    };
  });


/*patient -> patient directive*/
  module.directive('patientDialog',function(ngDialog){
    return{
      templateUrl:'shared/template/dialog/patientDialogBox.html',
      restrict : 'E',
      scope:{
        patient : '='
      },
      controller : function($scope){
        $scope.addPatientDetails = function(){
        	// alert("success");
        	// console.log($scope.$parent);
             $scope.$parent.vm.addPatient();
        }
        $scope.ageCal = function(date){
        	// alert(date);
          var today = new Date();
		  var birthDate = new Date(date);
		  var age = today.getFullYear() - birthDate.getFullYear();
		  var m = today.getMonth() - birthDate.getMonth();
		  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		    age--;
		  }
		  $scope.patient.age =  age;
        }
      },
      link:function(scope){
         scope.openDatePickers = [];
         scope.openDatePicker =[];
         scope.cancel =function(){
           ngDialog.close();
        }
         scope.openFrom = function($event, datePickerIndex) {
          event.preventDefault();
          event.stopPropagation();
          if(scope.openDatePickers[datePickerIndex] === true) {
             scope.openDatePickers.length = 0;
          } else {
              scope.openDatePickers.length = 0;
              scope.openDatePickers[datePickerIndex] = true;
          }
        };
      }
    }
  });

     /*patient -> patient directive*/
  module.directive('editPatientDialog',function(ngDialog){
    return{
      templateUrl:'shared/template/dialog/editpatientDialogBox.html',
      restrict : 'E',
      scope:{
        patient : '='
      },
      controller : function($scope){
        $scope.patientUpdate = function(datas,formName){

         if(formName.$pristine && formName.$valid){
         	// console.log(formName,"firstttttt");
            // alert("no");
            return false;
          }
          // console.log(formName,"secondddddd");
          // return false;
             $scope.$parent.vm.patientUpdate(datas);
        }
        
      },
      link:function(scope){
         scope.openDatePickers = [];
         scope.openDatePicker =[];
         scope.cancel =function(){
           ngDialog.close();
        }

         scope.ageCal = function(date){
        	// alert(date);
          var today = new Date();
		  var birthDate = new Date(date);
		  var age = today.getFullYear() - birthDate.getFullYear();
		  var m = today.getMonth() - birthDate.getMonth();
		  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		    age--;
		  }
		  scope.patient.age =  age;
        }
        // scope.patientUpdate = function(datas,formName){
        //   // console.log(scope.$parent);
        //    if(formName.$pristine && formName.$valid){
        //     // alert("no");
        //     return false;
        //   }

           
        //      // scope.$parent.vm.updatePatient(datas);
        // }
         scope.openFrom = function($event, datePickerIndex) {
          event.preventDefault();
          event.stopPropagation();
          if(scope.openDatePickers[datePickerIndex] === true) {
             scope.openDatePickers.length = 0;
          } else {
              scope.openDatePickers.length = 0;
              scope.openDatePickers[datePickerIndex] = true;
          }
        };
      }
    }
  });

   module.directive('editPatientDialogBox',function(ngDialog){
    return{
      templateUrl:'shared/template/dialog/editpatientDialogBox.html',
      restrict : 'E',
      scope:{
        patient : '='
      },
      controller : function($scope){
       
      },
      link:function(scope){
         scope.openDatePickers = [];
         scope.openDatePicker =[];

        scope.patientUpdate = function(datas,formName){

           if(formName.$pristine && formName.$valid){
            // alert("no");
            return false;
          }
             scope.$parent.vm.updatePatient(datas);
        }
        scope.ageCal = function(date){
        	// alert(date);
          var today = new Date();
		  var birthDate = new Date(date);
		  var age = today.getFullYear() - birthDate.getFullYear();
		  var m = today.getMonth() - birthDate.getMonth();
		  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		    age--;
		  }
		  scope.patient.age =  age;
        }

         scope.cancel =function(){
             ngDialog.close();
          } 
         scope.openFrom = function($event, datePickerIndex) {
          event.preventDefault();
          event.stopPropagation();
          if(scope.openDatePickers[datePickerIndex] === true) {
             scope.openDatePickers.length = 0;
          } else {
              scope.openDatePickers.length = 0;
              scope.openDatePickers[datePickerIndex] = true;
          }
        };
      }
    }
  });

module.directive('addDoctorDialog',function(settingService,$SQLite,ngDialog){
     return{
      templateUrl:'shared/template/dialog/addDoctorDialogBox.html',
      restrict : 'E',
      scope : {
        doctorDetails : '=?doctorData',
        colors:'=',
        type:'=',
        speciality:'=',
        serviceDatas:'='
      },
      controller: function($rootScope,$scope){
        $scope.addDoctor = function(data,form,type){
          console.log(form);
          if(type == 'add'){
          	$scope.$parent.vm.addDoctor(data,form);
          }else if(type == 'link'){
          	$scope.$parent.vm.linkDoctor(data,form);
          }
          	

          
        }

        
        $scope.getServices = function(data){
          if($rootScope.online){
             settingService.getSpecialityServices(data).then(function(resp){
                   $scope.data = resp.data.message;
              }); 
          }else{
            $scope.data = [];
            $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_services WHERE practysapp_services.specialityId=?',[data]).then(function(){
                  console.log("empty result");
                },function(){
                  console.log("error");
                },function(data){
                    $scope.data.push(data.item);
                });
            });
          }
        }
      },
      link: function(scope){
        scope.cancel =function(){
           ngDialog.close();
        }
      }
     }
  });

   module.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;

            scope.style = function () {
                return {
                    'height': (newValue.h - 100) + 'px',
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
})

    module .directive("fileinput", [function() {
    return {
      scope: {
        fileinput: "=",
        filepreview: "="
      },
      link: function(scope, element, attributes) {
        element.bind("change", function(changeEvent) {
          scope.fileinput = changeEvent.target.files[0];
          var reader = new FileReader();
          reader.onload = function(loadEvent) {
            scope.$apply(function() {
              scope.filepreview = loadEvent.target.result;
            });
          }
          reader.readAsDataURL(scope.fileinput);
        });
      }
    }
  }]);

    module.directive('autoComplete', function($timeout) {
            return function(scope, iElement, iAttrs) {
                iElement.autocomplete({
                    source: scope[iAttrs.uiItems],
                    select: function() {
                        $timeout(function() {
                            iElement.trigger('input');
                        }, 0);
                    }
                });
            };
        })

  module.directive('laterName', function () {
      return {
          restrict: 'A',
          require: ['?ngModel', '^?form'],
          link: function postLink(scope, elem, attrs, ctrls) {
              attrs.$set('name', attrs.laterName);

              var modelCtrl = ctrls[0];
              var formCtrl  = ctrls[1];            
              if (modelCtrl && formCtrl) {
                  modelCtrl.$name = attrs.name;
                  formCtrl.$addControl(modelCtrl);
                  scope.$on('$destroy', function () {
                      formCtrl.$removeControl(modelCtrl);
                  });
              }            
          }
      };
  });

  module.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];


                angular.forEach(element[0].files, function (item) {
                    var value = {
                       // File Name 
                        name: item.name,
                        //File Size 
                        size: item.size,
                        //File URL to view 
                        url: URL.createObjectURL(item),
                        // File Input Value 
                        _file: item
                    };
                    values.push(value);

                     console.log(values);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);
 
})();