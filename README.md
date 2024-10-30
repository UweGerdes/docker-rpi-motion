# Docker with motion - use cam to detect motion, grab video, html frontend

Controller for motion actions

Html server with image output, video stream and control buttons

## Elaborate use scenario

I want to set up my Raspberry Pi 3 with Camera V2, an USB sound device with microphone and a powerbank to have a video recorder. It also opens a hotspot with a node web server so I can control it from my smartphone.

Most of it should be packed in docker so I can recreate everything with a few commands.

## Prerequisites

Make sure you have connected and tested the hardware, activated the camera with `sudo raspi-config`, got images by raspistill and completed the following steps on your Raspberry Pi:

### Make a Raspbian image

I use Raspbian, other systems might work too.

### Create /dev/video0 (if not already existing)

On the rasbian system activate the video driver:

```bash
$ sudo rpi-update # to make sure the v4L2 drive is available.
$ sudo modprobe bcm2835-v4l2 # to load it and create /dev/video0
```

This worked for me. I was having previous problems so in case anyone else has this issue; check to make sure you inserted the camera ribbon into the slot correctly, mine was in backwards.

You should add `bcm2835-v4l2` to `/etc/modules` so whenever the pi is restarted it will always load up the module and always have /dev/video0 available.

### Build the Docker image

You should clone and build (`uwegerdes/baseimage`)[https://github.com/UweGerdes/docker-baseimage] and (`uwegerdes/nodejs`)[https://github.com/UweGerdes/docker-nodejs] before building the motion image.

```bash
$ docker build -t uwegerdes/motion .
```

## Run the Docker container

Run the container with:

```bash
$ docker run -it --rm \
  -v $(pwd)/modules/motion:/home/node/app/modules/motion \
  -v $(pwd)/capture:/home/node/app/capture \
  -v $(pwd)/key:/home/node/app/key \
  -v $(pwd)/logs:/home/node/app/logs \
  -v $(pwd)/fixture:/home/node/app/fixture \
  -p 8080:8080 \
  -p 8443:8443 \
  -p 8081:8081 \
  -p 8082:8082 \
  -p 8083:8083 \
  -v /dev/snd:/dev/snd \
  -v /dev/video0:/dev/video0 \
  --privileged \
  --name motion \
  uwegerdes/motion \
  bash
```

You should start `npm start` and open localhost:8080 for the server, localhost:8082 / localhost:8083 for motion / streaming (if started from server or console).

Restart it later with:

```bash
$ docker start -ai motion
```

## Start motion

In the running container you can start motion with:

```bash
motion -n
```

You find the results in `./capture`.

## Configure motion

My default settings for motion work - change them as you like.

## Combine video and audio

This process uses cpu and disk massively, so do it afterwards. The time depends on the (input and) output format. Best is no conversion for the video filetype.

```bash
$ ffmpeg -i "FILENAME.mp3" -r 30 -i "FILENAME.avi" "video.avi"
```

## Test Video and Audio Setup

`arecord --list-devices` can be used to find audio inputs, with an external USB camera the device name was `Camera`. I got `Device` for a USB soundcard.

```bash
SECS=5
TIME="$(date +%Y-%m-%d_%H:%M:%S)"
raspivid -t ${SECS}000 -w 1280 -h 720 -b 3500000 -o "video-${TIME}.h264" &
arecord -d ${SECS} -D default:CARD=Camera -t wav -c 1 -r 48000 -f S16_LE "audio-${TIME}.wav"
ffmpeg -i "video-${TIME}.h264" -i "audio-${TIME}.wav" -af loudnorm=I=-14:LRA=7:TP=-2 "vid-${TIME}.mp4"
```


## Deprecated

`raspistill` and `raspivid` are deprecated and replaced by `rpicam-*`. The new tools only work with Camera module, not USB.

### Take a pic

raspistill -e png -dt -o "./img%010d.png" -w 1640 -h 1232 -cs 0 -n -t 10

### Grab video and audio and convert

```bash
SECS=5
TIME="$(date +%Y-%m-%d_%H:%M:%S)"
raspivid -t ${SECS}000 -w 1280 -h 720 -b 3500000 -o "video-${TIME}.h264" &
arecord -d ${SECS} -D default:CARD=Device -t wav -c 1 -r 48000 -f S16_LE "audio-${TIME}.wav"
ffmpeg -i "video-${TIME}.h264" -i "audio-${TIME}.wav" -af loudnorm=I=-14:LRA=7:TP=-2 "vid-${TIME}.mp4"
```

Hint: `arecord` also works with `-D plughw:1,0`

## Usage extensions

https://www.bouvet.no/bouvet-deler/utbrudd/building-a-motion-activated-security-camera-with-the-raspberry-pi-zero

## References

Inspiration from (https://github.com/j3lte/node-motion)[https://github.com/j3lte/node-motion].
