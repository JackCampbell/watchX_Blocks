#!/bin/sh


cd ~/Desktop/watchX_Blocks
rm -rf ./dist
npm run dist
# open ./dist
# "./dist/mas/watchX Blocks.app/Contents/MacOS/watchX Blocks" --enable-logging --disable-gpu --disable-software-rasterizer --verbose --enable-gpu-debugging --no-sandbox
"./dist/mas/watchX Blocks.app/Contents/MacOS/watchX Blocks" --enable-logging --disable-gpu --disable-gpu-compositing
