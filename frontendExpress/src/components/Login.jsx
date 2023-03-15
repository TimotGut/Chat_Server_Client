import './Login.css'
import React from 'react'
import { useState } from 'react'

export default function Login(props){
    const {userName, changeName, login} = props




    
    function handelNameChange(event){
        changeName(event.target.value)
    }
    


    return(
        <div className='login'>

            <h1
                className='title'
            >Wilkommen bei Essen Kommen!</h1>

            <div>
                <label 
                    className='username_label' 
                    htmlFor="UserName">Username: </label>
                <input 
                    className='username_input'
                    id='UserName' 
                    name="name"
                    value={userName} 
                    onChange={handelNameChange}
                    maxLength="19"
                /> 

            </div>

            <button 
                className='login_button'
                onClick={login}
            >
                Login
            </button>
            
            
        </div>
    )
    
        
    
}