const client = require('socket.io').listen(4000).sockets;

console.log(client);


//registered a listner "connection"
client.on('connection',(args)=>{
	
	console.log("connect",args);
	
	
})

//Raise an event "connection
client.emit("connection",{id:1, url:'htpps' });
