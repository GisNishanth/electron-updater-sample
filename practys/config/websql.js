window.dao =  {

    syncURL: "http://54.169.138.244/",
    data : {},
     APIData: [
     {
      id:"Appointment",
      url:"appointments/getAppointments",
      saveurl:"databases/saveAppointments",
      updateurl:"databases/updateAppointments"
    }
    ,{
      id:"invoices",
      url:"appointments/getInvoices",
      saveurl:"databases/saveInvoices",
      updateurl:"databases/updateInvoices"

    },
    {
      id:"services",
      url:"appointments/getSpecialityService",
      saveurl:"databases/saveSpecialityService",
      updateurl:"databases/updateSpecialityService"
    },
    {
      id:"doctorclinic",
      url:"appointments/getDoctorclinicMap",
      saveurl:"databases/saveDoctorClinicMap",
      updateurl:"databases/updateDoctorClinicMap"
    },
    {
      id:"expenses",
      url:"appointments/getExpenses",
      saveurl:"databases/saveExpense",
      updateurl:"databases/updateExpense"
    },
    {
      id:"inventories",
      url:"appointments/getInventory",
      saveurl:"databases/saveInventory",
      updateurl:"databases/updateInventory"
    },
    {
      id:"messages",
      url:"appointments/getMessages",
      saveurl:"databases/saveMessage",
      updateurl:"databases/updateMessage"
    },
    {
      id :"patientReports",
      url:"appointments/getPatientReport",
       saveurl:"databases/savePatientReport",
      updateurl:"databases/updatePatientReport"
    },
    {
      id :"specialities",
      url:"appointments/getSpecialitys",
      saveurl:"databases/saveSpeciality",
      updateurl:"databases/updateSpeciality"
    },
    {
      id:"specialityUserMaps",
      url:"appointments/getSpecialityuserMap",
      saveurl:"databases/saveSpecialityuserMap",
      updateurl:"databases/updateSpecialityuserMap"
    },
    {
      id:"announcements",
      url:"appointments/getAnnouncement",
      saveurl:"databases/saveAnnouncement",
      updateurl:"databases/updateAnnouncement"
    },
    {
       id:"user",
      url:"appointments/getUser",
      saveurl:"databases/saveUser",
      updateurl:"databases/updateUser"
    },{
       id:"Drugs",
       url:"appointments/getDrugs",
       saveurl:"databases/saveDrugs",
       updateurl:"databases/updateDrugs"
    },
    {
       id:"subscription",
       url:"appointments/getSubscription",
       saveurl:"databases/saveDrugs",
       updateurl:"databases/updateDrugs"
    },
    {
       id:"subscriptionClinicMaps",
       url:"appointments/getSubscriptionclinicMap",
       saveurl:"databases/saveDrugs",
       updateurl:"databases/updateDrugs"
    },
    {
       id:"practysapp_inventory_audits",
       url:"appointments/getInventoryAudits",
       saveurl:"databases/saveInventoryAudits",
       updateurl:"databases/saveInventoryAudits"
    },
    {
       id:"practysapp_payments",
       url:"appointments/getPayment",
       saveurl:"databases/savePayments",
       updateurl:"databases/savePayments"
    },
    {
       id:"practysapp_invoices_billings",
       url:"appointments/getInvoicesBilling",
       saveurl:"databases/saveInvoicesBilling",
       updateurl:"databases/saveInvoicesBilling"
    }
    ],
    loadingApiData :true,
    initialize: function(callback) {
        var self = this;
        this.db = window.openDatabase("practys", "1.0", "Sync Demo DB", 200000);
        console.log(this.db);
    },

    findAll: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM EMPLOYEE";
                log('Local SQLite database: "SELECT * FROM EMPLOYEE"');
                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                        var len = results.rows.length,
                            employees = [],
                            i = 0;
                        for (; i < len; i = i + 1) {
                            employees[i] = results.rows.item(i);
                        }
                        // log(len + ' rows found');
                        callback(employees);
                    }
                );
            }
        );
    },

  getChanges: function(syncURL,id,token,callback) {
        $.ajax({
            url: syncURL+"/"+id,
             headers: { "Authorization" :token },
            dataType:"json",
            success:function (data) {
                console.log(data);
                // console.log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
                callback(data);
            },
            error: function(model, response) {
                console.log(response.responseText);
            }
        });

    },

    sync : function(id,token){
      if(id){
       var self = this;
       var APILength = self.APIData.length;
       var loadingApiData = true;
      for(var i = 0 ; i< APILength ; i++){
          var APIurl = self.APIData[i].url;
          var APIid  = self.APIData[i].id;
          self.syncData(APIid,APIurl,id,token);
        }
      }
    },

    deletedData :  function(){
       var self = this;
       var APILength = self.APIData.length;
       for(var i = 0 ; i< APILength ; i++){
          //var APIurl = self.APIData[i].url;
          var APIid  = self.APIData[i].id;
          self.deleteSyncData(APIid);
        }
    },

    syncData : function(APIid,APIurl,id,token) {
        var self = this;
          // self.getLastSync(APIid,function(lastSync){
              self.getChanges(self.syncURL+APIurl,id,token,
                  function (changes) {
                      if (changes.length > 0) {
                           self.applyChanges(APIid,changes);
                      } else {
                          // log('Nothing to synchronize');
                          console.log(APIid);
                           //callback();
                      }
                   }
              );
          // });
    },


    applyChanges: function(APIid,employees, callback) {
        this.db.transaction(
            function(tx) {
              switch(APIid) {
                case 'Appointment':
                    var l = employees.length;
                     var sql =
                         "INSERT OR REPLACE INTO practysapp_appointments (id,patientId,clinicId,status,specialityId, serviceId, doctorId, appointmentStart,appointmentEnd,startDate,startTime,endDate,endTime,reason,cancellationReason,reject_msg,prescription,drugId,drugQty,frequency,dose,food,noOfDays,notes,isDeleted,created,modified,fromDevice,isChecked,isView,is_sync) " +
                          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";

                    var e;
                    for (var i = 0; i < l; i++) {
                         e = employees[i];
                         // log(e.id + ' ' + e.firstName + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                        var params = [e.id,e.patientId,e.clinicId,e.status,e.specialityId, e.serviceId, e.doctorId, e.appointmentStart,e.appointmentEnd,e.startDate,e.startTime,e.endDate,e.endTime,e.reason,e.cancellationReason,e.reject_msg,e.prescription,e.drugId,e.drugQty,e.frequency,e.dose,e.food,e.noOfDays,e.notes,e.isDeleted,e.created,e.modified,e.fromDevice,e.isChecked,e.isView,e.is_sync];
                        tx.executeSql(sql, params);
                        }
                      // log('Synchronization complete (' + l + ' items synchronized)');
                      break;
                  case'specialities':
                                var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_specialities (id,name,slug,clinicId,created, modified, isDeleted, is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ?,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.name,e.slug,e.clinicId,e.created, e.modified, e.isDeleted, e.is_sync];
                                    tx.executeSql(sql, params);
                                }
                              // log('Synchronization complete (' + l + ' items synchronized)');
                       break;
                       case 'invoices':
                             var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_invoices (id,invoiceDate,clinicId,invoiceId,patientId, appointmentId,description, doctorId,amount,pendingAmount,paymentStatus,serviceList,additionalItems,appointmentBalanceAmount,appointmentBalanceDetails,payment,discount,tax,paymentType,billStatus,currentAppStatus  ,modified,isDeleted,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.invoiceDate,e.clinicId,e.invoiceId,e.patientId, e.appointmentId, e.description,e.doctorId,e.amount,e.pendingAmount,e.paymentStatus,e.serviceList,e.additionalItems,e.appointmentBalanceAmount,e.appointmentBalanceDetails,e.payment,e.discount,e.tax,e.paymentType,e.billStatus,e.currentAppStatus,e.modified,e.isDeleted,e.is_sync];
                                    tx.executeSql(sql, params);
                                }
                       break;
                       case 'patientReports':
                           var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_patientReports (id,appointmentId,patientId, doctorId,clinicId,image, createdAt,created,status,modified,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.appointmentId,e.patientId,e.doctorId,e.clinicId, e.image, e.createdAt,e.created,e.status,
                                    e.modified,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                        break;

                        case 'messages':
                              var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_messages (id,senderId,receiverId, message, image, type,isView,status,created,modified,fromDevice,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.senderId,e.receiverId,e.message, e.image, e.type,e.isView,e.status,e.created,e.modified,e.fromDevice,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                            break;

                          case 'specialityUserMaps':  
                                var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_specialityUserMaps (id,specialityId,serviceId, userId, clinicId, created,modified,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ?,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.specialityId,e.serviceId,e.userId,e.clinicId, e.created, e.modified,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                            break;
                            case 'services':
                                var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_services (id,specialityId,name, slug,cost,mins, created,modified,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ?,?,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.specialityId,e.name,e.slug,e.cost,e.mins, e.created, e.modified,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                            break;
                            case 'expenses':
                                var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_expenses (id,productName,clinicId, supplierName, expenseDate, noOfItem,costPerItem,totalAmount,fileName,created,modified,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,? ,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.productName,e.clinicId,e.supplierName,e.expenseDate, e.noOfItem, e.costPerItem,e.totalAmount,e.fileName,e.created,e.modified,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                            break;
                            case 'inventories':
                                 var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_inventories (id,clinicId,itemId, supplierName,productName  ,productType,sellingPrice,originalQty,onHandQty,description,inventoryDate,created,modified,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,?,?, ?, ?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.clinicId,e.itemId,e.supplierName,e.productName,e.productType,e.sellingPrice,e.originalQty,e.onHandQty, e.description,e.inventoryDate,e.created,e.modified,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                            break;
                            case 'doctorclinic':
                                var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_doctorclinic_maps (id,doctorId,clinicId, serviceId, specialityId,created,modified,isDeleted) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ? ,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.doctorId,e.clinicId,e.serviceId,e.specialityId,e.created,e.modified,e.isDeleted];
                                    tx.executeSql(sql, params);
                                 }

                            break;
                            case 'announcements':
                                var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_announcements(id,clinicId,receiverId,messageText, isView,created,modified,isDeleted,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.clinicId,e.receiverId,e.messageText,e.isView,e.created,e.modified,e.isDeleted,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                            break;
                            case 'user':
                                 var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_users (id,username,firstName, lastName, slug,email,mobile,occupation,address,age,password,financePassword,city,area,gender,colorCode,description,specialityId,serviceId,drugAllergy,otherAllergy,reference,emergencyContactName,emergencyContactNumber,emergencyRelationship,otherComments,guardianName,guardianContactNumber,guardianRelationship,image,birthday,clinicTiming,startsAt,endsAt,clinicId,ios_UDID,android_UDID,user_level,isDeleted,created,modified,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ? ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                   
                                    var params = [e.id,e.username,e.firstName,e.lastName,e.slug,e.email,e.mobile,e.occupation,e.address,e.age,e.password,e.financePassword,e.city,e.area,e.gender,e.colorCode,e.description,e.specialityId,e.serviceId,e.drugAllergy,e.otherAllergy,e.reference,e.emergencyContactName,e.emergencyContactNumber,e.emergencyRelationship,e.otherComments,e.guardianName,e.guardianContactNumber,e.guardianRelationship,e.image,e.birthday,e.clinicTiming,e.startsAt,e.endsAt,e.clinicId,e.ios_UDID,e.android_UDID,e.user_level,e.isDeleted,e.created,e.modified,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                            break;
                            case 'Drugs':
                              var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_drugs (id,clinicId,name,type, instruction,cost,created,modified,isDeleted,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ? ,?,?,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    // log(e.id + ' ' + e.name + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                                    //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                                    var params = [e.id,e.clinicId,e.name,e.type,e.instruction,e.cost,e.created,e.modified,e.isDeleted,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }

                             break;
                             case 'subscription':

                             var l = employees.length;
                                var sql =
                                      "INSERT OR REPLACE INTO practysapp_subscriptions (id,subscriptionPlan,doctorAccount,noOfAppointment, patientAccount,price,noOfMonth,created,modified,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ? ,?,?,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    var params = [e.id,e.subscriptionPlan,e.doctorAccount,e.noOfAppointment,e.patientAccount,e.price,e.noOfMonth,e.created,e.modified,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                                 break;
                            case 'subscriptionClinicMaps':
                            var l = employees.length;
                               var sql =
                                      "INSERT OR REPLACE INTO practysapp_subscriptionclinic_maps (id,subscriptionId,clinicId,autoRenewal,creditcard_id,planStartDate,created,modified,is_sync) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ? ,?,?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    var params = [e.id,e.subscriptionId,e.clinicId,e.autoRenewal,e.creditcard_id,e.planStartDate,e.created,e.modified,e.is_sync];
                                    tx.executeSql(sql, params);
                                 }
                                 break;
                             case 'practysapp_inventory_audits':
                             var l = employees.length;
                                  var sql =
                                      "INSERT OR REPLACE INTO practysapp_inventory_audits (id,inventoryId,modifiedField,oldValue,newValue,modifiedBy,created,modified) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    var params = [e.id,e.inventoryId,e.modifiedField,e.oldValue,e.newValue,e.modifiedBy,e.created,e.modified];
                                    tx.executeSql(sql, params);
                                 }

                                break; 

                            case 'practysapp_payments':
                                  var l = employees.length;
                                  var sql =
                                      "INSERT OR REPLACE INTO practysapp_payments (id,transaction_id,amount,currency,paymentNofification,clinicId,invoiceDetails,item_number,status,payment_type,created_on,created_by) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    var params = [e.id,e.transaction_id,e.amount,e.currency,e.paymentNofification,e.clinicId,e.invoiceDetails,e.item_number,e.status,e.payment_type,e.created_on,e.created_by];
                                    tx.executeSql(sql, params);
                                 }

                                break;   

                            case 'practysapp_invoices_billings':
                                  var l = employees.length;
                                  var sql =
                                      "INSERT OR REPLACE INTO practysapp_payments (invoiceBillingId,billId,invoiceDate,clinicId,invoiceId,patientId,appointmentId,description,doctorId,amount,paymentStatus) " +
                                        "VALUES (?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?)";

                                var e;
                                for (var i = 0; i < l; i++) {
                                    e = employees[i];
                                    var params = [e.invoiceBillingId,e.billId,e.invoiceDate,e.clinicId,e.invoiceId,e.clinicId,e.invoiceId,e.patientId,e.appointmentId,e.description,e.doctorId,e.amount,e.paymentStatus];
                                    tx.executeSql(sql, params);
                                 }

                                break;       

                  }
            },
            this.txErrorHandler,
            function(tx) {
                // callback();
            }
        );
    },

    upsync : function(){
       var self = this;
       var APILength = self.APIData.length;
      for(var i = 0 ; i< APILength ; i++){
          var APIurl = self.APIData[i].url;
          var APIid  = self.APIData[i].id;
          var APISaveurl  = self.APIData[i].saveurl;
          var APIUpdateurl  = self.APIData[i].updateurl;
          self.fetchData(APIid,APISaveurl,APIUpdateurl);
        }
    },

    Base64ToBlob: function(data){
        for(var i=0 ; i< data.length ; i++){
            if(data[i].type == 'image'){
                 var form        = data[i];
                 var ImageURL    = data[i].image; 
                 var block       = ImageURL.split(";");
                 var contentType = block[0].split(":")[1];
                var realData    = block[1].split(',')[1];
                window.dao.b64toBlob(realData, contentType ,function(data){
                    window.dao.messagesSend(data,form);
                  });
            }else{

            }
       }
    },
    messagesSend : function(data,form){
          var formDetails = data;
          var formDataToUpload = new FormData(form);
          formDataToUpload.append("image", formDetails);
    },
    deleteSyncData : function(APIid){
      this.db.transaction(
            function(tx) {
              switch(APIid) {
                case 'user':
                     var sql  =  "DELETE FROM practysapp_users";
                   tx.executeSql(sql, [], function (tx, results) {

                  },null);
                   break;
              
              case 'Appointment':

                 var sql  =  "DELETE FROM practysapp_appointments";
                tx.executeSql(sql, [], function (tx, results) {

                  },null);
                break;
              case'specialities':
                 var sql  =  "DELETE FROM practysapp_specialities";
                tx.executeSql(sql, [], function (tx, results) {

                  },null);
                 break;
              case 'invoices':
                  var sql  =  "DELETE FROM practysapp_invoices";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;
            case 'patientReports':
                  var sql  =  "DELETE FROM practysapp_patientReports";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;
              case 'messages':       
                  var sql  =  "DELETE FROM practysapp_messages";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;
              case 'specialityUserMaps':  
                   var sql  =  "DELETE FROM practysapp_specialityUserMaps";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;   
              case 'services':  
                  var sql  =  "DELETE FROM practysapp_services";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;    
              case 'expenses':    
                   var sql  =  "DELETE FROM practysapp_expenses";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;                          
              case 'inventories':
                    var sql  =  "DELETE FROM practysapp_inventories";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;      
               case 'doctorclinic': 
                var sql  =  "DELETE FROM practysapp_doctorclinic_maps";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;    
               case 'announcements':  
                var sql  =  "DELETE FROM practysapp_announcements";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;   
                case 'subscription':   
                 var sql  =  "DELETE FROM practysapp_subscriptions";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;
                 case 'subscriptionClinicMaps':
                   var sql  =  "DELETE FROM practysapp_subscriptionclinic_maps";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;
                  case 'practysapp_inventory_audits':

                   var sql  =  "DELETE FROM practysapp_inventory_audits";
                    tx.executeSql(sql, [], function (tx, results) {

                      },null);
                    break;
                  case 'Drugs':
                     var sql  =  "DELETE FROM practysapp_drugs";
                      tx.executeSql(sql, [], function (tx, results) {

                        },null);
                      break;
    

              }
            });
    },
    
     fetchData  : function(APIid,APISaveurl,APIUpdateurl,callback) {
        console.log('fetchDatas'+APIurl);

      var APIurl = window.dao.syncURL +APISaveurl;
      var APIUpdateurl = window.dao.syncURL +APIUpdateurl;
      var self = this;
      this.db.transaction(
            function(tx) {
              switch(APIid) {
                  case 'user':
                       var sql  =  "SELECT * FROM practysapp_users WHERE practysapp_users.is_sync = '0' AND practysapp_users.is_Created = '0'";

                        tx.executeSql(sql, [], function (tx, results) {
                          var len = results.rows.length, i;
                       
                          if(results.rows.length > 0){
                              console.log(results);
                              var Obj = results.rows;
                              window.dao.saveChanges(APIurl,Obj,'practysapp_users');
                          }
                          for (i = 0; i < len; i++){
                            // alert(results.rows.item(i).log );
                            console.log(results.rows.item(i).log);
                          }
                      
                       }, null);

                     var updatesql  =  "SELECT * FROM practysapp_users WHERE practysapp_users.is_sync = '0' AND practysapp_users.is_Created = '1'";

                    tx.executeSql(updatesql, [], function (tx, results) {
                      var len = results.rows.length, i;
                   
                      if(results.rows.length > 0){
                          console.log(results);
                          var Obj = results.rows;

                          window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_users');
                      }
                      for (i = 0; i < len; i++){
                        // alert(results.rows.item(i).log );
                      }
                  
                   }, null);

                  break;
                 case 'Appointment':
                    var sql  =  "SELECT * FROM practysapp_appointments WHERE practysapp_appointments.is_sync = '0' AND practysapp_appointments.is_Created = '0'";
                    tx.executeSql(sql, [], function (tx, results) 
                    {

                                var len = results.rows.length, i;
                                if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIurl,Obj,'practysapp_appointments');
                                }
                                for (i = 0; i < len; i++){
                                  // alert(results.rows.item(i).log );
                                }
                     }, null);
                     var updatesql  =  "SELECT * FROM practysapp_appointments WHERE practysapp_appointments.is_sync = '0' AND practysapp_appointments.is_Created = '1'";
                    tx.executeSql(updatesql, [], function (tx, results) 
                    {

                                var len = results.rows.length, i;
                                if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_appointments');
                                }
                                for (i = 0; i < len; i++){
                                  // alert(results.rows.item(i).log );
                                }
                     }, null);    
                      break;
                  case'specialities':
                    var sql  =  "SELECT * FROM practysapp_specialities WHERE practysapp_specialities.is_sync = '0'  AND practysapp_appointments.is_Created = '0'";

                      tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                                if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIurl,Obj,'practysapp_specialities');
                                }
                            
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                      }, null);
                      var updatesql  =  "SELECT * FROM practysapp_specialities WHERE practysapp_specialities.is_sync = '0'  AND practysapp_appointments.is_Created = '1'";
                        tx.executeSql(updatesql, [], function (tx, results) {
                                var len = results.rows.length, i;
                                if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_specialities');
                                }
                            
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                      }, null);
                          
                       break;
                       case 'invoices':
                                var sql  =  "SELECT * FROM practysapp_invoices WHERE practysapp_invoices.is_sync = '0'  AND practysapp_invoices.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                 
                               if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIurl,Obj,'practysapp_invoices');
                                }
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                             }, null);
                              var updatesql  =  "SELECT * FROM practysapp_invoices WHERE practysapp_invoices.is_sync = '0'  AND practysapp_invoices.is_Created = '1'";
                                tx.executeSql(updatesql, [], function (tx, results) {
                                var len = results.rows.length, i;
                 
                               if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_invoices');
                                }
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                             }, null);
                       break;
                       case 'patientReports':
                           var sql  =  "SELECT * FROM practysapp_patientReports WHERE practysapp_patientReports.is_sync = '0' AND practysapp_patientReports.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                              if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIurl,Obj,'practysapp_patient_reports');
                                }
                            
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                             }, null);
                            var updatesql  =  "SELECT * FROM practysapp_patientReports WHERE practysapp_patientReports.is_sync = '0' AND practysapp_patientReports.is_Created = '1'";
                             tx.executeSql(updatesql, [], function (tx, results) {
                                var len = results.rows.length, i;
                              if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_patient_reports');
                                }
                            
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                             }, null);
                        break;

                        case 'messages':
                              //alert("message");
                               var sql  =  "SELECT * FROM practysapp_messages WHERE practysapp_messages.is_sync = '0' AND practysapp_messages.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                                     if(results.rows.length > 0){
                                      var Obj = results.rows;
                                      // window.dao.Base64ToBlob(Obj);
                                      window.dao.saveChanges(APIurl,Obj,'practysapp_messages');
                                     }
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                             }, null);
                              var updatesql  =  "SELECT * FROM practysapp_messages WHERE practysapp_messages.is_sync = '0' AND practysapp_messages.is_Created = '1'";
                               tx.executeSql(updatesql, [], function (tx, results) {
                                var len = results.rows.length, i;
                                     if(results.rows.length > 0){
                                      var Obj = results.rows;
                                      // window.dao.Base64ToBlob(Obj);
                                      window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_messages');
                                     }
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                             }, null);
                            break;

                          case 'specialityUserMaps':  
                                var sql  =  "SELECT * FROM practysapp_specialityUserMaps WHERE practysapp_specialityUserMaps.is_sync = '0' AND practysapp_specialityUserMaps.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                                  if(results.rows.length > 0){
                                    var Obj = results.rows;
                                    window.dao.saveChanges(APIurl,Obj,'practysapp_specialityuser_maps');
                                       console.log(results);
                                    }
                                
                                    for (i = 0; i < len; i++){
                                       //alert(results.rows.item(i).log );
                                    }
                                
                                 }, null);
                               var updatesql  =  "SELECT * FROM practysapp_specialityUserMaps WHERE practysapp_specialityUserMaps.is_sync = '0' AND practysapp_specialityUserMaps.is_Created = '1'";
                                   tx.executeSql(updatesql, [], function (tx, results) {
                                    var len = results.rows.length, i;
                                  if(results.rows.length > 0){
                                    var Obj = results.rows;
                                    window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_specialityuser_maps');
                                       console.log(results);
                                    }
                                
                                    for (i = 0; i < len; i++){
                                       //alert(results.rows.item(i).log );
                                    }
                                
                                 }, null);
                            break;
                            case 'services':
                                var sql  =  "SELECT * FROM practysapp_services WHERE practysapp_services.is_sync = '0' AND practysapp_services.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                            
                                if(results.rows.length > 0){
                                  var Obj = results.rows;
                                  window.dao.saveChanges(APIurl,Obj,'practysapp_services');
                                   console.log(results);
                                }
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                             }, null);
                              var updatesql  =  "SELECT * FROM practysapp_services WHERE practysapp_services.is_sync = '0' AND practysapp_services.is_Created = '1'";
                                 tx.executeSql(updatesql, [], function (tx, results) {
                                  var len = results.rows.length, i;
                              
                                  if(results.rows.length > 0){
                                    var Obj = results.rows;
                                    window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_services');
                                     console.log(results);
                                  }
                                  for (i = 0; i < len; i++){
                                     //alert(results.rows.item(i).log );
                                  }
                              
                               }, null);
                            break;
                            case 'expenses':
                                var sql  =  "SELECT * FROM practysapp_expenses WHERE practysapp_expenses.is_sync = '0' AND practysapp_expenses.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                            
                                if(results.rows.length > 0){
                                  var Obj = results.rows;
                                       console.log(results);
                                       window.dao.saveChanges(APIurl,Obj,'practysapp_expenses');
                                    }
                                    for (i = 0; i < len; i++){
                                      // alert(results.rows.item(i).log );
                                    }
                                
                                 }, null);
                                  var updatesql  =  "SELECT * FROM practysapp_expenses WHERE practysapp_expenses.is_sync = '0' AND practysapp_expenses.is_Created = '1'";
                                   tx.executeSql(updatesql, [], function (tx, results) {
                                    var len = results.rows.length, i;
                                
                                if(results.rows.length > 0){
                                  var Obj = results.rows;
                                       console.log(results);
                                       window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_expenses');
                                    }
                                    for (i = 0; i < len; i++){
                                      // alert(results.rows.item(i).log );
                                    }
                                
                                 }, null);
                            break;
                            case 'inventories':
                                 var sql  =  "SELECT * FROM practysapp_invoices WHERE practysapp_invoices.is_sync = '0' AND practysapp_invoices.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                 var len = results.rows.length, i;
                               
                                  if(results.rows.length > 0){
                                    var Obj = results.rows;
                                    window.dao.saveChanges(APIurl,Obj,'practysapp_invoices');
                                       console.log(results);
                                    }
                                    for (i = 0; i < len; i++){
                                       //alert(results.rows.item(i).log );
                                    }
                                
                                 }, null);
                                 var updatesql  =  "SELECT * FROM practysapp_invoices WHERE practysapp_invoices.is_sync = '0' AND practysapp_invoices.is_Created = '1'";
                                 tx.executeSql(updatesql, [], function (tx, results) {
                                    var len = results.rows.length, i;
                                   
                                  if(results.rows.length > 0){
                                    var Obj = results.rows;
                                    window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_invoices');
                                       console.log(results);
                                    }
                                    for (i = 0; i < len; i++){
                                       //alert(results.rows.item(i).log );
                                    }
                                
                                 }, null);
                            break;
                            case 'doctorclinic':
                                var sql  =  "SELECT * FROM practysapp_doctorclinic_maps WHERE practysapp_doctorclinic_maps.is_sync = '0' AND practysapp_doctorclinic_maps.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                                if(results.rows.length > 0){
                                  var Obj = results.rows;
                                   window.dao.saveChanges(APIurl,Obj,'practysapp_invoices');
                                   console.log(results);
                                }
                            
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                            
                               }, null);
                             var updatesql  =  "SELECT * FROM practysapp_doctorclinic_maps WHERE practysapp_doctorclinic_maps.is_sync = '0' AND practysapp_doctorclinic_maps.is_Created = '1'";
                              tx.executeSql(updatesql, [], function (tx, results) {
                                var len = results.rows.length, i;
                                if(results.rows.length > 0){
                                  var Obj = results.rows;
                                    window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_invoices');
                                   console.log(results);
                                }
                                for (i = 0; i < len; i++){
                                   //alert(results.rows.item(i).log );
                                }
                             }, null);

                            break;
                            case 'announcements':
                                var sql  =  "SELECT * FROM practysapp_announcements WHERE practysapp_announcements.is_sync = '0' AND practysapp_announcements.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                              
                                if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIurl,Obj,'practysapp_announcements');
                                }
                                for (i = 0; i < len; i++){
                                  // alert(results.rows.item(i).log);
                                }
                            
                             }, null);
                             var updatesql  =  "SELECT * FROM practysapp_announcements WHERE practysapp_announcements.is_sync = '0' AND practysapp_announcements.is_Created = '1'";
                              tx.executeSql(updatesql, [], function (tx, results) {
                                var len = results.rows.length, i;
                              
                                if(results.rows.length > 0){
                                   console.log(results);
                                   var Obj = results.rows;
                                   window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_announcements');
                                }
                                for (i = 0; i < len; i++){
                                  // alert(results.rows.item(i).log);
                                }
                            
                             }, null);
                            break;
                           
                            case 'subscription':
                                var sql  =  "SELECT * FROM practysapp_subscriptions WHERE practysapp_subscriptions.is_sync = '0' AND practysapp_subscriptions.is_Created = '0'";
                                   tx.executeSql(sql, [], function (tx, results) {
                                var len = results.rows.length, i;
                             
                                if(results.rows.length > 0)
                                {
                                  var Obj = results.rows;
                                   console.log(results);
                                   window.dao.saveChanges(APIurl,Obj,'practysapp_subscriptions');
                                }
                                for (i = 0; i < len; i++){
                                  // alert(results.rows.item(i).log );
                                 }
                            
                                }, null);
                              var updatesql  =  "SELECT * FROM practysapp_subscriptions WHERE practysapp_subscriptions.is_sync = '0' AND practysapp_subscriptions.is_Created = '1'";
                               tx.executeSql(updatesql, [], function (tx, results) {
                                   var len = results.rows.length, i;
                               
                                   if(results.rows.length > 0)
                                   {
                                    var Obj = results.rows;
                                     console.log(results);
                                     window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_subscriptions');
                                   }
                                   for (i = 0; i < len; i++){
                                    // alert(results.rows.item(i).log );
                                   }
                              
                               }, null);
                            break;
                            case 'subscriptionClinicMaps':
                              var sql  =  "SELECT * FROM practysapp_subscriptionclinic_maps WHERE practysapp_subscriptionclinic_maps.is_sync = '0' AND practysapp_subscriptionclinic_maps.is_Created = '0'";
                                       tx.executeSql(sql, [], function (tx, results) {
                              var len = results.rows.length, i;
                            
                              if(results.rows.length > 0){
                                 console.log(results);
                                 var Obj = results.rows;
                                 window.dao.saveChanges(APIurl,Obj,'practysapp_subscriptionclinic_maps');
                              }
                              for (i = 0; i < len; i++){
                                 //alert(results.rows.item(i).log );
                              }
                          
                             }, null);
                              var updatesql  =  "SELECT * FROM practysapp_subscriptionclinic_maps WHERE practysapp_subscriptionclinic_maps.is_sync = '0' AND practysapp_subscriptionclinic_maps.is_Created = '1'";
                               tx.executeSql(updatesql, [], function (tx, results) {
                            var len = results.rows.length, i;
                    
                            if(results.rows.length > 0){
                               console.log(results);
                               var Obj = results.rows;
                               window.dao.saveChanges(APIUpdateurl,Obj,'practysapp_subscriptionclinic_maps');
                            }
                            for (i = 0; i < len; i++){
                               //alert(results.rows.item(i).log );
                            }
                        
                         }, null);
                               
                            break;
                            case 'downsync':
                              window.dao.sync();
                            break;

                  }
            },
            this.txErrorHandler,
            function(tx) {
              console.log(tx);
                // callback();
            }
        );



     },


     saveChanges: function(syncURL,Obj,tablename) 
     {
     console.log(syncURL);
      var senddata = [];
      angular.forEach(Obj, function(value, key) {
        senddata.push(value);
      });
        $.ajax({
            url: syncURL,
            type:'POST',
            data: {saveData:senddata,table:tablename},
            // pseheaders: {"Authorization": localStorage.getItem('token')}
            dataType:"json",
            success:function(data) {
                var statusCode = data.statusCode;
                console.log(data);
                if(data.statusCode === 1){
                  console.log(data);
                    console.log(data);
                  //window.dao.updateSyncChanges(tablename);
                }
            },
            error: function(model, response) {
              console.log(response);
                console.log(response.responseText+ 'error');
            }
        });
    },

    updateSyncChanges : function(tablename){
      this.db.transaction(function (tx) {
        tx.executeSql('UPDATE ' + tablename + ' SET is_sync = ? WHERE is_sync = ?', [1,0 ])
      });
    },

  b64toBlob :function (b64Data, contentType,callback) {
    console.log(contentType);
                contentType = contentType || '';
                sliceSize =  512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

              var blob = new Blob(byteArrays, {type: contentType});
              console.log(blob);
              callback(blob);
            },



    //  upsyncData : function(APIid,APIurl,saveData) {
    //     var self = this;
    //       // self.getLastSync(APIid,function(lastSync){
    //           self.saveChanges(self.syncURL+APIurl,
    //               function (changes) {
    //                   if (changes.length > 0) {
    //                        self.saveChanges(APIid,changes,saveData);
    //                   } else {
    //                       // log('Nothing to synchronize');
    //                        callback();
    //                   }
    //                }
    //           );
    //       // });
    // },

    txErrorHandler: function(tx) {
        console.log(tx.message);
    }
};

dao.initialize(function() {
    console.log('database initialized');
});