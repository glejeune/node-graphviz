/**
 * Module dependencies
 */
var Hash = require( './core_ext/hash' ).Hash,
  Node = require( './node' ).Node,
  Edge = require( './edge' ).Edge,
  sys = require('sys'),
  fs = require('fs'),
  exec  = require('child_process').exec,
  child;

/**
 * Create a new graph
 * @constructor
 * @param {Graph} graph Parent Graph
 * @param {String} id The graphID
 * @return {Graph}
 * @api public
 */
var Graph = exports.Graph = function(graph, id) {
  this.relativeGraph = graph;
  this.id = id;
  this.type = 'graph';
  this.gvPath = '';
  this.nodes = new Hash();
  this.edges = new Array();
  this.clusters = new Hash();
  this.graphAttributs = new Hash();
  this.nodesAttributs = new Hash();
  this.edgesAttributs = new Hash();
  this.use = 'dot';
};

/**
 * Create a new node
 *
 * @param {String} id The node ID
 * @return {Node}
 * @api public
 */
Graph.prototype.addNode = function(id) {
  this.nodes.setItem(id, new Node(this, id));
  return this.nodes.items[id];
}

/**
 * Return a node for a given ID
 *
 * @param {String} id The node ID
 * @return {Node}
 * @api public
 */
Graph.prototype.getNode = function(id) {
  return this.nodes.items[id];
}

/**
 * Return the number of nodes in the current graph
 *
 * @return {Integer}
 * @api public
 */
Graph.prototype.nodeCount = function() {
  return this.nodes.length;
}

/**
 * Create a new edge
 *
 * @param {String|Node} nodeOne
 * @param {String|Node} nodeTwo
 * @return {Edge}
 * @api public
 */
Graph.prototype.addEdge = function(nodeOne, nodeTwo) {
  var _nodeOne = nodeOne;
  var _nodeTwo = nodeTwo;
  if( typeof(nodeOne) == 'string' ) {
    _nodeOne = this.nodes.items[nodeOne];
    if( _nodeOne == null ) {
      _nodeOne = this.addNode( nodeOne );
    }
  }
  if( typeof(nodeTwo) == 'string' ) {
    _nodeTwo = this.nodes.items[nodeTwo];
    if( _nodeTwo == null ) {
      _nodeTwo = this.addNode( nodeTwo );
    }
  }
  
  var edge = new Edge(this, _nodeOne, _nodeTwo);
  this.edges.push( edge );
  
  return edge;
}

/**
 * Return the number of edges in the current graph
 *
 * @return {Integer}
 * @api public
 */
Graph.prototype.edgeCount = function() {
  return this.edges.length;
};

/**
 * Create a new subgraph
 *
 * @param {String} id The subgraph ID
 * @return {Graph}
 * @api public
 */
Graph.prototype.addCluster = function(id) {
  var cluster = new Graph(this, id);
  cluster.type = this.type;
  this.clusters.setItem(id, cluster);
  return cluster;
}

/**
 * Return a subgraph for a given ID
 *
 * @param {String} id The subgraph ID
 * @return {Graph}
 * @api public
 */
Graph.prototype.getCluster = function(id) {
  return this.clusters.items[id];
}

/**
 * Return the number of subgraphs in the current graph
 *
 * @return {Integer}
 * @api public
 */
Graph.prototype.clusterCount = function() {
  return this.clusters.length;
}

/**
 * Set a graph attribut
 *
 * @param {String} name The attribut name
 * @param {Void} value The attribut value
 * @api public
 */
Graph.prototype.set = function(name, value) {
  this.graphAttributs.setItem(name, value);
}

/**
 * Get a graph attribut
 *
 * @param {String} name The attribut name
 * @return {Void}
 * @api public
 */
Graph.prototype.get = function(name) {
  return this.graphAttributs.items[name];
}

