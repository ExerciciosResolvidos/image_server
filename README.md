ImageServer
===
Its a image server, that works based in json 3rd maturity level of API.
No external dependencies like ImageMagik are needed to crop image, it approach
makes simpliest build Docker image.

# Table of Contents
 - [configs](#config)
 - [Run It](#run-it)

## Configs
Some environments variables need to be supplied like: 
 - aws credentials
 - pg connection string
 - a canonical hostname generate full urls by url helpers.

The exactly **name** of variables can be checked in **config/*.yaml** files

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
obs: the other ENV vars need be exported before

If any doubt about how it works, api contracts etc, run the tests and see the output.

```bash
$ npm test
```