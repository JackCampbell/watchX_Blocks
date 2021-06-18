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
	rtc->rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
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

void wx_mag_get_value(wx_mag_t *mag) {
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
	mlx->mlx.setOversampling(0);
	mlx->mlx.setFilter(filter);
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

struct key_state_t {
    int pin;
    int count;
    bool impulse, down;
} keys[3] = {
    { WX_BTN_B1, 0, false, false},
    { WX_BTN_B2, 0, false, false},
    { WX_BTN_B3, 0, false, false}
};