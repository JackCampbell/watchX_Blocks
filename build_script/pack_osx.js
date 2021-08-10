const packager = require('electron-packager');
const path = require("path");

// electron-packager . watchXBlocks --overwrite --out=dist/osx --platform=darwin --arch=x64 --icon=resources/osx/icon.icns --ignore='watchx_exec' --ignore='watchxblocks.log' --ignore='dist' --ignore='arduino-cli/darwin-x64' --app-bundle-id='jack.campbell.watchxblocks' && npm run codesign
packager({
	dir : path.join(__dirname, '../'),
	asar: true,
	prune: true,
	overwrite: true,
	out: './dist/osx',
	platform: 'darwin',
	arch: 'x64',
	icon: 'resources/osx/icon.icns',
	appBundleId: 'jack.campbell.watchxblocks',
	appCategoryType: 'public.app-category.education',
	extraResource: [
		'arduino-cli/darwin-x64/',
		'include/',
		'watchxblocks.vac'
	],
	ignore: function(filepath) {
		if (/node_modules/.test(filepath)) {
			if (/\/(obj|test.*?|spec.*?|htdocs|demo|dist|example.*?|sample.*?)[\/$]/i.test(filepath)) {
				console.log("[Pass]", filepath);
				return true;
			}
			if (/^(\..*|.*\.(sln|pdb|exp|lib|map|md|sh|gypi|gyp|h|cpp|xml|yml|html)|vcxproj.*|LICENSE|README|CONTRIBUTORS|vagrant|Dockerfile|Makefile)$/i.test(path.basename(filepath))) {
				console.log("[Pass]", filepath);
				return true;
			}
		}
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
		// console.log("[F]", filepath);
		return false;
	}/*,
	osxSign: {
		'identity': 'jack_campbell_512@hotmail.com',
		'hardened-runtime': true,
		'entitlements': 'build_script/entitlements.plist',
		'entitlements-inherit': 'build_script/entitlements.plist',
		'signature-flags': 'library'
	},
	osxNotarize: {
		appleId: 'jack_campbell_512@hotmail.com'
	}
	*/
});