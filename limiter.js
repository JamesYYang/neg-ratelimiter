'use strict';

var assert = require('assert');

const DEFAULTCOUNT = 0;

module.exports = Limiter;

function Limiter(opts){
  this.id = opts.id;
  this.area = opts.area;
  this.nair = opts.nair;
  assert(this.id, '.id required');
  assert(this.area, '.area required');
  assert(this.nair, '.nair required');
  //默认一个小时1000次
  this.max = opts.max || 1000;
  this.duration = opts.duration || 3600;
  this.key = `limit:${this.id}`;
}

Limiter.prototype.count = function(fn){
  var duration = this.duration;
  var max = this.max;
  var db = this.nair;
  var key = this.key;
  var area = this.area;
  var n = max;

  function incr(){
    db.incr(area, key, 1, DEFAULTCOUNT, null, duration)
      .then((value) =>{
        n = max - value;
        done();
      }).catch((err) => fn(err));
  }

  function done(){
    fn(null, {
      total: max,
      remaining: n < 0 ? 0 : n,
      canAccess: n >= 0
    })
  }

  db.get(area, key)
    .then((value)=>{
      if(value !== null){
        duration = -1; //表示计数已经存在，不改变过期时间
      }
      incr();
    }).catch((err) => fn(err));

};