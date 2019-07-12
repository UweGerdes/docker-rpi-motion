#!/bin/bash

if [ ! -w "${APP_HOME}/" ]; then
	echo "ERROR: '${APP_HOME}/' cannot write"
	exit 1
fi

if [ ! -d "${APP_HOME}/key" ]; then
	mkdir "${APP_HOME}/key"
	# see https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs
	openssl req -new -newkey rsa:2048 -nodes -x509 -days 3650 -out "${APP_HOME}/key/selfsigned.crt" -keyout "${APP_HOME}/key/selfsigned.key"
	# -subj "/C=US/ST=New York/L=Brooklyn/O=Example Company/CN=example.com"
fi

cd "${APP_HOME}"

exec "$@"

