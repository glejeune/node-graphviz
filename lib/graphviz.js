var sys = require('sys'),
  Graph = require('./deps/graph').Graph;

exports.graph = function(id) {
  var graph = new Graph(null, id);
  graph.setType( 'graph' );
  return graph;
}

exports.digraph = function(id) {
  var graph = new Graph(null, id);
  graph.setType( 'digraph' );
  return graph;  
}
