import { app, BrowserWindow, dialog, shell } from 'electron'
const Menu = require('electron').Menu
const {ipcMain} = require('electron')

import pkg from '../../package.json'
import checkUpdate from '../modules/updateChecker'
//import {checkFirstTime} from '../modules/first'
import gnodeService from '../modules/gnode'

//checkFirstTime()

import log from '../modules/logger'
import {downloadUrl, gnodeOption} from '../modules/config'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

//https://molunerfinn.com/electron-vue-5/#%E4%B8%8D%E5%90%8C%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%9E%84%E5%BB%BA%E9%85%8D%E7%BD%AE
if (process.platform === 'win32') {
  app.setAppUserModelId(pkg.build.appId)
}

log.debug(`Platform:${process.platform}`)

import {exec, execFile, spawn, fork} from 'child_process'
if(process.platform!=='win32'){
  exec('pkill grin-wallet')
}else{
  exec('taskkill -f /im grin-wallet.exe')
}

// if(gnodeOption.type!='remoteAllTime'){
//   gnodeService.restartGnode()
// }

let mainWindow
let firstQuit = true
let firstClose = true

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: 'DiagonAlley Wallet',
    center: true,
    useContentSize: true,
    width: 775,
    height: 935,
    resizable:true,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  //mainWindow.openDevTools({mode: 'detach'})

  if (process.platform != 'darwin') {
    mainWindow.on('close', (e)=>{
      mainWindow.webContents.send('before-quit');
      if(firstClose){
        e.preventDefault()
        firstClose = false
      }

      setTimeout(()=>{
        log.debug('close now')
        if(mainWindow)mainWindow.close()}, 800)
    })

    mainWindow.setMenu(null)
  }

  mainWindow.on('closed', () => {
    log.debug('mainWidnows closed')
    mainWindow = null
  })
  log.debug('Mainwindows created')
}

async function launch(){
  let toUpdate = await checkUpdate()
  if(toUpdate){
    dialog.showMessageBox({
      type: 'info',
      title: 'Found new version',
      buttons: ['Yes', 'No'],
      message: 'Found new version of the wallet, go to download?',
    }, (res, checkboxChecked) => {
      if (res === 0) { 
        shell.openExternal(downloadUrl)
        app.quit()
      }else{
        createWindow()
        createMenu()
      }})
  }
} 


var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
}

app.on('ready', ()=>{
  createWindow()
  if (process.platform === 'darwin') {
    createMenu()
  }
})

app.on('window-all-closed', () => {
  log.debug('window-all-closed')
  //if (process.platform !== 'darwin') {
  app.quit()
  //}
})

app.on('before-quit', (event)=>{
  log.debug('before-quit')
  
  if(mainWindow){
    mainWindow.webContents.send('before-quit');

    mainWindow.openDevTools({mode: 'detach'})

    if(firstQuit){
      event.preventDefault()
      firstQuit = false
    }

    setTimeout(()=>{
      log.debug('quit now')
      app.quit()}, 800)
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

// ipcMain.on('resize', (event, width, height) => {
//   mainWindow.setSize(width, height)
//   mainWindow.center()
//
//   log.debug(`mainWindow resized to ${width}:${height}`)
// })

ipcMain.on('quit', (event) => {
  app.quit()
})

function createMenu() {
  const application = {
    label: "Application",
    submenu: [
      {
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        type: "separator"
      },
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const template = [
    application,
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}