var app = require('express').createServer();

var sys = require('sys'),
	graphviz = require('graphviz');

app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('index.ejs', {});
});

app.get('/image.png', function(req,res){
	var g = graphviz.digraph("G");
	var n1 = g.addNode( "Hello" );
	n1.set( "color", "red" );
	n1.set( "style", "filled" );
	g.addNode( "World" );
	var e = g.addEdge( n1, "World" );
	e.set( "color", "red" );
	g.render( "png", function(render) {
		res.send(render, { 'Content-Type': 'image/png' })
	} );
})

app.listen(3000);