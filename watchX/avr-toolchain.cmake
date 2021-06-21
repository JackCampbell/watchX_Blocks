# this one is important
set(CMAKE_SYSTEM_NAME Generic)
# this one not so much
set(CMAKE_SYSTEM_VERSION 1)

set(ARDUINO_APP     /Applications/Arduino.app)
set(TOOLCHAIN_PATH  ${ARDUINO_APP}/Contents/Java/hardware/tools/avr)

# specify the cross compiler
set(CMAKE_CXX_COMPILER   ${TOOLCHAIN_PATH}/bin/avr-g++)
set(CMAKE_C_COMPILER     ${TOOLCHAIN_PATH}/bin/avr-gcc)
set(CMAKE_ASM_COMPILER   ${TOOLCHAIN_PATH}/bin/avr-gcc)

set(AVR_STRIP_PATH       ${TOOLCHAIN_PATH}/bin/avr-strip)
set(AVR_OBJCOPY_PATH     ${TOOLCHAIN_PATH}/bin/avr-objcopy)
set(AVR_OBJDUMP_PATH     ${TOOLCHAIN_PATH}/bin/avr-objdump)
set(AVR_SIZE_PATH        ${TOOLCHAIN_PATH}/bin/avr-size)
set(AVRDUDE_PATH         ${TOOLCHAIN_PATH}/bin/avrdude)

# where is the target environment
set(CMAKE_FIND_ROOT_PATH ${TOOLCHAIN_PATH})

# search for programs in the build host directories
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
# for libraries and headers in the target directories
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)


macro(avr_set_cpu PROJECT CPU_ID CPU_FREQ BAUDRATE)
    enable_language(C CXX ASM)

    string(TOUPPER ${CPU_ID} MCU_TYPE_UPPER)
    # Compiler flags
    set(CSTANDARD "-std=gnu11")
    set(CXXSTANDARD "-std=gnu++11")
    set(CDEBUG    "-gstabs -g -ggdb")
    set(CWARN     "-Wall -Wl,--gc-sections -Wl,--relax -lm -fuse-linker-plugin -Wl,--gc-sections")
    set(CTUNING   "-fpermissive -fno-exceptions -funsigned-char -funsigned-bitfields -fpack-struct -fshort-enums -ffunction-sections -fdata-sections -fno-threadsafe-statics")
    set(COPT      "-Os -lm -lprintf_flt -flto -Wl,-u,vfprintf")
    set(CMCU      "-mmcu=${CPU_ID}")
    set(CDEFS     "-DF_CPU=${CPU_FREQ} -DBAUD=${BAUDRATE} -DARDUINO_AVR_LEONARDO -DARDUINO_ARCH_AVR -DUSB_VID=0x2341 -DUSB_PID=0x8036")

    set(CFLAGS   "${CMCU} ${CDEBUG} ${CDEFS} ${COPT} ${CWARN} ${CTUNING} ${CSTANDARD}")
    set(CXXFLAGS "${CMCU} ${CDEBUG} ${CDEFS} ${COPT} ${CWARN} ${CTUNING} ${CXXSTANDARD}")

    set(CMAKE_C_FLAGS     "${CFLAGS} -Wstrict-prototypes")
    set(CMAKE_ASM_FLAGS   "${CFLAGS} -x assembler-with-cpp")
    set(CMAKE_CXX_FLAGS   "${CXXFLAGS}")

    set(UPLOAD_CPU_ID ${CPU_ID})
    set(UPLOAD_BAUDRATE ${BAUDRATE})
    # Project setup
    include_directories(${TOOLCHAIN_PATH}/include)
    include_directories(${CMAKE_SOURCE_DIR}/arduino)

    # file(GLOB ARDUINO_SOURCE arduino/*.c arduino/*.cpp arduino/*.h arduino/*.s arduino/utility/*.c)
endmacro()


# avr-objcopy -O ihex -R .eeprom -R .eesafe $(TARGET_OUTPUT_FILE) $(TARGET_OUTPUT_FILE).hex
# avr-objcopy --no-change-warnings -j .eeprom --change-section-lma .eeprom=0 -O ihex $(TARGET_OUTPUT_FILE) $(TARGET_OUTPUT_FILE).eep.hex
# You second command worked for me. So I replaced it as
# avr-objcopy -O ihex -j .text -j .data $(TARGET_OUTPUT_FILE) $(TARGET_OUTPUT_FILE).hex

macro(avr_target_properties PROJECT DRIVER PORT)
    set_target_properties(${PROJECT} PROPERTIES OUTPUT_NAME "${PROJECT}.elf")
    add_custom_command(TARGET ${PROJECT} POST_BUILD VERBATIM
            COMMAND ${AVR_OBJDUMP_PATH} -h ${PROJECT}.elf
            COMMAND ${AVR_OBJCOPY_PATH} --verbose --only-section .text --only-section .data --output-target ihex ${PROJECT}.elf ${PROJECT}.hex
            #COMMAND ${AVR_OBJCOPY_PATH} --no-change-warnings --verbose --remove-section .eeprom --remove-section .eesafe --remove-section signature --output-target ihex ${PROJECT}.elf ${PROJECT}.hex
            COMMAND ${AVR_OBJCOPY_PATH} --verbose --only-section .eeprom --change-section-lma .eeprom=0 --output-target ihex ${PROJECT}.elf ${PROJECT}.eeprom
            COMMAND ${AVR_SIZE_PATH} -C --mcu=${UPLOAD_CPU_ID} ${PROJECT}.elf
            COMMAND ${AVR_SIZE_PATH} ${PROJECT}.hex
            # -- upload
            #COMMAND /bin/stty -f ${PORT} ispeed 1200 ospeed 1200
            COMMAND ${CMAKE_SOURCE_DIR}/leonardo_uploader/linux/leonardoUploader ${PORT} ${PROJECT}.hex
            COMMAND ${AVRDUDE_PATH} -F -p ${UPLOAD_CPU_ID} -P ${PORT} -D -V -c ${DRIVER} -b ${UPLOAD_BAUDRATE} -C ${TOOLCHAIN_PATH}/etc/avrdude.conf -U flash:w:${PROJECT}.hex
            DEPENDS ${PROJECT}
            WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
            COMMENT "Generating Hexs")
    set_directory_properties(PROPERTIES ADDITIONAL_MAKE_CLEAN_FILES "${PROJECT}.hex;${PROJECT}.eeprom;${PROJECT}.lst") # Compiling targets
endmacro()


macro(avr_target_upload PROJECT DRIVER PORT)
    # -F signature Check
    # -D default auto erase flash
    add_custom_target(${PROJECT}_Upload
            #COMMAND /bin/stty -f ${PORT} ispeed 1200 ospeed 1200
            COMMAND ${CMAKE_SOURCE_DIR}/leonardo_uploader/linux/leonardoUploader ${PORT} ${PROJECT}.hex
            COMMAND ${AVRDUDE_PATH} -F -p ${UPLOAD_CPU_ID} -P ${PORT} -D -V -c ${DRIVER} -b ${UPLOAD_BAUDRATE} -C ${TOOLCHAIN_PATH}/etc/avrdude.conf -U flash:w:${PROJECT}.hex
            DEPENDS ${PROJECT}
            WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
            COMMENT "Upload ${PORT}")
endmacro()
