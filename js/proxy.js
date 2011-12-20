var http = require("http");

http.createServer( function(req, res){

  res.writeHead(200, {
        'content-type': 'text/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers' : 'x-requested-with'
  });

	var options = {
		host: 'www.vesseltracker.com',
		port: 80,
		path: '/maps/tradav/map.xml'
	};

	http.get(options, function(xmlData){
		xmlData.on('data', function(chunk){
			res.write(chunk);
		}).on('end', function() {
			res.end();
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
	
}).listen(1337);
 
console.log('Server running at http://127.0.0.1:1337');
