// server ....
const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron');
const path = require("path");
const fs = require("fs");
const config = require("./cfgconst.js");
const helper = require("./cfghelper.js"); // TEST
const winston = require('winston');
const projectLocator = require('./projectlocator.js');



const tagMgr = "[watchXEvt] ";
const wxb_filter_name = "watchX Blocks File";
var compiler_process = null;

function send_error(event, name, id, description, type = null, tag = null) {
	var message = {
		'response_type': 'settings',
		'response_state': 'full_response',
		'settings_type': type || 'invalid',
		'tag': tag,
		'errors': [
			{ 'id': id, 'description': description }
		], 'success': false
	};
	event.reply(name, message);
}
function send_process(event, name, code, stdout, stderr, type = null, tag = null) {
	var success = false;
	if(code == 0) {
		success = true;
	}
	var message = {
		'response_type': type || 'ide_output',
		'response_state': 'full_response',
		'success': success,
		'ide_mode': "upload-hex",
		"tag": tag,
		'ide_data': {
			'std_output': stdout,
			'err_output': stderr,
			'exit_code': code
		}
	}
	event.reply(name, message);
}
function send_option_select(event, name, options, selected, type = null, tag = null) {
	var message = {
		'response_type': 'settings',
		'response_state': 'full_response',
		'settings_type': type || 'invalid',
		'options': options,
		'tag': tag,
		'selected': selected,
		'success': true
	};
	event.reply(name, message);
}
function send_simple_select(event, name, selected, type = null, tag = null) {
	var message = {
		'response_type': 'settings',
		'response_state': 'full_response',
		'settings_type': type || 'invalid',
		'tag': tag,
		'selected': selected,
		'success': true
	};
	event.reply(name, message);
}

function insert_quote(path) {
	return '"' + path + '"';
}

