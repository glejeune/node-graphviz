/**
 * Module dependencies
 */
var Hash = require( './core_ext/hash' ).Hash,
  Node = require( './node' ).Node,
  Edge = require( './edge' ).Edge,
  sys = require('sys'),
  path = require('path'),
  spawn  = require('child_process').spawn;

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
 * @param {Object} attrs Node attributs
 * @return {Node}
 * @api public
 */
Graph.prototype.addNode = function(id, attrs) {
  this.nodes.setItem(id, new Node(this, id));
  if( attrs ) {
    for( k in attrs ) {
      this.nodes.items[id].set( k, attrs[k] );
    }
  }

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
 * @param {Object} attrs Node attributs
 * @return {Edge}
 * @api public
 */
Graph.prototype.addEdge = function(nodeOne, nodeTwo, attrs) {
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
  if( attrs ) {
    for( k in attrs ) {
      edge.set( k, attrs[k] );
    }
  }
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
 * Generate an output in file or memory
 *
 * @param {String} type The output file type (png, jpeg, ps, ...)
 * @param {String|Function} name_or_callback The output file name or callback
 * @param {Function} errback Error callback
 * @api public
 */
Graph.prototype.render = function(type, name_or_callback, errback) {
  var dotScript = this.to_dot();
  
  var cmd = this.use;
  if( this.gvPath != '' ) {
    cmd = path.join( this.gvPath, this.use )
  }
  
  var rendered = null;
  var parameters = ['-T' + type];
  var outcallback = function(data) { 
    if( rendered == null ) {
      rendered = data; 
    } else {
      __b = new Buffer( rendered.length + data.length )
      rendered.copy(__b, 0, 0)
      data.copy(__b, rendered.length, 0)
      rendered = __b
    }
  };
  
  if( typeof(name_or_callback) == 'string' ) {
    parameters.push( '-o' + name_or_callback )
    outcallback = function(data) { if(data) console.log(data); }
  }
  
  graphviz = spawn(cmd, parameters);
  graphviz.stdout.on('data', outcallback);
  graphviz.stderr.on('data', function(data) {
    if(data) console.log("STDERR:"+data);
  });
  graphviz.on('exit', function(code) {
    if(code !== 0) {
      if(errback) { errback(code) }
    } else {
      if( typeof(name_or_callback) == 'function' ) name_or_callback(rendered);
    }
  });
  graphviz.stdin.write(this.to_dot());
  graphviz.stdin.end();
}
// Compatibility
Graph.prototype.output = function(type, name_or_callback, errback) {
  this.render(type, name_or_callback, errback);
}

/**
 * Set the GraphViz path
 *
 * @param {String} path The GraphViz path
 * @api public
 */
Graph.prototype.setGraphVizPath = function(path) {
  this.gvPath = path;
}