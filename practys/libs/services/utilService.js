/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module          :   Util
 *
 *  Description     :   Util Service
 *
 *  Developer       :   karthick
 *
 *  Date            :   14/09/2016
 *
 *  Version         :   1.0
 *
 **********************************************************************/


 (function () {
    'use strict';

 angular
    .module('practysApp')
    .factory('utilService', utilService);

    utilService.$inject = ['$rootScope','$q', '$window','$location','commonService','__env','$http','$SQLite'];

    function utilService ($rootScope, $q, $window,$location,commonService,__env,$http,$SQLite) {

          var service = {
            SaveStateObj: SaveStateObj,
            RestoreStateObj: RestoreStateObj,
            getItem: getItem,
            saveItem: saveItem,
            getDoctors: getDoctors,
            getUsers: getUsers,
            getSpecialities: getSpecialities,
            getPatients : getPatients,
            getFile: getFile,
            setFile: setFile,
            removeFile: removeFile,
            handleFileUpload: handleFileUpload,
            getSpeciality : getSpeciality,
            getService : getService,
            getUserDetails : getUserDetails,
            getMessage:getMessage,
            getDrugs:getDrugs,
            getDrugsDetails:getDrugsDetails,
            getInventory : getInventory,
            getSecialityUserMaps :getSecialityUserMaps,
            getInvoice : getInvoice,
            getReport : getReport,
            getAppointment : getAppointment,
            getExpenses    : getExpenses,
            distinctUserName:distinctUserName,
            getDoctorsCount : getDoctorsCount,
            getPatientCount : getPatientCount,
            getAppointmentCount: getAppointmentCount,
            getAllAppointmentData:getAllAppointmentData,
            getAllAppointmentDataById:getAllAppointmentDataById
          };

          var url = __env.apiUrl;
          var file = {};
          $rootScope.utilsFileArr = [];

        return service;
        function getAppointmentCount(id){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT COUNT(practysapp_appointments.id) AS count,practysapp_subscriptions.noOfAppointment AS AppointmentCount FROM practysapp_appointments INNER JOIN (practysapp_subscriptionclinic_maps INNER JOIN practysapp_subscriptions ON practysapp_subscriptions.id = practysapp_subscriptionclinic_maps.subscriptionId) WHERE  practysapp_appointments.clinicId  = ? AND practysapp_subscriptionclinic_maps.clinicId = ?',[id,id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }
        function getDoctorsCount(id){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT COUNT(practysapp_users.id) AS UserCount,practysapp_subscriptions.doctorAccount AS doctorsCount FROM practysapp_users INNER JOIN (practysapp_subscriptionclinic_maps INNER JOIN practysapp_subscriptions ON practysapp_subscriptions.id = practysapp_subscriptionclinic_maps.subscriptionId) WHERE practysapp_users.clinicId = ? AND practysapp_subscriptionclinic_maps.clinicId = ? AND practysapp_users.user_level = ?',[id,id,'doctor']).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
             return deferred.promise;
         }

        function getPatientCount(){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT COUNT(practysapp_users.id) AS UserCount,practysapp_subscriptions.patientAccount AS PatientCount FROM practysapp_users INNER JOIN (practysapp_subscriptionclinic_maps INNER JOIN practysapp_subscriptions ON practysapp_subscriptions.id = practysapp_subscriptionclinic_maps.subscriptionId) WHERE practysapp_users.clinicId = ? AND practysapp_subscriptionclinic_maps.clinicId = ? AND practysapp_users.user_level = ?',[id,id,'doctor']).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }
        function distinctUserName(userName){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT COUNT(email) AS Emailcount,email FROM practysapp_users WHERE  email = ?',[userName]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }

        function getExpenses(id){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_expenses WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }
        function getDrugsDetails(id){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_drugs WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }
         function getAppointment(id){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_appointments WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }

        function getReport(id){
             var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_patientReports WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }


        function getInvoice(id){
             var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_invoices WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;

            }

          function getSecialityUserMaps(id){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_specialityUserMaps WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }

        function getInventory(id){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.select('SELECT * FROM practysapp_inventories WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }

        /*
        getting drugs by clinicId
        */
        function getDrugs(id){
          var serviceCall =  commonService.GetAll(url+'inventories/getDrug?clinicId='+id);
          var deferred = $q.defer();
          serviceCall
               .success(function(data) {
                   console.log(data);
                   deferred.resolve(data);
               }).
               error(function(response){
                   console.log("Error : Request failed ");
                   console.log(response);
                   deferred.reject(response.data);
               });

           return deferred.promise;
        }

         function getMessage(id){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.selectFirst('SELECT * FROM practysapp_messages WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }

        function getSpeciality(id){
            var deferred = $q.defer();
            var details = {};
            $SQLite.ready(function(){
                this.selectFirst('SELECT * FROM practysapp_specialities WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                       console.log(data);
                       deferred.resolve(data.item);
                });
            });
            return deferred.promise;
        }

        function getService(id){
            var deferred = $q.defer();
            var data = {};
             $SQLite.ready(function(){
                this.selectFirst('SELECT * FROM practysapp_services WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                        console.log(data);
                        deferred.resolve(data.item);
                });
            });
           return deferred.promise;
        }

        function getUserDetails(id){
             var deferred = $q.defer();
             var UserDetailData = {};
             $SQLite.ready(function(){
                this.selectFirst('SELECT * FROM practysapp_users WHERE id = ?',[id]).then(function(){
                        console.log('empty result');
                    },function(){
                        console.log("error");
                    },function(data){
                        console.log(data);
                        deferred.resolve(data.item);
                });
            });
             return deferred.promise;
        }

        /* functions to save and retrieve object in localstorage */

        function SaveStateObj(obj) {
            return angular.toJson(obj);
        }

        function RestoreStateObj(obj) {
            return angular.fromJson(obj);
        }

        function getItem(name)
        {
            return $window.localStorage.getItem(name);
        }

        function saveItem(name, config_data)
        {
            console.log(name);
            console.log(config_data);
            if(config_data)
                $window.localStorage.setItem(name, SaveStateObj(config_data));
            else
                $window.localStorage.removeItem(name);

        }

        /*  function to get all doctors */
        function getDoctors(obj,id,type){
           console.log(obj);
            var deferred = $q.defer();

            if(id != undefined && obj == null && type != undefined){
                var serviceCall =  commonService.GetAll(url+'doctors?clinicId='+id+'&type='+type);
            }else if(id != undefined && obj == null ){
                var serviceCall =  commonService.GetAll(url+'doctors?clinicId='+id);
            }
            else if(obj != undefined ){
                var serviceCall =  commonService.GetAll(url+'doctors?specialityId='+obj.id+'&clinicId='+obj.clinicId);
               // var serviceCall =  commonService.GetAll(url+'doctors?specialityId='+obj.id);
            }


            serviceCall
            .success(function(data) {
                console.log(data);
                deferred.resolve(data);
            }).
            error(function(response){
                console.log("Error : doctor failed ");
                deferred.reject(response.data);
            });

            return deferred.promise;

        }

        /*get all patients for current clinic*/

        function getPatients(id){
            var deferred = $q.defer();


            var serviceCall =  commonService.GetAll(url+'users?clinicId='+id);



            serviceCall
            .success(function(data) {
                console.log(data);
                deferred.resolve(data);
            }).
            error(function(response){
                console.log("Error : patients failed ");
                deferred.reject(response.data);
            });

            return deferred.promise;

        }

         /*  function to get all doctors */
        function getDoctorsBySpeciality(obj){
            var deferred = $q.defer();


            var serviceCall =  commonService.GetAll(url+'doctors?specialityId='+obj.id);

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data.data);
                }).
                error(function(response){
                    console.log("Error : doctor failed ");
                    deferred.reject(response.data);
                });

            return deferred.promise;

        }


        /*  function to get all patient or users specific to that clinic */
        function getUsers(id,type){

            if(type == "msg"){
                var serviceCall =  commonService.GetAll(url+'users?clinicId='+id+'&type='+type);
            }else{
                var serviceCall =  commonService.GetAll(url+'users?clinicId='+id);
            }

            // var serviceCall =  commonService.GetAll(url+'users?clinicId='+id);

            var deferred = $q.defer();

            serviceCall
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }).
                error(function(response){
                    console.log("Error : users failed ");
                    console.log(response);
                    deferred.reject(response.data);
                });

            return deferred.promise;

        }

        /*  get all specialities and save it in localstorage*/
        function getSpecialities(id){
            var deferred = $q.defer();
            //saveItem('speciality');
            if (getItem("speciality") === null) {
                var serviceCall =  commonService.GetAll(url+'specialities?clinicId='+id);

                serviceCall
                .success(function(data) {
                    //console.log(data.data);

                    deferred.resolve(data.data);
                }).
                error(function(response){
                    //console.log(response);
                    deferred.reject(response);
                });
            }else{
                var data = RestoreStateObj(getItem("speciality"));
                console.log(data);
                deferred.resolve(data);
            }

            return deferred.promise;

        }



        function getFile (name) {
            console.log(file,"get fleeeeeeeeeeeeeeeeee");
            return file;
        };

        function removeFile(name){
        	$rootScope.utilsFileArr.splice($rootScope.fileCount,1);
            delete file[name];
        }

        function setFile(newFile, index, name) {

            if($rootScope.utilsFileArr.length == 0){
            	file = {};
            }
            var split = name.split("");
            // alert(split[2]);
            if(split[2] == 'p'){
            	var fileIndex = 0;
            }else{
            	var fileIndex = split[2];
            }
            if(fileIndex == 0  || fileIndex){
            		$rootScope.utilsFileArr[fileIndex] = newFile;
            }
            // if($rootScope.utilsFileArr == ''){
            // 	$rootScope.utilsFileArr.push(newFile);
            // }else{
            // 	angular.forEach($rootScope.utilsFileArr, function(value,key){
            // 		$rootScope.utilsFileArr[$rootScope.fileCount]= newFile;
            // 	});
            // }
            console.log(file,"finallllll steppppppppppppppp fileeeeeeeeeeeeeeee");
            console.log($rootScope.utilsFileArr);

            if (index === 0 && file === undefined){
                file[name] = [];
                file[name][index] = newFile;
            }
            else if (index === 0 && file[name] === undefined){
                file[name] = [];
                file[name][index] = newFile;
            }else{
            	file[name] = [];
                file[name][index] = newFile;
            }
            console.log(file,"finallllll fileeeeeeeeeeeeeeee");
        };

        function handleFileUpload (files,id){
            console.log(files);
           

            return $http({
                method: 'POST',
                url: url+"appointments/uploadImages",
                //IMPORTANT!!! You might think this should be set to 'multipart/form-data'
                // but this is not true because when we are sending up files the request
                // needs to include a 'boundary' parameter which identifies the boundary
                // name between parts in this multi-part request and setting the Content-type
                // manually will not set this boundary parameter. For whatever reason,
                // setting the Content-type to 'false' will force the request to automatically
                // populate the headers properly including the boundary parameter.
                headers: { 'Content-Type': undefined },
                //This method will allow us to change how the data is sent up to the server
                // for which we'll need to encapsulate the model data in 'FormData'
                transformRequest: function (data) {
                    console.log(data,"transformmemmemem");
                    // return false;
                    var formData = new FormData();
                    //need to convert our json object to a string version of json otherwise
                    // the browser will do a 'toString()' on the object which will result
                    // in the value '[Object object]' on the server.
                    //formData.append("model", angular.toJson(data.model));
                    //now add all of the assigned files
                    //formData.append("file",data.files);
                    //console.log(data.files);
                    for (var i = 0; i < files.length; i++) {
                        //debugger;
                        //add each file to the form data and iteratively name them
                        formData.append("file" + i, data.files[i]);

                    }
                    formData.append("clinicId",data.clinicId);
                    console.log(formData);
                    return formData;
                },

                //Create an object that contains the model and files which will be transformed
                // in the above transformRequest method
                data: { files: files,clinicId: id}
            }).
            success(function (data, status, headers, config) {
                files = "";
                file = {};
                return data;
            }).
            error(function (data, status, headers, config) {
               // alert("failed!");
                return data.error;
            });
        }


        function getAllAppointmentDataById(){
          var deferred = $q.defer();
          var UserDetailData = {};
          var data = ['1','6'];
          debugger;
          $SQLite.ready(function(){
             this.select('SELECT * FROM practysapp_users WHERE id  IN ('+data+')',[]).then(function(){
                     console.log('empty result');
                 },function(){
                     console.log("error");
                 },function(data){
                     console.log(data);
                     deferred.resolve(data.item);
             });
         });
          return deferred.promise;
        }


        function getAllAppointmentData(){
          debugger;
            var userData = [];
            var deferred = $q.defer();
            $SQLite.ready(function(){
               this.select('SELECT * FROM practysapp_users',[]).then(function(){
                       console.log('empty result');
                   },function(){
                       console.log("error");
                   },function(data){
                       console.log(data);
                       userData.push(data.item);
                       if(userData.length ==  data.count){
                          deferred.resolve(userData);
                       }
               });
           });
            return deferred.promise;
        }

    }
})();
