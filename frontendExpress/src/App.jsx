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
  const [client, setClient] = useState()

  const [state,setState] = useState("LOGIN")
  const [autoLogin,setAutoLogin] = useState(false)
  const [name, setName] = useState("No Name")

  const [chats,setChats] = useState([]);
  const [alerts, setAlerts] = useState([])
  const [allUserData,setAllUserData] = useState([])

  const serverAdress = "http://192.168.178.59:1337"

  const LOGINSTATE = "LOGIN";
  const MAINSTATE = "MAIN;"
  const localNameKey = "essen-kommen-express-username";

  useEffect(() => {
    if(state === LOGINSTATE) {
      const localName = getLocalStorage(localNameKey)
      if(localName !== null && localName !== undefined && localName !== "" && localName !== false)
      {
        setName(localName)  

        if(autoLogin === true){
          login()
        }     
      }

      
    }
    else if(state === MAINSTATE){

      let newClient = new Client(serverAdress, id, name);
      console.log("connecting to Server...")
      
      newClient.connectNewUser(name).then((result) => {
        
        if(result.status === 200){
          console.log("Connected successfully")
          newClient.syncronizeWithServer().then((data) => {
            setAllUserData(data.user)
            console.log("Sync: " , data.user)
  
            
            setClient(newClient) 
            updateLoop(newClient);
          });  
        }else{
          setState(LOGINSTATE)
          result.json().then(res => {
            console.log(res.text)
            prompt(res.text);
          })
          
        }
        
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
    setLocalStorage(localNameKey,value)
  }
  
  
  function getLocalStorage(key){
    const jasonValue = localStorage.getItem(key) 
    if(jasonValue !== null && jasonValue !== undefined){
      return JSON.parse(jasonValue)
    } 
    else{
      return false;
    }
      
  }

  function setLocalStorage(key,value){
    localStorage.setItem(key,JSON.stringify(value))
  }

  function getUserDataById(id){
    let userData = allUserData.find((value) => {return value.id === id})
    if(!userData){
      console.log(allUserData)
      console.log("No User Data found for id: " + id)
      return false;
    }
    return userData
  }

  /**
   * Get from Login to Main screen
   */
  function login(){
    setState(MAINSTATE)
  }

  function logout(){
    console.log("disconnect");
    client.disconnect()
    setClient(undefined)
    setAutoLogin(false)
    setState(LOGINSTATE)
  }
  
  
  return (
    <div className="app">
      
      {state === LOGINSTATE &&
      
        <Login 
          userName={name}
          changeName={changeName}
          login= {login}
        />
      }
      {state === MAINSTATE &&
        
        <div className='body'>
          <div className='HeaderContainer'>
            <Header
              name={name}
              logout={logout}
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
