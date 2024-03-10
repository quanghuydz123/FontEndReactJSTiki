import { useEffect, useState } from "react"

export const useDebounce = (value,delay)=>{
   const [valueDebouce,setValueDebouce] = useState('')
   useEffect(()=>{
        const handle = setTimeout(() => {
            setValueDebouce(value)
        }, [delay]);
        return ()=>{
            clearTimeout(handle)
        }
   },[value])
    
    return valueDebouce
}