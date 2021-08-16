#include "watchX.h"
#pragma hdrstop

unsigned char animation_offsetY = 0;
// OLED
void wx_oled_init(wx_oled_t *oled) {
	ssd1306_configure();
	clearAll();
	oled->need_clear = false;
}
void wx_oled_update(wx_oled_t *oled) {
	if(oled->need_clear == false) {
		return;
	}
    ssd1306_drawBuffer(0, 0, 128, 64, mbuf);
    clearAll();
    oled->need_clear = false;
}
void wx_oled_power(wx_oled_t *oled, int state) {
	if(state == HIGH) {
		ssd1306_sendCommand(SSD1306_DISPLAYON);
	} else {
		ssd1306_sendCommand(SSD1306_DISPLAYOFF);
	}
}
void wx_write_text_line(wx_oled_t *oled, int line, int align, String str) {
	int y = line * 8;
	int x = (64 - (str.length() * 3)) * align;
	drawString(x, y, str.c_str(), smallFont);
	oled->need_clear = true;
}
void wx_write_text_pos(wx_oled_t *oled, int x, int y, String str) {
	drawString(x, y, str.c_str(), smallFont);
	oled->need_clear = true;
}
void wx_draw_pixel(wx_oled_t *oled, int x, int y) {
	drawPixel(x, y);
	oled->need_clear = true;
}
void wx_draw_line(wx_oled_t *oled, int x1, int y1, int x2, int y2) {
	drawLine(x1, y1, x2, y2);
	oled->need_clear = true;
}
void wx_draw_battery_icon(wx_oled_t *oled, int x, int y, int level) {
	draw_bitmap(x, y, watchXui + (unsigned)( ( ( level ) / 40 ) * 16 ), 16, 8, false, 0);
	oled->need_clear = true;
}
void wx_brightness(wx_oled_t *oled, int level) {
	if(level == HIGH) {
		ssd1306_sendCommand(255);
	} else {
		ssd1306_sendCommand(0);
	}
	// oled->need_clear = true;
}
void wx_draw_usb_connect(wx_oled_t *oled, int x, int y) {
	draw_bitmap(x, y, watchXui + 80, 16, 8, false, 0);
	oled->need_clear = true;
}
void wx_draw_charge_state(wx_oled_t *oled, int x, int y) {
	draw_bitmap( x, y, watchXui + 64, 8, 8, false, 0);
	oled->need_clear = true;
}
void wx_clear_all(wx_oled_t *oled) {
	clearAll();
	oled->need_clear = true;
}

void wx_print_time(wx_oled_t *oled, wx_rtc_t *rtc, int line, int align) {
	const int pos_y = 20 * align;
	draw_bitmap( line, pos_y, font_mid + ( ( rtc->hour / 10 ) * 57 ), 19, 24, false, 0);
	draw_bitmap( line + 21, pos_y, font_mid + ( ( rtc->hour % 10 ) * 57 ), 19, 24, false, 0);
	draw_bitmap( line + 44, pos_y, watchXui + 144, 6, 24, false, 0);
	draw_bitmap( line + 54, pos_y, font_mid + ( ( rtc->minute / 10 ) * 57 ), 19, 24, false, 0);
	draw_bitmap( line + 75, pos_y, font_mid + ( ( rtc->minute % 10 ) * 57), 19, 24, false, 0);
	draw_bitmap( line + 97, pos_y, small2Font + ( ( ( rtc->second % 60 ) / 10 ) * 22 ), 11,  16, false, 0);
	draw_bitmap( line + 109, pos_y, small2Font + ( ( rtc->second % 10 ) * 22 ), 11,  16, false, 0);
	oled->need_clear = true;
}
void wx_print_time(wx_oled_t *oled, wx_rtc_t *rtc, int type, int x, int y) {
	if(type == WX_DRAW_TIME_HOUR) {
		draw_bitmap( x, y, font_mid + ( ( rtc->hour / 10 ) * 57), 19, 24, false, 0);
        draw_bitmap( x + 21, y, font_mid + ( ( rtc->hour % 10 ) * 57), 19, 24, false, 0);
	} else if(type == WX_DRAW_TIME_MINUTE) {
		draw_bitmap( x, y, font_mid + ( ( rtc->minute / 10 ) * 57 ), 19, 24, false, 0);
		draw_bitmap( x + 21, y, font_mid + ( ( rtc->minute % 10 ) * 57 ), 19, 24, false, 0);
	} else if(type == WX_DRAW_TIME_SECORD) {
		draw_bitmap( x, y, small2Font + ( ( ( rtc->second % 60 ) / 10) * 22), 11,  16, false, 0);
		draw_bitmap( x + 12, y, small2Font + ( ( rtc->second % 10 ) * 22), 11,  16, false, 0);
	}
	oled->need_clear = true;
}

