class Message{
    
    constructor(senderID,targetID,content){
        this.content = content;
        this.senderID = senderID
        this.targetID = targetID;
        this.date = Date.now();
    }
}
module.exports = Message