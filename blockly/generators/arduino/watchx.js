// noinspection EqualityComparisonWithCoercionJS

/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for Arduino Digital and Analogue input/output.
 *     Arduino built in function docs: http://arduino.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Arduino.watchx');

goog.require('Blockly.Arduino');

const watchx_include = "watchX.h"

Blockly.Arduino['wx_led'] = function(block) {
	var pin = block.getFieldValue('PIN');
	var stateOutput = Blockly.Arduino.valueToCode(block, 'STATE', Blockly.Arduino.ORDER_ATOMIC) || 'LOW';

	Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

	var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
	Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
	return code; // [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['wx_led_brightness'] = function(block) {
	var pin = block.getFieldValue('PIN');
	var level = block.getFieldValue('LEVEL');

	Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
	Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);
	var code = `analogWrite(${pin}, ${level});\n`
	return code;
};

/*
Blockly.Arduino['watchx_oled_get_screen_x'] = function(block) {
	var key = block.getFieldValue('VALUE');
	return [`${key}`, Blockly.Arduino.ORDER_ATOMIC];
}
Blockly.Arduino['watchx_oled_get_screen_y'] = function(block) {
	var key = block.getFieldValue('VALUE');
	return [`${key}`, Blockly.Arduino.ORDER_ATOMIC];
}
*/

