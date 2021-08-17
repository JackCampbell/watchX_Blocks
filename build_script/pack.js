const packager = require('electron-packager');
const createDMG = require('electron-installer-dmg');
const installer = require('electron-installer-windows');
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
}
const package_opts = {
	'name': "watchX Blocks",
	'dir' : project_path,
	'asar': true,
	'prune': true,
	'overwrite': true,
	'appBundleId': 'jack.campbell.watchxblocks',
	'appCategoryType': 'public.app-category.education',
	'extraResource': [ 'include/', 'watchxblocks.vac' ],
	'ignore': ignore_package,
	'protocols': {
		'name': "watchX-blocks-linking",
		'schemes': ["watchX"] // calismadi !!!
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
const osx_package_opts = {
	...package_opts,
	'out': path.join(dist_path, "osx"),
	'platform': 'darwin',
	'arch': 'x64',
	'icon': 'resources/osx/icon.icns',
	'extraResource': package_opts.extraResource.concat('arduino-cli/darwin-x64/')
};
const win32_package_opts = {
	...package_opts,
	'out': path.join(dist_path, "win32"),
	'platform': 'win32',
	'arch': 'ia32',
	'icon': 'resources/windows/icon.ico',
	'extraResource': package_opts.extraResource.concat('arduino-cli/windows-x32/')
};
const win64_package_opts = {
	...package_opts,
	'out': path.join(dist_path, "win32"),
	'platform': 'win32',
	'arch': 'x64',
	'icon': 'resources/windows/icon.ico',
	'extraResource': package_opts.extraResource.concat('arduino-cli/windows-x64/')
};
const dmg_package_opts = {
	'appPath': 'dist/osx/watchX Blocks-darwin-x64/watchX Blocks.app',
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
};
const wstore_package_opts = {
	src: 'dist/win/watchXBlocks-win32-x64',
	dest: path.join(dist_path, 'wstore'),
	icon: 'resources/windows/setup-icon.ico'
};
const msi_package_opts = {
	appDirectory: path.join(dist_path, "win", "watchXBlocks-win32-x64"),
	outputDirectory: path.join(dist_path, "msi"),
	description: config.description,
	exe: config.name,
	name: config.name,
	manufacturer: config.author,
	version: config.version,
	appIconPath: 'resources/windows/icon.ico',
	ui: {
		chooseDirectory: true,
		images: {
			// background: path.join(project_path, "resources", "windows", "setup-banner.bmp"),
			infoIcon: path.join(project_path, "resources", "windows", "icon.ico")
		}
	}
};


function pack_osx() {
	console.log("build osx");
	return packager(osx_package_opts).then( result => {
		const { 0: app_path } = result;
		console.log("OSX success: ", app_path);
		dmg_package_opts.appPath = path.join(app_path, 'watchX Blocks.app');
		return createDMG(dmg_package_opts);
	}).then(result => {
		console.log("DMG success: ", result.dmgPath, result.format);
	});
}
function pack_win32() {
	console.log("build window32");
	packager(win32_package_opts).then(result => {
		const { 0: app_path } = result;
		console.log("Win32 success: ", app_path);
	});
}
function pack_win64() {
	console.log("build window64");
	packager(win64_package_opts).then(result => {
		const { 0: app_path } = result;
		wstore_package_opts.src = app_path;
		msi_package_opts.appDirectory = app_path;

		const msiCreator = new MSICreator(msi_package_opts);
		return Promise.all([
			installer(wstore_package_opts),
			msiCreator.create().then(result => msiCreator.compile())
		]);
	});
}

function write_version() {
	var ver_path = path.join(dist_path, "version");
	fs.writeFileSync(ver_path, config.version, "utf8");
}


write_version();
if(process.platform == 'darwin') {
	pack_osx();
} else if(process.platform == 'win32' && (process.arch == 'ia32' || process.arch == 'x86')) {
	pack_win32();
} else if(process.platform == 'win32' && (process.arch == 'amd64' || process.arch == 'x86_64')) {
	pack_win64();
}
