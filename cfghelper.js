const fs = require("fs");
const path = require("path");
const { exec, execSync, spawnSync } = require('child_process');



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
	exec(cmdline, (error, stdout, stderr) => {
		var code = 0;
		if(error) {
			code = error.code;
		}
		callback(code, stdout || '', stderr || '');
	});
}
function install_core(compile_dir, callback) {
	compile_dir = insert_quote(compile_dir);
	var cmdline = [compile_dir, 'core', 'install', 'arduino:avr'].join(' ');
	exec(cmdline, (error, stdout, stderr) => {
		var code = 0;
		if(error) {
			code = error.code;
		}
		callback(code, stdout || '', stderr || '');
	});
}


module.exports = {
	get_dir_exists,
	get_file_exists,
	get_option_key_value,
	get_option_prop,
	get_option_array,
	get_first_value,

	find_serial_ports,
	check_compiler,
	write_sketch,
	compile_process,
	install_core
};




