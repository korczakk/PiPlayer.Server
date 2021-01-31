FROM node:14

WORKDIR /usr/src/app

COPY . .
COPY settings-prod.json settings.json

RUN npm install

RUN apt-get update
RUN apt-get -y install mplayer
RUN apt-get autoremove
RUN apt-get autoclean

EXPOSE 8080

CMD ["node", "app.js"]