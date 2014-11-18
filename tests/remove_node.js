var util = require('util'),
    graphviz = require('../lib/graphviz');


//create a graph
var g = graphviz.digraph("G");

//add some nodes
g.addNode("a");
g.addNode("b");
g.addNode("c");
g.addNode("d");
g.addNode("e");


//add relations
g.addEdge("a", "b");
g.addEdge("a", "c");
g.addEdge("c", "b");
g.addEdge("a", "d");

g.output( "png", "remove_node_original.png" );


//soft removeNode
//will remove the node, but not the edges
g.removeNode("e");
g.output( "png", "remove_node_soft.png" );

//hard removeNode
//removes the node and the edgesfrom and to the node
g.removeNode("c", true);
g.output( "png", "remove_node_hard.png" );

console.log(g.to_dot())
