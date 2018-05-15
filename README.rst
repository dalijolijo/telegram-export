telegram-export
===============

A tool to download Telegram data (users, chats, messages, and media)
into a database (and display the saved data).

**Database schema:**

.. figure:: https://user-images.githubusercontent.com/15344581/37377008-44c93d20-271f-11e8-8170-5d6071a21b8f.png
   :alt: Schema image

What does it do? Is it a bot?
=============================

No, it's not really a bot. It uses the Telegram API (what Telegram apps use), so it has access to
everything a Telegram app can do. This is why you need an API ID and API
hash to use it, and why one from Telegram Desktop will work. Since
normal clients need to download messages, media, users etc to display
them in-app, telegram-export can do the same, and save them into a nice
database. 

Preperations for Ubuntu 16.04
=============================
Python
------

``sudo apt-get install python3``

``sudo apt-get install python-pip3``

``sudo pip --upgrade pip``

Docker
-------

See https://docs.docker.com/install/linux/docker-ce/ubuntu/#upgrade-docker-ce


Installation
============

The simplest way is to run ``sudo pip3 install --upgrade telegram_export``,
after which telegram-export should simply be available as a command: ``telegram-export``
in the terminal.


Usage
=====

First, copy config.ini.example (from GitHub) to ``~/.config/telegram-export/config.ini``
and edit some values. You'll probably need to create this folder. To write your
config whitelist, you may want to refer to the output of
``telegram-export --list-dialogs`` to get dialog IDs or
``telegram-export --search <query>`` to filter the results.

Then run ``telegram-export`` and allow it to dump data.

Full option listing:

.. code::

    usage: __main__.py [-h] [--list-dialogs] [--search-dialogs SEARCH_STRING]
                       [--config-file CONFIG_FILE] [--contexts CONTEXTS]
                       [--format {text,html}] [--download-past-media]

    Download Telegram data (users, chats, messages, and media) into a database
    (and display the saved data)

    optional arguments:
      -h, --help            show this help message and exit
      --list-dialogs        list dialogs and exit
      --search-dialogs SEARCH_STRING
                            like --list-dialogs but searches for a dialog by
                            name/username/phone
      --config-file CONFIG_FILE
                            specify a config file. Default config.ini
      --contexts CONTEXTS   list of contexts to act on eg --contexts=12345,
                            @username (see example config whitelist for full
                            rules). Overrides whitelist/blacklist.
      --format {text,html}  formats the dumped messages with the specified
                            formatter and exits.
      --download-past-media
                            download past media instead of dumping new data (files
                            that were seen before but not downloaded).

Limitations
===========

-  Still being worked on. It dumps things, but the schema may change and we
   won't support old schema transitions.

-  Relies on `Telethon <https://github.com/LonamiWebs/Telethon>`, which is still pre-1.0.

-  Certain information is not dumped for simplicity's sake. For example,
   edited messages won't be re-downloaded and there is currently no
   support for multiple versions of a message in the db. However, this
   shouldn't be much of an issue, since most edits or deletions are
   legit and often to fix typos.


Installation from source
========================

``git clone`` this repository, then ``python3 setup.py install``. You should
also read through the `Installation`_ section for related notes.
