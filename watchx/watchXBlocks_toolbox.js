/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview XML toolbox embedded into a JavaScript text string.
 */
'use strict';

/** Create a namespace for the application. */
var watchXBlocks = watchXBlocks || {};

function Assume_Text(key, value) {
	return `<value name="${key}"><block type="text"><field name="TEXT">${value}</field></block></value>`;
}

function Assume_Num(key, value) {
	return `<value name="${key}"><block type="math_number"><field name="NUM">${value}</field></block></value>`;
}

function Assume_Pin(key) {
	return `<value name="${key}"><block type="io_highlow"></block></value>`;
}


watchXBlocks.TOOLBOX_XML =
'<xml>' +
'  <sep></sep>' +
'  <category id="catLogic" name="Logic">' +
'    <block type="controls_if"></block>' +
'    <block type="logic_compare"></block>' +
'    <block type="logic_operation"></block>' +
'    <block type="logic_negate"></block>' +
'    <block type="logic_boolean"></block>' +
'    <block type="logic_null"></block>' +
'    <block type="logic_ternary"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catLoops" name="Loops">' +
'    <block type="controls_repeat_ext">' +
'      <value name="TIMES">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="controls_whileUntil"></block>' +
'    <block type="controls_for">' +
'      <value name="FROM">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'      <value name="TO">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'      <value name="BY">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="controls_flow_statements"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catMath" name="Math">' +
'    <block type="math_number"></block>' +
'    <block type="math_arithmetic"></block>' +
'    <block type="math_single"></block>' +
'    <block type="math_trig"></block>' +
'    <block type="math_constant"></block>' +
'    <block type="math_number_property"></block>' +
'    <block type="math_change">' +
'      <value name="DELTA">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="math_round"></block>' +
'    <block type="math_modulo"></block>' +
'    <block type="math_constrain">' +
'      <value name="LOW">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'      <value name="HIGH">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="math_random_int">' +
'      <value name="FROM">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'      <value name="TO">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="math_random_float"></block>' +
'    <block type="base_map"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catText" name="Text">' +
'    <block type="text"></block>' +
'    <block type="text_join"></block>' +
'    <block type="text_append">' +
'      <value name="TEXT">' +
'        <block type="text"></block>' +
'      </value>' +
'    </block>' +
'    <block type="text_length"></block>' +
'    <block type="text_isEmpty"></block>' +
//'    <!--block type="text_trim"></block Need to update block -->' +
//'    <!--block type="text_print"></block Part of the serial comms -->' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catVariables" name="Variables">' +
'    <block type="variables_get"></block>' +
'    <block type="variables_set"></block>' +
'    <block type="variables_set">' +
'      <value name="VALUE">' +
'        <block type="variables_set_type"></block>' +
'      </value>' +
'    </block>' +
'    <block type="variables_set_type"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catFunctions" name="Functions" custom="PROCEDURE"></category>' +
'  <sep></sep>' +
'  <category id="catInputOutput" name="Input/Output">' +
'    <block type="wx_btn_read"></block>' +
'    <block type="wx_button_input"></block>' +
'    <block type="wx_gpad_read"></block>' +
'    <block type="wx_gpad_input"></block>' +
'    <block type="wx_led">' + Assume_Pin("STATE") + '</block>' +
'    <block type="wx_led_brightness"></block>' +  // '    <block type="LED_PIN"></block>' +
'    <block type="wx_led_brightness_2">' + Assume_Num("LEVEL", 100) + '</block>' +
'    <block type="io_digitalwrite">' + Assume_Pin("STATE") + '</block>' +
'    <block type="io_digitalread"></block>' +  //'    <block type="io_builtin_led">' + Assume_Pin("STATE") + '</block>' +
'    <block type="io_analogwrite"></block>' +
'    <block type="io_analogread"></block>' +
'    <block type="io_highlow"></block>' +
'    <block type="io_pulsein">' + Assume_Pin("PULSETYPE") + '</block>' +
'    <block type="io_pulsetimeout">' + Assume_Pin("PULSETYPE") + Assume_Num("TIMEOUT", 100) + '</block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catTime" name="Time">' +
'    <block type="wx_rtc_init_current"></block>' +
'    <block type="wx_rtc_init_param"></block>' +
'    <block type="wx_rtc_get_value"></block>' +
'    <block type="wx_print_time_line"></block>' +
'    <block type="wx_print_time_pos">' + Assume_Num("PX", 0) + Assume_Num("PY", 0) + '</block>' +
'    <block type="time_delay">' +
'      <value name="DELAY_TIME_MILI">' +
'        <block type="math_number">' +
'          <field name="NUM">1000</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="time_delaymicros">' +
'      <value name="DELAY_TIME_MICRO">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="time_millis"></block>' +
'    <block type="time_micros"></block>' +
'    <block type="infinite_loop"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catAudio" name="Audio">' +
'    <block type="wx_bzr_bpm">' + Assume_Num("BPM", 60) + '</block>' +
'    <block type="wx_bzr_play_note"></block>' +
'    <block type="wx_play_freq">' + Assume_Num("FREQUENCY", 220) + '</block>' +
'    <block type="wx_bzr_stop"></block>' +
// '    <block type="io_tone">' +
// '      <field name="TONEPIN">0</field>' +
// '      <value name="FREQUENCY">' +
// '        <shadow type="math_number">' +
// '          <field name="NUM">220</field>' +
// '        </shadow>' +
// '      </value>' +
// '    </block>' +
'    <block type="io_notone"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catMotors" name="Motors">' +
'    <block type="servo_write">' +
'      <value name="SERVO_ANGLE">' +
'        <block type="math_number">' +
'          <field name="NUM">90</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="servo_read"></block>' +
'    <block type="stepper_config">' +
'      <field name="STEPPER_NUMBER_OF_PINS">2</field>' +
'      <field name="STEPPER_PIN1">1</field>' +
'      <field name="STEPPER_PIN2">2</field>' +
'      <value name="STEPPER_STEPS">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'      <value name="STEPPER_SPEED">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="stepper_step">' +
'      <value name="STEPPER_STEPS">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catComms" name="Comms">' +
'    <block type="serial_setup"></block>' +
'    <block type="serial_print"></block>' +
'    <block type="text_prompt_ext">' +
'      <value name="TEXT">' +
'        <block type="text"></block>' +
'      </value>' +
'    </block>' +
'    <block type="spi_setup"></block>' +
'    <block type="spi_transfer"></block>' +
'    <block type="spi_transfer_return"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catDisplay" name="Display">' +
'    <block type="wx_write_text_line">' + Assume_Text('CONTENT', 'Hello') + '</block>' +
'    <block type="wx_write_text_pos">' + Assume_Text('CONTENT', 'Hello') + Assume_Num("PX", 0) + Assume_Num("PY", 0) + '</block>' +
'    <block type="wx_brightness">' + Assume_Pin("STATE") + '</block>' +
'    <block type="wx_oled_power">' + Assume_Pin("STATE") + '</block>' +
'    <block type="wx_clear_all"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catDraw" name="Draw">' +
'    <block type="wx_draw_pixel">' + Assume_Num("PX", 0) + Assume_Num("PY", 0) + '</block>' +
'    <block type="wx_draw_line">' + Assume_Num("PX1", 0) + Assume_Num("PY1", 0) + Assume_Num("PX2", 127) + Assume_Num("PY2", 0) + '</block>' +
'    <block type="wx_draw_battery_icon">' + Assume_Num("PX", 0) + Assume_Num("PY", 56) + '</block>' +
'    <block type="wx_draw_usb_connect">' + Assume_Num("PX", 18) + Assume_Num("PY", 56) + '</block>' +
'    <block type="wx_draw_charge_state">' + Assume_Num("PX", 36) + Assume_Num("PY", 56) + '</block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catSensors" name="Sensors">' +
'    <block type="wx_mpu_get_angle_value"></block>' +
'    <block type="wx_mpu_get_accel_value"></block>' +
'    <block type="wx_mpu_fall_detected"></block>' +
'    <block type="wx_mpu_motion_detected"></block>' +
'    <block type="wx_bmp_get_value"></block>' +
'    <block type="wx_mlx_get_value"></block>' +
'    <block type="wx_mag_get_value"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catBattery" name="Battery">' +
'    <block type="wx_get_bat_voltage"></block>' +
'    <block type="wx_get_bat_percent"></block>' +
'    <block type="wx_get_charge_status"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catUSB" name="USB">' +
'    <block type="wx_get_usb_connected"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catSleep" name="Sleep">' +
'    <block type="wx_sleep_and_weak_on_button"></block>' +
'    <block type="wx_sleep_and_weak_on_timer"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catBluetooth" name="Bluetooth">' +
'    <block type="wx_init_ble"></block>' +
'    <block type="wx_ble_write_text">' + Assume_Text('CONTENT', 'Hello') + '</block>' +
'    <block type="wx_ble_read_text"></block>' +
'    <block type="wx_ble_send_keys">' + Assume_Text('CONTENT', '0') + '</block>' +
'    <block type="wx_ble_media_control"></block>' +
'    <block type="wx_ble_mouse_control"></block>' +
'  </category>' +
'  <sep></sep>' +
'</xml>';
