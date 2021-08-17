  /**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview  Ardublockly specific English strings.
 *
 * After modifying this file, either run "build.py" from the blockly directory,
 * or run (from this directory):
 * ../i18n/js_to_json.py
 * to regenerate json/{en,qqq,synonyms}.json.
 *
 * To convert all of the json files to .js files, run:
 * ../i18n/create_messages.py json/*.json
 */
'use strict';

goog.provide('Blockly.Msg.en');

goog.require('Blockly.Msg');


/**
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to message files.
 */

/**
 * Each message is preceded with a triple-slash comment that becomes the
 * message descriptor.  The build process extracts these descriptors, adds
 * them to msg/json/qqq_ardublockly.json, and they show up in the translation
 * console.
 * Note the strings have to be surrounded by single quotation marks: ''
 */

/**
 * Ardublockly Types
 */
/// Arduino Types - Character C type char
Blockly.Msg.ARD_TYPE_CHAR = 'Character';
/// Arduino Types - Text C type String
Blockly.Msg.ARD_TYPE_TEXT = 'Text';
/// Arduino Types - Boolean type
Blockly.Msg.ARD_TYPE_BOOL = 'Boolean';
/// Arduino Types - Short number C type char
Blockly.Msg.ARD_TYPE_SHORT = 'Short Number';
/// Arduino Types - Number C type integer
Blockly.Msg.ARD_TYPE_NUMBER = 'Number';
/// Arduino Types - Large number C type long integer
Blockly.Msg.ARD_TYPE_LONG = 'Large Number';
/// Arduino Types - Decimal number C type floating point
Blockly.Msg.ARD_TYPE_DECIMAL = 'Decimal';
/// Arduino Types - Array
Blockly.Msg.ARD_TYPE_ARRAY = 'Array';
/// Arduino Types - Null C type void
Blockly.Msg.ARD_TYPE_NULL = 'Null';
/// Arduino Types - Undefined type
Blockly.Msg.ARD_TYPE_UNDEF = 'Undefined';
/// Arduino Types - Place holder value, indicates block with type not connected
Blockly.Msg.ARD_TYPE_CHILDBLOCKMISSING = 'ChildBlockMissing';

