import {Component, useState, useEffect} from 'react'
import bimmeln from './Assets/bimmeln.mp3'
import './App.css'
import {v4 as uuidV4} from "uuid"
import Person from "./components/Person"
import Chat from './components/Chat'
import Client from './Client'
import Login from './components/Login'
import Header from './components/Header'
const id = generateID();


function generateID(){
  const ID = uuidV4();
  console.log("new ID:" , ID)
  return ID
}

function App() {

  const  [audio,setAudio] = useState(new Audio(bimmeln));
  const [client, setClient] = useState("")

  const [state,setState] = useState("LOGIN")

  const [name, setName] = useState("No Name")

  const [chats,setChats] = useState([]);
  const [alerts, setAlerts] = useState([])
  const [allUserData,setAllUserData] = useState([])



  

  useEffect(() => {
    if(state === "MAIN"){

      let newClient = new Client("http://192.168.178.59:1337", id, name);
      console.log("connect to Server")
      
      newClient.connectNewUser(name).then(() => {
        newClient.syncronizeWithServer().then((data) => {
          setAllUserData(data.user)
          console.log("Sync: " , data.user)

          
          setClient(newClient) 
          updateLoop(newClient);
        });
        


      })
      
      

      
    }
  }, [state])


  async function updateLoop(client){
    
    while(true){
      if(client){
        await client.update(setAllUserData,setChats).then(res => {

          setChats(res.chats)
          setAllUserData(res.user)
          setAlerts(res.alerts)
          if(res.alerts && res.alerts.length > 0){
            
            
            audio.play();
          }

          
          console.log("Update: " , res)          
        })
      }else{
        console.log("client not defined")
        break;
      }
      
    }
    
    
  }


  

  window.addEventListener("beforeunload", (event) => {
    if(client){
      console.log("disconnect");
      client.disconnect()
    }
  });

  
  
  
  
  function startChat(targetUserData){
    client.startChat(targetUserData.id)
  }

  function changeName(value){

    setName(value)
    
  }

  function Persons(){
    
    if(allUserData){
      return allUserData.map(item => {
        if(item.id !== id){
          return (
          <Person
            key={item.id}
            UserData={item}
            startChat={() => {startChat(item)}}
          />)
        }
      })
    }

     
  }

  function getUserDataById(id){
    let userData = allUserData.find((value) => {return value.id === id})
    if(!userData){
      console.log(allUserData)
      console.log("No User Data found for id: " + id)
    }
    return userData
  }





  
  return (
    <div className="app">
      
      {state === "LOGIN"&&
      
        <Login 
          changeName={changeName}
          userName={name}
          login= {() => setState("MAIN")}
        />
      }
      {state === "MAIN" &&
        
        <div className='body'>
          <div className='HeaderContainer'>
            <Header
              name={name}
              />
          </div>
          
          
            
          
          
          <Chat
            Chats={chats}
            getUserDataById={getUserDataById}
            client={client}
            allUser={allUserData}
          />
          
          

        </div>
      }
      
        
    </div>
  )
}

export default App
