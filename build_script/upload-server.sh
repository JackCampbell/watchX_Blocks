#!/bin/zsh

scp "../dist/version" root@watchx.io:/root/w-site/media/version.txt
scp "../dist/osx/watchX Blocks.dmg" root@watchx.io:/root/w-site/media/latest.dmg
scp "../dist/win64/watchX Blocks.zip" root@watchx.io:/root/w-site/media/latest.zip

