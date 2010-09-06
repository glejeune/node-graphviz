/**
 * Module dependencies.
 */
var sys = require('sys'),
  Graph = require('./deps/graph').Graph;

/**
 * Create a new undirected graph
 * @constructor
 * @param {String} id The graphID
 * @return {Graph}
 * @api public
 */
exports.graph = function(id) {
  var graph = new Graph(null, id);
  graph.type = 'graph';
  return graph;
}

/**
 * Create a new directed graph
 * @constructor
 * @param {String} id The graphID
 * @return {Graph}
 * @api public
 */
exports.digraph = function(id) {
  var graph = new Graph(null, id);
  graph.type = 'digraph';
  return graph;  
}
