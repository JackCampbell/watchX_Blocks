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

Blockly.Arduino['watchx_led'] = function(block) {
	var pin = block.getFieldValue('PIN');
	var stateOutput = Blockly.Arduino.valueToCode(block, 'STATE', Blockly.Arduino.ORDER_ATOMIC) || 'LOW';

	Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

	var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
	Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
	return code; // [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['watchx_oled_write'] = function(block) {
	var content = Blockly.Arduino.valueToCode(block, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || "";
	var line = block.getFieldValue('LINE');
	var align = block.getFieldValue('ALIGN');

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addSetup('io_oled', 'wxInitOLED();\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wxFlushScreen();')

	return `wxWriteText(${line}, ${align}, ((String)${content}).c_str());\n`
};

Blockly.Arduino['watchx_oled_write_pos'] = function(block) {
	var content = Blockly.Arduino.valueToCode(block, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || "";
	var px = Blockly.Arduino.valueToCode(block, 'PX', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py = Blockly.Arduino.valueToCode(block, 'PY', Blockly.Arduino.ORDER_ATOMIC) || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addSetup('io_oled', 'wxInitOLED();\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wxFlushScreen();')

	var code = `wxWriteTextXY(${px}, ${py}, ((String)${content}).c_str());\n`;
	return code;
};


Blockly.Arduino['watchx_oled_draw_pixel'] = function(block) {
	var px = Blockly.Arduino.valueToCode(block, 'PX', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py = Blockly.Arduino.valueToCode(block, 'PY', Blockly.Arduino.ORDER_ATOMIC) || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addSetup('io_oled', 'wxInitOLED();\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wxFlushScreen();')

	var code = `wxDrawPixel(${px}, ${py});\n`;
	return code;
};

Blockly.Arduino['watchx_oled_draw_line'] = function(block) {
	var px1 = Blockly.Arduino.valueToCode(block, 'PX1', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py1 = Blockly.Arduino.valueToCode(block, 'PY1', Blockly.Arduino.ORDER_ATOMIC) || "0";

	var px2 = Blockly.Arduino.valueToCode(block, 'PX2', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py2 = Blockly.Arduino.valueToCode(block, 'PY2', Blockly.Arduino.ORDER_ATOMIC) || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addSetup('io_oled', 'wxInitOLED();\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wxFlushScreen();')

	var code = `wxDrawLine(${px1}, ${py1}, ${px2}, ${py2});\n`;
	return code;
};

Blockly.Arduino['watchx_oled_draw_battery'] = function(block) {
	var px = Blockly.Arduino.valueToCode(block, 'PX', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var py = Blockly.Arduino.valueToCode(block, 'PY', Blockly.Arduino.ORDER_ATOMIC) || "0";
	var level = block.getFieldValue('LEVEL') || "0";

	Blockly.Arduino.addInclude("io_watch", `#include "${watchx_include}"`);
	Blockly.Arduino.addSetup('io_oled', 'wxInitOLED();\n', false);
	Blockly.Arduino.addFinish('io_oled', 'wxFlushScreen();')

	return `wxDrawBatteryIcon(${px}, ${py}, ${level});\n`;
};

