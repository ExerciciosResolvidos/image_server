# FROM wjordan/libvips

FROM node:9.10.0-alpine

RUN mkdir /src

COPY . /src

WORKDIR /src

RUN npm install --only=production


EXPOSE 3000

CMD npm start