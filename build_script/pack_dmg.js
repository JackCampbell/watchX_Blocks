var createDMG = require('electron-installer-dmg');
const path = require('path');

createDMG({
	appPath: 'dist/osx/watchX Blocks-darwin-x64/watchX Blocks.app',
	icon: 'resources/osx/dmg-icon.icns',
	name: 'watchX Blocks',
	overwrite: true,
	background: 'resources/osx/dmg-background.png',
	out: path.join(__dirname, '..', 'dist', 'osx'),
	contents: function (opts) {
		return [
			{ x: 425, y: 225, type: 'link', path: '/Applications'},
			{ x: 125, y: 225, type: 'file', path: opts.appPath } ];
	}
}, function done (err) {
	console.log("State:", err);
});