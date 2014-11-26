/**
 * Module dependencies
 */
var Hash = require('./core_ext/hash').Hash,
  Attributes = require('./attributes').Attributes;

/**
 * Create a new edge
 * @constructor
 * @param {Graph} graph Parent Graph
 * @param {String|Node} nodeOne The first node
 * @param {String|Node} nodeTwo The second node
 * @return {Edge}
 * @api public
 */
var Edge = exports.Edge = function(graph, nodeOne, nodeTwo) {
  this.relativeGraph = graph;
  this.nodeOne = nodeOne;
  this.nodeTwo = nodeTwo;
  this.attributes = new Attributes("E");
};

/**
 * Set an edge attribute
 *
 * @param {String} name The attribute name
 * @param {Void} value The attribute value
 * @api public
 */
Edge.prototype.set = function(name, value) {
  this.attributes.set(name, value);
  return this;
};

/**
 * Get an edge attribute
 *
 * @param {String} name The attribute name
 * @return {Void}
 * @api public
 */
Edge.prototype.get = function(name) {
  return this.attributes.get(name);
};

/**
 * @api private
 */
Edge.prototype.to_dot = function() {
  var edgeLink = "->";
  if(this.relativeGraph.type === "graph") {
    edgeLink = "--";
  }
  
  var edgeOutput = '"' + this.nodeOne.id + '"' + " " + edgeLink + " " + '"' + this.nodeTwo.id + '"';
  edgeOutput = edgeOutput + this.attributes.to_dot();
  return edgeOutput;
};
