
window.DB_CONFIG = {
practysapp_appointments: {
    "id":{
        "type": "INTEGER",
        "primary": true,
        "null": null// default is "NULL" (if not defined)
      },
      "patientId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "clinicId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "specialityId": {
        "type": "INTEGER",
        "null": " NULL"
      },
       "serviceId": {
        "type": "INTEGER",
        "null": " NULL"
      },
       "doctorId": {
        "type": "INTEGER",
        "null": " NULL"
      }, 
      "appointmentStart": {
        "type": "VARCHAR(100)",
        "null": " NULL"
      },
      "appointmentEnd": {
        "type": "VARCHAR(100)",
        "null": " NULL"
      },
      "startDate": {
        "type": "DATE",
        "null": " NULL"
      },
      "startTime": {
        "type": "TIME",
        "null": " NULL"
      },
      "endDate": {
        "type": "DATE",
        "null": " NULL"
      },
       "endTime": {
        "type": "TIME",
        "null": " NULL"
      }, 
      "reason": {
        "type": "TEXT",
        "null": " NULL"
      },
      "cancellationReason":{
         "type": "TEXT",
        "null": " NULL"
      }, 
       "status": {
        "type": "VARCHAR(100)",
        "null": " NULL"
      }, 
      "reject_msg": {
        "type": "INTEGER(4)",
        "null": " NULL"
      },
      "prescription":{
         "type": "VARCHAR(500)",
        "null": " NULL"
      },
      "drugId":{
         "type": "INTEGER(20)",
        "null": " NULL"
      },
     "drugQty": {
        "type": "INTEGER(20)",
        "null": " NULL"
      },
      "frequency": {
        "type": "VARCHAR(100)",
        "null": " NULL"
      },
      "dose": {
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "food": {
        "type": "TEXT",
        "null": " NULL"
      },
      "noOfDays": {
        "type": "int(11)",
         "null": " NULL"
      },
      "notes": {
        "type": "TEXT",
        "null": " NULL"
      },
      "isDeleted": {
        "type": "INTEGER",
       "null": " NULL"
      },
      "created": {
        "type": "DATETIME",
         "null": " NULL"
      },
      "modified": {
        "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
      },
      "fromDevice": {
          "type": "INTEGER",
          "null": " NULL",
          "default":"0"
      },
       "isView": {
          "type": "INTEGER",
          "null": " NULL",
          "default":"1"
      },
      "isChecked":{
          "type": "INTEGER",
          "null": " NULL",
          "default":"0"
      },
      "is_sync": {
          "type": "INTEGER",
          "null": " NULL",
          "default":"1"
        },
        "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
        },
 practysapp_specialities:{
    "id":{
      "type": "INTEGER",
      "primary": true, // primary
      "auto_increment": true // auto increment
    },
    "name":{
      "type": "VARCHAR(250)",
      "null": " NULL"
    },
    "slug":{
      "type": "VARCHAR(250)",
      "null": " NULL"
    },
    "clinicId":{
       "type": "INTEGER",
       "null": " NULL"
    },
    "created":{
      "type": "DATETIME",
       "null": " NULL"
    },
    "modified":{
      "type": "DATETIME",
      "default":"CURRENT_TIMESTAMP"
    },
    "isDeleted":{
      "type": "INTEGER",
       "null": " NULL",
       "default":"0"
    },
    "is_sync":{
      "type": "INTEGER",
       "null": " NULL",
       "default":"1"
    },
    "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
        },
 practysapp_invoices_billings:{
  "invoiceBillingId":{
      "type": "INTEGER",
      "primary": true, // primary
      "auto_increment": true // auto increment
    },
    "invoiceDate":{
      "type": "DATETIME",
      "null": " NULL"
    },
     "billId":{
      "type": "INTEGER",
       "null": " NULL"
    },
    "clinicId":{
      "type": "INTEGER",
       "null": " NULL"
    },
    "invoiceId":{
      "type": "VARCHAR(20)",
       "null": " NULL"
    },
    "patientId":{
      "type": "INTEGER",
       "null": " NULL"
    },
    "appointmentId":{
      "type": "TEXT",
       "null": " NULL"
    },
    "description":{
      "type": "TEXT",
       "null": " NULL"
    },
    "doctorId":{
      "type": "INTEGER",
       "null": " NULL"
    },
    "amount":{
      "type": "INTEGER",
       "null": " NULL"
    },
    "paymentStatus":{
      "type": "VARCHAR(20)",
       "null": " NULL"
    },
    "created":{
      "type": "DATETIME",
       "null": " NULL"
    },
    "modified":{
      "type": "DATETIME",
       "default":"CURRENT_TIMESTAMP"
    },
     "isDeleted":{
      "type": "INTEGER",
       "null": " NULL",
       "default":"0"
    },
    "is_sync":{
      "type": "INTEGER",
       "null": " NULL",
       "default":"1"
    },
    "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
},
practysapp_patientReports:{
      "id":{
        "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "appointmentId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "patientId":{
          "type": "INTEGER",
          "null": " NULL"
      },
      "doctorId":{
          "type": "INTEGER",
          "null": " NULL"
      },
      "clinicId":{
          "type": "INTEGER",
          "null": " NULL"
      },
      "image":{
          "type": "VARCHAR(50)",
          "null": " NULL"
      },
      "createdAt":{
          "type": "VARCHAR(30)",
          "null": " NULL"
      },
      "status":{
          "type": "INTEGER",
          "null": " NULL"
      },
      "created":{
          "type": "DATETIME",
          "null": " NULL"
      },
      "modified":{
          "type": "DATETIME",
          "default":"CURRENT_TIMESTAMP"
      },
      "is_sync":{
          "type": "INTEGER",
          "null": " NULL",
          "default":"1"
      }
  },
  practysapp_messages:{
       "id":{
        "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "senderId":{
          "type": "INTEGER",
          "null": " NULL"
      },
      "receiverId":{
          "type": "INTEGER",
          "null": " NULL"
      },
      "message":{
          "type": "LONGTEXT",
          "null": " NULL"
      },
      "image":{
          "type": "VARCHAR(20)",
          "null": " NULL"
      },
      "imageData":{
        "type": "LONGTEXT",
          "null": " NULL"
      },
      "type":{
          "type": "VARCHAR(20)",
          "null": " NULL"
      },
      "isView":{
          "type": "INTEGER",
          "null": " NULL",
          "default":"0"
      },
      "status":{
          "type": "INTEGER",
          "null": " NULL"
      },
      "created":{
          "type": "DATETIME",
          "null": " NULL"
      },
      "modified":{
          "type": "DATETIME",
          "default":"CURRENT_TIMESTAMP"
      },
      "fromDevice":{
          "type": "INTEGER",
          "null": " NULL",
          "default":"0"
      },
      "is_sync":{
          "type": "INTEGER",
          "null": " NULL",
          "default":"1"
      },
      "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
 practysapp_specialityUserMaps:{
      "id":{
        "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "specialityId":{
        "type": "INTEGER",
        "null": " NULL"
      },
       "serviceId":{
        "type": "INTEGER",
        "null": " NULL"
      },
       "userId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "clinicId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "created":{
        "type": "DATETIME",
        "default":"CURRENT_TIMESTAMP"
      },
      "modified":{
       "type": "DATETIME",
        "default":"CURRENT_TIMESTAMP"
      },
      "is_sync":{
        "type": "INTEGER",
        "null": " NULL",
        "default":"1"
      },
      "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
  practysapp_services:{
    "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
    "specialityId":{
       "type": "INTEGER",
        "null": " NULL"
      },
      "name":{
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "slug":{
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "mins":{
        "type": "VARCHAR(20)",
        "null": " NULL"
      },
      "cost":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "created":{
        "type": "DATETIME",
        "null": " NULL"
      },
      "modified":{
         "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
      },
      "is_sync":{
        "type": "INTEGER",
        "null": " NULL",
        "default":"1"
      },
      "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
  "practysapp_expenses":{
    "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "productName":{
         "type": "VARCHAR(100)",
        "null": " NULL"
      },
      "clinicId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "supplierName":{
        "type": "VARCHAR(100)",
        "null": " NULL"
      },
      "expenseDate":{
        "type": "DATETIME",
        "null": " NULL"
      },
      "noOfItem":{
        "type": "DATETIME",
        "null": " NULL"
      },
      "costPerItem":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "totalAmount":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "fileName":{
        "type": "VARCHAR(20)",
        "null": " NULL"
      },
      "file":{
         "type": "VARCHAR(200)",
          "null": " NULL"
      },
      "created":{
        "type": "DATETIME",
        "null": " NULL"
      },
      "modified":{
        "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
      },
      "is_sync":{
        "type": "INTEGER",
        "null": " NULL",
        "default":"1"
      },
      "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
  "practysapp_inventories":{
    "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "clinicId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "itemId":{
         "type": "INTEGER",
        "null": " NULL"
      },
      "supplierName":{
         "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "description":{
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "productName":{
        "type": "TEXT",
        "null": " NULL"
      },
      "productType":{
         "type": "TEXT",
        "null": " NULL"
      },
       "onHandQty":{
         "type": "TEXT",
        "null": " NULL"
      },
      "sellingPrice":{
          "type": "TEXT",
        "null": " NULL"
      },
      "originalQty":{
         "type": "TEXT",
        "null": " NULL"
      },
      "inventoryDate":{
         "type": "DATETIME",
        "null": " NULL"
      },
      "created":{
        "type": "DATETIME",
        "null": " NULL"
      },
      "modified":{
         "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
      },
      "is_sync":{
        "type": "INTEGER",
        "null": " NULL",
        "default":"1"
      },
      "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
  "practysapp_doctorclinic_maps":{
      "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "doctorId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "clinicId":{
          "type": "INTEGER",
        "null": " NULL"
      },
      "serviceId":{
          "type": "INTEGER",
        "null": " NULL"
      },
      "specialityId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "created":{
          "type": "DATETIME",
        "null": " NULL"
      },
      "modified":{
         "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
      },
      "isDeleted":{
          "type": "INTEGER",
        "null": " NULL"
      },
      "is_sync":{
         "type": "INTEGER",
        "null": " NULL",
        "default":"1"
      },
      "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
  "practysapp_announcements":{
     "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "clinicId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "receiverId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "messageText":{
        "type": "TEXT",
        "null": " NULL"
      },
      "isView":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "created":{
        "type": "DATETIME",
        "null": " NULL"
      },
      "modified":{
        "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
      },
      "isDeleted":{
          "type": "DATETIME",
        "null": " NULL"
      },
      "is_sync":{
         "type": "INTEGER",
        "null": " NULL",
        "default":"1"
      }
  },

  "practysapp_users":{
    "id":{
        "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "username":{
        "type": "VARCHAR(50)",
        "null": " NULL"
      },
      "firstName":{
        "type": "VARCHAR(50)",
        "null": " NULL"
      },
      "lastName":{
        "type": "VARCHAR(50)",
        "null": " NULL"
      },
      "nric":{
        "type": "VARCHAR(50)",
        "null": " NULL"
      },
      "slug":{
         "type": "VARCHAR(100)",
        "null": " NULL"
      },
      "email":{
         "type": "VARCHAR(50)",
        "null": " NULL"
      },
      "mobile":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "occupation":{
         "type": "VARCHAR(50)",
        "null": " NULL"
      },
      "address":{
        "type": "TEXT",
        "null": " NULL"
      },
      "age":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "password":{
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "financePassword":{
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "city":{
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "area":{
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "gender":{
        "type": "TEXT",
        "null": " NULL"
      },
      "colorCode":{
        "type": "VARCHAR(11)",
        "null": " NULL"
      },
      "description":{
        "type": "TEXT",
        "null": " NULL"
      },
      "specialityId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "serviceId":{
        "type": "INTEGER",
        "null": " NULL"
      },
      "drugAllergy":{
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "otherAllergy":{
        "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "reference":{
        "type": "VARCHAR(100)",
        "null": " NULL"
      },
      "emergencyContactName":{
        "type": "VARCHAR(255)",
        "null": "NULL"
      },
      "emergencyContactNumber":{
        "type": "VARCHAR(100)",
        "null": "NULL"
      },
      "emergencyRelationship":{
        "type": "VARCHAR(200)",
        "null": "NULL"
      },
      "otherComments":{
         "type": "TEXT",
        "null": "NULL"
      },
      "guardianName":{
        "type": "VARCHAR(200)",
        "null": "NULL"
      },
      "guardianContactNumber":{
         "type": "VARCHAR(200)",
        "null": "NULL"
      },
      "guardianRelationship":{
         "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "image":{
         "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "imageData":{
        "type": "LONGTEXT",
          "null": " NULL"
      },
      "birthday":{
         "type": "DATETIME",
        "null": " NULL"
      },
      "clinicTiming":{
         "type": "messageText",
        "null": " NULL"
      },
      "startsAt":{
         "type": "DATETIME",
        "null": " NULL"
      },
      "endsAt":{
         "type": "DATETIME",
        "null": " NULL"
      },
      "clinicId":{
         "type": "INTEGER",
        "null": " NULL"
      },
      "ios_UDID":{
        "type": "VARCHAR(200)",
        "null": "NULL"
      },
      "android_UDID":{
         "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "user_level":{
          "type": "VARCHAR(200)",
        "null": " NULL"
      },
      "isDeleted":{
         "type": "INTEGER",
        "null": " NULL",
        "default":0
      },
      "created":{
         "type": "INTEGER",
        "null": " NULL"
      },
      "modified":{
         "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
      },
      "is_sync":{
         "type": "INTEGER",
        "null": " NULL",
        "default":"1"
      },
       "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
  "practysapp_subscriptions":{
      "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "subscriptionPlan":{
        "type": "TEXT",
        "null": "NULL"
      },
      "doctorAccount":{
        "type": "INTEGER",
        "null": "NULL",
        "default":"0"
      },
      "noOfAppointment":{
        "type": "INTEGER",
        "null": "NULL",
        "default":"0"
      },
      "patientAccount":{
        "type": "INTEGER",
        "null": "NULL",
        "default":"0"
      },
      "price":{
        "type": "INTEGER",
        "null": "NULL",
        "default":"0"
      },
      "noOfMonth":{
        "type": "INTEGER",
        "null": "NULL",
        "default":"0"
      },
      "created":{
          "type": "DATETIME",
        "null": " NULL"
      },
      "modified":{
           "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
      },
      "is_sync":{
         "type": "INTEGER",
        "null": "NULL",
        "default":"1"
      },
       "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
  "practysapp_subscriptionclinic_maps":{
      "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "subscriptionId":{
        "type": "INTEGER",
        "null": "NULL"
      },
      "clinicId":{
        "type": "INTEGER",
        "null": "NULL",
        "default":"0"
      },
       "plans":{
        "type": "INTEGER",
        "null": "NULL",
        "default":"0"
      },
      "autoRenewal":{
        "type": "INTEGER",
        "null": "NULL",
        "default":"0"
      },
      "creditcard_id":{
        "type": "VARCHAR(40)",
        "null": "NULL",
        "default":"0"
      },
      "planStartDate":{
        "type": "DATETIME",
        "null": "NULL"
      },
      "created":{
        "type": "DATETIME",
        "null": "NULL"
      },
      "modified":{
         "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
      },
      "is_sync":{
        "type": "INTEGER",
        "null": "NULL",
        "default":"1"
      },
       "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
  "practysapp_drugs":{
    "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "clinicId":{
         "type": "INTEGER",
         "null": " NULL"
      },
      "name":{
         "type": "VARCHAR(200)",
        "null": "NULL"
      },
      "type":{
         "type": "VARCHAR(100)",
        "null": "NULL"
      },
      "instruction":{
        "type": "TEXT",
        "null": " NULL"
      },
      "cost":{
          "type": "INTEGER",
         "null": " NULL"
       },
       "created":{
          "type": "DATETIME",
         "null": " NULL"
       },
       "modified":{
         "type": "DATETIME",
         "default":"CURRENT_TIMESTAMP"
       },
       "isDeleted":{
          "type": "INTEGER",
          "null": " NULL",
          "default":"0"
       },
        "is_sync":{
        "type": "INTEGER",
        "default":"1"
      },
       "is_Created":{
           "type": "INTEGER",
          "default":"1"
        }
  },
  "practysapp_inventory_audits":{
    "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "inventoryId":{
        "type": "INTEGER",
         "null": " NULL"
       },
       "modifiedField":{
         "type": "TEXT",
         "null": "NULL"
       },
       "oldValue":{
          "type": "TEXT",
         "null": "NULL"
       },
       "newValue":{
         "type": "TEXT",
         "null": "NULL"
       },
       "modifiedBy":{
         "type": "TEXT",
         "null": "NULL"
       },
       "created":{
          "type": "TEXT",
         "null": "NULL"
       },
       "modified":{
          "type": "TEXT",
         "null": "NULL"
       }
  },
   "practysapp_payments":{
    "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "transaction_id":{
        "type": "TEXT",
         "null": " NULL"
       },
       "amount":{
         "type": "TEXT",
         "null": "NULL"
       },
       "currency":{
          "type": "TEXT",
         "null": "NULL"
       },
       "paymentNofification":{
         "type": "TEXT",
         "null": "NULL"
       },
       "clinicId":{
         "type": "INTEGER",
         "null": "NULL"
       },
       "invoiceDetails":{
         "type": "VARCHAR(80)",
        "null": "NULL",
       },
       "item_number":{
          "type": "INTEGER",
         "null": "NULL"
       },
        "status":{
         "type": "TEXT",
         "null": "NULL"
       },
       "payment_type":{
          "type": "TEXT",
         "null": "NULL"
       },
       "created_on":{
          "type": "TEXT",
          "null": "NULL"
        },
         "created_by":{
          "type": "TEXT",
          "null": "NULL"
        },
         "created":{
          "type": "TEXT",
         "null": "NULL"
       },
       "modified":{
          "type": "TEXT",
         "null": "NULL"
       },
        "is_sync":{
        "type": "INTEGER",
        "default":"1"
      }
  },
  "practysapp_invoices":{
     "id":{
       "type": "INTEGER",
        "primary": true, // primary
        "auto_increment": true // auto increment
      },
      "invoiceDate":{
         "type": "DATE",
         "null": " NULL"
       },
       "clinicId":{
         "type": "TEXT",
         "null": "NULL"
       },
       "invoiceId":{
          "type": "INTEGER",
         "null": "NULL"
       },
       "patientId":{
         "type": "INTEGER",
         "null": "NULL"
       },
       "appointmentId":{
         "type": "INTEGER",
         "null": "NULL"
       },
       "description":{
         "type": "VARCHAR(80)",
        "null": "NULL",
       },
        "doctorId":{
         "type": "TEXT",
         "null": "NULL"
       },
       "amount":{
          "type": "INTEGER",
         "null": "NULL"
       },
       "pendingAmount":{
          "type": "INTEGER",
          "null": "NULL"
        },
         "paymentStatus":{
          "type": "TEXT",
          "null": "NULL"
        },
         "serviceList":{
          "type": "TEXT",
         "null": "NULL"
       },
       "additionalItems":{
          "type": "TEXT",
         "null": "NULL"
       },
        "appointmentBalanceAmount":{
        "type": "INTEGER",
         "null": "NULL"
      },
       "appointmentBalanceDetails":{
        "type": "INTEGER",
         "null": "NULL"
      },
      "payment":{
         "type": "TEXT",
         "null": "NULL"
       },
        "discount":{
         "type": "TEXT",
         "null": "NULL"
       },
       "paymentType":{
          "type": "TEXT",
         "null": "NULL"
       },
       "tax":{
          "type": "TEXT",
          "null": "NULL"
        },
         "payment":{
          "type": "TEXT",
          "null": "NULL"
        },
         "billStatus":{
          "type": "TEXT",
         "null": "NULL"
       },
       "currentAppStatus":{
          "type": "TEXT",
         "null": "NULL"
       },
        "is_sync":{
        "type": "INTEGER",
        "default":"1"
      },
      "created":{
          "type": "TEXT",
         "null": "NULL"
       },
       "modified":{
          "type": "TEXT",
         "null": "NULL"
       },
       "isDeleted":{
          "type": "TEXT",
         "null": "NULL"
       }
  }

};
