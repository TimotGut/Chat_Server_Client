class EventEmitter{
    listeners = {}

    /**
     * fires the given ids 
     * if there are no given, it fires all ids 
     * @param {int[]?} ids 
     */
    fire(ids){

        if(ids === undefined){
            console.log("Update all!")
            for(let id in this.listeners){
                let listener = this.listeners[id] 
                this.unregister(listener)
                listener()
            }
        }else{
            for(let id in this.listeners){
                let listener = this.listeners[id] 
                if(ids.find((item) => item === id)){
                    this.unregister(listener)
                    listener()
                }
                
            }
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