// Arduino Blocks
Blockly.Msg.ARD_HIGH = 'HIGH';
Blockly.Msg.ARD_LOW = 'LOW';
Blockly.Msg.ARD_ANALOGREAD = 'read analog pin#';
Blockly.Msg.ARD_ANALOGREAD_TIP = 'Return value between 0 and 1024';
Blockly.Msg.ARD_ANALOGWRITE = 'set analog pin#';
Blockly.Msg.ARD_ANALOGWRITE_TIP = 'Write analog value between 0 and 255 to a specific PWM Port';
Blockly.Msg.ARD_HIGHLOW_TIP = 'Set a pin state logic High or Low.';
Blockly.Msg.ARD_DIGITALREAD = 'read digital pin#';
Blockly.Msg.ARD_DIGITALREAD_TIP = 'Read digital value on a pin: HIGH or LOW';
Blockly.Msg.ARD_DIGITALWRITE = 'set digitial pin#';
Blockly.Msg.ARD_WRITE_TO = 'to';
Blockly.Msg.ARD_DIGITALWRITE_TIP = 'Write digital value HIGH or LOW to a specific Port';
Blockly.Msg.ARD_BUILTIN_LED = 'set built-in LED';
Blockly.Msg.ARD_BUILTIN_LED_TIP = 'Light on or off for the built-in LED of the Arduino';
Blockly.Msg.ARD_DEFINE = 'Define';
Blockly.Msg.ARD_TONE_PIN = 'Tone PIN#';
Blockly.Msg.ARD_TONE_FREQ = 'frequency';
Blockly.Msg.ARD_TONE_PIN_TIP = 'Generate audio tones on a pin';
Blockly.Msg.ARD_NOTONE_PIN = 'No tone PIN#';
Blockly.Msg.ARD_NOTONE_PIN_TIP = 'Stop generating a tone on a pin';
Blockly.Msg.ARD_MAP = 'Map';
Blockly.Msg.ARD_MAP_VAL = 'value to [0-';
Blockly.Msg.ARD_MAP_TIP = 'Re-maps a number from [0-1024] to another.';
Blockly.Msg.ARD_FUN_RUN_SETUP = 'watchX run first:';
Blockly.Msg.ARD_FUN_RUN_LOOP = 'watchX loop forever:';
Blockly.Msg.ARD_FUN_RUN_TIP = 'Defines the Arduino setup() and loop() functions.';
Blockly.Msg.ARD_PIN_WARN1 = 'Pin %1 is needed for %2 as pin %3. Already used as %4.';
Blockly.Msg.ARD_SERIAL_SETUP = 'Setup';
Blockly.Msg.ARD_SERIAL_SPEED = ':  speed to';
Blockly.Msg.ARD_SERIAL_BPS = 'bps';
Blockly.Msg.ARD_SERIAL_SETUP_TIP = 'Selects the speed for a specific Serial peripheral';
Blockly.Msg.ARD_SERIAL_PRINT = 'print';
Blockly.Msg.ARD_SERIAL_PRINT_NEWLINE = 'add new line';
Blockly.Msg.ARD_SERIAL_PRINT_TIP = 'Prints data to the console/serial port as human-readable ASCII text.';
Blockly.Msg.ARD_SERIAL_PRINT_WARN = 'A setup block for %1 must be added to the workspace to use this block!';
Blockly.Msg.ARD_SERVO_WRITE = 'set SERVO from Pin';
Blockly.Msg.ARD_SERVO_WRITE_TO = 'to';
Blockly.Msg.ARD_SERVO_WRITE_DEG_180 = 'Degrees (0~180)';
Blockly.Msg.ARD_SERVO_WRITE_TIP = 'Set a Servo to an specified angle';
Blockly.Msg.ARD_SERVO_READ = 'read SERVO from PIN#';
Blockly.Msg.ARD_SERVO_READ_TIP = 'Read a Servo angle';
Blockly.Msg.ARD_SPI_SETUP = 'Setup';
Blockly.Msg.ARD_SPI_SETUP_CONF = 'configuration:';
Blockly.Msg.ARD_SPI_SETUP_SHIFT = 'data shift';
Blockly.Msg.ARD_SPI_SETUP_MSBFIRST = 'MSBFIRST';
Blockly.Msg.ARD_SPI_SETUP_LSBFIRST = 'LSBFIRST';
Blockly.Msg.ARD_SPI_SETUP_DIVIDE = 'clock divide';
Blockly.Msg.ARD_SPI_SETUP_MODE = 'SPI mode (idle - edge)';
Blockly.Msg.ARD_SPI_SETUP_MODE0 = '0 (Low - Falling)';
Blockly.Msg.ARD_SPI_SETUP_MODE1 = '1 (Low - Rising)';
Blockly.Msg.ARD_SPI_SETUP_MODE2 = '2 (High - Falling)';
Blockly.Msg.ARD_SPI_SETUP_MODE3 = '3 (High - Rising)';
Blockly.Msg.ARD_SPI_SETUP_TIP = 'Configures the SPI peripheral.';
Blockly.Msg.ARD_SPI_TRANS_NONE = 'none';
Blockly.Msg.ARD_SPI_TRANS_VAL = 'transfer';
Blockly.Msg.ARD_SPI_TRANS_SLAVE = 'to slave pin';
Blockly.Msg.ARD_SPI_TRANS_TIP = 'Send a SPI message to an specified slave device.';
Blockly.Msg.ARD_SPI_TRANS_WARN1 = 'A setup block for %1 must be added to the workspace to use this block!';
Blockly.Msg.ARD_SPI_TRANS_WARN2 = 'Old pin value %1 is no longer available.';
Blockly.Msg.ARD_SPI_TRANSRETURN_TIP = 'Send a SPI message to an specified slave device and get data back.';
Blockly.Msg.ARD_STEPPER_SETUP = 'Setup stepper motor';
Blockly.Msg.ARD_STEPPER_MOTOR = 'stepper motor:';
Blockly.Msg.ARD_STEPPER_DEFAULT_NAME = 'MyStepper';
Blockly.Msg.ARD_STEPPER_NUMBER_OF_PINS = 'Number of pins';
Blockly.Msg.ARD_STEPPER_TWO_PINS = '2';
Blockly.Msg.ARD_STEPPER_FOUR_PINS = '4';
Blockly.Msg.ARD_STEPPER_PIN1 = 'pin1#';
Blockly.Msg.ARD_STEPPER_PIN2 = 'pin2#';
Blockly.Msg.ARD_STEPPER_PIN3 = 'pin3#';
Blockly.Msg.ARD_STEPPER_PIN4 = 'pin4#';
Blockly.Msg.ARD_STEPPER_REVOLVS = 'how many steps per revolution';
Blockly.Msg.ARD_STEPPER_SPEED = 'set speed (rpm) to';
Blockly.Msg.ARD_STEPPER_SETUP_TIP = 'Configures a stepper motor pinout and other settings.';
Blockly.Msg.ARD_STEPPER_STEP = 'move stepper';
Blockly.Msg.ARD_STEPPER_STEPS = 'steps';
Blockly.Msg.ARD_STEPPER_STEP_TIP = 'Turns the stepper motor a specific number of steps.';
Blockly.Msg.ARD_STEPPER_COMPONENT = 'stepper';
Blockly.Msg.ARD_COMPONENT_WARN1 = 'A %1 configuration block with the same %2 name must be added to use this block!';
Blockly.Msg.ARD_TIME_DELAY = 'wait';
Blockly.Msg.ARD_TIME_MS = 'milliseconds';
Blockly.Msg.ARD_TIME_DELAY_TIP = 'Wait specific time in milliseconds';
Blockly.Msg.ARD_TIME_DELAY_MICROS = 'microseconds';
Blockly.Msg.ARD_TIME_DELAY_MICRO_TIP = 'Wait specific time in microseconds';
Blockly.Msg.ARD_TIME_MILLIS = 'current elapsed Time (milliseconds)';
Blockly.Msg.ARD_TIME_MILLIS_TIP = 'Returns the number of milliseconds since the Arduino board began running the current program. Has to be stored in a positive long integer';
Blockly.Msg.ARD_TIME_MICROS = 'current elapsed Time (microseconds)';
Blockly.Msg.ARD_TIME_MICROS_TIP = 'Returns the number of microseconds since the Arduino board began running the current program. Has to be stored in a positive long integer';
Blockly.Msg.ARD_TIME_INF = 'wait forever (end program)';
Blockly.Msg.ARD_TIME_INF_TIP = 'Wait indefinitely, stopping the program.';
Blockly.Msg.ARD_VAR_AS = 'as';
Blockly.Msg.ARD_VAR_AS_TIP = 'Sets a value to a specific type';
/// IO blocks - pulseIn - Block for function pulseIn(), it measure a pulse duration in a given pin.
Blockly.Msg.ARD_PULSE_READ = 'measure %1 pulse on pin #%2';
/// IO blocks - pulseIn - Block similar to ARD_PULSE_READ, but it adds a time-out in microseconds.
Blockly.Msg.ARD_PULSE_READ_TIMEOUT = 'measure %1 pulse on pin #%2 (timeout after %3 μs)';
/// IO blocks - pulseIn - Tooltip for pulseIn() block.
Blockly.Msg.ARD_PULSE_TIP = 'Measures the duration of a pulse on the selected pin.';
/// IO blocks - pulseIn - Tooltip for pulseIn() block when it uses the optional argument for time-out.
Blockly.Msg.ARD_PULSETIMEOUT_TIP = 'Measures the duration of a pulse on the selected pin, if it is within the time-out in microseconds.';
Blockly.Msg.ARD_SETTONE = 'Set tone on pin #';
Blockly.Msg.ARD_TONEFREQ = 'at frequency';
Blockly.Msg.ARD_TONE_TIP = 'Sets tone on pin to specified frequency within range 31 - 65535';
Blockly.Msg.ARD_TONE_WARNING = 'Frequency must be in range 31 - 65535';
Blockly.Msg.ARD_NOTONE = 'Turn off tone on pin #';
Blockly.Msg.ARD_NOTONE_TIP = 'Turns the tone off on the selected pin';

