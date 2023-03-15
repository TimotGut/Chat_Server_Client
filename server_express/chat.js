const Message = require("./Message")
class Chat{
    
    constructor(ids,chatMessages){
        //int[2]
        this.ids = ids;

        this.chatMessages = chatMessages ? chatMessages : []
    }

    newMessage(message, targetID, senderID) {
        let targetIndex = this.ids.indexOf(targetID)
        let senderIndex = this.ids.indexOf(senderID)
        
            
        if(targetIndex === -1 || senderIndex === -1)
        {
            console.warn("Adding Message not possible")
            return
        }

        this.chatMessages.push(new Message(senderID,targetID,message))
    }
    /**returns if the Chat has both ids as target
     * @param {string} id_a 
     * @param {string} id_b 
     */
    findChat(id_a, id_b){
        return (this.findChatByID(id_a) && this.findChatByID(id_b));
    }
    ///returns if the Chat has the id as target
    findChatByID(id){
        
        return (this.ids[0] === id || this.ids[1] === id)
    }
}

module.exports = Chat;