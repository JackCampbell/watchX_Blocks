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
			.appendField("LED setup #")
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
		var leds = new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.builtinLed);
		var level = new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.batteyLevelIcon);
		this.appendDummyInput().appendField("LED brightness");
		this.appendDummyInput().appendField(leds, 'PIN')
		this.appendDummyInput().appendField("Level: ").appendField(level, 'LEVEL')
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
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.appendValueInput("CONTENT")
			.setCheck(null)
			.appendField("OLED write");
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.oledLine), 'LINE')
			.appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.oledAlign), 'ALIGN')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
	},
	updateFields: function() {
		Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'LINE', 'oledLine');
		Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'ALIGN', 'oledAlign');
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
		var level = new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.batteyLevelIcon);
		this.appendDummyInput().appendField("OLED draw battery level");
		this.appendValueInput("PX").setCheck("Number").appendField("X:");
		this.appendValueInput("PY").setCheck("Number").appendField("Y:");
		this.appendDummyInput().appendField("Level: ").appendField(level, 'LEVEL')

		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	},
	updateFields: function() {
		Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'LEVEL', 'batteyLevelIcon');
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
