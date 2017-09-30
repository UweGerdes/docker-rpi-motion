#
# Dockerfile for motion on Raspbian
#
# docker build -t uwegerdes/mtion .

FROM uwegerdes/nodejs

MAINTAINER Uwe Gerdes <entwicklung@uwegerdes.de>

ARG MOTION_PORT='8080'
ARG STREAM_PORT='8081'

ENV NODE_ENV development
ENV HOME ${NODE_HOME}
ENV APP_HOME ${NODE_HOME}/app
ENV MOTION_PORT ${MOTION_PORT}
ENV STREAM_PORT ${STREAM_PORT}

COPY package.json ${NODE_HOME}/

WORKDIR ${NODE_HOME}

RUN apt-get update && \
	apt-get install -y \
					alsa-utils \
					ffmpeg \
					motion && \
	adduser ${USER_NAME} audio && \
	adduser ${USER_NAME} video && \
	adduser ${USER_NAME} motion && \
	npm -g config set user ${USER_NAME} && \
	npm install -g \
				bower \
				gulp

COPY entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

COPY . ${APP_HOME}

RUN chown -R ${USER_NAME}:${USER_NAME} ${NODE_HOME}

USER ${USER_NAME}

RUN npm install && \
	npm cache clean

WORKDIR ${APP_HOME}

VOLUME [ "${APP_HOME}" ]

EXPOSE ${MOTION_PORT} ${STREAM_PORT}

CMD [ "bash" ]

