import React from 'react'
import './Person.css'

export default function Person(props){
    const {UserData, startChat} = props

    
    

    return (
        <div className="person">
            <h2 className='name'>{UserData.name}</h2>
            <button onClick={startChat}
                
            >                
                Chat Starten
            </button>
            
            
        </div>
    )
}