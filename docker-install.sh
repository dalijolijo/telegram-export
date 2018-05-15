#!/bin/bash
set -u

DOCKER_REPO="dalijolijo"
S_NAME="exporter"
DB_OUTPUT="output"

#
# Set telegram user pwd
#
echo -n "Enter new password for [telegram] user and Hit [ENTER]: "
read TELEPWD

#
# Set telegram API data
#
echo -n "Enter your PhoneNumber and Hit [ENTER]. Should start with +country code eg +49 : "
read PHONE
echo -n "Enter your Telegram API ID and Hit [ENTER]: "
read API_ID
echo -n "Enter your Telegram API Hash and Hit [ENTER]: "
read API_HASH
echo -n "Enter your Telegram Session Name and Hit [ENTER]: "
read S_NAME
echo -n "Enter the Name of Output Database Name and Hit [ENTER]: "
read DB_OUTPUT

#
# Installation of docker-ce package (Ubuntu 16.04)
#
apt-get update
sudo apt-get remove -y docker \
                       docker-engine \
                       docker.io
sudo apt-get install -y apt-transport-https \
			ca-certificates \
			curl \
			software-properties-common
cd /root
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install docker-ce -y

#
# Pull telegram-export
#
docker pull ${DOCKER_REPO}/telegram-export
docker run -p 80:80 --name telegram-export -e TELEPWD="${TELEPWD}" -e PHONE="${PHONE}" -e API_ID="${API_ID}" -e API_HASH="${API_HASH}" -e S_NAME="${S_NAME}" -e DB_OUTPUT="${DB_OUTPUT}" -v /home/telegram:/home/telegram:rw -d ${DOCKER_REPO}/telegram-export