// editor ...
ipcMain.on('get-version', (event, args) => {
	event.returnValue = app.getVersion();
});
ipcMain.on('editor-export', (event, arg) => {
	var { content, title } = arg;
	var filename = dialog.showSaveDialogSync(null, {
		title: title,
		properties: ['createDirectory'],
		filters: [
			{ name: 'Arduino Source Code', extensions: ['ino'] }
		]
	});
	if(filename == null) {
		event.returnValue = { "filename": null };
	} else {
		fs.writeFileSync(filename, content, "utf-8");
		winston.info(tagMgr + 'Export path: ' + filename);
		event.returnValue = { "filename": filename };
	}
});
ipcMain.on('editor-save', (event, args) => {
	var { filename, content, basename, title } = args;
	if(filename == null) {
		filename = dialog.showSaveDialogSync(null, {
			title: title,
			defaultPath: basename || "New Code",
			properties: ['createDirectory'],
			filters: [
				{ name: wxb_filter_name, extensions: ['wxb'] }
			]
		});
		if(filename == null) {
			event.returnValue = { "filename": null };
			return;
		}
	}
	fs.writeFileSync(filename, content, "utf-8");
	winston.info(tagMgr + 'Save path: ' + filename);
	event.returnValue = { "filename": filename };
});
ipcMain.on('editor-load', (event, args) => {
	const { filename } = args;
	var content = null;
	winston.info(tagMgr + 'Load path: ' + filename);
	try {
		if(fs.existsSync(filename)) {
			var stat = fs.statSync(filename);
			if(stat.isFile() == true) {
				fs.accessSync(filename, fs.constants.R_OK || fs.constants.W_OK);
				content = fs.readFileSync(filename, "utf-8");
			}
		}
	} catch(e) {
		console.log("permission denied: " + filename);
	}
	event.returnValue = { filename, content };
});
ipcMain.on('editor-open', (event, args) => {
	var { title } = args;
	var files = dialog.showOpenDialogSync(null, {
		title: title,
		properties: ['openFile'],
		filters: [
			{ name: wxb_filter_name, extensions: ['wxb'] }
		]
	});
	if(files == null) {
		event.returnValue = { "filename": null };
		return;
	}
	var content = fs.readFileSync(files[0], "utf-8");
	winston.info(tagMgr + 'Open path: ' + files[0]);
	return event.returnValue = { "filename": files[0], "content": content };
});
ipcMain.on('upload-hex', (event, args) => {
	const { hex_path } = args;
	if(compiler_process != null) {
		return send_error(event, "upload-hex-res", 76, 'Already process ...', 'ide_output', hex_path);
	}
	const compiler = config.get_compiler_path();
	if(compiler == null) {
		return send_error(event, "upload-hex-res", 53, 'Compiler directory not configured in the Settings', 'ide_output', hex_path);
	}
	const board = config.get_selected_fqbn();
	if(board == null) {
		return send_error(event, "upload-hex-res", 56, 'Arduino Board not configured in the Settings.', 'ide_output', hex_path);
	}
	const { ports } = helper.find_serial_ports(compiler, board);
	const serialport = config.get_serial_port(ports);
	if(serialport == null) {
		return send_error(event, "upload-hex-res", 55, 'Serial Port configured in Settings not accessible.', 'ide_output', hex_path);
	}
	var user_data_path = app.getPath('userData');
	var filename = projectLocator.getResourcePath(hex_path, user_data_path);
	if(filename == null) { // TODO sunuc kontrolu ...
		return send_error(event, "upload-hex-res", 74, 'file is not found: ' + filename, 'ide_output', hex_path);
	}
	var cmdline = [];
	cmdline.push( insert_quote(compiler) );
	cmdline.push( "upload" );
	cmdline.push( "--fqbn" );
	cmdline.push( board );
	cmdline.push( "--port" );
	cmdline.push( serialport );
	// cmdline.push( "--log-level" );
	// cmdline.push( "debug" );
	// cmdline.push( "-v" );
	cmdline.push( "--input-file" );
	cmdline.push( insert_quote(filename) );
	compiler_process = helper.compile_process(cmdline, (code, stdout, stderr) => {
		compiler_process = null;
		if(code != 0) {
			// return send_error(event, "upload-hex-res", 56, 'Unexpected Arduino exit error code:' + code, 'ide_output');
		}
		return send_process(event, "upload-hex-res", code, stdout, stderr, 'ide_output', hex_path);
	});
});
ipcMain.on('code', (event, args) => {
	const { sketch_code, action } = args;
	if(compiler_process != null) {
		return send_error(event, "code-res", 76, 'Already process ...', 'ide_output');
	}
	if(["upload", "verify"].indexOf(action) == -1) {
		return send_error(event, "code-res", 72, 'Undefined action', 'ide_output');
	}
	if(sketch_code == null) {
		return send_error(event, "code-res", 64, 'Unable to parse sent JSON.', 'ide_output');
	}
	const sketch_path = config.get_sketch_path();
	if(sketch_path == null) {
		return send_error(event, "code-res", 51, 'Could not create sketch file', 'ide_output');
	}
	var filename;
	try {
		filename = helper.write_sketch(sketch_code, sketch_path);
	} catch(e) {
		return send_error(event, "code-res", 52, 'Invalid path to internally created sketch file', 'ide_output');
	}
	const include_path = projectLocator.getIncludeDir();
	if(include_path == null) {
		return send_error(event, "code-res", 71, 'Include directory not found !!!', 'ide_output');
	}
	const compiler = config.get_compiler_path();
	if(compiler == null) {
		return send_error(event, "code-res", 53, 'Compiler directory not configured in the Settings', 'ide_output');
	}
	const board = config.get_selected_fqbn();
	if(board == null) {
		return send_error(event, "code-res", 56, 'Arduino Board not configured in the Settings.', 'ide_output');
	}
	// const action = config.get_selected_ide();

	var cmdline = [];
	cmdline.push( insert_quote(compiler) );
	cmdline.push("compile");
	cmdline.push( "--fqbn" );
	cmdline.push( board );
	cmdline.push("--library");
	cmdline.push( insert_quote(include_path) );
	cmdline.push("--clean");
	cmdline.push("--verify");
	if(action === 'upload') {
		const { ports } = helper.find_serial_ports(compiler, board);
		const serialport = config.get_serial_port(ports);
		if(serialport == null) {
			return send_error(event, "code-res", 55, 'Serial Port configured in Settings not accessible.', 'ide_output');
		}
		cmdline.push("--upload");
		cmdline.push("--port");
		cmdline.push( serialport );
	}
	// cmdline.push( "--log-level" );
	// cmdline.push( "debug" );
	// cmdline.push( "-v" );
	cmdline.push( insert_quote(filename) );
	compiler_process = helper.compile_process(cmdline, (code, stdout, stderr) => {
		compiler_process = null;
		if(code != 0) {
			// return send_error(event, "code-res", 56, 'Unexpected Arduino exit error code:' + code, 'ide_output');
		}
		return send_process(event, "code-res", code, stdout, stderr, 'ide_output');
	});
});
ipcMain.on("get-settings", (event, args) => {
	const { name } = args;
	if(name == 'ide') {
		var selected = config.get_selected_ide()
		var options = config.get_ide_options();
		return send_option_select(event, "get-settings-res", options, selected, 'ide', name);
	} else if(name == "board") {
		var selected = config.get_selected_ide()
		var options = config.get_board_options()
		return send_option_select(event, "get-settings-res", options, selected, 'board', name);
	} else if(name == "sketch") {
		var selected = config.get_sketch_path()
		return send_simple_select(event, "get-settings-res", selected, 'sketch', name);
	} else if(name == "compiler") {
		var selected = config.get_compiler_path();
		if(selected == null) {
			return send_error(event, "get-setting-res", 53, 'Compiler directory not configured in the Settings.', 'compiler', name);
		}
		return send_simple_select(event, "get-settings-res", selected, 'compiler', name);
	} else if(name == "serial") {
		var compiler = config.get_compiler_path();
		if(compiler == null) {
			return send_error(event, "get-settings-res", 53, 'Compiler directory not configured in the Settings.', 'compiler', name);
		}
		const { code, ports } = helper.find_serial_ports(compiler);
		if(code != 0) {
			return send_error(event, "get-settings-res", 71, 'find serial port failed ....', 'serial', name);
		}
		var selected = config.get_serial_port(ports);
		var options = config.get_option_serial(ports);
		return send_option_select(event, "get-settings-res", options, selected, 'serial', name);
	} else {
		return send_error(event, "get-settings-res", 61, 'Unexpected setting type requested.', null, name);
	}
});
ipcMain.on("set-settings", (event, args) => {
	if(args == null) {
		return send_error(event, "set-settings-res", 64, 'Unable to parse sent JSON.');
	}
	if(!("new_value" in args) || !("name" in args)) {
		return send_error(event, "set-settings-res", 65, "JSON received does not have \\'new_value\\' or \\'name\\' key.");
	}
	const { name, new_value } = args;
	if(new_value == null || name == null) {
		return send_error(event, "set-settings-res", 66, "Invalid value.");
	}
	var selected, options = null;
	if(name == 'ide') {
		config.set_selected_ide(new_value);
		selected = config.get_selected_ide();
		options = config.get_ide_options();
	} else if(name == 'board') {
		config.set_selected_board(new_value);
		selected = config.get_selected_board();
		options = config.get_board_options();
	} else if(name == 'sketch') {
		config.set_sketch_path(new_value);
		selected = config.get_sketch_path();
	} else if(name == 'compiler') {
		config.set_compiler_path(new_value);
		selected = config.get_compiler_path();
	} else if(name == "serial") {
		var compiler = config.get_compiler_path();
		if(compiler == null) {
			return send_error(event, "set-settings-res", 53, 'Compiler directory not configured in the Settings.', name);
		}
		const { code, ports } = helper.find_serial_ports(compiler);
		if(code != 0) {
			return send_error(event, "set-settings-res", 71, 'find serial port failed ....', name);
		}
		config.set_serial_port(new_value, ports);
		selected = config.get_serial_port(ports);
		options = config.get_option_serial(ports);
	} else {
		return send_error(event, "set-settings-res", 63, "Unexpected setting type to update.", name);
	}
	/*
	if(selected != new_value) {
		event.returnValue = send_error(res, 67, 'New value could not be set. ' + new_value + "/" + selected);
		return;
	}*/
	if(options == null) {
		return send_simple_select(event, "set-settings-res", selected, name);
	} else {
		return send_option_select(event, "set-settings-res", options, selected, name);
	}
});
ipcMain.on("all-settings", (event, args) => {
	var compiler = config.get_compiler_path();
	if(compiler == null) {
		return send_error(event, "all-settings-res", 53, 'Compiler directory not configured in the Settings.', 'all');
	}
	const { code, ports } = helper.find_serial_ports(compiler);
	if(code != 0) {
		return send_error(event, "all-settings-res", 71, 'find serial port failed ....', 'all');
	}
	event.reply("all-settings-res", {
		'response_type': 'settings',
		'response_state': 'full_response',
		'success': true,
		'settings_type': 'all',
		'settings': [{
			'settings_type': 'compiler',
			'selected': compiler
		}, {
			'settings_type': 'sketch',
			'selected': config.get_sketch_path()
		}, {
			'settings_type': 'board',
			'selected': config.get_selected_ide(),
			'options': config.get_board_options()
		}, {
			'settings_type': 'serial',
			'selected': config.get_serial_port(ports),
			'options': config.get_option_serial(ports)
		}, {
			'settings_type': 'ide',
			'selected': config.get_selected_ide(),
			'options': config.get_ide_options()
		}]
	});
});

