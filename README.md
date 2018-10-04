ImageServer
===
Its a image server, that works based in json 3rd maturity level of API.

The image input need be carry on base64 format.

No external dependencies like ImageMagik are needed to crop image. It approach
makes more simple build of Docker image.

# Table of Contents
 - [Configs](#config)
 - [Run It](#run-it)

## Configs

Some environments variables need to be supplied like: 
 
 - HOST
 - SQL_PRIMARY_URL
 - AWS_ACCESS_KEY_ID
 - AWS_SECRET_ACCESS_KEY
 - S3_BUCKET



## Run it
```bash
# install dependencies
$ npm install
```

```bash
# run in develoment(default) env
$ npm start
```

or to production
```bash
# run in production
$ NODE_ENV=production npm start
```
<small>**ps:** the other ENV vars need be exported before</small>


If any doubt about how it works, api contracts etc, run the tests and see the output.

```bash
$ npm test
```