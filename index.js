const IO = require('fs')
const { hotel, settings } = require('./config.json')
const { app, BrowserWindow } = require('electron')
const { join } = require('path')

let window

getIcon = () => {
	
	let iconsPath = 'assets/icons/'	
	let hotelIcon = join(__dirname, iconsPath, `${hotel.name}.png`)
	let cycloneIcon = join(__dirname, iconsPath, 'cyclone.png')	

	return IO.existsSync(hotelIcon) ? hotelIcon : cycloneIcon
}

createWindow = () => {

	window = new BrowserWindow({
		width: 1280,
		height: 720,
		title: hotel.name,
		icon: getIcon(),
		webPreferences: {
			plugins: true
		}
	})

	window.setMenuBarVisibility(settings.enableMenu)
	settings.startMaximized ? window.maximize() : null

	window.loadURL(hotel.url)

	window.on('closed', () => {
		window = null
	})

	settings.enableDevTools ? null : (
		window.webContents.on('devtools-opened', () => {
			window.webContents.closeDevTools()
		})
	)
}

app.on('ready', createWindow)

app.on('window-closed-all', () => {
	if(process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if(window === null) {
		createWindow()
	}
})