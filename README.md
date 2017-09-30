# Docker with motion - use cam to detect motion, grab video, html frontend

Inspiration from https://github.com/j3lte/node-motion

## TODO

Controller for motion actions

Html server with image output, video stream and control links

## Elaborate use scenario

I want to set up my Raspberry Pi 3 with Camera V2, an USB sound device with microphone and a powerbank to have a video recorder. It also opens a hotspot with a node web server so I can control it from my smartphone.

Most of it should be packed in docker so I can recreate everything with a few commands.

## Prerequisites

Make sure you have connected and tested the hardware, got images by raspistill and completed the following steps on your Raspberry Pi:

### Make a Raspbian image

I use Raspbian, other systems might work too.

### Install Docker

TODO

### Create /dev/video0

On the rasbian system activate the video driver:

```bash
$ sudo rpi-update # to make sure the v4L2 drive is available.
$ sudo modprobe bcm2835-v4l2 # to load it and create /dev/video0
```

This worked for me. I was having previous problems so in case anyone else has this issue; check to make sure you inserted the camera ribbon into the slot correctly, mine was in backwards.

You can add `bcm2835-v4l2` to `/etc/modules` so whenever the pi is restarted it will always load up the module and always have /dev/video0 available.

### Build the Docker image

If you have proxy caches for apt-get and npm you should build my baseimage-arm32v7 and nodejs before building the motion image.

```bash
$ docker build -t uwegerdes/motion .
```

## Run the Docker container

Run the container with:

```bash
$ docker run -it \
	-v $(pwd):/home/node/app \
	-p 5480:8080 \
	-v /dev/snd:/dev/snd \
	-v /dev/video0:/dev/video0 \
	--privileged \
	--name motion \
	uwegerdes/motion \
	bash
```

Restart it later with:

```bash
$ docker start -ai camserver
```

