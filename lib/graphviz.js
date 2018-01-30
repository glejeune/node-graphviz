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
  console.log("Parsing!")
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
  graphviz.on('exit', function(code) {
    if(code !== 0 || __graph_eval === undefined) {
      if(errback) { 
        errback(code, out, err); 
      }
    } else {
      console.log("All data: " + out);
      eval(out.toString());
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
      fs.write(info.fd, file_or_script, function(err, written, string) {
        if (err) console.log(err);
        console.log("Written: " + written + " " + string);
        fs.close(info.fd, function(err2) {
          if (err2) console.log(err2);
          _parse(info.path, callback, errback);
        });
      });
    });
  }
};
