const electron = require('electron')

const  Menu  = electron.Menu
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// const updater = require('electron-updater')

const path = require('path')
const url = require('url')


//auto updater
const autoUpdater = require("electron-updater").autoUpdater

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function sendStatusToWindow(text) {
  log.info(text);
  if(mainWindow){
    mainWindow.webContents.send('message', text);
  }
}

function createWindow () {

 


  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/practys/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

   //trigger auto update

  autoUpdater.checkForUpdates();
}


//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//-------------------------------------------------------------------

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
   console.log('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
   console.log('Update not available.');
})
autoUpdater.on('error', (err) => {
   console.log('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
   console.log(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
   console.log('Update downloaded');
});
autoUpdater.on('update-downloaded', (info) => {
   autoUpdater.quitAndInstall();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready',function(){
    //initial window definition
    createWindow();
    //template for menus
    const template = [
      {
      label: 'Practys',
      submenu: [
          {
            label: 'Quit',
            click: () => {
              app.quit();
            },
            accelerator: 'CmdOrCtrl + q'
          }
        ] 
      },
      {
        label: 'Edit',
        submenu: [
          {role: 'undo'},
          {role: 'redo'},
          {type: 'separator'},
          {role: 'cut'},
          {role: 'copy'},
          {role: 'paste'},
          {role: 'pasteandmatchstyle'},
          {role: 'delete'},
          {role: 'selectall'}
        ]
      },
      {
        label: 'View',
        submenu: [
          {role: 'reload'},
          {role: 'forcereload'},
          {role: 'toggledevtools'},
          {type: 'separator'},
          {role: 'resetzoom'},
          {role: 'zoomin'},
          {role: 'zoomout'},
          {type: 'separator'},
          {role: 'togglefullscreen'}
        ]
      },
      {
        role: 'window',
        submenu: [
          {role: 'minimize'},
          {role: 'close'}
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click () { require('electron').shell.openExternal('https://electronjs.org')},
            accelerator: 'CmdOrCtrl + Shift + H'
          }

        ]
      }
    ];


//menu bar implementation by menu API
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// if (process.platform === 'darwin') {
//   template.unshift({
//     label: app.getName(),
//     submenu: [
//       {role: 'about'},
//       {type: 'separator'},
//       {role: 'services', submenu: []},
//       {type: 'separator'},
//       {role: 'hide'},
//       {role: 'hideothers'},
//       {role: 'unhide'},
//       {type: 'separator'},
//       {role: 'quit'}
//     ]
//   })

//   // Edit menu
//   template[1].submenu.push(
//     {type: 'separator'},
//     {
//       label: 'Speech',
//       submenu: [
//         {role: 'startspeaking'},
//         {role: 'stopspeaking'}
//       ]
//     }
//   )

//   // Window menu
//   template[3].submenu = [
//     {role: 'close'},
//     {role: 'minimize'},
//     {role: 'zoom'},
//     {type: 'separator'},
//     {role: 'front'}
//   ]
// }




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
