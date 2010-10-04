var express = require('express'),
	app = express.createServer(),
	temp = require('temp'),
	fs = require('fs');

var sys = require('sys'),
	graphviz = require('graphviz');

app.set('views', __dirname + '/views');
app.configure(function(){ 
	app.use(express.bodyDecoder());
})

app.get('/', function(req, res){
    res.render('index.ejs', {});
});

app.post('/test', function(req,res){
	temp.open('dotGraph', function(err, info) {
	  fs.write(info.fd, req.body.data);
	  fs.close(info.fd, function(err) {
			graphviz.parse( info.path, function(graph) {
				graph.render( "png", function(render) {
					img = '<img src="data:image/png;base64,'+render.toString("base64")+'"/>'
					res.send(img)
				});
			});
	  });
	});
})

app.listen(3000);