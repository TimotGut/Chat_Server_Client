const e = require("express");
const express = require("express")
const app = express()
const Data = require('./Data.js');
const bodyParser = require('body-parser')
const EventEmitter = require("./eventEmitter")

const eventEmitter = new EventEmitter()
const port = 1337;
const cors = require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}



//all the data (quasi datenbank)
const data = new Data();


//Middleware
app.use(cors(corsOptions))
app.use(express.static("public"));

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))

//Response
//CRUD: Create Read Update Delete
//Read
app.get("/api/", (req, res, next) => {
    const body = {
        user: data.userData
    }

    res.json(body)
})



//Create
app.post("/api/", (req, res, next) => {
    
    data.newUser(req.body)
    
    Update()
    res.send()
})
app.post("/api/call/", (req, res, next) => {
    
    const ids = req;

    
    data.newChat(ids[0],ids[1])
    
    res.json({})
})

//new chat
app.post("/api/start-chat/", (req, res, next) => {
    
    const body = req.body;
    
    //if chat does not already exist
    if(data.newChat(body.ids[0],body.ids[1])){
        console.log("New Chat Created " + data.chats.length)
        Update()
    }else{
        console.log("Chat already exsists")
    }
    res.json({})
    
})

app.post("/api/new-Chat-Message/", (req,res) => {
    const body = req.body;
    
    if(data.newChatMessage(body.senderID,body.targetID,body.content) === true){
        console.log("Message Send")
        
        Update();
        res.status(200)
        
    }else{
        //createing a new chat message failed => chat doesn't exist 
        //create a new chat
        if(data.newChat(body.senderID,body.targetID)){
            //=> chat has been created
            //send chat message =>
            if(data.newChatMessage(body.senderID,body.targetID,body.content) === true){
                console.log("Message Send")
                Update();

            }else{
                
                console.log("something has gone wrong 1")
                res.status(420)
            }
        }else{
            console.log("something has gone wrong 2")
            res.status(420)
        }
    }
    res.send()
})

//Update
app.put("/api/", (req, res, next) => {
    

    const handler = function(){
        //client id
        const id = req.body.id;

        //find chats with senderID
        let chats = []
        data.chats.forEach(element => {
            if(element.findChatByID(id)){
                chats.push(element)
            }
        });

        
        const body = {
            calls: data.calls,
            chats: chats,
            user: data.userData,
        }
        res.status(200)
        res.json(body)


        eventEmitter.unregister(req.body.id)
    }

    eventEmitter.register(req.body.id,handler)
    

    

    
    
})



//Delete
app.delete("/api/", (req, res, next) => {
    
    let userId = req.body.id;
    if(data.disconnectUser(userId)){
        
        eventEmitter.unregister(userId)
        Update();
        res.json({message: "sucess"})
    }else{
        res.json({message: "failure"})
    }

    
})
app.delete("/api/call/", (req, res, next) => {
    
    let id = req.body.id
    data.removeCall(id)     
    
    res.json({});
})




app.listen(port, () => {
    
    console.log("Server listening on port: " + port)
})


function Update(){
    
    console.log("Sending Update!")
    
    eventEmitter.fire()
}



async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    }).catch(function() {});
  }   