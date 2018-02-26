/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   approutes.js
 *
 *  Description :   routing 
 *
 *  Developer   :   Karthick
 * 
 *  Date        :   24/08/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

 app.config(['$stateProvider', '$urlRouterProvider','$locationProvider',
            
    function ($stateProvider, $urlRouterProvider,$locationProvider) {

        
        $urlRouterProvider.otherwise('/login');
        // $locationProvider.html5Mode(true);

        // States
        $stateProvider
          .state('other', { 
              url: "/other",
              templateUrl: 'tpl.html',
          })
          .state('login',{
              url: '/login',
              templateUrl: 'components/login/login.html',
              controller: 'loginCtrl as auth',
          })
          .state('dashboard',{
              url: '/dashboard',
              templateUrl: 'components/dashboard/dashboard.html',
              controller: 'dashboardCtrl as dash',
          })
           .state('clinicName',{
              url: '/chooseClinic',
              templateUrl: 'components/clinic/clinicName.html',
              controller: 'clinicController as vm',
          })
	       .state('appointment',{
              url: '/appointment',
              params: {
                    status: false,
              },
              //templateUrl: 'components/appointment/appointment.html',
              //controller: 'appointmentController as vm',

              views: {
                // the main template will be placed here (relatively named)
                '': { templateUrl: 'components/appointment/appointment.html',
                  controller: 'appointmentController as vm'
                 },

                // the child views will be defined here (absolutely named)
                'waitingList@appointment': { templateUrl: 'components/appointment/appointmentWaiting.html',
                controller: 'appointmentWaitingController as vm',
                },

                // another child view
                'engageList@appointment': { 
                  templateUrl: 'components/appointment/appointmentWaiting.html',
                  controller: 'appointmentEngageController as vm',
                }
            },
             activetab: 'appointment'
          })
         .state('viewAppointment', {
              url: '/appointment/view',
              // templateUrl: 'components/appointment/viewAppointment.html',
              // controller: 'viewappointmentController as vm',
              views: {
                // the main template will be placed here (relatively named)
                '': { templateUrl: 'components/appointment/viewAppointment.html',
                  controller: 'viewappointmentController as vm'
                 },

                // the child views will be defined here (absolutely named)
                'waitingList@viewAppointment': { templateUrl: 'components/appointment/appointmentWaiting.html',
                controller: 'appointmentWaitingController as vm',
                },

                // another child view
                'engageList@viewAppointment': { 
                  templateUrl: 'components/appointment/appointmentWaiting.html',
                  controller: 'appointmentEngageController as vm',
                }
              },
              params: {
                appointmentId: {
                    value: '',
                    squash: false,
                  },
                  status: {
                    value: '',
                    squash: false,
                  },
              },
              activetab: 'appointment'
          })
          .state('bookapp',{
              url: '/appointment/book',
              templateUrl: 'components/appointment/book_appointment.html',
              controller: 'bookAppointmentController as vm',
              activetab: 'appointment'
          })
	.state('patient',{
              url: '/patient',
              templateUrl: 'components/patient/patient.html',
              controller: 'patientController as vm',
              activetab: 'patient'
          })
  .state('addPatient',{
              url: '/patient/addPatient',
              templateUrl: 'components/patient/addPatient.html',
              controller: 'patientController as vm',
              params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                  id:null,
                },
                activetab: 'patient'
          })
  .state('editPatient',{
              url: '/patient/editPatient',
              templateUrl: 'components/patient/editPatient.html',
              controller: 'patientController as vm',
              params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                 id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'editPatient',
               activetab: 'patient'
          })
	.state('patientDetails',{
              url: '/patient/details',
              templateUrl: 'components/patient/patientDetails.html',
              controller: 'patientController as vm',
              params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                  id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'particularPatientDetails',
               activetab: 'patient'
          })
 
  .state('treatmentDetails',{
              url: '/patient/treatmentDetails',
              templateUrl: 'components/patient/patientTreatmentDetails.html',
              controller: 'patientController as vm',
              params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                  id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'treatmentDetails',
               activetab: 'patient'
          })
 
	.state('addExpenses', {
              url: '/addExpenses',
              templateUrl: 'components/expenses/addExpenses.html',
              controller: 'expenseController as vmExpenses',
              activetab: 'expense'
          })
	.state('expenses', {
              url: '/expenses',
              templateUrl: 'components/expenses/expenses.html',
              controller: 'expenseController as vmExpenses',
              activetab: 'expense'

          })
	.state('editExpense', {
              url: '/editExpense',
              templateUrl: 'components/expenses/editExpense.html',
              controller: 'expenseController as vmExpenses',
              params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                  id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'editExpense',
               activetab: 'expense'
          })
  .state('viewExpense', {
              url: '/viewExpense',
              templateUrl: 'components/expenses/viewExpense.html',
              controller: 'expenseController as vmExpenses',
              params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                  id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'viewExpense',
               activetab: 'expense'
          })
          .state('inventory', {
              url: '/inventory',
              templateUrl: 'components/inventory/inventory.html',
              controller: 'inventoryController as vm',
              activetab: 'inventory'
          })
          .state('addInventory', {
              url: '/addInventory',
              templateUrl: 'components/inventory/addInventory.html',
              controller: 'inventoryController as vm',
              activetab: 'inventory'
          })
	.state('editInventory', {
              url: '/editInventory',
              templateUrl: 'components/inventory/editInventory.html',
              controller: 'inventoryController as vm',
              params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                  id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'editInventory',
               activetab: 'inventory'
          })
        .state('viewInventory', {
              url: '/viewInventory',
              templateUrl: 'components/inventory/viewInventory.html',
              controller: 'inventoryController as vm',
              params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                  id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'viewInventory',
               activetab: 'inventory'
          })
          .state('inventoryUsage', {
              url: '/inventoryUsage',
              templateUrl: 'components/inventory/inventoryUsage.html',
              controller: 'inventoryController as vm',
              activetab: 'inventory'
          })	
	.state('invoice',{
              url: '/invoice',
              templateUrl: 'components/invoice/invoice.html',
              controller: 'invoiceController as vm',
              activetab: 'invoice'
             
          })
	.state('addInvoice',{
              url: '/addInvoice',
              templateUrl: 'components/invoice/addInvoice.html',
              controller: 'invoiceController as vm',
              activetab: 'invoice'
          })
          .state('editInvoice',{
              url: '/editInvoice/:id',
              templateUrl: 'components/invoice/editInvoice.html',
              controller: 'invoiceController as vm',
               params: { 

                  id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'editInvoice',
               activetab: 'invoice'
          })
          .state('editSpecificInvoice',{
              url: '/editSpecificInvoice/:id',
              templateUrl: 'components/invoice/editSpecificInvoice.html',
              controller: 'invoiceController as vm',
               params: { 

                  id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'editSpecificInvoice',
               activetab: 'invoice'
          })
           .state('viewInvoice',{
              url: '/viewInvoice/:sNo',
              templateUrl: 'components/invoice/viewInvoice.html',
              controller: 'invoiceController as vm',
               params: { 

                  id: {
                    value: '',
                    squash: false,
                  },
                },
               method: 'viewInvoice',
               activetab: 'invoice'
          })
          .state('messages',{
              url: '/messages',
              templateUrl: 'components/messages/messages.html',
              controller: 'messagesController as vm',
              activetab: 'message'
          })
          .state('financeLogin',{
              url: '/financeLogin',
              templateUrl: 'components/finance/financeLogin.html',
              controller: 'financeController as vm',
              activetab: 'finance'
          })
          .state('finance',{
              url: '/finance',
              templateUrl: 'components/finance/finance.html',
              controller: 'financeController as vm',
              activetab: 'finance'
          })
           .state('settings',{
              url: '/settings',
              templateUrl: 'components/settings/settings.html',
              controller: 'settingController as vm',
               params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                  id:null,
                   data:null
                },
                activetab: 'setting'
          })
           .state('clinicEdit',{
              url: '/settings/clinicEdit',
              templateUrl: 'components/settings/clinicEdit.html',
              controller: 'settingController as vm',
               params: { 
                  // here we define default value for foo
                  // we also set squash to false, to force injecting
                  // even the default value into url
                   id:null,
                   data:null
                },
                activetab: 'setting'
          })
     
    }
]);
