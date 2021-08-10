const installer = require('electron-installer-windows');


installer({
	src: 'dist/win/watchXBlocks-win32-x64',
	dest: 'dist/wstore/',
	icon: 'resources/windows/setup-icon.ico'
}, function(error) {
	console.log("out", error);
});
