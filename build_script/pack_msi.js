const { MSICreator } = require('electron-wix-msi');
const path = require("path");
const config = require("../package.json");

const msiCreator = new MSICreator({
	appDirectory: path.join(__dirname, "..\\dist\\win\\watchXBlocks-win32-x64"),
	outputDirectory: path.join(__dirname, "..\\dist\\msi"),

	// Configure metadata
	description: config.description,
	exe: config.name,
	name: config.name,
	manufacturer: config.author,
	version: config.version,
	appIconPath: 'resources/windows/icon.ico',
	// Configure installer User Interface
	ui: {
		chooseDirectory: true,
		images: {
			// background: path.join(__dirname, "..\\resources\\windows\\setup-banner.bmp"),
			infoIcon: path.join(__dirname, "..\\resources\\windows\\icon.ico")
		}
	}
});
msiCreator.create().then(function(){
	msiCreator.compile();
});