#!/bin/bash

if [ -f "/dev/snd/pcm*c" ]; then
	if [ "$1" == "start" ] ; then
		arecord -D default:CARD=Device --fatal-errors --buffer-size=192000 -f dat -t raw | dd bs=240000 | lame -r --preset standard - /home/node/app/capture/%Y%m%d%H%M%S-%v.mp3
	elif [ "$1" == "stop" ] ; then
		pkill -6 arecord
	else
		echo "usage: $0 [start|stop]"
	fi
else
	echo "no audio capture device"
fi