/**
 * Set a global node attribut
 *
 * @param {String} name The attribut name
 * @param {Void} value The attribut value
 * @api public
 */
Graph.prototype.setNodeAttribut = function(name, value) {
  this.nodesAttributs.setItem(name, value);
}

/**
 * Get a global node attribut
 *
 * @param {String} name The attribut name
 * @return {Void}
 * @api public
 */
Graph.prototype.getNodeAttribut = function(name) {
  return this.nodesAttributs.items[name];
}

/**
 * Set a global edge attribut
 *
 * @param {String} name The attribut name
 * @param {Void} value The attribut value
 * @api public
 */
Graph.prototype.setEdgeAttribut = function(name, value) {
  this.edgesAttributs.setItem(name, value);
}

/**
 * Get a global edge attribut
 *
 * @param {String} name The attribut name
 * @return {Void}
 * @api public
 */
Graph.prototype.getNodeAttribut = function(name) {
  return this.edgesAttributs.items[name];
}

/**
 * Generate the GraphViz script
 *
 * @return {String}
 * @api public
 */
Graph.prototype.to_dot = function() {
  var dotScript = '';
  if( this.relativeGraph == null ) {
    dotScript = this.type + ' ' + this.id + ' {\n'
  } else {
    dotScript = 'subgraph ' + this.id + ' {\n'
  }
  
  // Graph attributs
  for( var name in this.graphAttributs.items ) {
    dotScript = dotScript + '  ' + name + ' = \"' + 
			this.graphAttributs.items[name] + '\";\n'
  }
  
  // Nodes attributs
  if( this.nodesAttributs.length > 0 ) {
    dotScript = dotScript + '  node [\n'
    var sep = '    '
    for( var name in this.nodesAttributs.items ) {
      dotScript = dotScript + sep + name + ' = \"' + 
				this.nodesAttributs.items[name] + '\"'
      sep = ',\n    '
    }
    dotScript = dotScript + '\n  ];\n'
  }
  
  // Edges attributs
  if( this.edgesAttributs.length > 0 ) {
    dotScript = dotScript + '  edge [\n'
    var sep = '    '
    for( var name in this.edgesAttributs.items ) {
      dotScript = dotScript + sep + name + ' = \"' + 
				this.edgesAttributs.items[name] + '\"'
      sep = ',\n    '
    }
    dotScript = dotScript + '\n  ];\n'
  }
  
  // Each clusters
  for( var id in this.clusters.items ) {
    dotScript = dotScript + this.clusters.items[id].to_dot() + '\n'
  }
  
  // Each nodes
  for( var id in this.nodes.items ) {
    dotScript = dotScript + '  ' + this.nodes.items[id].to_dot() + ';\n'
  }
  
  // Each edges
  for( var i in this.edges ) {
    dotScript = dotScript + '  ' + this.edges[i].to_dot() + ';\n'
  }
  
  dotScript = dotScript + '}\n'
  
  return dotScript;
}

/**
 * Generate an output file
 *
 * @param {String} type The output file type (png, jpeg, ps, ...)
 * @param {String} name The output file name
 * @api public
 */
Graph.prototype.output = function(type, name) {
  var dotFile = name+'.dot'
  fs.writeFile(dotFile, this.to_dot(), function (err) {
    if (err) throw err;
  });
  
  var cmd = this.gvPath + this.use + ' -T' + type + ' -o' + name + ' ' + dotFile;
  child = exec(cmd, 
    function (error, stdout, stderr) {
      sys.print('stdout: ' + stdout + '\n');
      sys.print('stderr: ' + stderr + '\n');
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });
  
  // TODO: this does not work ! -- Need a Tempfile class 'à la' Ruby
  // fs.unlink(dotFile);
}

/**
 * Set the GraphViz path
 *
 * @param {String} path The GraphViz path
 * @api public
 */
Graph.prototype.setGraphVizPath = function(path) {
  this.gvPath = path + '/';
}