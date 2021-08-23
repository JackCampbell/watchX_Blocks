/**
 * @author    carlosperate
 * @copyright 2015 carlosperate https://github.com/carlosperate
 * @license   Licensed under the The MIT License (MIT), a copy can be found in
 *            the electron project directory LICENSE file.
 *
 * @fileoverview Manages the Ardublockly server.
 */
const winston = require('winston');
// const childProcess = require('child_process');
const express = require('express');
const projectLocator = require('./projectlocator.js');
const config = require("./cfgconst");
const helper = require("./cfghelper");
const { dialog, BrowserWindow, app: capp } = require('electron');
const fs = require("fs");
const path = require("path");


const tagMgr = '[watchXMgr] ';
const tagSrv = '[watchXSvr] ';

const server_path = projectLocator.getServerPath();
var cprocess = null;


const app = express();
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-cache');
	winston.info(tagSrv + 'Request.:[' + req.method + '] ' + req.url);
	return next();
});
app.use("/watchx", express.static(server_path + "/watchx"));
app.use("/blockly", express.static(server_path + "/blockly"));
app.use("/blocks", express.static(server_path + "/blocks"));
app.use("/examples", express.static(server_path + "/examples"));
app.use("/closure-library", express.static(server_path + "/closure-library"));
app.use("/docs", express.static(server_path + "/docs"));
app.get("/settings/:name", (req, res, next) => {
	const name = req.params["name"];
	if(name == 'ide') {
		var selected = config.get_selected_ide()
		var options = config.get_ide_options();
		return send_option_select(res, options, selected, 'ide');
	} else if(name == "board") {
		var selected = config.get_selected_ide()
		var options = config.get_board_options()
		return send_option_select(res, options, selected, 'board');
	} else if(name == "sketch") {
		var selected = config.get_sketch_path()
		return send_simple_select(res, selected, 'sketch');
	} else if(name == "compiler") {
		var selected = config.get_compiler_path();
		if(selected == null) {
			return send_error(res, 53, 'Compiler directory not configured in the Settings.', 'compiler');
		}
		return send_simple_select(res, selected, 'compiler');
	} else if(name == "serial") {
		var compiler = config.get_compiler_path();
		if(compiler == null) {
			return send_error(res, 53, 'Compiler directory not configured in the Settings.', 'compiler');
		}
		const { code, ports } = helper.find_serial_ports(compiler);
		if(code != 0) {
			return send_error(res, 71, 'find serial port failed ....', 'serial');
		}
		var selected = config.get_serial_port(ports);
		var options = config.get_option_serial(ports);
		return send_option_select(res, options, selected, 'serial');
	} else {
		return send_error(res, 61, 'Unexpected setting type requested.');
	}
});
app.get("/settings", (req, res, next) => {
	var compiler = config.get_compiler_path();
	if(compiler == null) {
		return send_error(res, 53, 'Compiler directory not configured in the Settings.', 'all');
	}
	const { code, ports } = helper.find_serial_ports(compiler);
	if(code != 0) {
		return send_error(res, 71, 'find serial port failed ....', 'all');
	}
	var data = {
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
	return res.json(data);
});
app.put("/settings", (req, res, next) => {
	return send_error(res, 62, 'Settings have to be individually updated.', 'all');
});
app.put("/settings/:name", express.json(), (req, res, next) => {
	const name = req.params['name'];
	if(req.body == null) {
		return send_error(res, 64, 'Unable to parse sent JSON.', name);
	}
	if(!("new_value" in req.body)) {
		return send_error(res, 65, "JSON received does not have \\'new_value\\' key.", name);
	}
	var { new_value } = req.body;
	if(new_value == null) {
		return send_error(res, 66, "Invalid value.", name);
	}
	var selected, options;
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
			return send_error(res, 53, 'Compiler directory not configured in the Settings.', 'all');
		}
		const { code, ports } = helper.find_serial_ports(compiler);
		if(code != 0) {
			return send_error(res, 71, 'find serial port failed ....', 'all');
		}
		config.set_serial_port(new_value, ports);
		selected = config.get_serial_port(ports);
		options = config.get_option_serial(ports);
	} else {
		return send_error(res, 63, "Unexpected setting type to update.", 'invalid');
	}
	/*
	if(selected != new_value) {
		return send_error(res, 67, 'New value could not be set. ' + new_value + "/" + selected);
	}*/
	if(options == null) {
		return send_simple_select(res, selected, name);
	} else {
		return send_simple_select(res, options, selected, name);
	}
});
app.post("/code", express.json(), (req, res, next) => {
	const { sketch_code, action } = req.body;
	if(["upload", "verify"].indexOf(action) == -1) {
		return send_error(res, 72, 'Undefined action', 'ide_output');
	}
	if(cprocess != null) {
		return send_error(res, 76, 'Already process ...', 'ide_output');
	}
	if(sketch_code == null) {
		return send_error(res, 64, 'Unable to parse sent JSON.', 'ide_output');
	}
	const sketch_path = config.get_sketch_path();
	if(sketch_path == null) {
		return send_error(res, 51, 'Could not create sketch file', 'ide_output');
	}
	var filename;
	try {
		filename = helper.write_sketch(sketch_code, sketch_path);
	} catch(e) {
		return send_error(res, 52, 'Invalid path to internally created sketch file', 'ide_output');
	}
	const include_path = projectLocator.getIncludeDir();
	if(include_path == null) {
		return send_error(res, 71, 'Include directory not found !!!', 'ide_output');
	}
	const compiler = config.get_compiler_path();
	if(compiler == null) {
		return send_error(res, 53, 'Compiler directory not configured in the Settings', 'ide_output');
	}
	const board = config.get_selected_fqbn();
	if(board == null) {
		return send_error(res, 56, 'Arduino Board not configured in the Settings.', 'ide_output');
	}
	// const action = config.get_selected_ide();

	var args = [];
	args.push( insert_quote(compiler) );
	args.push("compile");
	args.push( "--fqbn" );
	args.push( board );
	args.push("--library");
	args.push( insert_quote(include_path) );
	args.push("--clean");
	args.push("--verify");
	if(action === 'upload') {
		const { ports } = helper.find_serial_ports(compiler, board);
		const serialport = config.get_serial_port(ports);
		if(serialport == null) {
			return send_error(res, 55, 'Serial Port configured in Settings not accessible.', 'ide_output');
		}
		args.push("--upload");
		args.push("--port");
		args.push( serialport );
	}
	args.push( insert_quote(filename) );
	cprocess = helper.compile_process(args, (code, stdout, stderr) => {
		cprocess = null;
		if(code != 0) {
			// return send_error(res, 56, 'Unexpected Arduino exit error code:' + code, 'ide_output');
		}
		return res.json({
			'response_type': 'ide_output',
			'response_state': 'full_response',
			'success': code == 0,
			'ide_mode': action,
			'ide_data': { 'std_output': stdout, 'err_output': stderr, 'exit_code': code }
		});
	});
});

