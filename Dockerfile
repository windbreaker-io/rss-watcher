FROM node:8.1.2-alpine

ENV HOME=/usr/rss-watcher

RUN mkdir -p $HOME

WORKDIR $HOME

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

ADD package.json $HOME
RUN npm install --silent
