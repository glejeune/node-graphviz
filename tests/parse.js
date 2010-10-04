var sys = require('sys'),
	graphviz = require('../lib/graphviz');

graphviz.parse( "cluster.dot", function(graph) {
	graph.render( "png", "cluster.png" );
})

graphviz.parse( "cluster.dot", function(graph) {
	graph.render( "png", function(render) {
		process.stdout.write( render );
	});
});