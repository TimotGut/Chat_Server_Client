

class Client{

    constructor(adress,id, clientName){
        this.CLIENT_NAME = clientName;
        this.ADRESS = adress
        this.ID = id
        this.updateEvent = new Event("updateEvent")
        this.server_fetch("sda")
    }

    async server_fetch(adress,type){
        

        return fetch(adress,type).catch(err => {
            console.log("err" )
        })
        
    }


 
    async disconnect(){
        const object = { id: this.ID}

        const result = await this.server_fetch(this.ADRESS + "/api/",{
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(object)
        }) 
        return await result.json();
    }

    //sending to the server that u connected
    async connectNewUser(name){
        const user = 
        {
            name: name,
            id: this.ID,
        }
        
        await this.server_fetch(this.ADRESS + "/api/",{
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        }) 
    }

    //immideate server request to synconize local and server data
    async syncronizeWithServer(){
        const result = await this.server_fetch(this.ADRESS + "/api/",{
            method: "GET",
            headers: {
                "Content-type": "application/json"
            },
        })
        const jsonResult = await result.json()
        

        console.log("On-Sync")
        
        return jsonResult;
    }
    async update(setAllUserData,setChats){
        const data = 
        {
            id: this.ID,
        }

        const result = await this.server_fetch(this.ADRESS + "/api/",{
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .catch(err => {console.log("ERROR")})
         

        
        console.log("Update: " , result)
        setAllUserData(result.user);

        setChats(result.chats)
        console.log(result.chats.length)

        const calls = result.calls;
        if(calls){

            return await this.getCalled(calls)
        }
        dispatchEvent(this.updateEvent)
    }

    async getCalled(calls){
        let youAreGettingCalled = false
        for (let i = 0; i < calls.length; i++) {
            const item = calls[i];
            if(item.targetID === this.ID){
                console.log("Du wirst gerufen!")
                console.log(":"+item.message)
                youAreGettingCalled = true
                
            }
        }
        if(youAreGettingCalled === true){
            const data = 
            {
                id: this.ID,
            }
    
            const result = await this.server_fetch(this.ADRESS + "/api/call/",{
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(res => res.json())
        }
        
        return youAreGettingCalled;
        
    }


    async startChat(targetID){
        const data = {
            ids:[this.ID,targetID]
        }

        const result = await this.server_fetch(this.ADRESS + "/api/start-chat/",{
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .catch(err => {console.log("ERROR")})
    }
    
    
    async newChatMessage(targetID,content){
        

        const data = {
            senderID: this.ID,
            targetID:targetID,
            content:content,
        }

        const result = await this.server_fetch(this.ADRESS + "/api/new-Chat-Message/",{
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .catch(err => {console.log("ERROR: " , err)})
    }

}


export default Client