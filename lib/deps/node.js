/**
 * Module dependencies
 */
var Hash = require('./core_ext/hash').Hash,
  Attributes = require('./attributes').Attributes;

/**
 * Create a new node
 * @constructor
 * @param {Graph} graph Parent Graph
 * @param {String} id The node ID
 * @return {Node}
 * @api public
 */
var Node = exports.Node = function(graph, id) {
  this.relativeGraph = graph;
  this.id = id;
  this.attributes = new Attributes("N");
};

/**
 *
 */
Node.prototype.to = function(id, attrs) {
	this.relativeGraph.addEdge(this, id, attrs);
	return this.relativeGraph.from(id);
};

/**
 * Set a node attribute
 *
 * @param {String} name The attribute name
 * @param {Void} value The attribute value
 * @api public
 */
Node.prototype.set = function(name, value) {
  this.attributes.set(name, value);
  return this;
};

/**
 * Get a node attribute
 *
 * @param {String} name The attribute name
 * @return {Void}
 * @api public
 */
Node.prototype.get = function(name) {
  return this.attributes.get(name);
};

/**
 * @api private
 */
Node.prototype.to_dot = function() {
  var nodeOutput = '"' + this.id + '"' + this.attributes.to_dot();
  return nodeOutput;
};
