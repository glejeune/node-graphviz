var express = require('express'),
  app = express.createServer(),
  temp = require('temp'),
  fs = require('fs');

var sys = require('sys'),
  graphviz = require('../../lib/graphviz');

var http = require('http'),
  url = require('url');

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
        }, function(code, out, err) {
          img = '<div class="error"><p><b>Render error (code '+code+')</b></p>';
          img += '<p>STDOUT : '+out+'</p>';
          img += '<p>STDERR : '+err+'</p></div>';
          res.send(img)
        });
      }, function(code, out, err){
        img = '<div class="error"><p><b>Parser error (code '+code+')</b></p>';
        img += '<p>STDERR : '+err+'</p></div>';
        img += '<p>STDOUT : '+out+'</p></div>';
        res.send(img)
      });
    });
  });
})

app.get('/draw/*', function(req,res){
	var urlData = url.parse(req.params[0]);
	
	var urlPort = urlData.port;
	if( urlPort == undefined ) {
		urlPort = 80;
	}
	var urlHost = urlData.host;
	var urlPath = urlData.pathname;
	
	var client = http.createClient(urlPort, urlHost);
	var request = client.request('GET', urlPath,
	  {'host': urlHost});
	request.end();
	request.on('response', function (response) {
	  response.setEncoding('utf8');
	  if(response.statusCode == 404 ) {
			res.send('<div class="error"><p><b>'+req.params[0]+'</b> does not exist (404 error)</p></div>');
		} else {
	  	response.on('data', function (chunk) {
				temp.open('dotGraph', function(err, info) {
			    fs.write(info.fd, chunk);
			    fs.close(info.fd, function(err) {
			      graphviz.parse( info.path, function(graph) {
			        graph.render( "png", function(render) {
			          img = '<img src="data:image/png;base64,'+render.toString("base64")+'"/>'
			          res.send(img)
			        }, function(code, out, err) {
			          img = '<div class="error"><p><b>Render error (code '+code+')</b></p>';
			          img += '<p>STDOUT : '+out+'</p>';
			          img += '<p>STDERR : '+err+'</p></div>';
			          res.send(img)
			        });
			      }, function(code, out, err){
			        img = '<div class="error"><p><b>Parser error (code '+code+')</b></p>';
			        img += '<p>STDERR : '+err+'</p></div>';
			        img += '<p>STDOUT : '+out+'</p></div>';
			        res.send(img)
			      });
			    });
			  });
	  	});
		}
	});
})

app.listen(3000);