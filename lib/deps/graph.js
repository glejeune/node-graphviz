/**
 * Module dependencies
 */
var Hash = require( './core_ext/hash' ).Hash,
  Node = require( './node' ).Node,
  Edge = require( './edge' ).Edge,
  gvattrs = require( './attributes' ),
  Attributes = gvattrs.Attributes,
  util = require('util'),
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
  if( this.relativeGraph == null ) {
    this.graphAttributes = new Attributes("G");
  } else {
    this.graphAttributes = new Attributes("C");
  }
  this.nodesAttributes = new Attributes("N");
  this.edgesAttributes = new Attributes("E");
  this.use = 'dot';
};

/**
 * Create a new node
 *
 * @param {String} id The node ID
 * @param {Object} attrs Node attributes
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

Graph.prototype.from = function(id) {
	if( this.nodes.items[id] == undefined ) {
		this.addNode(id);
	}
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
 * @param {Object} attrs Node attributes
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
 * Set a graph attribute
 *
 * @param {String} name The attribute name
 * @param {Void} value The attribute value
 * @api public
 */
Graph.prototype.set = function(name, value) {
  this.graphAttributes.set(name, value);
}

/**
 * Get a graph attribute
 *
 * @param {String} name The attribute name
 * @return {Void}
 * @api public
 */
Graph.prototype.get = function(name) {
  return this.graphAttributes.get(name);
}

/**
 * Set a global node attribute
 *
 * @param {String} name The attribute name
 * @param {Void} value The attribute value
 * @api public
 */
Graph.prototype.setNodeAttribute = function(name, value) {
  this.nodesAttributes.set(name, value);
}

/**
 * Get a global node attribute
 *
 * @param {String} name The attribute name
 * @return {Void}
 * @api public
 */
Graph.prototype.getNodeAttribute = function(name) {
  return this.nodesAttributes.get(name);
}

/**
 * Set a global edge attribute
 *
 * @param {String} name The attribute name
 * @param {Void} value The attribute value
 * @api public
 */
Graph.prototype.setEdgeAttribute = function(name, value) {
  this.edgesAttributes.set(name, value);
}

/**
 * Get a global edge attribute
 *
 * @param {String} name The attribute name
 * @return {Void}
 * @api public
 */
Graph.prototype.getEdgeAttribute = function(name) {
  return this.edgesAttributes.get(name);
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
  
  // Graph attributes
  if( this.graphAttributes.length() > 0 ) {
    dotScript = dotScript + "  graph" + this.graphAttributes.to_dot() + ";\n";
  }
  
  // Nodes attributes
  if( this.nodesAttributes.length() > 0 ) {
    dotScript = dotScript + "  node" + this.nodesAttributes.to_dot() + ";\n";
  }
  
  // Edges attributes
  if( this.edgesAttributes.length() > 0 ) {
    dotScript = dotScript + "  edge" + this.edgesAttributes.to_dot() + ";\n";
  }
  
  // Each clusters
  for( var id in this.clusters.items ) {
    if (this.clusters.items.hasOwnProperty(id)) {
      dotScript = dotScript + this.clusters.items[id].to_dot() + '\n';
    }
  }
  
  // Each nodes
  for( var id in this.nodes.items ) {
    if (this.nodes.items.hasOwnProperty(id)) {
      dotScript = dotScript + '  ' + this.nodes.items[id].to_dot() + ';\n'
    }
  }
  
  // Each edges
  for( var i in this.edges ) {
    if (this.edges.hasOwnProperty(i)) {
      dotScript = dotScript + '  ' + this.edges[i].to_dot() + ';\n'
    }
  }
  
  dotScript = dotScript + '}\n'
  
  return dotScript;
}

/**
 * Generate an output in file or memory
 *
 * @param {String|Object} type The output file type (png, jpeg, ps, ...) or options
 * @param {String|Function} name_or_callback The output file name or callback
 * @param {Function} errback Error callback
 * @api public
 *
 * Options :
 *   - type : output file type (png, jpeg, ps, ...)
 *   - use : Graphviz command to use (dot, neato, ...)
 *   - path : GraphViz path
 *   - G : 
 *   - N :
 *   - E :
 */
Graph.prototype.render = function(type_or_options, name_or_callback, errback) {
	var parameters = [];
	
	// Get output type
	var type = type_or_options;
	if( typeof(type_or_options) == 'object' ) {
		type = type_or_options.type;

		// Get use
		if( type_or_options.use != undefined ) { this.use = type_or_options.use; }
		
		// Get path
		if( type_or_options.path != undefined ) { this.gvPath = type_or_options.path; }
		
		// Get extra Graph Options
		if( type_or_options.G != undefined ) {
			for( attr in type_or_options.G ) {
				if( gvattrs.isValid( attr, "G" ) == false ) {
					util.debug( "Warning : Invalid attribute `"+attr+"' for a graph" );
				}
	      parameters.push( "-G"+attr+"="+type_or_options.G[attr] )
	    }
		}
		// Get extra Node Options
		if( type_or_options.N != undefined ) {
			for( attr in type_or_options.N ) {
				if( gvattrs.isValid( attr, "N" ) == false ) {
					util.debug( "Warning : Invalid attribute `"+attr+"' for a node" );
				}
	      parameters.push( "-N"+attr+"="+type_or_options.N[attr] )
	    }			
		}
		// Get extra Edge Options
		if( type_or_options.E != undefined ) {
			for( attr in type_or_options.E ) {
				if( gvattrs.isValid( attr, "E" ) == false ) {
					util.debug( "Warning : Invalid attribute `"+attr+"' for an edge" );
				}
	      parameters.push( "-E"+attr+"="+type_or_options.E[attr] )
	    }			
		}
	}
	parameters.push( '-T' + type );
	
  var dotScript = this.to_dot();
  
  var cmd = this.use;
  if( this.gvPath != '' ) {
    cmd = path.join( this.gvPath, this.use )
  }
  
  var rendered = null;
  var out = ''
  var err = ''
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
    outcallback = function(data) { out += data; }
  }
  
  graphviz = spawn(cmd, parameters);
  graphviz.stdout.on('data', outcallback);
  graphviz.stderr.on('data', function(data) {
    err += data;
  });
  graphviz.on('exit', function(code) {
    if(code !== 0) {
      if(errback) { errback(code, out, err) }
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