app.post("/upload-hex", express.json(), (req, res, next) => {
	const { hex_path } = req.body;
	if(cprocess != null) {
		return send_error(res, 76, 'Already process ...', 'ide_output');
	}
	const compiler = config.get_compiler_path();
	if(compiler == null) {
		return send_error(res, 53, 'Compiler directory not configured in the Settings', 'ide_output');
	}
	const board = config.get_selected_fqbn();
	if(board == null) {
		return send_error(res, 56, 'Arduino Board not configured in the Settings.', 'ide_output');
	}
	const { ports } = helper.find_serial_ports(compiler, board);
	const serialport = config.get_serial_port(ports);
	if(serialport == null) {
		return send_error(res, 55, 'Serial Port configured in Settings not accessible.', 'ide_output');
	}
	var user_data_path = capp.getPath('userData');
	var filename = projectLocator.getBuildHexPath(hex_path, user_data_path);
	if(filename == null) {
		// TODO sunuc kontrolu ...
		return send_error(res, 74, 'file is not found: ' + filename, 'ide_output');
	}
	var args = [];
	args.push( insert_quote(compiler) );
	args.push( "upload" );
	args.push( "--fqbn" );
	args.push( board );
	args.push( "--port" );
	args.push( serialport );
	args.push( "--input-file" );
	args.push( insert_quote(filename) );
	cprocess = helper.compile_process(args, (code, stdout, stderr) => {
		cprocess = null;
		if(code != 0) {
			// return send_error(res, 56, 'Unexpected Arduino exit error code:' + code, 'ide_output');
		}
		return res.json({
			'response_type': 'ide_output',
			'response_state': 'full_response',
			'success': code == 0 ? true: false,
			'ide_mode': "upload-hex",
			'ide_data': { 'std_output': stdout, 'err_output': stderr, 'exit_code': code }
		});
	});
});

const wxb_filter_name = "watchX Blocks File";

