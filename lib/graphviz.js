/**
 * Module dependencies.
 */
var path = require('path'),
  spawn = require('child_process').spawn,
  temp = require('temp'),
  which = require('which'),
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
 * @param {Boolean} isStrict if the Graph is strict
 * @return {Graph}
 * @api public
 */
exports.digraph = function(id, isStrict = false) {
  var graph = new Graph(null, id);
  graph.type = 'digraph';
  graph.isStrict = isStrict;
  return graph;
};

function _parse(file, callback, errback) {
  which('gvpr', function(err, cmdPath) {
    if (err) {
      if (errback) {
        errback(-1, '', 'Command gvpr not found');
      }
    } else {
      var gvprScript = path.join(__dirname, 'ext', 'gvpr', 'dot2js.g'),
        parameters = ['-f' + gvprScript, file],
        __graph_eval,
        err = '',
        out = '',
        graphviz = spawn(cmdPath, parameters);

      graphviz.stdout.on('data', function(data) {
        out += data;
      });
      graphviz.stderr.on('data', function(data) {
        err += data;
      });
      graphviz.stdin.end();
      graphviz.on('exit', function(code) {
        if (code !== 0) {
          if (errback) {
            errback(code, out, err);
          }
        } else {
          eval(out.toString());
          if (typeof __graph_eval == 'undefined') {
            if (errback) {
              errback(code, out, '__graph_eval is not defined in call to graphviz');
            }
          } else {
            callback(__graph_eval);
          }
        }
      });
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
  if (fsExt.exist(file_or_script)) {
    _parse(file_or_script, callback, errback);
  } else {
    temp.open('node-graphviz', function(err, info) {
      if (err) {
        return errback(err);
      }
      fs.write(info.fd, file_or_script, function(err) {
        if (err) {
          return errback(err);
        }
        fs.close(info.fd, function(err) {
          if (err) {
            return errback(err);
          }
          _parse(info.path, callback, errback);
        });
      });
    });
  }
};
