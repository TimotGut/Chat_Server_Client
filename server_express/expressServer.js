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




//Create
app.post("/api/", (req, res, next) => {
    
    data.newUser(req.body)
    
    Update()
    res.send()
})


//new chat
app.post("/api/start-chat/", (req, res, next) => {
    
    const body = req.body;
    
    //if chat does not already exist
    if(data.newChat(body.ids[0],body.ids[1])){
        console.log("New Chat Created " + data.chats.length)
        Update(body.ids)
    }else{
        console.log("Chat already exsists")
    }
    res.json({})
    
})

app.post("/api/new-Chat-Message/", (req,res) => {
    const body = req.body;
    
    if(data.newChatMessage(body.senderID,body.targetID,body.content) === true){
        console.log("Message Send")
        
        
        res.status(200)
        
    }else{
        //createing a new chat message failed => chat doesn't exist 
        //create a new chat
        if(data.newChat(body.senderID,body.targetID)){
            //=> chat has been created
            //send chat message =>
            if(data.newChatMessage(body.senderID,body.targetID,body.content) === true){
                console.log("Message Send")
                
                res.status(200)
            }else{
                
                console.log("something has gone wrong 1")
                res.status(420)
            }
        }else{
            console.log("something has gone wrong 2")
            res.status(420)
        }
    }
    
    const chatMessages = data.findChat(body.senderID,body.targetID).chatMessages
    console.log(chatMessages[chatMessages.length - 1])
    console.log(eventEmitter.listeners)
    Update([body.senderID,body.targetID]);
    res.send("")
    
})

app.post("/api/alert/", (req,res) => {
    const senderID = req.body.senderID;
    const targetID = req.body.targetID;
    
    data.newAlert(senderID,targetID)
    Update()
})


//Update
app.put("/api/update", (req, res, next) => {
    console.log("register ", req.body.id)
    eventEmitter.register(req.body.id,() => {updateHandler(req,res)})
})
app.put("/api/syncronize", (req, res, next) => {
    const id = req.body.id
    const body = getUpdateData(id)

    res.json(body)
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
automaticUpdate();

function Update(ids){    
    eventEmitter.fire(ids)
}

function automaticUpdate(){
    const autoUpdateTime = 1000 * 30; //30 seconds
    const autoUpdate = setInterval(() => {
        eventEmitter.fire()
    }
    ,autoUpdateTime)
}

async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    }).catch(function() {});
  }   

  function getUpdateData(clientID){
    const id = clientID
    //find chats with senderID
    let chats = []
    for (let i = 0; i < data.chats.length; i++) {
        const item = data.chats[i];
        if(item.findChatByID(id)){
            chats.push(item)
        }
    }


    //pushes all the allerts for an id in the array
    //then removes it from the stored data
    const alerts = [];
    for(let i = 0; i < data.alerts.length;i++){
        const item = data.alerts[i]
        if(item.targetID === id){
            alerts.push(item)
            data.alerts.splice(i,1)
            i--;
        }
    }

    const body = {
        chats: chats,
        user: data.userData,
        alerts: alerts,
    }
    return body
}

function updateHandler(req,res)
{
    //client id
    const id = req.body.id;

    const body = getUpdateData(id)
    res.status(200)
    res.json(body)


    eventEmitter.unregister(req.body.id)
}