void wx_rtc_init(wx_rtc_t *rtc) {
	rtc->rtc.begin();
#if 1
	rtc->rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
#else
	rtc->rtc.adjust( now() );
#endif
	wx_rtc_update(rtc); // update ...
}
void wx_rtc_init(wx_rtc_t *rtc, int year, int month, int day, int hour, int minute, int second) {
	DateTime date(year, month, day, hour, minute, second);
    rtc->rtc.begin();
    rtc->rtc.adjust(date);
    wx_rtc_update(rtc); // update ...
}
void wx_rtc_update(wx_rtc_t *rtc) {
	DateTime now = rtc->rtc.now();
	rtc->year = now.year();
	rtc->month = now.month();
	rtc->day = now.day();
	rtc->hour = now.hour();
	rtc->minute = now.minute();
	rtc->second = now.second();
}
int  wx_rtc_get_value(wx_rtc_t *rtc, int key) {
	switch(key) {
		case WX_RTC_YEAR: return rtc->year;
		case WX_RTC_MONTH: return rtc->month;
		case WX_RTC_DAY: return rtc->day;
		case WX_RTC_HOUR: return rtc->hour;
		case WX_RTC_MINUTE: return rtc->minute;
		case WX_RTC_SECOND: return rtc->second;
		default:
			break;
	}
	return 0;
}


void  wx_bmp_init(wx_bmp_t *bmp) {
	bmp->bme.begin();
	bmp->altitude = 0;
	bmp->pressure = 0;
	bmp->temperature = 0;
}
void  wx_bmp_update(wx_bmp_t *bmp) {
	bmp->altitude = bmp->bme.readAltitude(1013.25f);
	bmp->pressure = bmp->bme.readPressure();
	bmp->temperature = bmp->bme.readTemperature();
}
float wx_bmp_get_value(wx_bmp_t *bmp, int key) {
	switch(key) {
		case WX_BMP_ALTITUDE: return bmp->altitude;
		case WX_BMP_PRESSURE: return bmp->pressure;
		case WX_BMP_TEMPERATURE: return bmp->temperature;
		default: break;
	}
	return 0.0f;
}

void wx_mag_init(wx_mag_t *mag) {
	mag->mag.initialize();
}

bool wx_mag_get_value(wx_mag_t *mag) {
	return mag->heading;
}

void wx_mag_update(wx_mag_t *mag) {
	mag->heading = mag->mag.readHeading();
	if(mag->mag.isCalibrated()) {
        return;
    }
    if(mag->mag.isCalibrating()) {
        mag->mag.calibrate();
    } else {
        mag->mag.enterCalMode();
    }
}

void wx_mlx_init(wx_mlx_t *mlx, int filter) {
	mlx->mlx.begin_I2C();
	mlx->mlx.setOversampling( (mlx90393_oversampling)0 );
	mlx->mlx.setFilter( (mlx90393_filter)filter );
}

void wx_mlx_update(wx_mlx_t *mlx) {
	mlx->mlx.readData(&mlx->mx, &mlx->my, &mlx->mz);
}

int  wx_mlx_get_value(wx_mlx_t *mlx, int key) {
	switch(key) {
		case WX_MLX_DX: return mlx->mx;
		case WX_MLX_DY: return mlx->my;
		case WX_MLX_DZ: return mlx->mz;
		default:
			break;
	}
	return 0;
}

// module

bool wx_mpu_t::fall_detected = false;
bool wx_mpu_t::motion_detected = false;

void wx_mpu_init(wx_mpu_t *mpu) {
	mpu->mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G);
}


