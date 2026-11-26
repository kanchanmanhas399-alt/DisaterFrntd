import axios from "axios"
import { ADDCUSTOMER, ALLCUSTOMER, BASEURL, GetToken, UPDATECUSTOMER, USER_DELETE, USER_SINGLE, USER_UPDATE } from "../endpoints"

export const CustomerAdd = async(data) => {
   return await axios.post(BASEURL + ADDCUSTOMER, data)
}

export const CustomerUpdate = async(data) => {
   return await axios.put(BASEURL + USER_UPDATE + "/" + data._id, data, GetToken())
}

export const CustomerDelete = async(id) => {
   return await axios.post(BASEURL + USER_DELETE ,{_id:id}, GetToken())
}

export const CustomerAll = async() => {
   return await axios.get(BASEURL + ALLCUSTOMER, GetToken())
}


export const CustomerSingle = async(data) => {
   const payload = typeof data === 'object' && data?._id ? data : { _id: data };
   return await axios.post(BASEURL + USER_SINGLE, payload, GetToken());
}


