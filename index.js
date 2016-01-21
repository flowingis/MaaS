var express = require('express');
var fs = require('fs');
var envs = require('envs');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.end('Ciao');
    /* mettere documentazione - usage */
});

app.get('/memes', function (req, res) {
    var images = [];
    var hostname = 'http://' + req.headers.host;

    fs.readdir(__dirname + '/images/', function (err, files) {
        if (err) {
            console.log(err);
        }

        files.forEach(function (f) {
            var name = f.replace('.png', '');

            images.push({
                name: name,
                url: hostname + '/meme/' + name
            })
        });

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(images));
    });
});

app.get('/meme/:name', function (req, res) {
    var filename = __dirname + '/images/' + req.params.name + '.png';
    try {
        var img = fs.readFileSync(filename);
    } catch (err) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: 'File not found'}));
    }

    res.writeHead(200, {"Content-Type": "image/png"});
    res.end(img, 'binary');
});

app.post('/slack', function (req, res) {
    //var slacktoken = envs('TOKEN');
    var filename = __dirname + '/images/' + req.body.text + '.png';
    var imageurl = 'http://' + req.headers.host + '/meme/' + req.body.text;

    try {
        var img = fs.readFileSync(filename);

    } catch (err) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end('File not found');
    }

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({
        "text": "",
        "attachments": [
            {
                "fallback": req.body.text,

                "color": "#fff",

                "image_url": imageurl,
                "thumb_url": imageurl
            }
        ]
    }));
});


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});