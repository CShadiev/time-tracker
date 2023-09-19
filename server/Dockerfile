FROM python:3.10-buster

RUN apt-get update -y
RUN apt-get install -y gnutls-bin

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

WORKDIR /time-tracker