void wx_mpu_update(wx_mpu_t *mpu) {
	Vector normAccel = mpu->mpu.readNormalizeAccel();
	mpu->angle_x = -(atan2(normAccel.XAxis, sqrt(normAccel.YAxis * normAccel.YAxis + normAccel.ZAxis * normAccel.ZAxis)) * 180.0) / M_PI;
	mpu->angle_y = (atan2(normAccel.YAxis, normAccel.ZAxis) * 180.0) / M_PI;
	mpu->angle_z = normAccel.ZAxis;
	mpu->accel_x = normAccel.XAxis;
	mpu->accel_y = normAccel.YAxis;
	mpu->accel_z = normAccel.ZAxis;
}

int  wx_mpu_get_value(wx_mpu_t *mpu, int key) {
	switch(key) {
        case WX_MPU_ANGLE_X: return mpu->angle_x;
        case WX_MPU_ANGLE_Y: return mpu->angle_y;
        case WX_MPU_ANGLE_Z: return mpu->angle_z;
        case WX_MPU_ACCEL_X: return mpu->accel_x;
        case WX_MPU_ACCEL_Y: return mpu->accel_y;
        case WX_MPU_ACCEL_Z: return mpu->accel_z;
        default: break;
    }
    return 0;
}

void fall_detected_int() {
	wx_mpu_t::fall_detected = true;
}
void wx_mpu_init_fall(wx_mpu_t *mpu, int threshold, int duration) {
	mpu->mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G);
	mpu->mpu.setAccelPowerOnDelay(MPU6050_DELAY_3MS);
	mpu->mpu.setIntFreeFallEnabled(true);
	mpu->mpu.setIntZeroMotionEnabled(false);
	mpu->mpu.setIntMotionEnabled(false);
	mpu->mpu.setDHPFMode(MPU6050_DHPF_5HZ);
	mpu->mpu.setFreeFallDetectionThreshold(threshold);
	mpu->mpu.setFreeFallDetectionDuration(duration);
	attachInterrupt(4, fall_detected_int, RISING);
}

bool wx_mpu_fall_detected(wx_mpu_t *mpu) {
	return wx_mpu_t::fall_detected;
}

void wx_mpu_clear_fall(wx_mpu_t *mpu) {
	wx_mpu_t::fall_detected = false;
}

void motion_detected_int() {
	wx_mpu_t::motion_detected = true;
}

void wx_mpu_init_motion(wx_mpu_t *mpu, int threshold, int duration) {
    mpu->mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G);
    mpu->mpu.setAccelPowerOnDelay(MPU6050_DELAY_3MS);
    mpu->mpu.setIntFreeFallEnabled(false);
    mpu->mpu.setIntZeroMotionEnabled(false);
    mpu->mpu.setIntMotionEnabled(true);
    mpu->mpu.setDHPFMode(MPU6050_DHPF_5HZ);
    mpu->mpu.setMotionDetectionThreshold(threshold);
    mpu->mpu.setMotionDetectionDuration(duration);
    mpu->mpu.setZeroMotionDetectionThreshold(4);
    mpu->mpu.setZeroMotionDetectionDuration(2);
    attachInterrupt(4, motion_detected_int, RISING);
}

bool wx_mpu_motion_detected(wx_mpu_t *mpu) {
	return wx_mpu_t::motion_detected;
}

void wx_mpu_clear_motion(wx_mpu_t *mpu) {
	wx_mpu_t::motion_detected = false;
}

void wx_init_bat(wx_bat_t *bat) {
	pinMode(WX_BAT_EN, OUTPUT);
	pinMode(WX_BAT_PIN, INPUT);
	pinMode(WX_BAT_DET, INPUT);
	bat->charge_status = false;
	bat->voltage = 0.0f;
	bat->percent = 0;
}

int wx_clamp(int value, int min, int max) {
	if(value < min) {
		return min;
	} else if(value > max) {
		return max;
	}
	return value;
}

