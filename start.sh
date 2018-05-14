#!/bin/bash
set -u

CONFIG='config.ini'

#
# Set passwd of telegram user
#
echo telegram:${TELEPWD} | chpasswd
mkdir -p /home/telegram/
chown -R telegram:telegram /home/telegram

#
# Downloading config file
#
printf "** Downloading config.ini ***"
cd /root/.config/telegram-export/
wget https://raw.githubusercontent.com/dalijolijo/telegram-export/master/${CONFIG}

#
# Set Telegram API developer data
#
# sed -i.bak s/STRING_TO_REPLACE/STRING_TO_REPLACE_IT/g index.html
sed -i s/PHONE/${PHONE}/g /root/.config/telegram-export/${CONFIG}
sed -i s/API_ID/${API_ID}/g /root/.config/telegram-export/${CONFIG}
sed -i s/API_HASH/${API_HASH}/g /root/.config/telegram-export/${CONFIG}
sed -i s/S_NAME/${S_NAME}/g /root/.config/telegram-export/${CONFIG}
sed -i s/DB_OUTPUT/${DB_OUTPUT}/g /root/.config/telegram-export/${CONFIG}
cat /root/.config/telegram-export/${CONFIG}

#
# Starting Supervisor Service
#
# Hint: docker not supported systemd, use of supervisord
printf "*** Starting Supervisor Service ***\n"
exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
