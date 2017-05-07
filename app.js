var express = require('express');
var app = express();
var server = require('http').createServer(app);


var io = require('socket.io').listen(server);


var users = [];

var connections = [];


server.listen(3000);

app.get('/',function(erq,res,next){
    res.sendFile(__dirname +'/index.html');
})


io.sockets.on('connection',function(client){
    connections.push(client);
    console.log('socket connected: ', connections.length);

    client.on('disconnect',function(data){

        users.splice(users.indexOf(client.username,1));
        updateUserNames();
        connections.splice(connections.indexOf(client),1);
        console.log('socket disconnected: ', connections.length);
    })
     
    client.on('send message',function(data){
        console.log('data ',data);
        io.sockets.emit('new message',{msg : data, user :client.username});
    }) 

    //new user
    client.on('new user',function(data,callback){
        callback(true);
        client.username = data;
        users.push(client.username);
        updateUserNames();
    });

    function updateUserNames(){
        io.sockets.emit('get users',users);
    }
})