void wx_update_bat(wx_bat_t *bat) {
	int value;
    float voltage, divider;
	const float min = 3.4f, max = 4.2f;
    divider = WX_BAT_R2 / float(WX_BAT_R1 + WX_BAT_R2);

    digitalWrite(WX_BAT_EN, HIGH);
    delay(50);
    value = analogRead(WX_BAT_PIN);
    delay(50);
    digitalWrite(WX_BAT_EN, LOW);

    voltage = ((float(value) / 1024) * 3.35f) / divider;
	int percent = int(((voltage - min) * 100) / (max - min));

	if(digitalRead(WX_BAT_DET) == HIGH) {
		bat->charge_status = true;
	} else {
		bat->charge_status = false;
	}
	bat->percent = wx_clamp(percent, 0, 100);
	bat->voltage = voltage;
}

float wx_get_bat_voltage(wx_bat_t *bat) {
	return bat->voltage;
}

int wx_get_bat_percent(wx_bat_t *bat) {
	return bat->percent;
}

bool wx_get_charge_status(wx_bat_t *bat) {
	return bat->charge_status;
}


void wx_init_usb(wx_usb_t *usb) {
	usb->connected = false;
	usb->voltage = false;
	usb->is_update = false;
	usb->weak_pin = 11;
}

void wx_init_usb(wx_usb_t *usb, int pin) {
	USBCON |= ( 1 << OTGPADE );
	if(pin != -1) {
		pinMode(pin, INPUT_PULLUP);
		usb->weak_pin = pin;
	}	
	wx_init_usb(usb);
}

void wx_update_usb(wx_usb_t *usb) {
	usb->voltage = ( USBSTA & ( 1 << VBUS ) );
	usb->connected = (UDADDR & _BV(ADDEN)) != 0;
	usb->is_update = true;
}

bool wx_get_usb_connected(wx_usb_t *usb) {
	if(usb->is_update == false) {
		wx_update_usb(usb);
	}
	return usb->connected;
}

void wx_wake_from_button() {}

void wx_sleep_and_weak_on_button(wx_usb_t *usb) {
	if(usb->is_update == false) {
		wx_update_usb(usb);
	}
	if(usb->connected) {
		return;
	}
	int inter = digitalPinToPinChangeInterrupt(usb->weak_pin);
	power_adc_disable();
	set_sleep_mode(SLEEP_MODE_PWR_DOWN);
	sleep_enable();
	attachPinChangeInterrupt(inter, wx_wake_from_button, FALLING);
	sleep_cpu();
	sleep_disable();
	detachPinChangeInterrupt(inter);
	power_adc_enable();
}

void wx_sleep_and_weak_on_timer(wx_usb_t *usb, long time) {
	if(usb->is_update == false) {
		wx_update_usb(usb);
	}
	if(usb->voltage) {
		return;
	}
	Watchdog.sleep(time);
	USBDevice.attach();
}


void wx_init_ble_transceiver(wx_ble_t *ble, int id) {
	char name[64];
	sprintf_P(name, PSTR("AT+GAPDEVNAME=watchX_%d") , id);
	
	ble->ble.begin(VERBOSE_MODE);
	if( FACTORYRESET_ENABLE ){
		ble->ble.factoryReset();
	}
	ble->ble.echo(false);
	ble->ble.verbose(false);
	ble->ble.setMode(BLUEFRUIT_MODE_DATA);
	ble->ble.sendCommandCheckOK( name );
	delay(100);
	ble->ble.reset();
}

void wx_ble_write_text(wx_ble_t *ble, String str) {
	ble->ble.print(str);
}

void wx_update_ble(wx_ble_t *ble) {
	String result;
	while( ble->ble.available() ) {
		int c = ble->ble.read();
		result.concat( (char)c );
	}
	result.trim();
	if(result.length() > 0) {
		ble->recv = result;
	}
}

String wx_ble_read_text(wx_ble_t *ble) {
	return ble->recv;
}

void wx_init_ble_bt_keyboard(wx_ble_t *ble, int id) {
    char name[64];
    sprintf_P(name, PSTR("AT+GAPDEVNAME=watchX_%d") , id);

    ble->ble.begin(VERBOSE_MODE);
    if( FACTORYRESET_ENABLE ){
        ble->ble.factoryReset();
    }
    ble->ble.echo(false);
    ble->ble.verbose(false);
    ble->ble.sendCommandCheckOK(F("AT+BleHIDEn=On"));
    ble->ble.sendCommandCheckOK(F("AT+BleKeyboardEn=On"));
    ble->ble.sendCommandCheckOK( name );
    delay(100);
    ble->ble.reset();
}


