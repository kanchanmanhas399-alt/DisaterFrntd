import axios from "axios"
import { BASEURL, GetToken, RESCUE_CENTER_ADD, RESCUE_CENTER_ALL, RESCUE_CENTER_UPDATE, RESCUE_CENTER_DELETE } from "../endpoints"

export const RescueCenterAdd = async (data) => {
    return await axios.post(BASEURL + RESCUE_CENTER_ADD, data, GetToken())
}

export const RescueCenterAll = async () => {
    return await axios.get(BASEURL + RESCUE_CENTER_ALL, GetToken())
}

export const RescueCenterSingle = async (id) => {
    return await axios.get(BASEURL + RESCUE_CENTER_ALL + "/" + id, GetToken())
}

export const RescueCenterUpdate = async (data) => {
    return await axios.put(BASEURL + RESCUE_CENTER_UPDATE + "/" + data._id, data, GetToken())
}

export const RescueCenterDelete = async (id) => {
    return await axios.delete(BASEURL + RESCUE_CENTER_DELETE + "/" + id, GetToken())
}
