cmake_minimum_required(VERSION 3.17)
set(CMAKE_VERBOSE_MAKEFILE OFF)
set(CMAKE_TOOLCHAIN_FILE avr-toolchain.cmake)
project(watchX-Tool)

add_definitions(-DARDUINO=182)
avr_set_cpu(w-firmware-2 atmega32u4 16000000 57600)


file(GLOB SOURCE_FILES *.h *.cpp *.c)


add_executable(watchX-Tool ${SOURCE_FILES})
# avr_target_properties(watchX-Tool /dev/tty.usbmodem14101)