import React, { useEffect , useRef } from "react";
import './Chat.css'
export default function Chat(props){
    const {Chats,getUserDataById,client, allUser} = props   

    const refContainer = useRef()


    

    
    const [activeChatIds,setActiveChatIds] = React.useState()
    const [activeTab,setActiveTab] = React.useState("CHATS")
    const [input,setInput] = React.useState("")
    function ChatsTabClickHandel(){
        setActiveTab("CHATS")
    }
    function SpecificChatTabClickHandel(){
        setActiveTab("ACTIVE_CHAT")
    }
    function getActiveChat(){
        
        for (let i = 0; i < Chats.length; i++) {
            const element = Chats[i];
            
            if(element.ids[0] === activeChatIds[0] && element.ids[1] === activeChatIds[1] 
                || element.ids[0] === activeChatIds[1] && element.ids[1] === activeChatIds[0]){
                return element;
            }
        }
            
        
        return null;
        
    }
    function renderActiveTab(){

        if(activeTab === "CHATS"){
            /*const chatObjects = Chats.map(item => 
                {
                    
                    return(
                        <div className="selectChatObject noSelect button"
                            key={item.ids[0] + "/" + item.ids[1]}
                            onClick={()=>{setActiveChatIds(item.ids);SpecificChatTabClickHandel()}}>
                            {getOtherChatName(client.ID,item.ids)}
                        </div>
                    )
                }
            )*/
            const newChatObjects = []
            
            
            console.log("all user" ,allUser.length)
            allUser.forEach(user => {
                if(user.id !== client.ID ){
                    newChatObjects.push (
                        <div className="selectChatObject noSelect button"
                            key={client.ID + "/" + user.id}
                            onClick={()=>{setActiveChatIds([client.ID, user.id]);SpecificChatTabClickHandel()}}>
                            {user.name}
                        </div>)
                }
                
            })
            
            console.log("newChatObjects:" , newChatObjects)
            /*if(newChatObjects.length > 0){
                chatObjects.push(<div key={"new Chat"}>Start new Chat</div>)
                newChatObjects.forEach(i => {chatObjects.push(i)});
                
            }*/
            return  newChatObjects
        }else{
            const activeChat = getActiveChat();
            if(activeChat === null){
                
            }else{
                const chatObjects = activeChat.chatMessages.map(item => 
                    {
                        
                        return(
                            //Chat message (checks if the message is from you)
                            <div className={"chatMessage " + (item.senderID === client.ID? "yourMessage" : "foreignMessage")}
                                key={item.date}
                                >
                                {item.content}
                            </div>
                        )
                    }
                )
                return chatObjects
            }
            
        }
    }

    function getOtherID(id,chatIds){
        return chatIds[0] === id ? chatIds[1] : chatIds[0]
    }
    function getOtherChatName(yourId,chatIds){
        let otherId = getOtherID(yourId,chatIds)
        let otherUsername = getUserDataById(otherId).name
        return otherUsername
    }

    function sendMessageButton(){
        if(input != ""){
            client.newChatMessage(getOtherID(client.ID,activeChatIds),input)
            setInput("")

        }
    }

    function handelSubmitWithEnter(event){
        if(event.key === "Enter"){
            sendMessageButton()
        }
    }
    return (
        <div className="Chats">
            <div className="headline noSelect">
                <div className="tab button" onClick={ChatsTabClickHandel}>
                    <p className="tabText">Users</p>
                </div>
                {activeTab === "ACTIVE_CHAT" &&<div className="tab " >
                    <p className="tabText">{getOtherChatName(client.ID,activeChatIds)}</p>
                    
                </div>}
                
            </div>
            <div className="container" ref={refContainer}>
                {renderActiveTab()}
                
            </div>
            {activeTab=== "ACTIVE_CHAT" && 
                <div className="sendMessageContainer">
                    
                        
                    <input className="sendMessageInput" 
                        type="text"
                        value={input}
                        onChange={(e) => {setInput(e.target.value)}}
                        onKeyDown={handelSubmitWithEnter}
                        />
                    <div 
                        className="sendMessageButton button"
                        onClick={sendMessageButton}
                        >Send</div>
                </div>}
            
        </div>
    );
}