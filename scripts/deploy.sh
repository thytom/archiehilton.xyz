#!/bin/sh

if [ -d './public' ]; then
	echo -e "\e[32m./public exists. Cleaning...\e[0m"
	rm -rf ./public
fi

echo -e "\e[32mInstalling packages...\e[0m"
/usr/bin/npm install

echo -e "\e[32mRunning build...\e[0m"
./scripts/build.sh

echo -e "\e[5mCopying build to public...\e[0m"
/bin/cp -r ./_build ./public

echo -e "\e[32mCleaning up...\e[0m"
/usr/bin/npm run clean
