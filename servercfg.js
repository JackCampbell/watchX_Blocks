/*
	# 'Uno': 'arduino:avr:uno',
	# 'Nano 328': 'arduino:avr:nano:cpu=atmega328',
	# 'Nano 168': 'arduino:avr:nano:cpu=atmega168',
	# 'Leonardo': 'arduino:avr:leonardo',
	# 'Yun': 'arduino:avr:leonardo',
	# 'Mega': 'arduino:avr:mega',
	# 'Duemilanove 328p': 'arduino:avr:diecimila',
	# 'Duemilanove 168p': 'arduino:avr:diecimila:cpu=atmega168',
	# 'Atmel atmega328p Xplained mini': 'atmel:avr:atmega328p_xplained_mini',
	# 'Atmel atmega168pb Xplained mini': 'atmel:avr:atmega168pb_xplained_mini',
	# 'Atmel atmega328pb Xplained mini': 'atmel:avr:atmega328pb_xplained_mini',
	# 'ESP8266 Huzzah': 'esp8266:esp8266:generic',
	# 'ESP8266 WeMos D1': 'esp8266:esp8266:generic'
 */
const serialList = require('serial-list');
const nconf = require("nconf");


var config = {
	compiler_dir: null,
	sketch_name: null,
	sketch_dir: null,
	arduino_board: null,
	serial_port: { key: null, value: null },
	load_ide_option: null
};

var arduino_types = { 'watchX': 'arduino:avr:leonardo' };
var serial_ports = { 'port0': 'COM1' };
var ide_load_options = {
	'open': 'Open sketch in IDE',
	'verify': 'Verify sketch',
	'upload': 'Compile and Upload sketch'
};


const settings_filename = "ServerCompilerSettings.json";
var settings_path = null;


module.exports.get_settings_file_path = function() {
	return __settings_path;
}

module.exports.get_settings_file_data = function() {
	var settings_dict = {};
	try {
		var config = require(settings_path);
		settings_dict["arduino_exec_path"] = config['arduino_exec_path'];
		settings_dict["arduino_board"] = config['arduino_board'];
		settings_dict["arduino_serial_port"] = config['arduino_serial_port'];
		settings_dict["sketch_name"] = config['sketch_name'];
		settings_dict["sketch_directory"] = config['sketch_directory'];
		settings_dict["ide_load"] = config['ide_load'];
		console.log("Settings loaded from:", settings_path);
	} catch(e) {
		console.log("Settings corrupted or not found in:", settings_path);
		settings_dict = null;
	}
	return settings_dict;
};

module.exports.read_settings = function() {
	var settings_dict = module.exports.get_settings_file_data();
	if(settings_dict != null) {

	}
}
module.exports.save_settings = function() {}








module.exports.set_load_ide_default = function() {
	config.load_ide_option = Object.keys(ide_load_options)[0]; // first
}
module.exports.get_load_ide = function() {
	return config.load_ide_option;
};
module.exports.set_load_ide = function(new_load_option) {
	if( new_load_option in  ide_load_options ) {
		config.load_ide_option = new_load_option;
		console.log("IDE options set to: ", ide_load_options[new_load_option]);
	} else {
		console.log('The provided "Load IDE option" is not valid !!!:', new_load_option);
		if(config.load_ide_option != null) {
			console.log('Previous "Load IDE option" maintained:', ide_load_options[config.load_ide_option]);
		} else {
			module.exports.set_load_ide_default();
			console.log('Default "Load IDE option" set:', ide_load_options[config.load_ide_option]);
			module.exports.save_settings();
		}
	}
};
module.exports.set_load_ide_from_file = function(new_load_option) {
	if( new_load_option in  ide_load_options ) {
		config.load_ide_option = new_load_option;
	} else {
		console.log('Settings file "Load IDE option" is not valid:', new_load_option);
		module.exports.set_load_ide_default();
		console.log('Default "Load IDE option" set:', config.load_ide_option);
	}
}



function populate_serial_port_list() {
	var list = serialList.list() || [];
	serial_ports = {};
	if(list.length == 0) {
		return;
	}
	for(var i = 0; i < list.length; i++) {
		serial_ports["port" + i] = list[i];
	}
}
module.exports.get_serial_ports = function() {
	populate_serial_port_list();
	return serial_ports;
};
module.exports.get_serial_port_flag = function() {
	populate_serial_port_list();
	var port_names = Object.values(serial_ports);
	if( Object.keys(serial_ports).length == 0 ) {
		config.serial_port.key = null;
		config.serial_port.value = null;
		module.exports.save_settings();
	} else if(port_names.indexOf(config.serial_port.value) == -1) {
		console.log("The selected Serial Port is no longer available");
		config.serial_port.key = null;
		config.serial_port.value = null;
		module.exports.save_settings();
	} else if(serial_ports[config.serial_port.key] != config.serial_port.value) {
		for( const [key, value] of Object.entries(serial_ports) ) {
			if(value == config.serial_port.value) {
				config.serial_port.key = key;
				break;
			}
		}
		// No need to save settings as only value saved and stays the same
	}
	return config.serial_port.value;
};

