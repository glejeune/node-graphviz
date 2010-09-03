var Hash = require( './core_ext/hash' ).Hash,
  sys = require('sys')

var Attributs = exports.Attributs = function() {
  this.attributs = new Hash();
}

Attributs.prototype.set = function( name, value ) {
  this.attributs.setItem(name, value);
}

Attributs.prototype.get = function( name ) {
  return this.attributs.items[name];
}

Attributs.prototype.to_dot = function(link) {
  var attrsOutput = "";
  var sep = "";
  
  if( this.attributs.length > 0 ) {
    attrsOutput = attrsOutput + " [ "
    for( var name in this.attributs.items ) {
      attrsOutput = attrsOutput + sep + name + " = " + this.attributs.items[name]
      sep = ", "
    }
    attrsOutput = attrsOutput + " ]"
  }
  
  return attrsOutput;
}