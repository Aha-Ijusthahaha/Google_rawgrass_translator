// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, dialog} = require('electron')

let mainWindow
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 966,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(mainWindow.webContents);
  // and load the index.html of the app.
  mainWindow.loadFile(__dirname + '/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  const menuTemplate = [
    {
      label: '文件',
      submenu: [
        {
          label: '从文件中导入内容',
          click: () => {
            mainWindow.webContents.send('importFile')
          }
        },
        {
          label: '从结果中导出内容',
          click: () => {
            mainWindow.webContents.send('exportFile')
          }
        },
        {
          type: "separator"
        },
        {
          label: '退出程序',
          role: 'quit'
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '全屏 / 取消全屏',
          role: 'togglefullscreen'
        },
        {
          label: '放大10%',
          role: 'zoomIn'
        },
        {
          label: '缩小10%',
          role: 'zoomOut'
        },
        {
          label: '重置大小',
          role: 'resetZoom'
        },
        {
          type: 'separator'
        },
        {
          label: '重新加载',
          role: 'forceReload'
        },
        {
          type: 'separator'
        },
        {
          label: '打开开发者工具',
          role: 'toggleDevTools'
        }
      ]
    },
    {
      label: '设置',
      submenu: [
        {
          label: '浅色模式 / 深色模式',
          click: () => {
            mainWindow.webContents.send('changeColor')
          }
        },
        {
          type: 'separator'
        }
      ]
    },
    {
      label: '关于',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: '关于此谷歌生草机',
          message:
              `作者: Ijusthahaha\n版本: v0.1\n原作者: bilibili MC着火的冰块`
        })
      }
    }
  ]
  const appMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(appMenu);
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
