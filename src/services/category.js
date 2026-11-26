import axios from "axios"
import { BASEURL, CATEGORYADD, CATEGORYALL, EMERGENCYADD, GetToken } from "../endpoints"



export const CategoryAll = async(data) => {
    // let retoken=GetToken()
    // console.log({retoken});
    
   return await axios.post(BASEURL+CATEGORYALL,{},GetToken())
}

    