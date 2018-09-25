#
# Dockerfile for motion on Raspbian
#
# docker build -t uwegerdes/motion .

FROM resin/rpi-raspbian:stretch

MAINTAINER Uwe Gerdes <entwicklung@uwegerdes.de>

ARG APT_PROXY
ARG TERM=xterm
ARG TZ=UTC
ARG UID='1000'
ARG GID='1000'
ARG NPM_PROXY
ARG NPM_LOGLEVEL
ARG MOTION_PORT='8080'
ARG STREAM_PORT='8081'
ARG SERVER_PORT='8082'

ENV DEBIAN_FRONTEND noninteractive
ENV TERM=${TERM}
ENV TZ ${TZ}
ENV NODE_ENV development
ENV USER_NAME node
ENV NODE_HOME /home/${USER_NAME}
ENV NODE_PATH ${NODE_HOME}/node_modules:/usr/lib/node_modules
ENV HOME ${NODE_HOME}
ENV APP_HOME ${NODE_HOME}/app
ENV MOTION_PORT ${MOTION_PORT}
ENV STREAM_PORT ${STREAM_PORT}
ENV SERVER_PORT ${SERVER_PORT}

# Set development environment as default
ENV NODE_ENV development

COPY package.json ${NODE_HOME}/

WORKDIR ${NODE_HOME}

RUN if [ -n "${APT_PROXY}" ] ; then \
		echo "Acquire::http { Proxy \"${APT_PROXY}\"; };" >> /etc/apt/apt.conf.d/01proxy ; \
		echo "Acquire::https { Proxy \"https://\"; };" >> /etc/apt/apt.conf.d/01proxy ; \
	fi && \
	echo 'APT::Install-Recommends 0;' >> /etc/apt/apt.conf.d/01norecommends && \
	echo 'APT::Install-Suggests 0;' >> /etc/apt/apt.conf.d/01norecommends && \
	apt-get update && \
	apt-get install -y \
				alsa-utils \
				ffmpeg \
				lame \
				motion && \
	curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
	sed -i -e "s/https:/http:/" /etc/apt/sources.list.d/nodesource.list && \
	apt-get update && \
	apt-get install -y \
				nodejs \
				npm && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
	mkdir -p ${NODE_HOME} && \
	groupadd --gid ${GID} ${USER_NAME} && \
	useradd --uid ${UID} --gid ${GID} --home-dir ${NODE_HOME} --shell /bin/bash ${USER_NAME} && \
	adduser ${USER_NAME} sudo && \
	echo "${USER_NAME}:${USER_NAME}" | chpasswd && \
	if [ "${NPM_PROXY}" != '' ]; then \
		echo "proxy = ${NPM_PROXY}" >> ${NODE_HOME}/.npmrc ; \
		echo "https-proxy = ${NPM_PROXY}" >> ${NODE_HOME}/.npmrc ; \
		echo "strict-ssl = false" >> ${NODE_HOME}/.npmrc ; \
	fi && \
	if [ "${NPM_LOGLEVEL}" != '' ]; then \
		echo "loglevel = ${NPM_LOGLEVEL}" >> ${NODE_HOME}/.npmrc ; \
	fi && \
	adduser ${USER_NAME} audio && \
	adduser ${USER_NAME} video && \
	adduser ${USER_NAME} motion && \
	npm -g config set user ${USER_NAME} && \
	npm install -g \
				bower \
				gulp \
				jshint

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

EXPOSE ${MOTION_PORT} ${STREAM_PORT} ${SERVER_PORT}

CMD [ "bash" ]

