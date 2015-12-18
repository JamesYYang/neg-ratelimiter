'use strict';
var Limiter = require('./limiter');
var _ = require('lodash');


module.exports = negRatelimiter;

function negRatelimiter(opts){
  opts = opts || {};

  return function(req, res, next){
    var id = opts.id ? opts.id(req) : req.ip;

    if(!id){
      next();
      return;
    }

    var option = _.cloneDeep(opts);
    option.id = id;
    var limiter = new Limiter(option);

    limiter.count((err, result) => {

      if(err){
        next(err);
      }else{
        // header fields
        res.set('X-RateLimit-Limit', result.total);
        res.set('X-RateLimit-Remaining', result.remaining);

        if(result.canAccess){
          next();
        }else{
          res.sendStatus(429);
        }
      }
    });

  };

}