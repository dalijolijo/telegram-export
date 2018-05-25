/*
 * MIT License
 *
 * Copyright (c) 2017-2018 Bannerets <save14@protonmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// npm i telegram-mtproto@2.2.8

// node.js v7.6.0+ is required

// ---- Options ----

// Can be obtained from https://my.telegram.org
const API_ID = 666666;
const API_HASH = 'xxxxxxxxxxxxxxxxxxxxxxx';

const PHONE_NUMBER = '+xxxxxxx';

const OUTPUT_FILE = 'output.txt';
const SESSION_FILE = 'session.json';

// Can be obtained from https://tjhorner.com/webogram/ or https://fabianpastor.github.io/webogram
const CHANNEL_ID = 1111111;
const ACCESS_HASH = 'xxxxxxxxxxxxxxxxxxxxxxx';

// ---- Advanced Options ---

const TIMEOUT = 10000; // ms
const NO_AUTH = false;

// ----

const fs = require('fs');
const readline = require('readline');
const { EOL } = require('os');
const { MTProto } = require('telegram-mtproto');
const { FileStorage } = require('telegram-mtproto/lib/plugins/file-storage');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (!fs.existsSync(SESSION_FILE)) fs.writeFileSync(SESSION_FILE, '{}');

const inputChannel = {
  _: 'inputChannel',
  channel_id: CHANNEL_ID,
  access_hash: ACCESS_HASH
};

const config = {
  server: {
    dev: false
  },
  api: {
    layer: 57,
    initConnection: 0x69796de9,
    api_id: API_ID
  },
  app: {
    storage: new FileStorage(SESSION_FILE)
  }
};

const outputStream = fs.createWriteStream('OUTPUT_FILE', {flags: 'a'});

// eslint-disable-next-line new-cap
const client = MTProto(config);

const input = text => new Promise(resolve => rl.question(text, resolve));

const isUserAuthorized = () => new Promise((resolve, reject) => {
  setTimeout(resolve, TIMEOUT, false);

  client('users.getFullUser', { id: { _: 'inputUserSelf' } })
    .then(() => resolve(true))
    .catch(e => e.type === 'AUTH_KEY_UNREGISTERED'
      ? resolve(false)
      : reject(e)
    );
});

(async () => {
  if (!NO_AUTH && await isUserAuthorized() === false) {
    await auth(PHONE_NUMBER);
  }

  await getUsers();

  outputStream.on('finish', () => process.exit());
  outputStream.end();
})();

async function auth (phone_number) {
  console.log('Sending code request...');

  const { phone_code_hash } = await client('auth.sendCode', {
    phone_number,
    current_number: false,
    api_id: API_ID,
    api_hash: API_HASH
  });

  const phone_code = await input('Enter the code: ');

  await client('auth.signIn', {
    phone_number,
    phone_code_hash,
    phone_code
  });
}

async function getUsers () {
  let cycles;
  let counter = 0;

  do {
    const { users, count } = await client('channels.getParticipants', {
      channel: inputChannel,
      filter: { _: 'channelParticipantsRecent' },
      offset: counter * 200,
      limit: 200
    });

    counter++;

    if (cycles == null && (count < 200 || counter > 1)) {
      console.log(`${count} users.`);
      cycles = Math.ceil(count / 200);
    }

    const percentage = counter/cycles*100 || 0;

    console.log(`Completed ${percentage.toFixed(2)}%`);

    users.forEach(user => {
      //user.phone + EOL
      outputStream.write(user.username + "_" + user.first_name + "_" + user.last_name + " ");
    });
  } while (cycles ? counter < cycles : counter < 2);
}
