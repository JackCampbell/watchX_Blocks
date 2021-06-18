#include "Adafruit_Sensor.h"
#include "Adafruit_BMP280.h"
#include "SparkFun_MAG3110.h"
#include "RTClib.h"
#include "MPU6050.h"
#include "oled.h"
#include "resources.h"
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "Adafruit_MLX90393.h"
#include "BluefruitConfig.h"
//#include "ML"
#include <SPI.h>
#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#pragma once

#define BUILD_LED_R     6
#define BUILD_LED_L     13

#define WX_BTN_B1	8
#define WX_BTN_B2	10
#define WX_BTN_B3	10

#define BIT(x) (1 << (x))
#define PREV_INDEX(x, m) ((m + x - 1) % m)
#define NEXT_INDEX(x, m) ((x + 1) % m)

enum WX_DRAW_TIME {
	WX_DRAW_TIME_HOUR,
	WX_DRAW_TIME_MINUTE,
	WX_DRAW_TIME_SECORD
};
struct wx_oled_t {
	bool                need_clear;
	// TODO extra data...
};
void wx_oled_init(wx_oled_t *oled);
void wx_oled_update(wx_oled_t *oled);
void wx_oled_power(wx_oled_t *oled, int state);
void wx_brightness(wx_oled_t *oled, int level);
void wx_write_text_line(wx_oled_t *oled, int line, int align, String str);
void wx_write_text_pos(wx_oled_t *oled, int line, int align, String str);
void wx_draw_pixel(wx_oled_t *oled, int x, int y);
void wx_draw_line(wx_oled_t *oled, int x1, int y1, int x2, int y2);
void wx_draw_battery_icon(wx_oled_t *oled, int x, int y, int level);
void wx_draw_usb_connect(wx_oled_t *oled, int x, int y);
void wx_draw_charge_state(wx_oled_t *oled, int x, int y);
void wx_clear_all(wx_oled_t *oled);

enum WX_RTC {
	WX_RTC_YEAR,
	WX_RTC_MONTH,
	WX_RTC_DAY,
	WX_RTC_HOUR,
	WX_RTC_MINUTE,
	WX_RTC_SECOND,
	WX_RTC_TIME
};
struct wx_rtc_t {
	RTC_DS3231  rtc;
	int         year, month, day;
	int         hour, minute, second;
};
void wx_rtc_init(wx_rtc_t *rtc);
void wx_rtc_init(wx_rtc_t *rtc, int year, int month, int day, int hour, int minute, int second);
void wx_rtc_update(wx_rtc_t *rtc);
int wx_rtc_get_value(wx_rtc_t *rtc, int key);

void wx_print_time(wx_oled_t *oled, wx_rtc_t *rtc, int line, int align);
void wx_print_time(wx_oled_t *oled, wx_rtc_t *rtc, int type, int x, int y);

struct wx_bmp_t {
	Adafruit_BMP280 bme;
	float       altitude;
	float       pressure;
	float       temperature;
};
enum WX_BMP {
	WX_BMP_ALTITUDE,
	WX_BMP_PRESSURE,
	WX_BMP_TEMPERATURE
};
void wx_bmp_init(wx_bmp_t *bmp);
void wx_bmp_update(wx_bmp_t *bmp);
float wx_bmp_get_value(wx_bmp_t *bmp, int key);

struct wx_mag_t {
	MAG3110     mag;
	float       heading;
};
void wx_mag_init(wx_mag_t *mag);
void wx_mag_update(wx_mag_t *mag);
void wx_mag_get_value(wx_mag_t *mag);


enum WX_MLX {
	WX_MLX_DX,
	WX_MLX_DY,
	WX_MLX_DZ
};
struct wx_mlx_t {
	Adafruit_MLX90393   mlx;
	float               mx, my, mz;
};
void wx_mlx_init(wx_mlx_t *mlx, int filter);
void wx_mlx_update(wx_mlx_t *mlx);
int  wx_mlx_get_value(wx_mlx_t *mlx, int key);


enum WX_MPU {
	WX_MPU_ANGLE_X,
	WX_MPU_ANGLE_Y,
	WX_MPU_ANGLE_Z,
	WX_MPU_ACCEL_X,
	WX_MPU_ACCEL_Y,
	WX_MPU_ACCEL_Z
};
struct wx_mpu_t {
	MPU6050					mpu;
	float					angle_x, angle_y, angle_z;
	float					accel_x, accel_y, accel_z;
	static bool				fall_detected;
	static bool				motion_detected;
};
void wx_mpu_init(wx_mpu_t *mpu);
void wx_mpu_update(wx_mpu_t *mpu);
int  wx_mpu_get_value(wx_mpu_t *mpu, int key);

void wx_mpu_init_fall(wx_mpu_t *mpu, int threshold, int duration);
bool wx_mpu_fall_detected(wx_mpu_t *mpu);
void wx_mpu_clear_fall(wx_mpu_t *mpu);

void wx_mpu_init_motion(wx_mpu_t *mpu, int threshold, int duration);
bool wx_mpu_motion_detected(wx_mpu_t *mpu);
void wx_mpu_clear_motion(wx_mpu_t *mpu);

