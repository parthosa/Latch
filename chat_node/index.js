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

// // io.on('connection', function(socket){
// // 	console.log('a user connected');
// //   socket.on('chat message', function(msg){
// //     io.emit('chat message', msg);
// //     console.log('message: ' + msg);
// //   });
// // });

// // http.listen(3000, function(){
// //   console.log('listening on *:3000');
// // });
// io.sockets.on('connection', function (socket) {
    
//     //Grab message from Redis and send to client
//     sub.on('message', function(channel, message){
//         socket.send(message);
//     });
    
//     //Client is sending message through socket.io
//     socket.on('send_message', function (message) {
//         values = querystring.stringify({
//             comment: message,
//             sessionid: socket.handshake.cookie['sessionid'],
//         });



var http = require('http');
var server = http.createServer().listen(4000);
var io = require('socket.io').listen(server);
var cookie_reader = require('cookie');
var querystring = require('querystring');
 
var redis = require('redis');
var sub = redis.createClient();
 
//Subscribe to the Redis chat channel
sub.subscribe('chat');
 
//Configure socket.io to store cookie set by Django
// io.configure(function(){
//     io.set('authorization', function(data, accept){
//         if(data.headers.cookie){
//             data.cookie = cookie_reader.parse(data.headers.cookie);
//             return accept(null, true);
//         }
//         return accept('error', false);
//     });
//     io.set('log level', 1);
// });

io.sockets.on('connection', function (socket) {
    
    //Grab message from Redis and send to client
    sub.on('message', function(channel, message){
        socket.send(message);
    });
    
    //Client is sending message through socket.io
    socket.on('send_message', function (message, sessionid) {
        console.log(message);
        console.log(sessionid);
        values = querystring.stringify({
            comment: message,
            sessionid: sessionid
            // sessionid: socket.handshake.cookie['sessionid'],
        });
        
        var options = {
            host: 'localhost',
            port: 8001,
            path: '/main/node_api/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': values.length
            }
        };
        
        var req = {}
        //Send message to Django server
        req = http.get(options, function(res){
            res.setEncoding('utf8');
            
            //Print out error message
            res.on('data', function(message){
                if(message != 'Everything worked :)'){
                    console.log('Message: ' + message);
                }
            });
        });
        while(req=={}){
                req.write(values);
            }
        req.end();
    });
});


