class EventEmitter{
    listeners = {}

    fire(){
        console.log("Sending Update!")
        for(let k in this.listeners){
            let listener = this.listeners[k] 
            this.unregister(listener)
            listener()
        }
    }
    //the handler is the connection to the server
    register(id,handler){
        //object "id": res
        this.listeners[id] = handler;
    }
    //when event is fired unregister 
    unregister(id){
        return delete this.listeners[id]
    }
}

module.exports = EventEmitter