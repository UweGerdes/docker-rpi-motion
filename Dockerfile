#
# Dockerfile for motion on Raspbian
#
# docker build -t uwegerdes/motion .

FROM uwegerdes/nodejs

MAINTAINER Uwe Gerdes <entwicklung@uwegerdes.de>

ARG MOTION_PORT='8080'
ARG STREAM_PORT='8081'
ARG SERVER_PORT='8082'

ENV MOTION_PORT ${MOTION_PORT}
ENV STREAM_PORT ${STREAM_PORT}
ENV SERVER_PORT ${SERVER_PORT}

# Set development environment as default
ENV NODE_ENV development

USER root

COPY package.json ${NODE_HOME}/

WORKDIR ${NODE_HOME}

RUN apt-get update && \
	apt-get install -y \
				alsa-utils \
				ffmpeg \
				lame \
				motion && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
	adduser ${USER_NAME} audio && \
	adduser ${USER_NAME} video && \
	adduser ${USER_NAME} motion && \
	npm install -g \
				bower \
				gulp \
				jshint && \
	npm install

COPY entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

COPY . ${APP_HOME}

RUN chown -R ${USER_NAME}:${USER_NAME} ${NODE_HOME}

WORKDIR ${APP_HOME}

USER ${USER_NAME}

VOLUME [ "${APP_HOME}" ]

EXPOSE ${MOTION_PORT} ${STREAM_PORT} ${SERVER_PORT}

CMD [ "bash" ]

