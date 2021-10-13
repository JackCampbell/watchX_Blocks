const fs = require("fs");
const path = require("path");
const os = require("os");

function parse_version(config, count) {
	var version_split = config.version.split(".");
	if(version_split.length == 3) {
		version_split[2] = count.toString(10);
	} else {
		version_split.push(count.toString(10));
	}
	return version_split.join(".");
}
function get_build_data(config, count) {
	var date = new Date();
	var user_info = os.userInfo();
	var data = {
		count: count,
		timestamp: date.toString(),
		platform: os.platform(),
		arch: os.arch(),
		username: user_info.username,
		version: os.version(),
		hostname: os.hostname()
	}
	return Object.assign(config.argex || {}, data);
}

function read_build_data(config, count) {
	if(config.argex != null) {
		count = config.argex.count || 0;
	}
	return count;
}
if(process.argv.length != 3) {
	console.log("usage: node builder.js ../package.json");
	process.exit(-1);
}
const package_file = path.join( process.cwd(), process.argv[2] );
if( fs.existsSync(package_file) == false ) {
	console.log("package file is not found !!!");
	process.exit(-2);
}
const config = require(package_file);
var count = read_build_data(config, 100) + 1;
config.version = parse_version(config, count);
config.argex = get_build_data(config, count);

var json = JSON.stringify(config, null, "\t");
fs.writeFileSync(package_file, json, "utf-8");
console.log("Version: ", config.version, package_file);
