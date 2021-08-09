var createDMG = require('electron-installer-dmg');
const path = require('path');

createDMG({
	appPath: 'dist/osx/watchXBlocks-darwin-x64/watchXBlocks.app',
	icon: 'resources/osx/dmg-icon.icns',
	name: 'watchXBlocks',
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