ipcMain.on("set-compiler", (event, args) => {
	var files = dialog.showOpenDialogSync(null, {
		title: 'Select the arduini-cli executable',
		buttonLabel: 'Select',
		properties: ['openFile']
	});
	if(files == undefined) {
		return send_error(event, "set-settings-res", 53, 'Compiler directory not configured in the Settings.', 'compiler');
	}
	config.set_compiler_path(files[0]);
	var selected = config.get_compiler_path();
	if(selected == null) {
		return send_error(event, "set-settings-res", 53, 'Compiler directory not configured in the Settings.', 'compiler');
	}
	return send_simple_select(event, "set-settings-res", selected, "compiler");
});
ipcMain.on("set-sketch", (event, args) => {
	var folders = dialog.showOpenDialogSync(null, {
		title: 'Select the sketch folder',
		buttonLabel: 'Select',
		properties: ['openDirectory', 'openFile', 'createDirectory']
	});
	if(folders != undefined) {
		config.set_sketch_path(folders[0]);
	}
	var selected = config.get_sketch_path();
	return send_simple_select(event, "set-settings-res", selected, 'sketch');
});

ipcMain.on("get-lang", (event, args) => {
	var { lang_key } = args;
	var filename = path.join(__dirname, "..", "client", "msg", lang_key + ".js");
	var buffer = fs.readFileSync(filename);
	event.returnValue = buffer.toString("utf-8");
});
var usb_interval = null, last_usb_state = null;
function usb_connetion_callback() {
	const compiler = config.get_compiler_path();
	if(compiler == null) {
		return;
	}
	const board = config.get_selected_fqbn();
	if(board == null) {
		return;
	}
	helper.find_serial_ports_cb(compiler, board, (code, list) => {
		var curr_usb_state = list.length != 0; // connect
		if(last_usb_state == null) {
			last_usb_state = !curr_usb_state;
		}
		if(curr_usb_state ^ last_usb_state) {
			var mainWindow = BrowserWindow.getFocusedWindow();
			if(mainWindow == null) {
				return;
			}
			mainWindow.webContents.send('device-connect', { curr_usb_state });
			console.log("usb_connect: ", curr_usb_state);
			last_usb_state = curr_usb_state;
		}
	});
}

module.exports.kill_compiler_process = function() {
	if(compiler_process == null) {
		return;
	}
	winston.info(tagMgr + 'kill alt process.:' + compiler_process.pid);
	compiler_process.kill('SIGKILL');
};
module.exports.start_usb = function(timeout = 5 * 1000) {
	usb_interval = setInterval(usb_connetion_callback, timeout);
	winston.info(tagMgr + 'start usb interval');
};
module.exports.stop_usb = function() {
	if(usb_interval == null) {
		return;
	}
	clearInterval(usb_interval);
	winston.info(tagMgr + 'kill usb interval');
	usb_interval = null;
};