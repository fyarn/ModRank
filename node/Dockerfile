FROM node:carbon
RUN mkdir -p /opt/ModRank
WORKDIR /opt/ModRank

COPY package*.json /opt/ModRank/
RUN npm install
COPY . /opt/ModRank

ENV NODE_ENV production

EXPOSE 8080
CMD [ "npm", "start" ]