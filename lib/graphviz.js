/**
 * Module dependencies.
 */
var path = require('path'),
  spawn  = require('child_process').spawn,
  temp = require('temp'),
  fs = require('fs'),
  fsExt = require('./deps/core_ext/fs-ext'),
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
};

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
};

function _parse(file, callback, errback) {
  var gvprScript = path.join(__dirname, "ext", "gvpr", "dot2js.g"),
    parameters = ["-f" + gvprScript, file],
    cmd = "gvpr",
    __graph_eval,
    err = '',
    out = '',
    graphviz = spawn(cmd, parameters);

  graphviz.stdout.on('data', function(data) {
    out += data;
  });
  graphviz.stderr.on('data', function(data) {
    err += data;
  });
  graphviz.stdin.end();
  // Avoid race condition by listening for close instead of exit in newer node.js versions
  var version = process.version.split('.')[1];
  graphviz.on(version < 8 ? 'exit' : 'close', function(code) {
    eval(out);
    if(code !== 0 || __graph_eval === undefined) {
      if(errback) { 
        errback(code, out, err); 
      }
    } else {
      callback(__graph_eval);
    }
  });
}
/**
 * Create a new graph from a dot script
 * @constructor
 * @param {String} file_or_script The DOT script or file
 * @param {Function} callback
 * @param {Function} errback
 * @api public 
 */
exports.parse = function(file_or_script, callback, errback) {
  if(fsExt.exist(file_or_script)) {
    _parse(file_or_script, callback, errback);
  } else {
    temp.open('node-graphviz', function(err, info) {
      fs.write(info.fd, file_or_script);
      fs.close(info.fd, function(err) {
        _parse(info.path, callback, errback);
      });
    });
  }
};
