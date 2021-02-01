const platform = require('os').platform()
const {menubar} = require('menubar')
const path = require('path')

const initialIcon = path.join(__dirname, 'img/png/blank.png')

const mb = menubar({
  preloadWindow: true,
  icon: initialIcon,
  browserWindow: {
    width: 220,
    height: 206,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  }
})

// Make menubar accessible to the renderer
global.sharedObject = {mb}

mb.on('ready', () => {
  console.log('app is ready')
  // Workaround to fix window position when statusbar at top for win32
  if (platform === 'win32' && mb.tray.getBounds().y < 5) {
    mb.setOption('windowPosition', 'trayCenter')
  }
})

mb.on('after-create-window', () => {
  mb.window.loadURL(`file://${__dirname}/index.html`) // eslint-disable-line node/no-path-concat

  mb.tray.on('right-click', () => {
    if(!mb.window.isVisible()) {
      mb.showWindow()
    }
  })
})
