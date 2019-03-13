import {
	app,
	BrowserWindow,
	Menu,
} from 'electron' // eslint-disable-line

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ?
	'http://localhost:9080' :
	`file://${__dirname}/index.html`;

app.commandLine.appendSwitch('ppapi-flash-path', '../../static/flash/pepflashplayer64_32_0_0_101.dll');
app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.101');

function createWindow() {
	/**
	 * Initial window options
	 */
	Menu.setApplicationMenu(null);
	mainWindow = new BrowserWindow({
		height: 563,
		useContentSize: true,
		width: 1280,
		minWidth:860,
		'web-preferences': {
      'plugins': true
    }
	});

	mainWindow.loadURL(winURL);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});


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
