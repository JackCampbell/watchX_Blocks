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

Blockly.Blocks['watchx_led'] = {
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

Blockly.Blocks['watchx_oled_write'] = {
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
	}
};

Blockly.Blocks['watchx_oled_write_pos'] = {
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

Blockly.Blocks['watchx_oled_draw_pixel'] = {
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

Blockly.Blocks['watchx_oled_draw_line'] = {
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

Blockly.Blocks['watchx_oled_draw_battery'] = {
	init: function() {
		this.appendDummyInput().appendField("OLED draw battery level");
		this.appendValueInput("PX").setCheck("Number").appendField("X:");
		this.appendValueInput("PY").setCheck("Number").appendField("Y:");
		this.appendDummyInput().appendField("level: ").appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.batteyLevelIcon), 'LEVEL')

		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.io.ORANGE);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
