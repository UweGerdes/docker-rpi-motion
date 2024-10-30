#
# Dockerfile for motion on Raspbian
#
# docker build -t uwegerdes/motion .

FROM uwegerdes/expressjs-boilerplate

MAINTAINER Uwe Gerdes <entwicklung@uwegerdes.de>

ARG SERVER_PORT='8080'
ARG HTTPS_PORT='8443'
ARG LIVERELOAD_PORT='8081'
ARG MOTION_PORT='8082'
ARG STREAM_PORT='8083'
ARG GPIO_GROUP='997'

ENV SERVER_PORT ${SERVER_PORT}
ENV HTTPS_PORT ${HTTPS_PORT}
ENV LIVERELOAD_PORT ${LIVERELOAD_PORT}
ENV MOTION_PORT ${MOTION_PORT}
ENV STREAM_PORT ${STREAM_PORT}
ENV GPIO_GROUP ${GPIO_GROUP}

USER root

RUN apt-get update && \
	apt-get dist-upgrade -y && \
	apt-get install -y \
				alsa-utils \
				ffmpeg \
				psmisc \
				lame \
				motion && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
	mv ${NODE_HOME}/node_modules ${NODE_HOME}/boilerplate_node_modules && \
	adduser ${USER_NAME} audio && \
	adduser ${USER_NAME} video && \
	adduser ${USER_NAME} motion && \
	groupadd -g ${GPIO_GROUP} gpio && \
	adduser ${USER_NAME} gpio

ENV NODE_PATH ${NODE_PATH}:${NODE_HOME}/boilerplate_node_modules

COPY --chown=${USER_NAME}:${USER_NAME} package.json ${NODE_HOME}/

WORKDIR ${NODE_HOME}

RUN npm install --cache /tmp/node-cache && \
	rm -r /tmp/*

WORKDIR ${APP_HOME}

COPY --chown=${USER_NAME}:${USER_NAME} . ${APP_HOME}

USER ${USER_NAME}

EXPOSE ${SERVER_PORT} ${HTTPS_PORT} ${LIVERELOAD_PORT} ${MOTION_PORT} ${STREAM_PORT}

CMD [ "npm", "start" ]
