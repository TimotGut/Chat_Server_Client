import React from "react"
import "./Header.css"
export default function Header(props){
    const {name, logout} = props
    return (
        <div className="Header">
            <div>Name: {name}</div>
            <div className="Logout button" onClick={logout}>Logout</div>
        </div>
    )
}