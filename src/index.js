const { app, dialog, BrowserWindow } = require('electron');
const path = require('path');
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
const { ipcMain } = require('electron')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const getFilesAsync = async (filePath) => {
  const fileContent = (await readFile(filePath)).toString()
  return fileContent
}

ipcMain.handle('save-file', async (e, { fileOpened, currentFileContent }) => {
  try {
    const newFile = await writeFile(fileOpened, currentFileContent)
    return newFile
  } catch(e) {
    console.error(e)
  }
})

ipcMain.handle('get-file-from-user', async e => {
  const dialogResponse = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md'] },
      { name: 'Text Files', extensions: ['txt', 'text'] }
    ]
  })
  try {
    if (dialogResponse.canceled) return
    const filePath = dialogResponse.filePaths[0]
    const fileContent = await getFilesAsync(filePath)
    app.addRecentDocument(filePath)
    e.sender.send('file-open', { filePath, fileContent })
  } catch (err) {
    console.error(err)
  }
})


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Mdown ⬇',
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // When content loaded
  mainWindow.once('ready-to-show', () => mainWindow.show())
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
