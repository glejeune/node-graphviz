var Hash = require( './core_ext/hash' ).Hash,
  Node = require( './node' ).Node,
  Edge = require( './edge' ).Edge,
  sys = require('sys'),
  fs = require('fs'),
  exec  = require('child_process').exec,
  child;

var Graph = exports.Graph = function(graph, id) {
  this.relativeGraph = graph;
  this.id = id;
  this.type = "graph";
  this.gvPath = "";
  this.nodes = new Hash();
  this.edges = new Array();
  this.clusters = new Hash();
  this.graphAttributs = new Hash();
};

//
// Set the graph type
//
// This method may not be called directly but internaly
//
Graph.prototype.setType = function(type) {
  this.type = type;
}

Graph.prototype.getType = function(type) {
  return this.type;
}

Graph.prototype.addNode = function(id) {
  this.nodes.setItem(id, new Node(this, id));
  return this.nodes.items[id];
}

Graph.prototype.getNode = function(id) {
  return this.nodes.items[id];
}

Graph.prototype.nodeCount = function() {
  return this.nodes.length;
}

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

Graph.prototype.edgeCount = function() {
  return this.edges.length;
};

Graph.prototype.addCluster = function(id) {
  var cluster = new Graph(this, id);
  cluster.setType( this.type );
  this.clusters.setItem(id, cluster);
  return cluster;
}

Graph.prototype.getCluster = function(id) {
  return this.clusters.items[id];
}

Graph.prototype.clusterCount = function() {
  return this.clusters.length;
}

Graph.prototype.set = function(name, value) {
  this.graphAttributs.setItem(name, value);
}

Graph.prototype.get = function(name) {
  return this.graphAttributs.items[name];
}

Graph.prototype.to_dot = function() {
  var dotScript = "";
  if( this.relativeGraph == null ) {
    dotScript = this.type + " " + this.id + " {\n"
  } else {
    dotScript = "subgraph " + this.id + " {\n"
  }
  
  // Graph attributs
  for( var name in this.graphAttributs.items ) {
    dotScript = dotScript + "  " + name + " = \"" + this.graphAttributs.items[name] + "\";\n"
  }
  
  // Each clusters
  for( var id in this.clusters.items ) {
    dotScript = dotScript + this.clusters.items[id].to_dot() + "\n"
  }
  
  // Each nodes
  for( var id in this.nodes.items ) {
    dotScript = dotScript + "  " + this.nodes.items[id].to_dot() + ";\n"
  }
  
  // Each edges
  for( var i in this.edges ) {
    // dotScript = dotScript + "  " + this.edges[i].nodeOne.id + " " + edgeLink + " " + this.edges[i].nodeTwo.id + ";\n"
    dotScript = dotScript + "  " + this.edges[i].to_dot() + ";\n"
  }
  
  dotScript = dotScript + "}\n"
  
  return dotScript;
}

Graph.prototype.output = function(type, name) {
  var dotFile = name+".dot"
  fs.writeFile(dotFile, this.to_dot(), function (err) {
    if (err) throw err;
  });
  
  var cmd = this.gvPath + "dot -T" + type + " -o" + name + " " + dotFile;
  child = exec(cmd, 
    function (error, stdout, stderr) {
      sys.print('stdout: ' + stdout + "\n");
      sys.print('stderr: ' + stderr + "\n");
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });
  
  // TODO: this does not work ! -- Need a Tempfile class "à la" Ruby
  // fs.unlink(dotFile);
}

Graph.prototype.setGraphVizPath = function(path) {
  this.gvPath = path + "/";
}