import { useState, useEffect , useRef } from "react";
import './Chat.css'
export default function Chat(props){
    const {Chats,getUserDataById,client, allUser} = props   

    const refContainer = useRef()


    // format "someId" : "number of messages read" 
    const [readMessages,setReadMessages] = useState({})

    
    const [activeChatIds,setActiveChatIds] = useState()
    const [activeTab,setActiveTab] = useState("CHATS")
    const [input,setInput] = useState("")
    const [alertSending,setAlertSending] = useState(false);

    function ChatsTabClickHandel(){
        if(activeChatIds){
            const otherID = activeChatIds[0] === client.id ? activeChatIds[0] : activeChatIds[1];
            const activeChat = getActiveChat();

            if(activeChat !== null){
                setReadMessages(prev => {
                    prev[otherID] = activeChat.chatMessages.length;
                    return prev
                })
            }
        }
        setActiveTab("CHATS")
        setActiveChatIds(null)
    }
    function SpecificChatTabClickHandel(){
        setActiveTab("ACTIVE_CHAT")
    }
    function getActiveChat(){
        return getChat(activeChatIds[0],activeChatIds[1])
    }
    function getChat(id_a,id_b){
        for (let i = 0; i < Chats.length; i++) {
            const element = Chats[i];
            
            if(element.ids[0] === id_b && element.ids[1] === id_a 
                || element.ids[0] === id_a && element.ids[1] === id_b){
                return element;
            }
        }
        return null
    }

    function renderActiveTab(){
        if(!client){
            return
        }
        if(activeTab === "CHATS"){
            
            const newChatObjects = []
            
            
            console.log("all user" ,allUser.length)
            allUser.forEach(user => {
                const chat = getChat(client.ID,user.id);
                const messagesRead = readMessages[user.id] ? readMessages[user.id] : 0;
                let messagesUnread
                if(chat !== null){
                    messagesUnread = chat.chatMessages.length - messagesRead;
                }
                if(user.id !== client.ID ){
                    newChatObjects.push (
                        <div className="selectChatObject noSelect button"
                            key={client.ID + "/" + user.id}
                            onClick={()=>{
                                setActiveChatIds([client.ID, user.id]);
                                setReadMessages(prev => {
                                    const chat = getChat(client.ID,user.id)
                                    if(chat !== null){
                                        prev[user.id] = chat.chatMessages.length;
                                    }
                                    return prev
                                })
                                SpecificChatTabClickHandel()
                                }}>
                            {user.name} {messagesUnread !== undefined && messagesUnread !== 0 ? " [" + messagesUnread + "]" : ""}
                        </div>)
                }
                
            })
            
            console.log("newChatObjects:" , newChatObjects)
            return  newChatObjects
        }



        if(activeTab === "ACTIVE_CHAT"){
            
            const activeChat = getActiveChat();
            if(activeChat === null){
                return <div>Keine Nachichten bisher.</div>
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
        const otherUser = getUserDataById(otherId);
        //otherUser doesn't exist. It may have disconnected
        if(otherUser === false){
            ChatsTabClickHandel()
        }else{
            let otherUsername = otherUser.name
            return otherUsername
        }
    }

    function sendMessageButton(){
        if(input != ""){
            console.log("Send " + input)
            client.newChatMessage(getOtherID(client.ID,activeChatIds),input)
            setInput("")

        }
    }
    function sendAlertButton(){
        if(alertSending === false){
            setAlertSending(true);
            client.sendAlert(client.ID,getOtherID(client.ID,activeChatIds)).then(() => {
                setAlertSending(false);
            })
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

                    <div 
                        className="sendAlertButton button"
                        onClick={sendAlertButton}
                        >Alert</div>
                </div>}
            
        </div>
    );
}