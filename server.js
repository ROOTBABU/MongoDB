const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

//Connect to mongo 

mongo.connect('mongodb://localhost:27017',{ useNewUrlParser: true },function(err,data){
    if(err){

       console.log(err);

    }
    
    console.log("mongoDb connected........");
    
    //connect to socket.io  //Register a listner "connection"
    client.on('connection',function(socket){
		
		
		var db = data.db('mongochat');
		let chat = db.collection('chats');
		
		//create function to send status
		sendStatus = function(s){
			
			//Raise an event "status"
			socket.emit('status',s);
			
		}
		//get chat from mongo collection
		chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
			if(err){
				console.log(err);
			}
			
			//emit the message//Raise an event "output"
			socket.emit('output',res);
			});
		
		//Handle input events
		//Register a listner "input"
		socket.on('input',function(data){
			let name = data.name;
			let message = data.message;
			
			//check for name and message
			if(name=="" || message==""){
				//send error status
				sendStatus("ps enter name and message");
			}
			else{
				
				//insert message
				chat.insert({name:name,message:message},function(){
					
					//raise an event "output"
					client.emit('output',[data]);
					
					//send status object
					sendStatus({
						
						message:"message sent",
						clear: true
						
						});
					});
				
			}
			});
			//handle clear //register an lisner "clear"
			socket.on('clear',function(data){
				
				//remove all chats from all the collection
				chat.remove({},function(){
					//Raise an event "cleared"
					socket.emit('cleared');
					});
				});
		
		});
    
    }
);
