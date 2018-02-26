window.dao =  {

   // syncURL: "../api/employees",
   syncURL : "http://http://54.169.138.244/appointments/getAppointments",

    initialize: function(callback) {
        var self = this;
        this.db = window.openDatabase("practys", "1.0", "Sync Demo DB", 200000);

        // Testing if the table exists is not needed and is here for logging purpose only. We can invoke createTable
        // no matter what. The 'IF NOT EXISTS' clause will make sure the CREATE statement is issued only if the table
        // does not already exist.
        this.db.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='employee'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
                            log('Using existing Employee table in local SQLite database');
                        }
                        else
                        {
                            log('Employee table does not exist in local SQLite database');
                            self.createTable(callback);
                        }
                    });
            }
        )

    },
        
    createTable: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql =
                    "CREATE TABLE IF NOT EXISTS employee ( " +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "firstName VARCHAR(50), " +
                    "lastName VARCHAR(50), " +
                    "title VARCHAR(50), " +
                    "officePhone VARCHAR(50), " +
                    "deleted INTEGER, " +
                    "lastModified VARCHAR(50))";
                    
                tx.executeSql(sql);
            

                var appointmentSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_appointments ("+
                      "id INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "patientId INTEGER NOT NULL,"+
                      "clinicId INTEGER NOT NULL,"+
                      "specialityId INTEGER NOT NULL,"+
                      "serviceId INTEGER NOT NULL ,"+
                      "doctorId INTEGER NOT NULL,"+
                      "appointmentStart VARCHAR(100) NOT NULL,"+
                      "appointmentEnd VARCHAR(100) NOT NULL,"+
                      "startDate DATE DEFAULT NULL,"+
                      "startTime TIME DEFAULT NULL,"+
                      "endDate DATE DEFAULT NULL,"+
                      "endTime TIME DEFAULT NULL,"+
                      "reason TEXT,"+
                     // "status ENUM('checkIn','engage','cancel','book','checkOut') NOT NULL DEFAULT 'book',"+
                      "reject_msg INTEGER(4) NOT NULL,"+
                      "drugName VARCHAR(200) DEFAULT NULL,"+
                      "frequency VARCHAR(100) DEFAULT NULL,"+
                      "dose VARCHAR(200) DEFAULT NULL,"+
                      "food TEXT,"+
                      "noOfDays int(11) DEFAULT NULL,"+
                      "notes TEXT,"+
                      "isDeleted INTEGER NOT NULL DEFAULT '0',"+
                      "created DATETIME NOT NULL,"+
                      "modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,"+
                      "fromDevice INTEGER DEFAULT '0',"+
                      "isView INTEGER NOT NULL DEFAULT '1',"+
                      "is_sync INTEGER NOT NULL DEFAULT '1')" ;



                  
                tx.executeSql(appointmentSql);

                  var annoncementSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_announcements ("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`receiverId` TEXT NOT NULL,"+
                      "`messageText` TEXT NOT NULL,"+
                      "`isView` TEXT NOT NULL ,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`isDeleted` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(annoncementSql);

                  var annoncementSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_announcements ("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`receiverId` TEXT NOT NULL,"+
                      "`messageText` TEXT NOT NULL,"+
                      "`isView` TEXT NOT NULL ,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`isDeleted` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(annoncementSql);


                  var doctorClinicSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_doctorclinic_maps ("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`doctorId` INTEGER NOT NULL,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`serviceId` INTEGER NOT NULL,"+
                      "`specialityId` INTEGER NOT NULL ,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`isDeleted` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(doctorClinicSql);

                   var expenseSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_expenses ("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`itemId` INTEGER NOT NULL,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`supplierName` VARCHAR(100) NOT NULL,"+
                      "`expenseDate` DATETIME NOT NULL,"+
                      "`noOfItem` INTEGER NOT NULL,"+
                      "`costPerItem` INTEGER NOT NULL,"+
                      "`totalAmount` INTEGER NOT NULL,"+
                      "`fileName` INTEGER NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(expenseSql);


                   var inventorySql =
                    "CREATE TABLE IF NOT EXISTS practysapp_inventories ("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`itemId` INTEGER NOT NULL,"+
                      "`supplierName` VARCHAR(100) NOT NULL,"+
                      "`type` VARCHAR(100) NOT NULL,"+
                      "`balanceQty` INTEGER NOT NULL,"+
                      "`description` TEXT NOT NULL,"+
                      "`inventoryDate` DATETIME NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+

                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(inventorySql);


                    var inventorySql =
                    "CREATE TABLE IF NOT EXISTS practysapp_inventories ("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`itemId` INTEGER NOT NULL,"+
                      "`supplierName` VARCHAR(100) NOT NULL,"+
                      "`type` VARCHAR(100) NOT NULL,"+
                      "`balanceQty` INTEGER NOT NULL,"+
                      "`description` TEXT NOT NULL,"+
                      "`inventoryDate` DATETIME NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(inventorySql);

                var invoiceSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_invoices ("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`invoiceDate` DATETIME NOT NULL,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`invoiceId` VARCHAR(20) NOT NULL,"+
                      "`patientId` INTEGER NOT NULL,"+
                      "`reason` TEXT NOT NULL,"+
                      "`doctorId` INTEGER NOT NULL,"+
                      "`amount` INTEGER NOT NULL,"+
                      "`paymentStatus` VARCHAR(20) NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`isDeleted` INTEGER NOT NULL DEFAULT '0',"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(invoiceSql);


                 var messageSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_messages ("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`senderId`   INTEGER NOT NULL,"+
                      "`receiverId` INTEGER NOT NULL,"+
                      "`message` LONGTEXT NOT NULL,"+
                      "`image` LONGTEXT NOT NULL,"+
                      "`type` VARCHAR(20) NOT NULL,"+
                      "`isView` INTEGER NOT NULL,"+
                      "`status` INTEGER NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`fromDevice` INTEGER NOT NULL DEFAULT '0',"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(messageSql);


                     var patientReportsSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_patient_reports("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`appointmentId`   INTEGER NOT NULL,"+
                      "`patientId` INTEGER NOT NULL,"+
                      "`doctorId` INTEGER NOT NULL,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`image` VARCHAR(50) NOT NULL,"+
                      "`createdAt` VARCHAR(30) NOT NULL,"+
                      "`status` INTEGER NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(patientReportsSql);

                  var specialitiesSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_specialities("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`name`   VARCHAR(250) NOT NULL,"+
                      "`slug` VARCHAR(250) NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`isDeleted` INTEGER NOT NULL DEFAULT '0',"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(specialitiesSql);

                  var specialityUserMapsSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_specialityuser_maps("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`specialityId`  INTEGER NOT NULL,"+
                      "`serviceId` INTEGER NOT NULL,"+
                      "`userId` INTEGER NOT NULL,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
             
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(specialityUserMapsSql);


                  var specialityUserServicesSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_speciality_services("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`specialityId`  INTEGER NOT NULL,"+
                      "`name` VARCHAR(200) NOT NULL,"+
                      "`slug` VARCHAR(200) NOT NULL,"+
                      "`mins` VARCHAR(20) NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(specialityUserServicesSql);


                var subscriptionclinicMapsSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_subscriptionclinic_maps("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`subscriptionId`  INTEGER NOT NULL,"+
                      "`clinicId` INTEGER NOT NULL,"+
                      "`autoRenewal` INTEGER NOT NULL,"+
                      "`creditcard_id` VARCHAR(40) NOT NULL,"+
                      "`planStartDate` TIMESTAMP NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` DATETIME NOT NULL,"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(subscriptionclinicMapsSql);


                   var subscriptionSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_subscriptions("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`subscriptionPlan`  INTEGER NOT NULL,"+
                      "`doctorAccount` INTEGER NOT NULL,"+
                      "`noOfAppointment` INTEGER NOT NULL,"+
                      "`patientAccount` INTEGER NOT NULL,"+
                      "`price` INTEGER NOT NULL,"+
                      "`noOfMonth` INTEGER NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` DATETIME NOT NULL,"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;



                  
                tx.executeSql(subscriptionSql);



                   var tokenSql =
                    "CREATE TABLE IF NOT EXISTS practysapp_tokens("+
                      "`id` INTEGER PRIMARY KEY AUTOINCREMENT,"+
                      "`user_id`  INTEGER NOT NULL,"+
                      "`token` VARCHAR(200) NOT NULL,"+
                      "`referKey` VARCHAR(200) NOT NULL,"+
                      "`created` DATETIME NOT NULL,"+
                      "`modified` TIMESTAMP NOT NULL,"+
                      "`is_sync` INTEGER NOT NULL DEFAULT '0')" ;

                  
                tx.executeSql(tokenSql);


            },
            this.txErrorHandler,
            function() {
                log('Table employee successfully CREATED in local SQLite database');
               // callback();
            }
        );
    },

    dropTable: function(callback) {
        this.db.transaction(
            function(tx) {
                tx.executeSql('DROP TABLE IF EXISTS employee');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_appointments');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_announcements');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_doctorclinic_maps');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_expenses');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_inventories');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_invoices');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_messages');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_patient_reports');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_specialities');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_specialityuser_maps');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_speciality_services');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_subscriptionclinic_maps');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_subscriptions');
                tx.executeSql('DROP TABLE IF EXISTS practysapp_tokens');


            },
            this.txErrorHandler,
            function() {
                log('Table employee successfully DROPPED in local SQLite database');
                callback();
            }
        );
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
                        log(len + ' rows found');
                        callback(employees);
                    }
                );
            }
        );
    },

    getLastSync: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT MAX(lastModified) as lastSync FROM employee";
                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                        var lastSync = results.rows.item(0).lastSync;
                        log('Last local timestamp is ' + lastSync);
                        callback(lastSync);
                    }
                );
            }
        );
    },

    sync: function(callback) {


        var self = this;
        console.log(self.syncURL);
        log('Starting synchronization...');
        this.getLastSync(function(lastSync){
            self.getChanges(self.syncURL, lastSync,
                function (changes) {
                  console.log(changes);
                    if (changes.length > 0) {
                        self.applyChanges(changes, callback);
                    } else {
                        log('Nothing to synchronize');
                        callback();
                    }
                }
            );
        });

    },

    getChanges: function(syncURL, modifiedSince, callback){

        console.log(syncURL);

        $.ajax({
            url: syncURL,
            data: {modifiedSince: modifiedSince},
           // dataType:"json",
            success:function (data) {
                console.log(data);
                log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
                callback(data);
            },
            error: function(model, response) {
              console.log(response);
                alert(response.responseText);
            }
        });

    },

    applyChanges: function(employees, callback) {
        this.db.transaction(
            function(tx) {
                var l = employees.length;
                // var sql =
                //     "INSERT OR REPLACE INTO employee (id, firstName, lastName, title, officePhone, deleted, lastModified) " +
                //     "VALUES (?, ?, ?, ?, ?, ?, ?)";

                 var sql =
                    "INSERT OR REPLACE INTO practysapp_appointments (id,patientId,clinicId,specialityId, serviceId, doctorId, appointmentStart,appointmentEnd,startDate,startTime,endDate,endTime,reason,reject_msg,drugName,frequency,dose,food,noOfDays,notes,isDeleted,created,modified,fromDevice,isView,is_sync) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                var e;
                for (var i = 0; i < l; i++) {
                    e = employees[i];
                    log(e.id + ' ' + e.firstName + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                 //   var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                   var params = [e.id,e.patientId,e.clinicId,e.specialityId, e.serviceId, e.doctorId, e.appointmentStart,e.appointmentEnd,e.startDate,e.startTime,e.endDate,e.endTime,e.reason,e.reject_msg,e.drugName,e.frequency,e.dose,e.food,e.noOfDays,e.notes,e.isDeleted,e.created,e.modified,e.fromDevice,e.isView,e.is_sync];

                    tx.executeSql(sql, params);
                }
                log('Synchronization complete (' + l + ' items synchronized)');
            },
            this.txErrorHandler,
            function(tx) {
                callback();
            }
        );
    },

    txErrorHandler: function(tx) {
        alert(tx.message);
    }
};

dao.initialize(function() {
    console.log('database initialized');
});

$('#reset').on('click', function() {
    dao.dropTable(function() {
       dao.createTable();
    });
});


$('#sync').on('click', function() {
    dao.sync(renderList);
});

$('#render').on('click', function() {
    renderList();
});

$('#clearLog').on('click', function() {
    $('#log').val('');
});

function renderList(employees) {
    log('Rendering list using local SQLite data...');
    dao.findAll(function(employees) {
        $('#list').empty();
        var l = employees.length;
        for (var i = 0; i < l; i++) {
            var employee = employees[i];
            $('#list').append('<tr>' +
                '<td>' + employee.id + '</td>' +
                '<td>' + employee.firstName + '</td>' +
                '<td>' + employee.lastName + '</td>' +
                '<td>' + employee.title + '</td>' +
                '<td>' + employee.officePhone + '</td>' +
                '<td>' + employee.deleted + '</td>' +
                '<td>' + employee.lastModified + '</td></tr>');
        }
    });
}

function log(msg) {
    $('#log').val($('#log').val() + msg + '\n');
}
