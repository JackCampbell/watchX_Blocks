const fs = require("fs");
const path = require("path");
const os = require('os');
const https = require('https');
const url = require('url');
const zlib = require("zlib");
const assert = require("assert");
const { exec, execSync, spawnSync } = require('child_process');
// 3th part
const tar = require('tar');
const extract = require('extract-zip');
const winston = require('winston');



function get_dir_exists(absolute_path) {
	if(absolute_path == null) {
		return null;
	}
	if(fs.existsSync(absolute_path) == false) {
		return null;
	}
	var stat = fs.lstatSync(absolute_path);
	if(!stat) {
		return null;
	}
	if( stat.isDirectory() == false) {
		return null
	}
	return absolute_path;
}
function get_file_exists(absolute_path) {
	if(absolute_path == null) {
		return null;
	}
	if(fs.existsSync(absolute_path) == false) {
		return null;
	}
	var stat = fs.lstatSync(absolute_path);
	if(stat == null) {
		return null;
	}
	//if( stat.isFile() == false)
	if(stat.isDirectory() == true) {
		return null
	}
	return absolute_path;
}
function get_option_key_value(object) {
	return Object.keys(object).map(prop => { return { value: prop, display_text: object[prop] } });
}
function get_option_prop(object) {
	return Object.keys(object).map(prop => { return { value: prop, display_text: prop } });
}
function get_option_array(array) {
	return array.map(port => { return { value: port, display_text: port } })
}
function get_first_value(object) {
	return Object.keys(object)[0];
}

function insert_quote(compiler) {
	return '"' + compiler + '"';
}

function find_serial_ports(compiler, fqbn = "arduino:avr:leonardo") {
	compiler = insert_quote(compiler);
	var cmdline = [compiler, 'board', 'list'].join(' ');
	try {
		var output = execSync(cmdline).toString();
		var list = output.toString().trim().split('\n').filter(item => item.indexOf(fqbn) != -1).map(item => item.split(' ').shift())
		return { code: 0, stdout: output, ports: list };
	} catch(error) {
		return { code: error.status, stderr: error.message };
	}
}
function check_compiler(compiler) {
	compiler = insert_quote(compiler);
	var cmdline = [ compiler, 'version' ].join(' ');
	try {
		var output = execSync(cmdline).toString();
		var check = output.startsWith("arduino-cli");
		return { code: 0, stdout: output, status: check };
	} catch(error) {
		return { code: error.status, stderr: error.message };
	}
}
function find_serial_ports_cb(compiler, fqbn = "arduino:avr:leonardo", callback) {
	compiler = insert_quote(compiler);
	var cmdline = [compiler, 'board', 'list'].join(' ');
	exec(cmdline, (error, stdout, stderr) => {
		if(error) {
			return callback(error.code, null);
		}
		var list = stdout.toString().trim().split('\n').filter(item => item.indexOf(fqbn) != -1).map(item => item.split(' ').shift())
		callback(0, list);
	});
}

