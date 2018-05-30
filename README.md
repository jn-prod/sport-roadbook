Master [![Build Status](https://travis-ci.org/jn-prod/sport-roadbook.svg?branch=master)](https://travis-ci.org/jn-prod/sport-roadbook) DEV [![Build Status](https://travis-ci.org/jn-prod/sport-roadbook.svg?branch=dev)](https://travis-ci.org/jn-prod/sport-roadbook)

# Feezily App

### Short description
This app use Node.js, Express and Mongoose. Application de gestion d'entrainement sportif.

### Urls
dev : https://feezify-dev.herokuapp.com/
prod : http://www.feezify.me

# Commands 

### Version
1.1.0

### Installation

```sh
$ npm install
```

### Launch app

```sh
$ node app
```

### Test

```sh
$ npm run test
```
### Build assets

```sh
$ npm run build
```

### Generate local SSL
more: https://www.kevinleary.net/self-signed-trusted-certificates-node-js-express-js/
```sh
$ cd certs
$ openssl genrsa -out localhost.key 2048
$ openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650
```




