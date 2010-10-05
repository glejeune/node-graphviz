/**
 * Module dependencies.
 */
var sys = require('sys'),
  path = require('path'),
  spawn  = require('child_process').spawn,
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

exports.parse = function(file, callback, errback) {
  var gvprScript = path.join( __dirname, "ext", "gvpr", "dot2js.g" );
  var parameters = ["-f"+gvprScript, file];
  var cmd = "gvpr";
  var __graph_eval;
  var err = '';
  var out = '';

  graphviz = spawn(cmd, parameters);
  graphviz.stdout.on('data', function(data) {
    out += data;
    eval(data.toString());
  });
  graphviz.stderr.on('data', function(data) {
    err += data;
  });
  graphviz.stdin.end();
  graphviz.on('exit', function(code) {
    if(code !== 0 || __graph_eval == undefined) {
      if(errback) { errback(code, out, err) }
    } else {
      callback(__graph_eval)
    }
  });
}
