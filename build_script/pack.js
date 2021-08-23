const packager = require('electron-packager');
const createDMG = require('electron-installer-dmg');
const installerWin = require('electron-installer-windows');
const installerDeb = require('electron-installer-debian');
const installerRPM = require('electron-installer-redhat')
const zip = require('electron-installer-zip');
const { MSICreator } = require('electron-wix-msi');
const config = require("../package.json");
const path = require("path");
const fs = require("fs");


const project_path = path.join(__dirname, "..");
const dist_path = path.join(project_path, "dist");

function ignore_package(filepath) {
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
	if( filepath.startsWith("/blockly/tests") ||
		filepath.startsWith("/blockly/demos") ||
		filepath.startsWith("/build_pack") ||
		filepath.startsWith("/build_script") ||
		filepath.startsWith("/.git") ||
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
}
const package_opts = {
	'name': config.productName,
	'dir' : project_path,
	'asar': true,
	'prune': true,
	'overwrite': true,
	'appBundleId': 'jack.campbell.watchxblocks',
	'appCopyright': config.copyright,
	'appVersion': config.version,
	'win32metadata': {
		'CompanyName': 'argeX A.S.',
		'FileDescription': config.productName
	},
	'darwinDarkModeSupport': false,
	'appCategoryType': 'public.app-category.education',
	'extraResource': [ 'include/', 'watchxblocks.vac', 'build/' ],
	'ignore': ignore_package,
	'protocols': {
		'name': "watchX-blocks-metadata",
		'schemes': ["watchx"] // calismadi !!!
	},
	'osxSign': {
		'identity': 'Apple Development: jack_campbell_512@hotmail.com (BU6S277FZG)',
		'hardened-runtime': true,
		'entitlements': 'build_script/entitlements.plist',
		'entitlements-inherit': 'build_script/entitlements.plist',
		'signature-flags': 'library',
		// DIKKAT yapmasini engeller !!!
		'gatekeeper-assess': false
	}/*,
	'osxNotarize': {
		'appleId': 'jack_campbell_512@hotmail.com',
		'appleIdPassword': '----no-password'
	}*/
};


function samver_version() {
	return config.version.split(".").slice(0, 3).join(".");
}
function pack_zip(opts) {
	return new Promise((resolve, reject) => {
		zip(opts, function(error, result) {
			if(error) {
				reject(error);
			} else {
				resolve(result);
			}
		})
	});
}

function pack_osx() {
	console.log("build osx");
	return packager({
		...package_opts,
		'out': path.join(dist_path, "osx"),
		'platform': 'darwin',
		'arch': 'x64',
		'icon': 'resources/osx/icon.icns',
		'extraResource': package_opts.extraResource.concat('arduino-cli/darwin-x64/')
	}).then( result => {
		const { 0: app_path } = result;
		console.log("OSX success: ", app_path);
		return createDMG({
			'appPath': path.join(app_path, 'watchX Blocks.app'),
			'icon': 'resources/osx/dmg-icon.icns',
			'name': 'watchX Blocks',
			'overwrite': true,
			'debug': false,
			'background': 'resources/osx/dmg-background.png',
			'out': path.join(dist_path, 'osx'),
			'contents': function (opts) {
				return [
					{ x: 425, y: 225, type: 'link', path: '/Applications'},
					{ x: 125, y: 225, type: 'file', path: opts.appPath } ];
			}
		});
	}).then(result => {
		console.log("DMG success: ", result.dmgPath, result.format);
	});
}
function pack_win32() {
	console.log("build win32");
	packager({
		...package_opts,
		'out': path.join(dist_path, "win32"),
		'platform': 'win32',
		'arch': 'ia32',
		'icon': 'resources/windows/icon.ico',
		'extraResource': package_opts.extraResource.concat('arduino-cli/windows-x32/')
	}).then(result => {
		const { 0: app_path } = result;
		console.log("Win32 success: ", app_path);
	});
}
function pack_win64() {
	console.log("build win64");
	packager({
		...package_opts,
		'out': path.join(dist_path, "win64"),
		'platform': 'win32',
		'arch': 'x64',
		'icon': 'resources/windows/icon.ico',
		'extraResource': package_opts.extraResource.concat('arduino-cli/windows-x64/')
	}).then(result => {
		const { 0: app_path } = result;
		const win_install = installerWin({
			'src': app_path, // //path.join(dist_path, "win64", "watchXBlocks-win32-x64"),
			'dest': path.join(dist_path, 'wstore'),
			'icon': 'resources/windows/setup-icon.ico',
			'name': config.name,
			'exe': config.productName + ".exe",
			'authors': [config.author],
			'version': samver_version(),
			'description': config.description,
			'copyright': config.copyright
		});
		const msiCreator = new MSICreator({
			'appDirectory': app_path, //path.join(dist_path, "win64", "watchXBlocks-win32-x64"),
			'outputDirectory': path.join(dist_path, "msi"),
			'description': config.description,
			'exe': config.productName + ".exe",
			'name': config.name,
			'manufacturer': config.author,
			'version': config.version,
			'appIconPath': 'resources/windows/icon.ico',
			'ui': {
				'chooseDirectory': true,
				'images': {
					// 'background': path.join(project_path, "resources", "windows", "setup-banner.bmp"),
					'infoIcon': path.join(project_path, "resources", "windows", "icon.ico")
				}
			}
		});
		const zip = pack_zip({
			'dir': app_path, // path.join(dist_path, "win64", "watchXBlocks-win32-x64"),
			'out': path.join(dist_path, "win64", config.productName + ".zip")
		})
		return Promise.all([ win_install, msiCreator.create().then(result => msiCreator.compile()), zip ]);
	}).then(result => {
		console.log("Win64 success: ", result);
	});
}
function pack_linux64() {
	return packager({
		...package_opts,
		'out': path.join(dist_path, "linux64"),
		'platform': 'linux',
		'arch': 'x64',
		'icon': 'resources/windows/icon.ico',
		'extraResource': package_opts.extraResource.concat('arduino-cli/linux-x64/')
	}).then( result => {
		const { 0: app_path } = result;
		console.log("Linux success: ", app_path);
		const zip = pack_zip({
			'dir': app_path, // path.join(dist_path, "linux", "watchXBlocks-linux-x64"),
			'out': path.join(dist_path, "linux64", config.productName + ".zip")
		});
		const deb = installerDeb({
			'src': app_path,
			'dest': path.join(dist_path, 'linux64'),
			'bin': 'watchX Blocks',
			'arch': 'amd64',
			'icon': "resources/icon.png",
			"categories": [ "Utility" ],
			"lintianOverrides": [ "changelog-file-missing-in-native-package" ]
		});
		const rpm = installerRPM({
			'src': app_path,
			'dest': path.join(dist_path, 'linux64'),
			'bin': 'watchX Blocks',
			'arch': 'amd64',
			'license': 'Apache License',
			'icon': "resources/icon.png",
			"categories": [ "Utility" ],
			"lintianOverrides": [ "changelog-file-missing-in-native-package" ]
		});
		return Promise.all([ zip, deb, rpm ]);
	});
}

function write_version() {
	if(fs.existsSync(dist_path) == false) {
		fs.mkdirSync(dist_path, { recursive: true });
	}
	var ver_path = path.join(dist_path, "version");
	fs.writeFileSync(ver_path, config.version, "utf8");
}
function get_platform() {
	if(process.platform == 'darwin') {
		return 'osx';
	} else if(process.platform == 'win32') {
		return 'windows';
	} else if(process.platform == 'linux') {
		return 'linux';
	}
	return null;
}
function get_arch() {
	if(process.arch == 'x86_64' || process.arch == 'x64' || process.arch == 'amd64') {
		return 'x64';
	} else if(process.arch == 'ia32' || process.arch == 'x86' || process.arch == 'i386') {
		return 'x32';
	}
	return null;
}

function main() {
	console.log(">>", process.argv);
	var platform = get_platform();
	var arch = get_arch();
	if(process.argv.length >= 3) {
		platform = process.argv[2];
	}
	if(process.argv.length >= 4) {
		arch = process.argv[3];
	}
	write_version();
	if(platform == 'osx') {
		pack_osx();
	} else if(platform == 'windows' && arch == 'x32') {
		pack_win32();
	} else if(platform == 'windows' && arch == 'x64') {
		pack_win64();
	} else if(platform == 'linux' && arch == 'x64') {
		pack_linux64();
	} else {
		console.error("Undefined platform ...");
	}
}

main();

/*


*/