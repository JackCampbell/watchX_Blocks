const packager = require('electron-packager');
const path = require("path");

// electron-packager . watchXBlocks --overwrite --out=dist/osx --platform=darwin --arch=x64 --icon=resources/osx/icon.icns --ignore='watchx_exec' --ignore='watchxblocks.log' --ignore='dist' --ignore='arduino-cli/darwin-x64' --app-bundle-id='jack.campbell.watchxblocks' && npm run codesign
packager({
	name: "watchXBlocks",
	dir : path.join(__dirname, '../'),
	asar: true,
	prune: true,
	overwrite: true,
	out: './dist/win',
	platform: 'win32',
	arch: 'x64',
	icon: 'resources/windows/icon.ico',
	// appVersion: '1.0',
	// buildVersion: '0.36.2',
	extraResource: [
		'arduino-cli/windows-x64/',
		'include/',
		'watchxsketch/',
		'watchxblocks.vac'
	],
	ignore: function(filepath) {
		if( filepath.startsWith("/.git") ||
			filepath.startsWith("/.idea") ||
			filepath.startsWith("/dist") ||
			filepath.startsWith("/build") ||
			filepath.startsWith("/watchxsketch") ||
			filepath.startsWith("/cache") ||
			filepath.startsWith("/appdata") ||
			filepath.startsWith("/arduino-cli") ||
			filepath.indexOf(".bin/") != -1 ||
			filepath.indexOf(".git") != -1 ||
			filepath.indexOf(".gitignore") != -1 ||
			filepath.indexOf(".DS_Store") != -1 ||
			filepath == "/watchxblocks.log" ||
			filepath == '/watchxblocks.vac') {
			console.log("[Pass]", filepath);
			return true;
		}
		return false;
	}/*,
	osxSign: {
		'identity': 'Developer ID Application: JackCampbell',
		'hardened-runtime': true,
		'entitlements': 'build/entitlements.plist',
		'entitlements-inherit': 'build/entitlements.plist',
		'signature-flags': 'library'
	},
	osxNotarize: {
		appleId: 'jack_campbell_512@hotmail.com',
		appleIdPassword: 'XXXXXX'
	}*/
});