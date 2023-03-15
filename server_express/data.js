const uuid = require("uuid")
const Chat = require("./Chat")


class Data{
    
    constructor(){
        this.userData = []
        
        this.chats = [];//Chat 
    }

    generateID(){
        const ID = uuid.v4();
        console.log("new ID:" , ID)
        return ID
    }
    

    
    newUser(user){
        this.userData.push(user)
        console.log("New User: " , user)
    }

    disconnectUser(id){
        
        for(let i = 0; i < this.userData.length;i++){
            let user = this.userData[i];
            if(user.id === id){
                this.userData.splice(i)
                console.log("disconnect User: " , user)
                return true;
            }
        }
        return false;
    }

    findChat(id_a,id_b){
        return this.chats.find(item => {
            return item.findChat(id_a,id_b)
        })
    }

    findUser(id){
        return this.userData.find((a) => {return a.id === id})
    }
    /**
     * 
     * @param {*} user_a_id 
     * @param {*} user_b_id 
     * @returns true if worked false if didn't (there is already a chat between those ids)
     */
    newChat(user_a_id, user_b_id){
        if(this.findChat(user_a_id,user_b_id) === undefined){

            this.chats.push(new Chat([user_a_id,user_b_id]))
            console.log("Chat has been created.")
            return true;
        }
        return false
    }
    
    newChatMessage(senderID,targetID,content){
        let chat = this.chats.find(item => {
            return item.findChat(senderID,targetID)
        })
        
        if(chat === undefined){
            return false
        }else{
            chat.newMessage(content,targetID,senderID)
            return true
        }
    }

    removeCall(id){
        for (let i = 0; i < this.callUpdate.length; i++) {
            const item = this.callUpdate[i];
            if(item.targetID === id){
                console.log("Du wirst gerufen!")
                this.callUpdate.splice(i,1)
            }
        }
    }
}

module.exports = Data

