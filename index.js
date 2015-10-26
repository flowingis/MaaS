var express = require('express');
var fs = require('fs');
var app = express();
var hostname = 'http://localhost:8088';

app.get('/', function(req, res){
    res.end('Ciao');
});

app.get('/memes', function(req, res){
    var images = [];

    fs.readdir(__dirname+'/images/', function(err, files){
        if(err) {
            console.log(err);
        }

        files.forEach(function(f){
            var name =  f.replace('.png', '');

            images.push({
                name: name,
                url: hostname+'/meme/'+name
            })
        });

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(images));
    });
});

app.get('/meme/:name', function(req, res){
    var filename = __dirname+'/images/'+req.params.name+'.png';
    try {
        var img = fs.readFileSync(filename);
    } catch(err) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: 'File not found'}));
    }

    res.writeHead(200, {"Content-Type": "image/png"});
    res.end(img, 'binary');
});

var server = app.listen(8088, function(){
    console.log(__dirname);
    console.log('Mi chiamo '+ server.address().address);
});