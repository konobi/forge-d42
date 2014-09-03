var restify = require('restify');
var async = require('async');

function fd42 (opts) {
  var self = this;

  self.url  = opts.url;
  self.user = opts.user;
  self.pass = opts.pass;
  self.subnet_name = opts.subnet_name;
  self.host = opts.host;

  self.client = restify.createJsonClient({
    url: self.url
  });

  self.client.basicAuth(self.user, self.pass);
}

fd42.prototype.init = function() {
  var self = this;

  self.get_subnet_details(self.subnet_name, function(err, subnet){
    if(subnet.type != 2) { // type == DHCP
      throw new Error('Subnet is not set as DHCP');
    }

    self.subnet       = subnet.network + '/' + subnet.mask_bits;
    self.range_start  = subnet.range_begin;
    self.range_end    = subnet.range_end;
    self.routers      = [ subnet.gateway ];
  });

};

fd42.prototype.get_subnet_details = function(name, cb) {
  var self = this;

  self.client.get('/subnets', function(err, req, res, obj) {

    var subnet;
    obj.forEach(function(elem){
      if(elem.name == name){
        subnet = elem;
      }
    });

    cb(err, subnet);
  });
};

fd42.prototype.get_lease = function(mac, cb) {
  var self = this;

  self.client.get({
    path: '/macs/',
    query: [ { 'mac': mac } ]
  }, function(err, req, res, obj) {
    var macaddr = obj[0];
    if(macaddr){
      // ...
    }
  });
};

