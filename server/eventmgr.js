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

function send_error(id, description, type = 'invalid') {
	return { 'response_type': 'settings', 'response_state': 'full_response', 'settings_type': type, 'errors': [{ 'id': id, 'description': description }], 'success': false };
}
function send_option_select(options, selected, type = 'invalid') {
	return { 'response_type': 'settings', 'response_state': 'full_response', 'settings_type': type, 'options': options, 'selected': selected, 'success': true };
}
function send_simple_select(selected, type = 'invalid') {
	return { 'response_type': 'settings', 'response_state': 'full_response', 'settings_type': type, 'selected': selected, 'success': true };
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
	if(fs.existsSync(filename)) {
		content = fs.readFileSync(filename, "utf-8");
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
		var error = send_error(76, 'Already process ...', 'ide_output');
		event.reply("upload-hex-res", error);
		return;
	}
	const compiler = config.get_compiler_path();
	if(compiler == null) {
		var error = send_error(53, 'Compiler directory not configured in the Settings', 'ide_output');
		event.reply("upload-hex-res", error);
		return;
	}
	const board = config.get_selected_fqbn();
	if(board == null) {
		var error = send_error(56, 'Arduino Board not configured in the Settings.', 'ide_output');
		event.reply("upload-hex-res", error);
		return;
	}
	const { ports } = helper.find_serial_ports(compiler, board);
	const serialport = config.get_serial_port(ports);
	if(serialport == null) {
		var error = send_error(55, 'Serial Port configured in Settings not accessible.', 'ide_output');
		event.reply("upload-hex-res", error);
		return;
	}
	var user_data_path = app.getPath('userData');
	var filename = projectLocator.getResourcePath(hex_path, user_data_path);
	if(filename == null) { // TODO sunuc kontrolu ...
		var error = send_error(74, 'file is not found: ' + filename, 'ide_output');
		event.reply("upload-hex-res", error);
		return;
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
			// var error = send_error(56, 'Unexpected Arduino exit error code:' + code, 'ide_output');
			// event.reply("upload-hex-res", error);
			// return;
		}
		event.reply("upload-hex-res", {
			'response_type': 'ide_output',
			'response_state': 'full_response',
			'success': code == 0 ? true: false,
			'ide_mode': "upload-hex",
			'ide_data': { 'std_output': stdout, 'err_output': stderr, 'exit_code': code }
		});
	});
});
ipcMain.on('code', (event, args) => {
	const { sketch_code, action } = args;
	if(compiler_process != null) {
		var error = send_error(76, 'Already process ...', 'ide_output');
		event.reply("code-res", error);
		return;
	}
	if(["upload", "verify"].indexOf(action) == -1) {
		var error = send_error(72, 'Undefined action', 'ide_output');
		event.reply("code-res", error);
		return;
	}
	if(sketch_code == null) {
		var error = send_error(64, 'Unable to parse sent JSON.', 'ide_output');
		event.reply("code-res", error);
		return;
	}
	const sketch_path = config.get_sketch_path();
	if(sketch_path == null) {
		var error = send_error(51, 'Could not create sketch file', 'ide_output');
		event.reply("code-res", error);
		return;
	}
	var filename;
	try {
		filename = helper.write_sketch(sketch_code, sketch_path);
	} catch(e) {
		var error = send_error(52, 'Invalid path to internally created sketch file', 'ide_output');
		event.reply("code-res", error);
		return;
	}
	const include_path = projectLocator.getIncludeDir();
	if(include_path == null) {
		var error = send_error(71, 'Include directory not found !!!', 'ide_output');
		event.reply("code-res", error);
		return;
	}
	const compiler = config.get_compiler_path();
	if(compiler == null) {
		var error = send_error(53, 'Compiler directory not configured in the Settings', 'ide_output');
		event.reply("code-res", error);
		return;
	}
	const board = config.get_selected_fqbn();
	if(board == null) {
		var error = send_error(56, 'Arduino Board not configured in the Settings.', 'ide_output');
		event.reply("code-res", error);
		return;
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
			var error = send_error(55, 'Serial Port configured in Settings not accessible.', 'ide_output');
			event.reply("code-res", error);
			return;
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
			// var error = send_error(res, 56, 'Unexpected Arduino exit error code:' + code, 'ide_output');
			// event.reply("code-res", error);
			// return;
		}
		event.reply("code-res", {
			'response_type': 'ide_output',
			'response_state': 'full_response',
			'success': code == 0,
			'ide_mode': action,
			'ide_data': { 'std_output': stdout, 'err_output': stderr, 'exit_code': code }
		});
	});
});
ipcMain.on("get-settings", (event, args) => {
	const { name } = args;
	if(name == 'ide') {
		var selected = config.get_selected_ide()
		var options = config.get_ide_options();
		event.returnValue = send_option_select(options, selected, 'ide');
	} else if(name == "board") {
		var selected = config.get_selected_ide()
		var options = config.get_board_options()
		event.returnValue = send_option_select(options, selected, 'board');
	} else if(name == "sketch") {
		var selected = config.get_sketch_path()
		event.returnValue = send_simple_select(selected, 'sketch');
	} else if(name == "compiler") {
		var selected = config.get_compiler_path();
		if(selected == null) {
			event.returnValue = send_error(53, 'Compiler directory not configured in the Settings.', 'compiler');
			return;
		}
		event.returnValue = send_simple_select(selected, 'compiler');
	} else if(name == "serial") {
		var compiler = config.get_compiler_path();
		if(compiler == null) {
			event.returnValue = send_error(53, 'Compiler directory not configured in the Settings.', 'compiler');
			return;
		}
		const { code, ports } = helper.find_serial_ports(compiler);
		if(code != 0) {
			event.returnValue = send_error(71, 'find serial port failed ....', 'serial');
			return;
		}
		var selected = config.get_serial_port(ports);
		var options = config.get_option_serial(ports);
		event.returnValue = send_option_select(options, selected, 'serial');
	} else {
		event.returnValue = send_error(61, 'Unexpected setting type requested.');
	}
});
ipcMain.on("set-settings", (event, args) => {
	const { name, new_value } = args;
	if(req.body == null) {
		event.returnValue = send_error(64, 'Unable to parse sent JSON.', name);
		return;
	}
	if(!("new_value" in req.body)) {
		event.returnValue = send_error(65, "JSON received does not have \\'new_value\\' key.", name);
		return;
	}
	if(new_value == null) {
		event.returnValue = send_error(66, "Invalid value.", name);
		return;
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
			event.returnValue = send_error(53, 'Compiler directory not configured in the Settings.', 'all');
			return;
		}
		const { code, ports } = helper.find_serial_ports(compiler);
		if(code != 0) {
			event.returnValue = send_error(71, 'find serial port failed ....', 'all');
			return;
		}
		config.set_serial_port(new_value, ports);
		selected = config.get_serial_port(ports);
		options = config.get_option_serial(ports);
	} else {
		event.returnValue = send_error(63, "Unexpected setting type to update.", 'invalid');
		return;
	}
	/*
	if(selected != new_value) {
		event.returnValue = send_error(res, 67, 'New value could not be set. ' + new_value + "/" + selected);
		return;
	}*/
	if(options == null) {
		event.returnValue = send_simple_select(selected, name);
	} else {
		event.returnValue = send_simple_select(options, selected, name);
	}
});
ipcMain.on("all-settings", (event, args) => {
	var compiler = config.get_compiler_path();
	if(compiler == null) {
		event.returnValue = send_error(53, 'Compiler directory not configured in the Settings.', 'all');
		return;
	}
	const { code, ports } = helper.find_serial_ports(compiler);
	if(code != 0) {
		event.returnValue = send_error(71, 'find serial port failed ....', 'all');
		return;
	}
	event.returnValue = {
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
	};
});

ipcMain.on("set-compiler", (event, args) => {
	var files = dialog.showOpenDialogSync(null, {
		title: 'Select the arduini-cli executable',
		buttonLabel: 'Select',
		properties: ['openFile']
	});
	if(files == undefined) {
		event.returnValue = send_error(53, 'Compiler directory not configured in the Settings.', 'compiler');
		return;
	}
	config.set_compiler_path(files[0]);
	var selected = config.get_compiler_path();
	if(selected == null) {
		event.returnValue = send_error(53, 'Compiler directory not configured in the Settings.', 'compiler');
		return;
	}
	event.returnValue = send_simple_select(selected, 'compiler');
});
ipcMain.on("set-sketch", (event, args) => {
	var folders = dialog.showOpenDialogSync(null, {
		title: 'Select the sketch folder',
		buttonLabel: 'Select',
		properties: ['openDirectory']
	});
	if(folders != undefined) {
		config.set_sketch_path(files[0]);
	}
	var selected = config.get_sketch_path();
	event.returnValue = send_simple_select(selected, 'sketch');
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