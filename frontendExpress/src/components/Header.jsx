import React from "react"
import "./Header.css"
export default function Header(props){
    const {name} = props
    return (
        <div className="Header">
            <div>Name: {name}</div>
        </div>
    )
}