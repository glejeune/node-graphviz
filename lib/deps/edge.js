var Hash = require( './core_ext/hash' ).Hash,
  Attributs = require( './attributs' ).Attributs;

var Edge = exports.Edge = function(graph, nodeOne, nodeTwo) {
  this.relativeGraph = graph;
  this.nodeOne = nodeOne;
  this.nodeTwo = nodeTwo;
  this.attributs = new Attributs();
};

Edge.prototype.set = function( name, value ) {
  this.attributs.set(name, value);
}

Edge.prototype.get = function( name ) {
  return this.attributs.get(name);
}

Edge.prototype.to_dot = function() {
  var edgeLink = "->";
  if( this.relativeGraph.type == "graph" ) {
    edgeLink = "--";
  }
  
  var edgeOutput = this.nodeOne.id + " " + edgeLink + " " + this.nodeTwo.id;
  edgeOutput = edgeOutput + this.attributs.to_dot()
  return edgeOutput;
}