/**
 * Ardublockly instances
 */
/// Instances - Menu item to indicate that it will create a new instance
Blockly.Msg.NEW_INSTANCE = 'New instance...';
/// Instances - Menu item to rename an instance name
Blockly.Msg.RENAME_INSTANCE = 'Rename instance...';
/// Instances - Menu item to create a new instance name and apply it to that block
Blockly.Msg.NEW_INSTANCE_TITLE = 'New instance name:';
/// Instances - Confirmation message that a number of instances will be renamed to a new name
Blockly.Msg.RENAME_INSTANCE_TITLE = 'Rename all "%1" instances to:';

// watchx ...
Blockly.Msg.WX_TURN_LED = 'Turn LED';
Blockly.Msg.WX_TO = 'to';
Blockly.Msg.WX_TURN_LED_TIPS = 'Selected light on or off for the built-in LED of the watchX.';
Blockly.Msg.WX_LED_BRIGHTNESS = 'LED brightness';
Blockly.Msg.WX_LED_BRIGHTNESS_TIP = 'Selected light on or off with brightness control.';
Blockly.Msg.WX_LED_LEVEL = ' level ';
Blockly.Msg.WX_OLED_WRITE = 'Display write';
Blockly.Msg.WX_OLED_WRITE_LINE = 'line';
Blockly.Msg.WX_OLED_WRITE_ALIGN = 'align';
Blockly.Msg.WX_PX = 'X';
Blockly.Msg.WX_PY = 'Y';
Blockly.Msg.WX_OLED_WRITE_LINE_TIP = 'Displays the data on the watchX display, sets the line within range 1 - 8, aligns the text left, centered or right.  ';
Blockly.Msg.WX_OLED_WRITE_POS_TIP = 'Displays the data on the watchX display, X lateral position within range 0 - 127, Y vertical position within range 0 - 63.';
Blockly.Msg.WX_DRAW_PIXEL = 'Draw pixel';
Blockly.Msg.WX_DRAW_PIXEL_TIP = 'Draws a single pixel at the given X - Y position. X lateral position within range 0 - 127, Y vertical position within range 0 - 63.';
Blockly.Msg.WX_DRAW_LINE = 'Draw line';
Blockly.Msg.WX_DRAW_LINE_TIP = 'Draws a line. X1 and Y1 start point of the line, X2 and Y2 finis point of the line. X lateral position within range 0 - 127, Y vertical position within range 0 - 63.';
Blockly.Msg.WX_DRAW_BATTERY_LEVEL = 'Draw battery level';
Blockly.Msg.WX_DRAW_BATTERY_LEVEL_TIP = 'Draws a battery icon at the given X - Y position with percent indicates battery fullness. X lateral position within range 0 - 127, Y vertical position within range 0 - 63.';
Blockly.Msg.WX_PERCENT = 'percent';
Blockly.Msg.WX_OLED_BRIGHTNESS = 'Display brightness';
Blockly.Msg.WX_OLED_BRIGHTNESS_TIP = 'Sets the display brightness high or low. High setting is for better visibility, low setting is for low power consumption.';
Blockly.Msg.WX_DRAW_USB_ICON = 'Display USB icon';
Blockly.Msg.WX_DRAW_USB_ICON_TIP = 'Displays the USB icon at the given X - Y position. X lateral position within range 0 - 127, Y vertical position within range 0 - 63.';
Blockly.Msg.WX_DRAW_CHARGE_ICON = 'Display charge icon';
Blockly.Msg.WX_DRAW_CHARGE_ICON_TIP = 'Displays the charge icon at the given X - Y position. X lateral position within range 0 - 127, Y vertical position within range 0 - 63.';
Blockly.Msg.WX_OLED_CLEAR_ALL = 'Display clear display';
Blockly.Msg.WX_OLED_CLEAR_ALL_TIP = 'Clears any data on the display.';
Blockly.Msg.WX_OLED_POWER = 'Display power';
Blockly.Msg.WX_OLED_POWER_TIP = 'Turns the display on or off. High to turn on, low to turn off.';
Blockly.Msg.WX_SET_DATE = 'Set date';
Blockly.Msg.WX_DAY = 'day';
Blockly.Msg.WX_MONTH = 'month';
Blockly.Msg.WX_YEAR = 'year';
Blockly.Msg.WX_HOUR = 'hour';
Blockly.Msg.WX_MINUTE = 'minute';
Blockly.Msg.WX_SECOND = 'second';
Blockly.Msg.WX_SET_DATE_TIP = 'Sets the given date and time to the watchX time unit.';
Blockly.Msg.WX_CURRENT_TIME = 'Current date & time';
Blockly.Msg.WX_CURRENT_TIME_TIP = 'Sets the computers date and time to the watchX time unit. ';
Blockly.Msg.WX_GET = 'get';
Blockly.Msg.WX_GET_TIME_TIP = 'Gets the current date/time unit from the watchX time unit.';
Blockly.Msg.WX_LINE = 'line';
Blockly.Msg.WX_PRINT_TIME = 'Display time';
Blockly.Msg.WX_PRINT_TIME_LINE_TIP = 'Displays the hour, minute and second with a big font, sets the line within range 1 - 8.';
Blockly.Msg.WX_PRINT_TIME_POS_TIP = 'isplays the hour, minute and second with a big font at the given X - Y position. X lateral position within range 0 - 127, Y vertical position within range 0 - 63.';
Blockly.Msg.WX_ALTITUDE = 'altitude';
Blockly.Msg.WX_PRESSURE = 'pressure';
Blockly.Msg.WX_TEMPERATURE = 'temperature';
Blockly.Msg.WX_GET_BMP = 'get';
Blockly.Msg.WX_GET_BMP_TIP = 'Gets the selected altitude, pressure or temperature value from the built in BMP280 sensor. Altitude in meters, pressure in Pascal, temperature in celsius.';
Blockly.Msg.WX_GET_MAG = 'get MAG3110';
Blockly.Msg.WX_GET_MAG_TIP = 'Gets the magnetic field data from the built in MAG3110 sensor. Magnetic field in micro tesla(uT). This sensor replaced with MLX90393 sensor in watchX v1.3 and later.';
Blockly.Msg.WX_GET_MLX = 'get Magnetometer';
Blockly.Msg.WX_GET_MLX_TIP = 'Gets the magnetic field data from the built in MLX90393 sensor with filterin option for better sensebility. Magnetic field in micro tesla(uT).';
Blockly.Msg.WX_FILTER = 'filter';
Blockly.Msg.WX_GET_MPU_ANGLE = 'get IMU angle';
Blockly.Msg.WX_GET_MPU_ANGLE_TIP = 'Gets the angle between ground and watchX from the built in MPU6050 sensor. X is pitch angle and Y is roll angle.';
Blockly.Msg.WX_GET_MPU_ACCEL = 'get IMU acceleration';
Blockly.Msg.WX_GET_MPU_ACCEL_TIP = 'Gets the acceleration data from the built in MPU6050 sensor in meters per second square.';
Blockly.Msg.WX_FREE_FALL_DETECTED = 'detect free fall';
Blockly.Msg.WX_FREE_FALL_DETECTED_TIP = 'Detects free fall using the built in MPU6050 sensor. Adjusts the sensitivity using treshold and duration values.';
Blockly.Msg.WX_THRESHOLD = 'threshold';
Blockly.Msg.WX_DURATION = 'duration';
Blockly.Msg.WX_DETECT_MOTION = 'detect motion';
Blockly.Msg.WX_DETECT_MOTION_TIP = 'Detects motion using the built in MPU6050 sensor. Adjusts the sensitivity using treshold and duration values.';
Blockly.Msg.WX_BZR_PLAY_NOTE = 'Play tone note';
Blockly.Msg.WX_BZR_PLAY_NOTE_TIP = 'Plays the selected note on the built in buzzer. Beat sets the duration of the note.';
Blockly.Msg.WX_BEAT = 'beat';
Blockly.Msg.WX_PLAY_FREQ = 'Play frequency';
Blockly.Msg.WX_PLAY_FREQ_TIP = 'Sets tone on built in buzzer, frequency within range 31 - 65535';
Blockly.Msg.WX_READ_BUTTON = 'read button';
Blockly.Msg.WX_READ_BUTTON_TIP = 'Gets the status of the button weather it is pressed or not. Returns true if pressed.';
Blockly.Msg.WX_READ_GPAD = 'read G-Pad button';
Blockly.Msg.WX_READ_GPAD_TIP = 'Gets the status of the Game pad button weather it is pressed or not. Returns true if pressed.';
Blockly.Msg.WX_GET_BATTERY_VOLTAGE = 'get battery voltage (V)';
Blockly.Msg.WX_GET_BATTERY_VOLTAGE_TIP = 'Measures the battery voltage in Volts.';
Blockly.Msg.WX_GET_BATTERY_PERCENT = 'get battery voltage (%)';
Blockly.Msg.WX_GET_BATTERY_PERCENT_TIP = 'Measures the battery voltage and returns a value between 0 - 100.';
Blockly.Msg.WX_CHARGE_COMPLETE = 'detect charge complete';
Blockly.Msg.WX_CHARGE_COMPLETE_TIP = 'Checks the charge complete status of the watchX battery while charging. Returns true if the battery is fully charged.';
Blockly.Msg.WX_CHECK_USB_CONNECTION = 'check USB connection';
Blockly.Msg.WX_CHECK_USB_CONNECTION_TIP = 'Returns true if the watchX is connected to a USB source.';
Blockly.Msg.WX_SLEEP_AND_WAKE_BUTTON = 'sleep and wake on button';
Blockly.Msg.WX_SLEEP_AND_WAKE_BUTTON_TIP = 'Sleeps when the block executed, wakes up when stated button pressed.';
Blockly.Msg.WX_SLEEP_AND_WAKE_TIMER = 'sleep and wake on time';
Blockly.Msg.WX_SLEEP_AND_WAKE_TIMER_TIP = 'Sleeps and wakes on stated intervals.';
Blockly.Msg.WX_INTERVALS = 'intervals';
Blockly.Msg.WX_BLUETOOTH = 'Bluetooth';
Blockly.Msg.WX_ID = 'id';
Blockly.Msg.WX_INIT = 'init';
Blockly.Msg.WX_BLUETOOTH_INIT_TIP = 'Sets the bluetooth module in different mods. Id allows to give a unique Bluetooth device name.';
Blockly.Msg.WX_BLUETOOTH_SEND = 'Bluetooth send';
Blockly.Msg.WX_BLUETOOTH_SEND_TIP = 'Sends the given data over Bluetoth.';
Blockly.Msg.WX_BLUETOOTH_RECV = 'bluetooth receive text';
Blockly.Msg.WX_BLUETOOTH_RECV_TIP = 'Receives data from the connected Bluetooth device.';
Blockly.Msg.WX_BLE_KEY_PRESS = 'Bluetooth key press';
Blockly.Msg.WX_BLE_KEY_PRESS_TIP = 'Acts as a Bluetooth keyboard, sends a keyboard key stroke.';
Blockly.Msg.WX_BLE_MEDIA_CONTROL = 'Bluetooth media control';
Blockly.Msg.WX_BLE_MEDIA_CONTROL_TIP = 'Allows media control when connected to a PC or phone.';
Blockly.Msg.WX_PLAY_PAUSE = 'Play/Pause';
Blockly.Msg.WX_NEXT = 'Next';
Blockly.Msg.WX_PREVIOUS = 'Previous';
Blockly.Msg.WX_VOLUME_UP = 'Volume+';
Blockly.Msg.WX_VOLUME_DOWN = 'Volume-';
Blockly.Msg.WX_LEFT = 'Left';
Blockly.Msg.WX_RIGHT = 'Right';
Blockly.Msg.WX_PRESSED = 'Pressed';
Blockly.Msg.WX_RELEASE = 'Release';
Blockly.Msg.WX_BLE_MOUSE_CONTROL = 'Bluetooth mouse button';
Blockly.Msg.WX_BLE_MOUSE_CONTROL_TIP = 'Allows to send Bluetooth mouse click.';
Blockly.Msg.WX_INPUT_DOWN = 'Read button once';
Blockly.Msg.WX_INPUT_DOWN_TIP = 'Gets the status of the button, single-shot pressed-on time duration. Delivers input value (state) after it has been stable.';
