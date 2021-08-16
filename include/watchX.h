#include "Adafruit_Sensor.h"
#include "Adafruit_BMP280.h"
#include "SparkFun_MAG3110.h"
#include "RTClib.h"
#include "MPU6050.h"
#include "Adafruit_MLX90393.h"
#include "oled.h"
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "BluefruitConfig.h"
#include "PinChangeInterrupt.h"
#include "Adafruit_SleepyDog.h"
#include "MLX90393.h"
#include "resources.h"
//#include "ML"
#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include <avr/interrupt.h>
#include <avr/sleep.h>
#include <avr/power.h>
#include <avr/wdt.h>
#pragma once

#define BUILD_LED_R     6
#define BUILD_LED_L     13

#define WX_GPAD_G0 A0
#define WX_GPAD_G1 4
#define WX_GPAD_G2 11
#define WX_GPAD_G3 10
#define WX_GPAD_G4 8
#define WX_GPAD_G5 1


#define WX_BAT_PIN 	A11
#define WX_BAT_EN	4
#define WX_BAT_DET	5
// Voltage divider resistor values.
#define WX_BAT_R1	10000
#define WX_BAT_R2	10000



#define BIT(x) (1 << (x))
#define PREV_INDEX(x, m) ((m + x - 1) % m)
#define NEXT_INDEX(x, m) ((x + 1) % m)

void wx_delay(unsigned long delay);
void wx_delay_sec(float seconds); // old function

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
bool wx_mag_get_value(wx_mag_t *mag);


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

struct wx_bat_t {
	bool	charge_status;
	float	voltage;
	int		percent;
};

void wx_init_bat(wx_bat_t *bat);
void wx_update_bat(wx_bat_t *bat);

float wx_get_bat_voltage(wx_bat_t *bat);
int   wx_get_bat_percent(wx_bat_t *bat);
bool  wx_get_charge_status(wx_bat_t *bat);


struct wx_usb_t {
	bool		connected;
	bool		voltage;
	bool		is_update;
	int			weak_pin;
};
void wx_init_usb(wx_usb_t *usb);
void wx_init_usb(wx_usb_t *usb, int pin);
void wx_update_usb(wx_usb_t *usb);
bool wx_get_usb_connected(wx_usb_t *usb);
void wx_sleep_and_weak_on_button(wx_usb_t *usb);
void wx_sleep_and_weak_on_timer(wx_usb_t *usb, long time);


#define ADAFRUITBLE_REQ A2
#define ADAFRUITBLE_RDY 0
#define ADAFRUITBLE_RST A1
#define FACTORYRESET_ENABLE 1
class Adafruit_BLE_SPI : public Adafruit_BluefruitLE_SPI {
public:
	Adafruit_BLE_SPI() : Adafruit_BluefruitLE_SPI(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST) {}
};

struct wx_ble_t {
	Adafruit_BLE_SPI 	ble;
	String				recv;
};
void wx_init_ble_transceiver(wx_ble_t *ble, int id);
void wx_init_ble_bt_keyboard(wx_ble_t *ble, int id);
void wx_init_ble_hid_control(wx_ble_t *ble, int id);
void wx_ble_write_text(wx_ble_t *ble, String str);
void wx_update_ble(wx_ble_t *ble);
String wx_ble_read_text(wx_ble_t *ble);
void wx_ble_send_keys(wx_ble_t *ble, const char *key);
void wx_ble_media_control(wx_ble_t *ble, int cmd);
void wx_ble_mouse_control(wx_ble_t *ble, int button, int state);


// key state
#define WX_BTN_B1	8
#define WX_BTN_B2	11
#define WX_BTN_B3	10

struct key_state_t {
	int         pin;
	int         down;
	int         impulse;
	int         count;
	int         bit;
};
enum {
	KEY_B1      = BIT(0),
	KEY_B2      = BIT(1),
	KEY_B3      = BIT(2)
};
struct wx_input_t {
	key_state_t btn1, btn2, btn3;
	int         state;
};
void wx_init_input(wx_input_t *keys);
void wx_update_input(wx_input_t *input);