app.get("/editor/open", (req, res, next) => {
	var files = dialog.showOpenDialogSync(null, {
		title: "Open Dialog",
		properties: ['openFile'],
		filters: [
			{ name: wxb_filter_name, extensions: ['wxb'] }
		]
	});
	if(files == null) {
		return res.json({ "filename": null });
	}
	var content = fs.readFileSync(files[0], "utf-8");
	winston.info(tagMgr + 'Load path: ' + files[0]);
	return res.json({ "filename": files[0], "content": content });
});
app.post("/editor/save", express.json(), (req, res, next) => {
	var { filename, content, basename } = req.body;
	if(filename == null) {
		filename = dialog.showSaveDialogSync(null, {
			title: "Save Dialog",
			defaultPath: basename || "New Code",
			properties: ['createDirectory'],
			filters: [
				{ name: wxb_filter_name, extensions: ['wxb'] }
			]
		});
		if(filename == null) {
			return res.json({ "filename": null });
		}
	}
	fs.writeFileSync(filename, content, "utf-8");
	winston.info(tagMgr + 'Save path: ' + filename);
	return res.json({ "filename": filename });
});
app.post("/editor/export", express.json(), (req, res, next) => {
	var { content } = req.body;
	var filename = dialog.showSaveDialogSync(null, {
		title: "Save Dialog",
		properties: ['createDirectory'],
		filters: [
			{ name: 'Arduino Source Code', extensions: ['ino'] }
		]
	});
	if(filename == null) {
		return res.json({ "filename": null });
	}
	fs.writeFileSync(filename, content, "utf-8");
	winston.info(tagMgr + 'Export path: ' + filename);
	return res.json({ "filename": filename });
});
app.get("/version", (req, res, next) => {
	const version = capp.getVersion();
	return res.json({ version });
});
app.get(["/", "/watchx"], (req, res, next) => {
	return res.redirect("/watchx/index.html");
});
app.use((req, res, next) => {
	return res.status(405).send('Not Allowed, code can only be sent: ' + req.url);
});
app.use((error, req, res, next) => {
	return send_error(res, 95, error.message);
});

var usb_interval = null;
var last_usb_state = null;
function usb_connect() {
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
			mainWindow.webContents.executeJavaScript('watchXBlocks.connectDevice(' + curr_usb_state + ')');
			console.log("usb_connect: ", curr_usb_state);
			last_usb_state = curr_usb_state;
		}
	});
}





var server = null;
module.exports.startServer = function(port, callback) {
	if(server !== null) {
		return;
	}
	server = app.listen(port, () =>  {
		winston.info(tagMgr + 'Path: ' + server_path + ' listening server on port 8000');
		if(callback) {
			callback(port);
		}
		// usb_interval = setInterval(usb_connect, 5 * 1000);
	});
}
module.exports.stopServer = function() {
	if (server !== null) {
		if(usb_interval) {
			clearInterval(usb_interval);
			winston.info(tagMgr + 'kill usb interval');
		}
		if(cprocess != null) {
			cprocess.kill('SIGKILL');
			winston.info(tagMgr + 'kill alt process.:' + cprocess.pid);
		}
		// Server executable needs to clean up (kill child), so no SIGKILL
		server.close();
		server = null;
		winston.info(tagMgr + 'Server stopped.');
	}
};
module.exports.restartServer = function() {
    module.exports.stopServer();
    setTimeout(function() {
        module.exports.startServer();
    }, 1000);
};
module.exports.initializeCore = function(callback) {
	const compile_dir = config.get_compiler_path();
	winston.info(tagMgr + 'initialize core ...');
	if(compile_dir == null) {
		winston.info(tagMgr + 'Compiler not found !!!');
		callback(0);
		return;
	}
	helper.install_core(compile_dir, (code, stdout, stderr) => {
		winston.info(tagMgr + 'Output: ' + stdout);
		callback(code);
	});
}



function send_error(res, id, description, type = 'invalid') {
	return res.json({ 'response_type': 'settings', 'response_state': 'full_response', 'settings_type': type, 'errors': [{ 'id': id, 'description': description }], 'success': false });
}
function send_option_select(res, options, selected, type = 'invalid') {
	return res.json({ 'response_type': 'settings', 'response_state': 'full_response', 'settings_type': type, 'options': options, 'selected': selected, 'success': true });
}
function send_simple_select(res, selected, type = 'invalid') {
	return res.json({ 'response_type': 'settings', 'response_state': 'full_response', 'settings_type': type, 'selected': selected, 'success': true });
}

function insert_quote(compiler) {
	return '"' + compiler + '"';
}
