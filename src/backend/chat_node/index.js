// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// var redis = require('socket.io/node_modules/redis');
// var sub = redis.createClient();
 
// //Subscribe to the Redis chat channel
// sub.subscribe('chat_message');

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });
//         });



var http = require('http');
var request = require('request');
base_url = '192.168.43.56';
var server = http.createServer().listen(4000, base_url);
var io = require('socket.io').listen(server);
var cookie_reader = require('cookie');
var querystring = require('querystring');
 
var redis = require('redis');
var sub = redis.createClient();
 
//Subscribe to the Redis chat channel
sub.subscribe('chat');
 


io.sockets.on('connection', function (socket) {
    console.log(35);
    socket.on('send_message_indi', function (data) {
        // message_split=data.split(',');
 
        console.log(data);
        var options = {
            // host: 'localhost',
            // port: 8001,
            // path: '/main/node_api/',
            url: 'http://'+base_url+':8001/main/user/chat/indi/',
            method: 'POST',
            form: data,
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Length': values.length,
                // "X-CSRFToken": message[2],
                // 'Cookie': 'csrftoken=' + message_split[2]
            }
        }
        // console.log(6);
        // var req = {}
        // //Send message to Django server
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                // io.emit('send_message_indi', data)
                console.log(3);
                console.log(body)
                io.sockets.emit('send_message_indi', data)
            }
            console.log(body);
        });
});


    });

io.sockets.on('connection', function (socket) {
    console.log(35);
    socket.on('send_message_group', function (data) {
        console.log(data);

        var options = {
            // host: 'localhost',
            // port: 8001,
            // path: '/main/node_api/',
            url: 'http://'+base_url+':8001/main/room/message_send/',
            method: 'POST',
            form: data,
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Length': values.length,
                // "X-CSRFToken": message[2],
                // 'Cookie': 'csrftoken=' + message_split[2]
            }
        }
        // console.log(6);
        // var req = {}
        // //Send message to Django server
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                // io.emit('send_message_indi', JSON.parse(data))
                console.log(3);
                console.log(body)
                io.sockets.emit('send_message_group', data)
            }
            console.log(body);
        });
});


    });



