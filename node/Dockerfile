FROM node:carbon
RUN mkdir -p /opt/ModRank
WORKDIR /ModRank

COPY package*.json /ModRank/
RUN npm install
COPY . /ModRank

ENV NODE_ENV production

EXPOSE 8080
CMD [ "npm", "start" ]