#!/bin/bash

python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8001

cd chat_node/ && node index.js
