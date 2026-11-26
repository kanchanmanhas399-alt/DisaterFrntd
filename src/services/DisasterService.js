import axios from "axios"
import { BASEURL, GetToken, DISASTER_ADD, DISASTER_ALL, DISASTER_UPDATE, DISASTER_DELETE } from "../endpoints"

export const DisasterAdd = async (data) => {
    return await axios.post(BASEURL + DISASTER_ADD, data, GetToken())
}

export const DisasterAll = async () => {
    return await axios.get(BASEURL + DISASTER_ALL, GetToken())
}

export const DisasterSingle = async (id) => {
    const disasterId = typeof id === 'object' && id?._id ? id._id : id;
    return await axios.get(BASEURL + DISASTER_ALL + "/" + disasterId, GetToken());
}

export const DisasterUpdate = async (data) => {
    return await axios.put(BASEURL + DISASTER_UPDATE + "/" + data._id, data, GetToken())
}

export const DisasterDelete = async (id) => {
    return await axios.delete(BASEURL + DISASTER_DELETE + "/" + id, GetToken())
}
