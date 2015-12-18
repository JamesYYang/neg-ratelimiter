neg-ratelimiter
===================

A express middleware for rate limit in Newegg

## Install

```sh
$ npm install neg-ratelimiter
```

## How to Use

```js
'use strict';

var express = require('express');
var nair = require('neg-nair');
var negLimiter = require('neg-ratelimiter');


var options = {
  hosts: hosts,
  nairDBUri: uri,
  debug_mode: true
};


nair.init(options, (err) => { //need a few seconds to init connection
  if(err){
    console.log(err);
  }else{
    console.log('init success');
  }

}

var app = express();
app.use(negLimiter(opts));

```

## License

MIT

