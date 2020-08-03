#!/bin/sh

if [ -d './_build' ]; then
	echo -e "\e[32m./_build exists. Cleaning...\e[0m"
	rm -rf ./_build
fi

/usr/bin/node ./src/index.js
