// This file is a node-jake file -- http://github.com/mde/node-jake

var sys = require('sys'),
	exec  = require('child_process').exec,
	child;

var docTitle = 'node-graphviz'
var docFiles = 'lib/graphviz.js lib/deps/graph.js lib/deps/node.js lib/deps/edge.js'
var outputDocFile = 'documentation.html'
var docRibbon = 'http://github.com/glejeune/node-graphviz'
var docDesc = '[Node.js](http://nodejs.org) interface to the [GraphViz](http://graphviz.org) graphing tool'

desc('Generate node-graphviz documentation.');
task('doc', [], function () {
  child = exec('dox -r ' + docRibbon + ' -d "' + docDesc + '" -t "' + docTitle + '" -J ' + docFiles + ' > ' + outputDocFile, 
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });
});