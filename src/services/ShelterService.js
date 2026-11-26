import axios from "axios"
import { BASEURL, GetToken, SHELTER_ADD, SHELTER_ALL, SHELTER_UPDATE, SHELTER_DELETE } from "../endpoints"

export const ShelterAdd = async (data) => {
    return await axios.post(BASEURL + SHELTER_ADD, data, GetToken())
}

export const ShelterAll = async () => {
    return await axios.get(BASEURL + SHELTER_ALL, GetToken())
}

export const ShelterSingle = async (id) => {
    return await axios.get(BASEURL + SHELTER_ALL + "/" + id, GetToken())
}

export const ShelterUpdate = async (data) => {
    return await axios.put(BASEURL + SHELTER_UPDATE + "/" + data._id, data, GetToken())
}

export const ShelterDelete = async (id) => {
    return await axios.delete(BASEURL + SHELTER_DELETE + "/" + id, GetToken())
}
