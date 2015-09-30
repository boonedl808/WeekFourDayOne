var fs = require('fs');
var path = require('path');
var url = require('url');

function getFileExtension(route) {
    var arr = route.split('.');
    if(arr.length<=1) {
        return 'html'
    }
    return arr[arr.length -1].toLowerCase();
}

function handleRequests(req, res) {
    var header;
    var route = url.parse(req.url).path;
    if(route === '/') {
        route = '/index.html';
    }
    var ext = getFileExtension(route);
    switch (ext) {
        case 'css':
            header = {
                'Content-Type': 'text/css'
            };
            break;
        case 'js':
            header = {
                'Content-Type': 'application/javascript'
            };
            break;
        case 'html':
            header = {
                'Content-Type': 'text/html'
            };
            break;
        default:
            header = {
                'Content-Type': 'application/json'
            };
            break;
    }
    
    var filePath;
    if(route === '/messages') {
        if(req.method === 'GET') {
            filePath = path.join(__dirname, './messages.txt');
            readFile(filePath, function(data){
                writeResponse(res, data, header)    
            });
        }
        if(req.method === 'POST') {
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                writeTweet(JSON.parse(body), res);
            });
        }
    } else {
        
        filePath = path.join(__dirname, '../client' + route);
        readFile(filePath, function(data){
            writeResponse(res, data, header)    
        });
    }
}

function writeTweet(tweet, res) {
    if(tweet.text && tweet.userName) {
        var filePath = __dirname + '/messages.txt'; 
        readFile(filePath, function(data){
            var tweets = JSON.parse(data);
            tweets.push(tweet);
            fs.writeFile(filePath,JSON.stringify(tweets), function(err){
                res.writeHead(201);
                res.end();
            });    
        });
    } else {
        console.log('server error');
        res.writeHead(500);
        res.end();
    }
}

function writeResponse(res, data, header) {
    var statusCode = statusCode || 200;
    res.writeHead(statusCode, header);
    res.end(data);
}

function readFile(filePath, callBack) {
    fs.readFile(filePath, function (err, data) {
        callBack(data);
    });
}

module.exports = {
    handleRequests: handleRequests
};