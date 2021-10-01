const nconf = require('nconf');
const projectLocator = require("./projectlocator.js");
const {
	get_dir_exists,
	get_file_exists,
	get_option_key_value,
	get_option_prop,
	get_option_array,
	get_first_value,
	find_compiler_path,
	find_serial_ports,
	check_compiler
} = require("./cfghelper");

const CFG_KEY = { BOARD : 'board', SERIAL: 'serial', COMPILER: 'compiler', IDE: 'ide', SKETCH: 'sketch' };
const ide_options = {
	'upload': 'Compile and Upload sketch',
	'verify': 'Verify sketch',
	'open': 'Open sketch in IDE'
};
// 'Uno': 'arduino:avr:uno',
// 'Nano 328': 'arduino:avr:nano:cpu=atmega328',
// 'Nano 168': 'arduino:avr:nano:cpu=atmega168',
// 'Leonardo': 'arduino:avr:leonardo',
// 'Yun': 'arduino:avr:leonardo',
// 'Mega': 'arduino:avr:mega',
// 'Duemilanove 328p': 'arduino:avr:diecimila',
// 'Duemilanove 168p': 'arduino:avr:diecimila:cpu=atmega168',
// 'Atmel atmega328p Xplained mini': 'atmel:avr:atmega328p_xplained_mini',
// 'Atmel atmega168pb Xplained mini': 'atmel:avr:atmega168pb_xplained_mini',
// 'Atmel atmega328pb Xplained mini': 'atmel:avr:atmega328pb_xplained_mini',
// 'ESP8266 Huzzah': 'esp8266:esp8266:generic',
// 'ESP8266 WeMos D1': 'esp8266:esp8266:generic'
const board_list = {
	'watchX': 'arduino:avr:leonardo'
};

module.exports = {
	get_selected_ide: function() {
		return nconf.get(CFG_KEY.IDE) || get_first_value(ide_options);
	},
	set_selected_ide: function(new_value) {
		nconf.set(CFG_KEY.IDE, new_value);
		nconf.save();
	},
	get_ide_options: function() {
		return get_option_key_value(ide_options);
	},
	get_selected_board: function() {
		return nconf.get(CFG_KEY.BOARD) || get_first_value(board_list);
	},
	set_selected_board: function(value) {
		nconf.set(CFG_KEY.BOARD, value);
		nconf.save();
	},
	get_selected_fqbn: function() {
		var prop = nconf.get(CFG_KEY.BOARD) || get_first_value(board_list);
		return board_list[prop];
	},
	get_board_options: function() {
		return get_option_prop(board_list);
	},
	get_sketch_path: function() {
		var absolute_path = nconf.get(CFG_KEY.SKETCH);
		if(absolute_path != null) {
			absolute_path = get_dir_exists(absolute_path);
		}
		if(absolute_path == null) {
			absolute_path = projectLocator.getSketchPath();
		}
		return absolute_path;
	},
	set_sketch_path: function(value) {
		var absolute_path = get_dir_exists(value);
		if(absolute_path == null) {
			return;
		}
		nconf.set(CFG_KEY.SKETCH, absolute_path);
		nconf.save();
	},
	get_compiler_path: function() {
		var absolute_path = nconf.get(CFG_KEY.COMPILER);
		if(absolute_path != null) {
			absolute_path = get_file_exists(absolute_path);
		}
		if(absolute_path == null) {
			absolute_path = projectLocator.getArduinoDir();
		}
		const { code, status } = check_compiler(absolute_path);
		if(code != 0 || status == false) {
			return null;
		}
		return absolute_path;
	},
	set_compiler_path: function(value) {
		var absolute_path = get_file_exists(value);
		if(absolute_path == null) {
			return;
		}
		const { code, status } = check_compiler(absolute_path);
		if(code != 0 || status == false) {
			return;
		}
		nconf.set(CFG_KEY.COMPILER, absolute_path);
		nconf.save();
	},
	get_serial_port: function(serial_ports = []) {
		var port = nconf.get(CFG_KEY.SERIAL);
		if(serial_ports.length != 0) {
			if((port != null && serial_ports.indexOf(port) == -1) || port == null) {
				port = serial_ports[0];
			}
		}
		return port;
	},
	get_option_serial: function(serial_ports) {
		return get_option_array(serial_ports);
	},
	set_serial_port: function(new_value, list) {
		var absolute = get_file_exists(new_value);
		if(absolute == null) {
			return;
		}
		if(list.indexOf(absolute) == -1) {
			return;
		}
		nconf.set(CFG_KEY.SERIAL, absolute);
		nconf.save();
	}
};