/*import { useEffect,useState } from "react"

const PREFIX = "komm-essen-"
export default function useLocalStorage(key,initialValue){
    const PrefixedKey = PREFIX + key;
    const [value ,setValue] = useState(() => {
        const jasonValue = localStorage.getItem(PrefixedKey)
        if(jasonValue != null) return JSON.parse(jasonValue)

        if(typeof(initialValue) === "function") return initialValue();
        else return initialValue
    });
    

    useEffect(() => {
        localStorage.setItem(PrefixedKey,JSON.stringify(value))
    },
    [PrefixedKey,value])

    return [value,setValue]
}*/