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

Blockly.Blocks.io.display_color = '#B055A1';
Blockly.Blocks.io.battery_color = '#32af64';
Blockly.Blocks.io.usb_color = '#84a551';
Blockly.Blocks.io.sleep_color = '#5b4b9f';
Blockly.Blocks.io.bluetooth_color = '#B055A1';
Blockly.Blocks.io.sensor_color = '#1798c4';
Blockly.Blocks.io.draw_color = '#5954a4';
Blockly.Blocks.io.time_color = 144;
Blockly.Blocks.io.audio_color = 250;
Blockly.Blocks.io.inout_color = 250;

function num_validator(value, min, max) {
	return (min <= value && value <= max) ? value : null;
}

Blockly.Blocks['wx_led'] = {
	init: function() {
		this.setColour(Blockly.Blocks.io.inout_color);
		this.appendValueInput('STATE')
			.appendField(Blockly.Msg.WX_TURN_LED)
			.appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.builtinLed), 'PIN')
			.appendField(Blockly.Msg.WX_TO)
			.setCheck(Blockly.Types.BOOLEAN.checkList);
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setHelpUrl("http://watchx.io");
		this.setTooltip(Blockly.Msg.WX_TURN_LED_TIPS);
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
			.appendField(Blockly.Msg.WX_LED_BRIGHTNESS)
			.appendField(leds, 'PIN')
			.appendField(Blockly.Msg.WX_LED_LEVEL)
			.appendField(new Blockly.FieldDropdown(level), 'LEVEL')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.inout_color);
		this.setHelpUrl("http://watchx.io");
		this.setTooltip(Blockly.Msg.WX_LED_BRIGHTNESS_TIP);
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
		this.setColour(Blockly.Blocks.io.display_color);
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
		this.setColour(Blockly.Blocks.io.display_color);
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
		var line = [ ['1', '0'], ['2', '1'], ['3', '2'], ['4', '3'], ['5', '4'], ['6', '5'], ['7', '6'], ['8', '7'] ];
		var align = [
			[Blockly.Msg.WX_ALIGN_LEFT, '0'],
			[Blockly.Msg.WX_ALIGN_MIDDLE, '1'],
			[Blockly.Msg.WX_ALIGN_RIGHT, '2'] ];
		this.appendValueInput("CONTENT")
			.setCheck(null)
			.appendField(Blockly.Msg.WX_OLED_WRITE);
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField(Blockly.Msg.WX_OLED_WRITE_LINE)
			.appendField(new Blockly.FieldDropdown(line), 'LINE')
			.appendField(Blockly.Msg.WX_OLED_WRITE_ALIGN)
			.appendField(new Blockly.FieldDropdown(align), 'ALIGN')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.display_color);
		this.setHelpUrl("http://watchx.io");
		this.setTooltip(Blockly.Msg.WX_OLED_WRITE_LINE_TIP);
	}
};
Blockly.Blocks['wx_write_text_pos'] = {
	init: function() {
		this.appendValueInput("CONTENT").setCheck(null).appendField(Blockly.Msg.WX_OLED_WRITE);
		this.appendValueInput("PX").setCheck("Number").appendField(Blockly.Msg.WX_PX);
		this.appendValueInput("PY").setCheck("Number").appendField(Blockly.Msg.WX_PY);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.display_color);
		this.setHelpUrl("http://watchx.io");
		this.setTooltip(Blockly.Msg.WX_OLED_WRITE_POS_TIP);
	}
};
Blockly.Blocks['wx_draw_pixel'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_DRAW_PIXEL);
		this.appendValueInput("PX").setCheck("Number").appendField(Blockly.Msg.WX_PX);
		this.appendValueInput("PY").setCheck("Number").appendField(Blockly.Msg.WX_PY);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.draw_color);
		this.setHelpUrl("http://watchx.io");
		this.setTooltip(Blockly.Msg.WX_DRAW_PIXEL_TIP);
	}
};
Blockly.Blocks['wx_draw_line'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_DRAW_LINE);
		this.appendValueInput("PX1").setCheck("Number").appendField(Blockly.Msg.WX_PX + "1");
		this.appendValueInput("PY1").setCheck("Number").appendField(Blockly.Msg.WX_PY + "1");
		this.appendValueInput("PX2").setCheck("Number").appendField(Blockly.Msg.WX_PX + "2");
		this.appendValueInput("PY2").setCheck("Number").appendField(Blockly.Msg.WX_PY + "2");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.draw_color);
		this.setHelpUrl("http://watchx.io");
		this.setTooltip(Blockly.Msg.WX_DRAW_LINE_TIP);
	}
};
Blockly.Blocks['wx_draw_battery_icon'] = {
	init: function() {
		var list = [ ['%0', '0'], ['%50', '50'], ["%75", '100'], ['%100', '150'] ];
		this.appendDummyInput().appendField(Blockly.Msg.WX_DRAW_BATTERY_LEVEL);
		this.appendValueInput("PX").setCheck("Number").appendField(Blockly.Msg.WX_PX);
		this.appendValueInput("PY").setCheck("Number").appendField(Blockly.Msg.WX_PY);
		this.appendDummyInput().appendField(Blockly.Msg.WX_PERCENT).appendField(new Blockly.FieldDropdown(list), 'LEVEL')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.draw_color);
		this.setHelpUrl("http://watchx.io");
		this.setTooltip(Blockly.Msg.WX_DRAW_BATTERY_LEVEL_TIP);
	}
};
Blockly.Blocks['wx_brightness'] = {
	init: function() {
		this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
		this.setColour(Blockly.Blocks.io.display_color);
		this.appendValueInput('STATE').appendField(Blockly.Msg.WX_OLED_BRIGHTNESS).setCheck(Blockly.Types.BOOLEAN.checkList);
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setHelpUrl("http://watchx.io");
		this.setTooltip(Blockly.Msg.WX_OLED_BRIGHTNESS_TIP);
	}
};
Blockly.Blocks['wx_draw_usb_connect'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_DRAW_USB_ICON);
		this.appendValueInput("PX").setCheck("Number").appendField(Blockly.Msg.WX_PX);
		this.appendValueInput("PY").setCheck("Number").appendField(Blockly.Msg.WX_PY);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.draw_color);
		this.setTooltip(Blockly.Msg.WX_DRAW_USB_ICON_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_draw_charge_state'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_DRAW_CHARGE_ICON);
		this.appendValueInput("PX").setCheck("Number").appendField(Blockly.Msg.WX_PX);
		this.appendValueInput("PY").setCheck("Number").appendField(Blockly.Msg.WX_PY);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.draw_color);
		this.setTooltip(Blockly.Msg.WX_DRAW_CHARGE_ICON_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_clear_all'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_OLED_CLEAR_ALL);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.display_color);
		this.setTooltip(Blockly.Msg.WX_OLED_CLEAR_ALL_TIP );
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_oled_power'] = {
	init: function() {
		this.setColour(Blockly.Blocks.io.display_color);
		this.appendValueInput('STATE').appendField(Blockly.Msg.WX_OLED_POWER).setCheck(Blockly.Types.BOOLEAN.checkList);
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip(Blockly.Msg.WX_OLED_POWER_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_rtc_init_param'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_SET_DATE)
			.appendField(new Blockly.FieldNumber('1', (value) => num_validator(value, 1, 31)), "DAY")
			.appendField(Blockly.Msg.WX_MONTH)
			.appendField(new Blockly.FieldNumber('1', (value) => num_validator(value, 1, 12)), "MONTH")
			.appendField(Blockly.Msg.WX_YEAR)
			.appendField(new Blockly.FieldNumber('2011', (value) => num_validator(value, 1900, 2099)), "YEAR");
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField(Blockly.Msg.WX_HOUR)
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 23)), "HOUR")
			.appendField(Blockly.Msg.WX_MINUTE)
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 59)), "MINUTE")
			.appendField(Blockly.Msg.WX_SECOND)
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 59)), "SECOND")
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.time_color);
		this.setTooltip(Blockly.Msg.WX_SET_DATE_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_rtc_init_current'] = {
	init: function() {
		this.setColour(Blockly.Blocks.io.time_color);
		this.appendDummyInput().appendField(Blockly.Msg.WX_CURRENT_TIME);
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip(Blockly.Msg.WX_CURRENT_TIME_TIP);
		this.setHelpUrl("http://watchx.io");
	}
}
Blockly.Blocks['wx_rtc_get_value'] = {
	init: function() {
		var list = [[Blockly.Msg.WX_DAY, "WX_RTC_YEAR"],
					[Blockly.Msg.WX_MONTH,"WX_RTC_MONTH"],
					[Blockly.Msg.WX_YEAR,"WX_RTC_DAY"],
					[Blockly.Msg.WX_HOUR,"WX_RTC_HOUR"],
					[Blockly.Msg.WX_MINUTE,"WX_RTC_MINUTE"],
					[Blockly.Msg.WX_SECOND,"WX_RTC_SECOND"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_GET)
			.appendField(new Blockly.FieldDropdown(list), "KEY");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.time_color);
		this.setInputsInline(true);
		this.setTooltip(Blockly.Msg.WX_GET_TIME_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.DECIMAL;
	}
};
Blockly.Blocks['wx_print_time_line'] = {
	init: function() {
		var list = [[ "1", "0"], [ "2", "1"], [ "3", "2"]];
		/*
		var list = [[Blockly.Msg.WX_LINE + ' 1', '0'],
					[Blockly.Msg.WX_LINE + ' 2', '1'],
					[Blockly.Msg.WX_LINE + ' 3', '2']];
		*/
		this.setColour(Blockly.Blocks.io.time_color);
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_PRINT_TIME + " " + Blockly.Msg.WX_LINE)
			.appendField(new Blockly.FieldDropdown(list), 'LINE');
		this.setInputsInline(false);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip(Blockly.Msg.WX_PRINT_TIME_LINE_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_print_time_pos'] = {
	init: function() {
		var list = [[Blockly.Msg.WX_HOUR, 'WX_DRAW_TIME_HOUR'],
					[Blockly.Msg.WX_MINUTE, 'WX_DRAW_TIME_MINUTE'],
					[Blockly.Msg.WX_SECOND, 'WX_DRAW_TIME_SECORD']];
		this.setColour(Blockly.Blocks.io.time_color);
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_PRINT_TIME)
			.appendField(new Blockly.FieldDropdown(list), 'TYPE');
		this.appendValueInput("PX").setCheck("Number").appendField(Blockly.Msg.WX_PX);
		this.appendValueInput("PY").setCheck("Number").appendField(Blockly.Msg.WX_PY);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip(Blockly.Msg.WX_PRINT_TIME_POS_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_bmp_get_value'] = {
	init: function() {
		var list = [[Blockly.Msg.WX_ALTITUDE, "WX_BMP_ALTITUDE"],
					[Blockly.Msg.WX_PRESSURE, "WX_BMP_PRESSURE"],
					[Blockly.Msg.WX_TEMPERATURE, "WX_BMP_TEMPERATURE"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_GET_BMP)
			.appendField(new Blockly.FieldDropdown(list), "KEY");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.sensor_color);
		this.setInputsInline(true);
		this.setTooltip(Blockly.Msg.WX_GET_BMP_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mag_get_value'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_GET_MAG);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.sensor_color);
		this.setTooltip(Blockly.Msg.WX_GET_MAG_TIP);
		this.setHelpUrl("http://watchx.io");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mlx_get_value'] = {
	init: function() {
		var filter = [["0", "0"], ["25", "25"], ["50", "50"], ["75", "75"], ["100", "100"]];
		var list = [['X', 'WX_MLX_DX'], ['Y', 'WX_MLX_DY'], ['Z', 'WX_MLX_DZ']]
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_GET_MLX)
			.appendField(new Blockly.FieldDropdown(list), "KEY");
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_FILTER)
			.appendField(new Blockly.FieldDropdown(filter), "FILTER");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.sensor_color);
		this.setTooltip(Blockly.Msg.WX_GET_MLX_TIP);
		this.setHelpUrl("http://watchx.io");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mpu_get_angle_value'] = {
	init: function() {
		var list = [['X', 'WX_MPU_ANGLE_X'], ['Y', 'WX_MPU_ANGLE_Y'], ['Z', 'WX_MPU_ANGLE_Z']]
		this.appendDummyInput().appendField(Blockly.Msg.WX_GET_MPU_ANGLE).appendField(new Blockly.FieldDropdown(list), "KEY");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.sensor_color);
		this.setTooltip(Blockly.Msg.WX_GET_MPU_ANGLE_TIP);
		this.setHelpUrl("http://watchx.io");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mpu_get_accel_value'] = {
	init: function() {
		var list = [['X', 'WX_MPU_ACCEL_X'], ['Y', 'WX_MPU_ACCEL_Y'], ['Z', 'WX_MPU_ACCEL_Z']]
		this.appendDummyInput().appendField(Blockly.Msg.WX_GET_MPU_ACCEL).appendField(new Blockly.FieldDropdown(list), "KEY");
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.sensor_color);
		this.setTooltip(Blockly.Msg.WX_GET_MPU_ACCEL_TIP);
		this.setHelpUrl("http://watchx.io");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_mpu_fall_detected'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_FREE_FALL_DETECTED + " " + Blockly.Msg.WX_THRESHOLD)
			.appendField(new Blockly.FieldNumber('17', (value) => num_validator(value, 0, 1000)), "THRESHOLD")
			.appendField(Blockly.Msg.WX_DURATION)
			.appendField(new Blockly.FieldNumber('2', (value) => num_validator(value, 0, 60)), "DURATION")
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.sensor_color);
		this.setTooltip(Blockly.Msg.WX_FREE_FALL_DETECTED_TIP);
		this.setHelpUrl("http://watchx.io");
		this.setInputsInline(true);
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_mpu_motion_detected'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_DETECT_MOTION + " " + Blockly.Msg.WX_THRESHOLD)
			.appendField(new Blockly.FieldNumber('5', (value) => num_validator(value, 0, 1000)), "THRESHOLD")
			.appendField(Blockly.Msg.WX_DURATION)
			.appendField(new Blockly.FieldNumber('2', (value) => num_validator(value, 0, 60)), "DURATION")
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.sensor_color);
		this.setTooltip(Blockly.Msg.WX_DETECT_MOTION_TIP);
		this.setHelpUrl("http://watchx.io");
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
		var beat = [
			[Blockly.Msg.WX_BUZZER_HALF, "500"],
			[Blockly.Msg.WX_BUZZER_QUARTER, "250"],
			[Blockly.Msg.WX_BUZZER_EIGHTH, "125"],
			[Blockly.Msg.WX_BUZZER_WHOLE, "1000"],
			[Blockly.Msg.WX_BUZZER_DOUBLE, "2000"],
			[Blockly.Msg.WX_BUZZER_ZERO, "0"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_BZR_PLAY_NOTE)
			.appendField(new Blockly.FieldDropdown(tone), 'TONE')
			.appendField(Blockly.Msg.WX_BEAT)
			.appendField(new Blockly.FieldDropdown(beat), 'BEAT');
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.audio_color);
		this.setTooltip(Blockly.Msg.WX_BZR_PLAY_NOTE_TIP);
		this.setHelpUrl("http://watchx.io");
		this.setTooltip("");
	}
};
Blockly.Blocks['wx_play_freq'] = {
	init: function() {
		this.appendValueInput("FREQUENCY").setCheck("Number").appendField(Blockly.Msg.WX_PLAY_FREQ);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.audio_color);
		this.setTooltip(Blockly.Msg.WX_PLAY_FREQ_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};

Blockly.Blocks['wx_input_down'] = {
	init: function() {
		var btn = [["B1", "KEY_B1"], ["B2", "KEY_B2"], ["B3", "KEY_B3"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_INPUT_DOWN)
			.appendField(new Blockly.FieldDropdown(btn), 'KEY');
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.inout_color);
		this.setTooltip(Blockly.Msg.WX_INPUT_DOWN_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};

Blockly.Blocks['wx_btn_read'] = {
	init: function() {
		var btn = [["B1", "8"], ["B2", "11"], ["B3", "10"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_READ_BUTTON)
			.appendField(new Blockly.FieldDropdown(btn), 'BUTTON');
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.inout_color);
		this.setTooltip(Blockly.Msg.WX_READ_BUTTON_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_gpad_read'] = {
	init: function() {
		var btn = [["B_UP", "A0"], ["B_DOWN", "4"], ["B_LEFT", "11"], ["B_RIGHT", "10"], ["B_A", "8"], ["B_B", "1"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_READ_GPAD)
			.appendField(new Blockly.FieldDropdown(btn), 'BUTTON');
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.inout_color);
		this.setTooltip(Blockly.Msg.WX_READ_GPAD_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_get_bat_voltage'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_GET_BATTERY_VOLTAGE);
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.battery_color);
		this.setTooltip(Blockly.Msg.WX_GET_BATTERY_VOLTAGE_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_get_bat_percent'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_GET_BATTERY_PERCENT);
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.battery_color);
		this.setTooltip(Blockly.Msg.WX_GET_BATTERY_PERCENT_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.NUMBER;
	}
};
Blockly.Blocks['wx_get_charge_status'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_CHARGE_COMPLETE);
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.battery_color);
		this.setTooltip(Blockly.Msg.WX_CHARGE_COMPLETE_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_get_usb_connected'] = {
	init: function() {
		this.appendDummyInput().appendField(Blockly.Msg.WX_CHECK_USB_CONNECTION);
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.usb_color);
		this.setTooltip(Blockly.Msg.WX_CHECK_USB_CONNECTION_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.BOOLEAN;
	}
};
Blockly.Blocks['wx_sleep_and_weak_on_button'] = {
	init: function() {
		var btn = [["B1", "8"], ["B2", "11"], ["B3", "10"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_SLEEP_AND_WAKE_BUTTON)
			.appendField(new Blockly.FieldDropdown(btn), 'BUTTON')
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.sleep_color);
		this.setTooltip(Blockly.Msg.WX_SLEEP_AND_WAKE_BUTTON_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_sleep_and_weak_on_timer'] = {
	init: function() {
		// 15, 30  60 120 250 500 1000 2000 4000 8000
		var btn = [["15ms", "15"], ["30ms", "30"], ["60ms", "60"],
				["120ms", "120"], ["250ms", "250"], ["500ms", "500"], ["1000ms", "1000"],
				["2000ms", "2000"], ["4000ms", "4000"], ["8000ms", "8000"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_SLEEP_AND_WAKE_TIMER)
			.appendField(new Blockly.FieldDropdown(btn), 'TIMER')
			.appendField(Blockly.Msg.WX_INTERVALS);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.sleep_color);
		this.setTooltip(Blockly.Msg.WX_SLEEP_AND_WAKE_TIMER_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_init_ble'] = {
	init: function() {
		var types = [
			[Blockly.Msg.WX_BLUETOOTH_TRANSCEIVER, "wx_init_ble_transceiver"],
			[Blockly.Msg.WX_BLUETOOTH_KEYBOARD, "wx_init_ble_bt_keyboard"],
			[Blockly.Msg.WX_BLUETOOTH_HID_CONTROL, "wx_init_ble_hid_control"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_BLUETOOTH)
			.appendField(new Blockly.FieldDropdown(types), 'TYPE')
			.appendField(Blockly.Msg.WX_ID)
			.appendField(new Blockly.FieldNumber('0', (value) => num_validator(value, 0, 64)), "ID")
			.appendField(Blockly.Msg.WX_INIT);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.bluetooth_color);
		this.setTooltip(Blockly.Msg.WX_BLUETOOTH_INIT_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_ble_write_text'] = {
	init: function() {
		this.appendValueInput("CONTENT").setCheck(null).appendField(Blockly.Msg.WX_BLUETOOTH_SEND);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.bluetooth_color);
		this.setTooltip(Blockly.Msg.WX_BLUETOOTH_SEND_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_ble_read_text'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_BLUETOOTH_RECV);
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(Blockly.Blocks.io.bluetooth_color);
		this.setTooltip(Blockly.Msg.WX_BLUETOOTH_RECV_TIP);
		this.setHelpUrl("http://watchx.io");
	},
	getBlockType: function() {
		return Blockly.Types.String;
	}
};
Blockly.Blocks['wx_ble_send_keys'] = {
	init: function() {
		this.appendValueInput("CONTENT").setCheck(null).appendField(Blockly.Msg.WX_BLE_KEY_PRESS);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.bluetooth_color);
		this.setTooltip(Blockly.Msg.WX_BLE_KEY_PRESS_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_ble_media_control'] = {
	init: function() {
		var cmd =  [[Blockly.Msg.WX_PLAY_PAUSE, "0"],
					[Blockly.Msg.WX_NEXT, "1"],
					[Blockly.Msg.WX_PREVIOUS, "2"],
					[Blockly.Msg.WX_VOLUME_UP, "3"],
					[Blockly.Msg.WX_VOLUME_DOWN, "4"]];
		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_BLE_MEDIA_CONTROL)
			.appendField(new Blockly.FieldDropdown(cmd), 'CMD');
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.bluetooth_color);
		this.setTooltip(Blockly.Msg.WX_BLE_MEDIA_CONTROL_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
Blockly.Blocks['wx_ble_mouse_control'] = {
	init: function() {
		var btns = [[Blockly.Msg.WX_LEFT, "0"], [Blockly.Msg.WX_RIGHT, "1"]];
		var state = [[Blockly.Msg.WX_PRESSED, "0"], [Blockly.Msg.WX_RELEASE, "1"]];

		this.appendDummyInput()
			.appendField(Blockly.Msg.WX_BLE_MOUSE_CONTROL)
			.appendField(new Blockly.FieldDropdown(btns), 'BUTTON')
			.appendField(new Blockly.FieldDropdown(state), 'STATE');
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.bluetooth_color);
		this.setTooltip(Blockly.Msg.WX_BLE_MOUSE_CONTROL_TIP);
		this.setHelpUrl("http://watchx.io");
	}
};
