#!/bin/bash

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser || echo "Skipping superuser creation"

echo "To start the server, run: python manage.py runserver 0.0.0.0:8000"
