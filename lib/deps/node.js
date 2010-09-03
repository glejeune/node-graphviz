var Hash = require( './core_ext/hash' ).Hash,
  Attributs = require( './attributs' ).Attributs;

var Node = exports.Node = function(graph, id) {
  this.relativeGraph = graph;
  this.id = id;
  this.attributs = new Attributs();
};

Node.prototype.setId = function(id) {
  this.id = id
}

Node.prototype.id = function() {
  return this.id;
}

Node.prototype.set = function( name, value ) {
  this.attributs.set(name, value);
}

Node.prototype.get = function( name ) {
  return this.attributs.get(name);
}

Node.prototype.to_dot = function() {
  var nodeOutput = this.id + this.attributs.to_dot();
  return nodeOutput;
}