function write_sketch(sketch_code, sketch_path) {
	var dir = path.join(sketch_path, 'watchxsketch');
	if(!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	var filename = path.join(dir, 'watchxsketch.ino');
	fs.writeFileSync(filename, sketch_code, 'utf-8');
	return filename;
}

function compile_process(args, callback) {
	var cmdline = args.join(' ');
	// console.log(">>>", cmdline);
	return exec(cmdline, (error, stdout, stderr) => {
		var code = 0;
		if(error) {
			code = error.code;
		}
		var c_stdout = stdout || '';
		var c_stderr = stderr || '';
		if(c_stderr.length != 0 && code == 0) {
			c_stdout += "\n" + c_stderr;
			c_stderr = '';
		}
		callback(code, c_stdout, c_stderr);
	});
}



function install_core(compile_dir, callback) {
	compile_dir = insert_quote(compile_dir);
	var cmdline = [compile_dir, 'core', 'install', 'arduino:avr'].join(' ');
	return exec(cmdline, (error, stdout, stderr) => {
		var code = 0;
		if(error) {
			code = error.code;
		}
		callback(code, stdout || '', stderr || '');
	});
}




const PLATFORM_KEYS = {
	"win32": "Windows",
	"darwin": "macOS",
	"linux": "Linux"
};
const ARCH_KEYS = {
	"x86_64": "64bit",
	"amd64": "64bit",
	"x64": "64bit",
	"i386": "32bit",
	"ia32": "32bit",
	"x32": "32bit",
	"arm": "ARMv7",
};
function get_file_size(size) {
	var calc = size / (1 << 30);
	if (Math.floor(calc) != 0) {
		return calc.toFixed(2) + " GB";
	}
	calc = size / (1 << 20);
	if (Math.floor(calc) != 0) {
		return calc.toFixed(2) + " MB";
	}
	calc = size / (1 << 10);
	if (Math.floor(calc) != 0) {
		return calc.toFixed(2) + " KB";
	}
	return size + " Byte";
}
function get_percent(value, total) {
	return ((value * 100) / total).toFixed(2)
}
function setup_download_percent(response) {
	var received_bytes = 0;
	var total_bytes = response.headers["content-length"];
	response.on('data', function(chunk) {
		received_bytes += chunk.length;
		var recv_str = get_file_size(received_bytes);
		var chunk_str = get_file_size(chunk.length);
		if(total_bytes == null) {
			process.stdout.write(`recv: ${recv_str} Ck: ${chunk_str}\r`);
		} else {
			var total_str = get_file_size(total_bytes);
			var percentage = get_percent(received_bytes, total_bytes);
			process.stdout.write(`percent: % ${percentage} recv: ${recv_str}/${total_str} Ck: ${chunk_str}\r`)
		}
	});
}
function get_bundle_extension() {
	if(os.platform() == "win32") {
		return ".zip";
	} else {
		return ".tar.gz";
	}
}
function get_command_extension() {
	if(os.platform() == 'win32') {
		return ".exe";
	}
	return "";
}
function get_arduino_cli_name(version) {
	var platform = PLATFORM_KEYS[os.platform()];
	if(platform == null) {
		throw new Error("Undefined platform");
	}
	var arch = ARCH_KEYS[os.arch()];
	if(arch == undefined) {
		throw new Error("Undefined arch");
	}
	return "arduino-cli_" + version + "_" + platform + "_" + arch + get_bundle_extension();
}
function get_arduino_cli_manifest(callback) {
	var options = {
		host: 'api.github.com',
		path: '/repos/arduino/arduino-cli/releases/latest',
		headers: {'User-Agent': 'request'}
	};
	https.get(options, response => {
		var list = [];
		response.on('data', function (chunk) {
			list.push(chunk);
		});
		response.on('end', function () {
			if(response.statusCode != 200) {
				callback(new Error("Status: " + response.statusCode), null);
				return;
			}
			try {
				var buffer = Buffer.concat(list).toString("utf-8");
				var json = JSON.parse(buffer)
				callback(null, json);
			} catch (e) {
				callback(e, null);
			}
		});
	}).on('error', error => {
		callback(error, null);
	});
}
function get_arduino_cli_download_and_extract(asset, user_path, callback) {
	var zip_path = path.join(user_path, asset.name);
	if(fs.existsSync(zip_path)) {
		fs.unlinkSync(zip_path); // remove old file ...
	}
	var file = fs.createWriteStream(zip_path);
	winston.info("Downloading...\t" + asset.browser_download_url);
	https.get(asset.browser_download_url, response => {
		setup_download_percent(response);
		if(response.statusCode == 200) {
			response.pipe(file);
			return;
		}
		if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
			if (url.parse(response.headers.location).hostname) {
				winston.info("redirect: " + response.headers.location);
				https.get(response.headers.location, (data) => {
					setup_download_percent(data);
					data.pipe(file);
				});
			} else {
				var solve = url.resolve(url.parse(url).hostname, response.headers.location);
				winston.info("redirect: " + solve);
				https.get(solve, (data) => {
					setup_download_percent(data);
					data.pipe(file);
				});
			}
			return;
		}
		callback(new Error("Cannot download file: " + asset.browser_download_url), null);
	}).on('error', (error) => {
		callback(error, null);
	});
	file.on('finish', () => {
		winston.info('Unzipping...\t' + zip_path);
		var extract_path = path.join(user_path, "arduino-cli");
		if(!fs.existsSync(extract_path)) {
			fs.mkdirSync(extract_path);
		}
		winston.info("extracting...\t" + extract_path);
		// OK ..
		// if(fs.existsSync(extract_path)) {
		// 	fs.rmdirSync(extract_path, { recursive: true });
		// 	console.log("removed extract path");
		// }
		var compile_path = path.join(extract_path, "arduino-cli") + get_command_extension();
		if(os.platform() == "win32") {
			extract(zip_path, { dir: extract_path });
			callback(null, compile_path);
		} else {
			// const comp = fs.createReadStream(zip_path);
			// const tar_path = path.join(install_path, "arduino-cli.tar");
			// const unzip = zlib.createUnzip();
			// const tarball = fs.createWriteStream(tar_path);
			// comp.pipe(unzip).pipe(tarball);
			tar.extract({ cwd: extract_path, file: zip_path, sync: true });
			callback(null, compile_path);
		}
	});
}


function download_core(user_path, callback) {
	if(user_path == null) {
		user_path = path.join( os.homedir(), '.watchx_blocks' );
	}
	if(!fs.existsSync(user_path)) {
		fs.mkdirSync(user_path);
	}
	var arduino_cli_path = path.join(user_path, "arduino-cli", "arduino-cli" + get_command_extension() );
	if(fs.existsSync(arduino_cli_path)) {
		winston.info("already installed compiler: " + arduino_cli_path);
		callback(null, arduino_cli_path);
		return;
	}
	get_arduino_cli_manifest( (error, json) => {
		if(error) {
			throw error;
		}
		winston.info("Current Version: " + json.tag_name);
		var name = get_arduino_cli_name(json.tag_name);
		var download_asset = json.assets.find(asset => asset.name == name);
		if(download_asset == null) {
			throw new Error("cannot find package of " + name);
		}
		get_arduino_cli_download_and_extract(download_asset, user_path, (error, arduino_cli_path) => {
			if(error) {
				throw error;
			}
			callback(null, arduino_cli_path);
		});
	});
}



module.exports = {
	get_dir_exists,
	get_file_exists,
	get_option_key_value,
	get_option_prop,
	get_option_array,
	get_first_value,

	get_file_size,

	find_serial_ports,
	find_serial_ports_cb,
	check_compiler,
	write_sketch,
	compile_process,

	install_core,
	download_core
};

