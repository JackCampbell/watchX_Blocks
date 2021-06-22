/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Blocks for Arduino Digital and Analogue input and output
 *     functions. The Arduino function syntax can be found at
 *     http://arduino.cc/en/Reference/HomePage
 *
 * TODO: maybe change this to a "PIN" BlocklyType
 */
'use strict';

goog.provide('Blockly.Blocks.watchx');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

Blockly.Blocks.io.ORANGE = 20;
Blockly.Blocks.io.GREEN = 250;

function num_validator(value, min, max) {
	return (min <= value && value <= max) ? value : null;
}

Blockly.Blocks['wx_led'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.appendValueInput('STATE')
			.appendField("Turn led: ")
			.appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.builtinLed), 'PIN')
			.appendField(" to ")
			.setCheck(Blockly.Types.BOOLEAN.checkList);
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("Saat uzerindeki isiklar.");
	},
	updateFields: function() {
		Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'builtinLed');
	}
};
Blockly.Blocks['wx_led_brightness'] = {
	init: function() {
		var level = [ ['%0', '0'], ['%50', '50'], ["%75", '150'], ['%100', '255'] ];
		var leds = new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.builtinLed);
		this.appendDummyInput()
			.appendField("LED brightness")
			.appendField(leds, 'PIN')
			.appendField("Level: ")
			.appendField(new Blockly.FieldDropdown(level), 'LEVEL')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	},
	updateFields: function() {
		Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'LEVEL', 'ledBrightness');
		Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'builtinLed');
	}
};
/*
Blockly.Blocks['watchx_oled_get_screen_x'] = {
	init: function() {
		this.appendDummyInput()
			.appendField("get Screen X")
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 127)), "VALUE")
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	},
	getBlockType: function() {
		return Blockly.Types.DECIMAL;
	}
};
Blockly.Blocks['watchx_oled_get_screen_y'] = {
	init: function() {
		this.appendDummyInput()
			.appendField("get Screen X")
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 63)), "VALUE")
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	},
	getBlockType: function() {
		return Blockly.Types.DECIMAL;
	}
};
*/
Blockly.Blocks['wx_write_text_line'] = {
	init: function() {
		var line = [ ['Line 1', '0'], ['Line 2', '1'], ['Line 3', '2'], ['Line 4', '3'],
					['Line 5', '4'], ['Line 6', '5'], ['Line 7', '6'], ['Line 8', '7'] ];
		var align = [ ['Left', '0'], ['Middle', '1'], ['Right', '2'] ];
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendValueInput("CONTENT")
			.setCheck(null)
			.appendField("OLED write");
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField(new Blockly.FieldDropdown(line), 'LINE')
			.appendField(new Blockly.FieldDropdown(align), 'ALIGN')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_write_text_pos'] = {
	init: function() {
		this.appendValueInput("CONTENT").setCheck(null).appendField("OLED write");
		this.appendValueInput("PX").setCheck("Number").appendField("X:");
		this.appendValueInput("PY").setCheck("Number").appendField("Y:");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
Blockly.Blocks['wx_draw_pixel'] = {
	init: function() {
		this.appendDummyInput().appendField("OLED draw pixel");
		this.appendValueInput("PX").setCheck("Number").appendField("X:");
		this.appendValueInput("PY").setCheck("Number").appendField("Y:");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
Blockly.Blocks['wx_draw_line'] = {
	init: function() {
		this.appendDummyInput().appendField("OLED draw line");
		this.appendValueInput("PX1").setCheck("Number").appendField("X1:");
		this.appendValueInput("PY1").setCheck("Number").appendField("Y1:");
		this.appendValueInput("PX2").setCheck("Number").appendField("X2:");
		this.appendValueInput("PY2").setCheck("Number").appendField("Y2:");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
Blockly.Blocks['wx_draw_battery_icon'] = {
	init: function() {
		var list = [ ['%0', '0'], ['%50', '50'], ["%75", '100'], ['%100', '150'] ];
		this.appendDummyInput().appendField("OLED draw battery level");
		this.appendValueInput("PX").setCheck("Number").appendField("X:");
		this.appendValueInput("PY").setCheck("Number").appendField("Y:");
		this.appendDummyInput()
			.appendField("Level: ")
			.appendField(new Blockly.FieldDropdown(list), 'LEVEL')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
Blockly.Blocks['wx_brightness'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.appendValueInput('STATE').appendField("OLED brightness ").setCheck(Blockly.Types.BOOLEAN.checkList);
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("Saat uzerindeki isiklar.");
	}
};
Blockly.Blocks['wx_draw_usb_connect'] = {
	init: function() {
		this.appendDummyInput().appendField("OLED usb connect");
		this.appendValueInput("PX").setCheck("Number").appendField("X:");
		this.appendValueInput("PY").setCheck("Number").appendField("Y:");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
Blockly.Blocks['wx_draw_charge_state'] = {
	init: function() {
		this.appendDummyInput().appendField("OLED show charge status");
		this.appendValueInput("PX").setCheck("Number").appendField("X:");
		this.appendValueInput("PY").setCheck("Number").appendField("Y:");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
Blockly.Blocks['wx_clear_all'] = {
	init: function() {
		this.appendDummyInput().appendField("OLED clear display");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
Blockly.Blocks['wx_oled_power'] = {
	init: function() {
		this.setHelpUrl('');
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.appendValueInput('STATE').appendField("OLED power ").setCheck(Blockly.Types.BOOLEAN.checkList);
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_rtc_init_param'] = {
	init: function() {
		this.appendDummyInput()
			.appendField("set day")
			.appendField(new Blockly.FieldNumber('1', (value) => num_validator(value, 1, 31)), "DAY")
			.appendField("month")
			.appendField(new Blockly.FieldNumber('1', (value) => num_validator(value, 1, 12)), "MONTH")
			.appendField("year")
			.appendField(new Blockly.FieldNumber('2011', (value) => num_validator(value, 1900, 2099)), "YEAR");
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField("hour")
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 23)), "HOUR")
			.appendField("minute")
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 59)), "MINUTE")
			.appendField("second")
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 59)), "SECOND")
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
Blockly.Blocks['wx_rtc_init_current'] = {
	init: function() {
		this.setHelpUrl('');
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.appendDummyInput().appendField("OLED current date & time");
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
}
Blockly.Blocks['wx_rtc_get_value'] = {
	init: function() {
		var list = [["year","WX_RTC_YEAR"], ["month","WX_RTC_MONTH"], ["day","WX_RTC_DAY"],
			["hour","WX_RTC_HOUR"], ["minute","WX_RTC_MINUTE"], ["second","WX_RTC_SECOND"]];
		this.appendDummyInput()
			.appendField("get ")
			.appendField(new Blockly.FieldDropdown(list), "KEY");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.DECIMAL;
	}
};
Blockly.Blocks['wx_print_time_line'] = {
	init: function() {
		var list = [["Line 1", '0'], ['Line 2', '1'], ['Line 3', '2']];
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.appendDummyInput()
			.appendField("Oled print time ")
			.appendField(new Blockly.FieldDropdown(list), 'LINE');
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_print_time_pos'] = {
	init: function() {
		var list = [["Hour", 'WX_DRAW_TIME_HOUR'],
			['Minute', 'WX_DRAW_TIME_MINUTE'],
			["Second", 'WX_DRAW_TIME_SECORD']];
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.appendDummyInput()
			.appendField("Oled print time ")
			.appendField(new Blockly.FieldDropdown(list), 'TYPE');
		this.appendValueInput("PX").setCheck("Number").appendField("X:");
		this.appendValueInput("PY").setCheck("Number").appendField("Y:");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_bmp_get_value'] = {
	init: function() {
		var list = [["altitude","WX_BMP_ALTITUDE"],
					["pressure","WX_BMP_PRESSURE"],
					["temperature","WX_BMP_TEMPERATURE"]];
		this.appendDummyInput()
			.appendField("get ")
			.appendField(new Blockly.FieldDropdown(list), "KEY");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mag_get_value'] = {
	init: function() {
		this.appendDummyInput().appendField("get mag");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mlx_get_value'] = {
	init: function() {
		var filter = [["0", "0"], ["50", "50"], ["75", "75"], ["100", "100"]];
		var list = [['X', 'WX_MLX_DX'], ['Y', 'WX_MLX_DY'], ['Z', 'WX_MLX_DZ']]
		this.appendDummyInput()
			.appendField("get MLX ")
			.appendField(new Blockly.FieldDropdown(list), "KEY");
		this.appendDummyInput()
			.appendField("filter ")
			.appendField(new Blockly.FieldDropdown(filter), "FILTER");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mpu_get_angle_value'] = {
	init: function() {
		var list = [['X', 'WX_MPU_ANGLE_X'], ['Y', 'WX_MPU_ANGLE_Y'], ['Z', 'WX_MPU_ANGLE_Z']]
		this.appendDummyInput().appendField("get IMU angle ").appendField(new Blockly.FieldDropdown(list), "KEY");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mpu_get_accel_value'] = {
	init: function() {
		var list = [['X', 'WX_MPU_ACCEL_X'], ['Y', 'WX_MPU_ACCEL_Y'], ['Z', 'WX_MPU_ACCEL_Z']]
		this.appendDummyInput().appendField("get IMU acceleration ").appendField(new Blockly.FieldDropdown(list), "KEY");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mpu_fall_detected'] = {
	init: function() {
		this.appendDummyInput()
			.appendField("detect free fall threshold: ")
			.appendField(new Blockly.FieldNumber('17', (value) => num_validator(value, 0, 1000)), "THRESHOLD")
			.appendField(" duration: ")
			.appendField(new Blockly.FieldNumber('2', (value) => num_validator(value, 0, 60)), "DURATION")
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_mpu_motion_detected'] = {
	init: function() {
		this.appendDummyInput()
			.appendField("detect motion threshold: ")
			.appendField(new Blockly.FieldNumber('5', (value) => num_validator(value, 0, 1000)), "THRESHOLD")
			.appendField(" duration: ")
			.appendField(new Blockly.FieldNumber('2', (value) => num_validator(value, 0, 60)), "DURATION")
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_bzr_play_note'] = {
	init: function() {
		var tone = [["B0", "31"], ["C1", "33"], ["D1", "37"], ["E1", "41"], ["F1", "44"], ["G1", "49"],
			["A1", "55"], ["B1", "1"], ["C2", "65"], ["D2", "73"], ["E2", "82"], ["F2", "87"], ["G2", "98"],
			["A2", "110"], ["B2", "2"], ["C3", "131"], ["D3", "147"], ["E3", "165"], ["F3", "175"],
			["G3", "196"], ["A3", "220"], ["B3", "3"], ["C4", "262"], ["D4", "294"], ["E4", "330"],
			["F4", "349"], ["G4", "392"], ["A4", "440"], ["B4", "494"], ["C5", "523"], ["D5", "587"],
			["E5", "659"], ["F5", "698"], ["G5", "784"], ["A5", "880"], ["B5", "988"], ["C6", "1047"],
			["D6", "1175"], ["E6", "1319"], ["F6", "1397"], ["G6", "1568"], ["A6", "1760"], ["B6", "1976"],
			["C7", "2093"], ["D7", "2349"], ["E7", "2637"], ["F7", "2794"], ["G7", "3136"], ["A7", "3520"],
			["B7", "3951"], ["C8", "4186"], ["D8", "4699"]];
		var beat = [["Half", "500"], ["Quarter", "250"], ["Eighth", "125"],
			["Whole", "1000"], ["Double", "2000"], ["Zero", "0"]];
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("play tone note: ")
			.appendField(new Blockly.FieldDropdown(tone), 'TONE')
			.appendField("beat: ")
			.appendField(new Blockly.FieldDropdown(beat), 'BEAT');
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_btn_read'] = {
	init: function() {
		var btn = [["B1", "8"], ["B2", "11"], ["B3", "10"]];
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("read button: ")
			.appendField(new Blockly.FieldDropdown(btn), 'BUTTON');
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_gpad_read'] = {
	init: function() {
		var btn = [["B_UP", "A0"],
				["B_DOWN", "4"],
				["LEFT", "11"],
				["RIGHT", "10"],
				["B_A", "8"],
				["B_B", "1"]];
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("read button: ")
			.appendField(new Blockly.FieldDropdown(btn), 'BUTTON');
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_get_bat_voltage'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("get battery voltage (V)");
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_get_bat_percent'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("get battery voltage (%)");
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_get_charge_status'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput().appendField("detect charge completed");
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_get_usb_connected'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput().appendField("get usb connected");
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_sleep_and_weak_on_button'] = {
	init: function() {
		var btn = [["B1", "8"], ["B2", "11"], ["B3", "10"]];
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("sleep and wake on button: ")
			.appendField(new Blockly.FieldDropdown(btn), 'BUTTON')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_sleep_and_weak_on_timer'] = {
	init: function() {
		// 15, 30  60 120 250 500 1000 2000 4000 8000
		var btn = [["15ms", "15"], ["30ms", "30"], ["60ms", "60"],
				["120ms", "120"], ["250ms", "250"], ["500ms", "500"], ["1000ms", "1000"],
				["2000ms", "2000"], ["4000ms", "4000"], ["8000ms", "8000"]];
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("sleep and wake on time: ")
			.appendField(new Blockly.FieldDropdown(btn), 'TIMER')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_init_ble'] = {
	init: function() {
		var types = [
			["Transceiver", "wx_init_ble_transceiver"],
			["BTKeyboard", "wx_init_ble_bt_keyboard"],
			["HIDControl", "wx_init_ble_hid_control"]];
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("bluetooth: ")
			.appendField(new Blockly.FieldDropdown(types), 'TYPE')
			.appendField(" id: ")
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 64)), "ID");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_ble_write_text'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendValueInput("CONTENT")
			.setCheck(null)
			.appendField("BLE write");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_ble_read_text'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("bluetooth recive text");
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.GREEN);
		this.setTooltip("");
	},
	getBlockType: function() {
		return Blockly.Types.String;
	}
};
Blockly.Blocks['wx_ble_send_keys'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendValueInput("CONTENT")
			.setCheck(null)
			.appendField("BLE key press: ");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_ble_media_control'] = {
	init: function() {
		var cmd = [["Play/Pause", "0"], ["Next", "1"], ["Previous", "2"],
					["Volume+", "3"], ["Volume-", "4"]];
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("media controls: ")
			.appendField(new Blockly.FieldDropdown(cmd), 'CMD');
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_ble_mouse_control'] = {
	init: function() {
		var btns = [["Left Button", "0"], ["Right Button", "1"]];
		var state = [["Pressed", "0"], ["Release", "1"]];

		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendDummyInput()
			.appendField("mouse button: ")
			.appendField(new Blockly.FieldDropdown(btns), 'BUTTON')
			.appendField(" state: ")
			.appendField(new Blockly.FieldDropdown(state), 'STATE');
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	}
};