void wx_ble_send_keys(wx_ble_t *ble, const char *key) {
	ble->ble.print("AT+BleKeyboard=");
	ble->ble.println(key);
}


void wx_init_ble_hid_control(wx_ble_t *ble, int id) {
    char name[64];
    sprintf_P(name, PSTR("AT+GAPDEVNAME=watchX_%d") , id);

    ble->ble.begin(VERBOSE_MODE);
    if( FACTORYRESET_ENABLE ){
        ble->ble.factoryReset();
    }
    ble->ble.echo(false);
    ble->ble.verbose(false);
    ble->ble.sendCommandCheckOK(F("AT+BleHIDEn=On"));
    ble->ble.sendCommandCheckOK( name );
    delay(100);
    ble->ble.reset();
}

void wx_ble_media_control(wx_ble_t *ble, int cmd) {
	switch(cmd){
		case 0:
		ble->ble.sendCommandCheckOK(F("AT+BLEHIDCONTROLKEY=PLAYPAUSE"));
		break;
		case 1:
		ble->ble.sendCommandCheckOK(F("AT+BLEHIDCONTROLKEY=MEDIANEXT"));
		break;
		case 2:
		ble->ble.sendCommandCheckOK(F("AT+BLEHIDCONTROLKEY=MEDIAPREVIOUS"));
		break;
		case 3:
		ble->ble.sendCommandCheckOK(F("AT+BLEHIDCONTROLKEY=VOLUME+"));
		break;
		case 4:
		ble->ble.sendCommandCheckOK(F("AT+BLEHIDCONTROLKEY=VOLUME-"));
		break;
	}
}

void wx_ble_mouse_control(wx_ble_t *ble, int button, int state) {
	if(state == 0) {
		ble->ble.sendCommandCheckOK(F("AT+BleHidMouseButton=0"));
	} else if(button == 0) {
		ble->ble.sendCommandCheckOK(F("AT+BleHidMouseButton=L,press"));
	} else if(button == 1) {
		ble->ble.sendCommandCheckOK(F("AT+BleHidMouseButton=R,press"));
	}
}

extern void update_env();

void wx_delay(unsigned long delay) {
    long endTime = millis() + delay;
    while(millis() < endTime) {
        update_env();
    }
}

void wx_delay_sec(float seconds) {
    long endTime = millis() + seconds * 1000;
    while(millis() < endTime) {
        update_env();
    }
}




void wx_key_init(key_state_t *key, int pin, int bit) {
	key->pin = pin;
	key->down = 0;
	key->impulse = 0;
	key->count = 0;
	key->bit = bit;
	pinMode(pin, INPUT_PULLUP);
}

void wx_key_state(key_state_t *key) {
	int state = digitalRead(key->pin);
	if(state == LOW && key->down == 0) {
	    key->down = 1;
	    key->impulse = 0;
	    key->count = 0;
	} else if(state == LOW && key->down == 0) {
	    key->count++;
	} else if(state == HIGH && key->down == 1) {
	    key->down = 0;
	    key->impulse = 1;
	}
}

int wx_key_impulse(key_state_t *key) {
	int state = 0;
	if(key->impulse == 1) {
	    state |= key->bit;
	}
	key->impulse = 0;
	// key->down = false;
	key->count = 0;
	return state;
}



void wx_init_input(wx_input_t *input) {
	wx_key_init( &input->btn1, WX_BTN_B1, KEY_B1 );
	wx_key_init( &input->btn2, WX_BTN_B2, KEY_B2 );
	wx_key_init( &input->btn3, WX_BTN_B3, KEY_B3 );
	input->state = 0;
}

void wx_update_input(wx_input_t *input) {
	wx_key_state( &input->btn1 );
	wx_key_state( &input->btn2 );
	wx_key_state( &input->btn3 );
    // --------------
    input->state = 0;
    input->state |= wx_key_impulse( &input->btn1 );
    input->state |= wx_key_impulse( &input->btn2 );
    input->state |= wx_key_impulse( &input->btn3 );
}