Blockly.Arduino['wx_write_text_line'] = function(block) {
	var content = Blockly.Arduino.valueToCode(block, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || "\"empty\"";
	var line = block.getFieldValue('LINE');
	var align = block.getFieldValue('ALIGN');

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');

	return `wx_write_text_line(&oled, ${line}, ${align}, ((String)${content}).c_str());\n`
};
Blockly.Arduino['wx_write_text_pos'] = function(block) {
	var content = Blockly.Arduino.valueToCode(block, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || "\"empty\"";
	var px = Blockly.Arduino.valueToCode(block, 'PX', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py = Blockly.Arduino.valueToCode(block, 'PY', Blockly.Arduino.ORDER_ATOMIC) || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');

	var code = `wx_write_text_pos(&oled, ${px}, ${py}, ((String)${content}).c_str());\n`;
	return code;
};
Blockly.Arduino['wx_draw_pixel'] = function(block) {
	var px = Blockly.Arduino.valueToCode(block, 'PX', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py = Blockly.Arduino.valueToCode(block, 'PY', Blockly.Arduino.ORDER_ATOMIC) || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');

	var code = `wx_draw_pixel(&oled, ${px}, ${py});\n`;
	return code;
};
Blockly.Arduino['wx_draw_line'] = function(block) {
	var px1 = Blockly.Arduino.valueToCode(block, 'PX1', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py1 = Blockly.Arduino.valueToCode(block, 'PY1', Blockly.Arduino.ORDER_ATOMIC) || "0";

	var px2 = Blockly.Arduino.valueToCode(block, 'PX2', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py2 = Blockly.Arduino.valueToCode(block, 'PY2', Blockly.Arduino.ORDER_ATOMIC) || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');

	var code = `wx_draw_line(&oled, ${px1}, ${py1}, ${px2}, ${py2});\n`;
	return code;
};
Blockly.Arduino['wx_draw_battery_icon'] = function(block) {
	var px = Blockly.Arduino.valueToCode(block, 'PX', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py = Blockly.Arduino.valueToCode(block, 'PY', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var level = block.getFieldValue('LEVEL') || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');

	return `wx_draw_battery_icon(&oled, ${px}, ${py}, ${level});\n`;
};
Blockly.Arduino['wx_brightness'] = function(block) {
	var stateOutput = Blockly.Arduino.valueToCode(block, 'STATE', Blockly.Arduino.ORDER_ATOMIC) || 'LOW';

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');

	var code = `wx_brightness(&oled, ${stateOutput});\n`
	return code; // [code, Blockly.Arduino.ORDER_ATOMIC];
};
Blockly.Arduino['wx_draw_usb_connect'] = function(block) {
	var px = Blockly.Arduino.valueToCode(block, 'PX', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py = Blockly.Arduino.valueToCode(block, 'PY', Blockly.Arduino.ORDER_ATOMIC) || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');

	return `wx_draw_usb_connect(&oled, ${px}, ${py});\n`;
};
Blockly.Arduino['wx_draw_charge_state'] = function(block) {
	var px = Blockly.Arduino.valueToCode(block, 'PX', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py = Blockly.Arduino.valueToCode(block, 'PY', Blockly.Arduino.ORDER_ATOMIC) || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');

	return `wx_draw_charge_state(&oled, ${px}, ${py});\n`;
};
Blockly.Arduino['wx_clear_all'] = function(block) {
	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');
	return `wx_clear_all(&oled);\n`;
};
Blockly.Arduino['wx_oled_power'] = function(block) {
	var stateOutput = Blockly.Arduino.valueToCode(block, 'STATE', Blockly.Arduino.ORDER_ATOMIC) || 'LOW';

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');

	return `wx_oled_power(&oled, ${stateOutput});\n`
};
Blockly.Arduino['wx_rtc_init_param'] = function(block) {
	var day = block.getFieldValue('DAY');
	var month = block.getFieldValue('MONTH');
	var year = block.getFieldValue('YEAR');
	var hour = block.getFieldValue('HOUR');
	var minute = block.getFieldValue('MINUTE');
	var second = block.getFieldValue('SECOND');

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_rtc", 'wx_rtc_t rtc;', false);
	Blockly.Arduino.addSetup('io_rtc', `wx_rtc_init(&rtc, ${year}, ${month}, ${day}, ${hour}, ${minute}, ${second});\n`, false);
	Blockly.Arduino.addFinish('io_rtc', 'wx_rtc_update(&rtc);');
	return "";
};
Blockly.Arduino['wx_rtc_init_current'] = function(block) {
	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_rtc", 'wx_rtc_t rtc;', false);
	Blockly.Arduino.addSetup('io_rtc', `wx_rtc_init(&rtc);\n`, false);
	Blockly.Arduino.addFinish('io_rtc', 'wx_rtc_update(&rtc);');
	return "";
};
Blockly.Arduino['wx_rtc_get_value'] = function(block) {
	var key = block.getFieldValue('KEY');

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_rtc", 'wx_rtc_t rtc;', false);
	Blockly.Arduino.addSetup('io_rtc', `wx_rtc_init(&rtc);\n`, false);
	Blockly.Arduino.addFinish('io_rtc', 'wx_rtc_update(&rtc);');

	var code = `wx_rtc_get_value(&rtc, ${key})`;
	return [code, Blockly.Arduino.ORDER_ATOMIC];
};
Blockly.Arduino['wx_print_time_line'] = function(block) {
	var line = block.getFieldValue('LINE');
	// header
	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	// init oled
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');
	// init rtc
	Blockly.Arduino.addVariable("var_rtc", 'wx_rtc_t rtc;', false);
	Blockly.Arduino.addSetup('io_rtc', `wx_rtc_init(&rtc);\n`, false);
	Blockly.Arduino.addFinish('io_rtc', 'wx_rtc_update(&rtc);');
	var code = `wx_print_time(&oled, &rtc, 4, ${line});\n`;
	return code;
};

Blockly.Arduino['wx_print_time_pos'] = function(block) {
	var type = block.getFieldValue('TYPE');
	var px = Blockly.Arduino.valueToCode(block, 'PX', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py = Blockly.Arduino.valueToCode(block, 'PY', Blockly.Arduino.ORDER_ATOMIC) || "0";
	// header
	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	// init oled
	Blockly.Arduino.addVariable("var_oled", 'wx_oled_t oled;', false);
	Blockly.Arduino.addSetup('io_spi', 'SPI.begin();\n', false);
	Blockly.Arduino.addSetup('io_oled', 'wx_oled_init(&oled);\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wx_oled_update(&oled);');
	// init rtc
	Blockly.Arduino.addVariable("var_rtc", 'wx_rtc_t rtc;', false);
	Blockly.Arduino.addSetup('io_rtc', `wx_rtc_init(&rtc);\n`, false);
	Blockly.Arduino.addFinish('io_rtc', 'wx_rtc_update(&rtc);');
	var code = `wx_print_time(&oled, &rtc, ${type}, ${px}, ${py});\n`;
	return code;
};

Blockly.Arduino['wx_bmp_get_value'] = function(block) {
	var key = block.getFieldValue('KEY');

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_bmp", 'wx_bmp_t bmp;', false);
	Blockly.Arduino.addSetup('io_bmp', 'wx_bmp_init(&bmp);\n', false);
	Blockly.Arduino.addFinish('io_bmp', 'wx_bmp_update(&bmp);');

	var code = `wx_bmp_get_value(&bmp, ${key})`;
	return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['wx_mag_get_value'] = function(block) {
	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_mag", 'wx_mag_t mag;', false);
	Blockly.Arduino.addSetup('io_mag', 'wx_mag_init(&mag);\n', false);
	Blockly.Arduino.addFinish('io_mag', 'wx_mag_update(&mag);');

	var code = `wx_mag_get_value(&mag)`;
	return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['wx_mlx_get_value'] = function(block) {
	var key = block.getFieldValue('KEY');
	var filter = block.getFieldValue("FILTER");

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_mlx", 'wx_mlx_t mlx;', false);
	Blockly.Arduino.addSetup('io_mlx', `wx_mlx_init(&mlx, ${filter});\n`, false);
	Blockly.Arduino.addFinish('io_mlx', 'wx_mlx_update(&mlx);');

	var code = `wx_mlx_get_value(&mlx, ${key})`;
	return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['wx_mpu_get_angle_value'] =
Blockly.Arduino['wx_mpu_get_accel_value'] = function(block) {
	var key = block.getFieldValue('KEY');

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_mpu", 'wx_mpu_t mpu;', false);
	Blockly.Arduino.addSetup('wx_mpu', `wx_mpu_init(&mpu);\n`, false);
	Blockly.Arduino.addFinish('wx_mpu', 'wx_mpu_update(&mpu);');

	var code = `wx_mpu_get_value(&mpu, ${key})`;
	return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['wx_mpu_fall_detected'] = function(block) {
	var threshold = block.getFieldValue('THRESHOLD');
	var duration = block.getFieldValue("DURATION");

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_mpu", 'wx_mpu_t mpu;', false);
	Blockly.Arduino.addSetup('wx_mpu', `wx_mpu_init_fall(&mpu, ${threshold}, ${duration});\n`, false);
	Blockly.Arduino.addFinish('wx_mpu', 'wx_mpu_clear_fall(&mpu);');

	var code = `wx_mpu_fall_detected(&mpu)`;
	return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['wx_mpu_motion_detected'] = function(block) {
	var threshold = block.getFieldValue('THRESHOLD');
	var duration = block.getFieldValue("DURATION");

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addVariable("var_mpu", 'wx_mpu_t mpu;', false);
	Blockly.Arduino.addSetup('wx_mpu', `wx_mpu_init_motion(&mpu, ${threshold}, ${duration});\n`, false);
	Blockly.Arduino.addFinish('wx_mpu', 'wx_mpu_clear_motion(&mpu);');

	var code = `wx_mpu_motion_detected(&mpu)`;
	return [code, Blockly.Arduino.ORDER_ATOMIC];
};
