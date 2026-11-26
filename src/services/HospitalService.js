import axios from "axios"
import { BASEURL, GetToken, HOSPITAL_ADD, HOSPITAL_ALL, HOSPITAL_UPDATE, HOSPITAL_DELETE } from "../endpoints"

export const HospitalAdd = async (data) => {
    return await axios.post(BASEURL + HOSPITAL_ADD, data, GetToken())
}

export const HospitalAll = async () => {
    return await axios.get(BASEURL + HOSPITAL_ALL, GetToken())
}

export const HospitalSingle = async (id) => {
    return await axios.get(BASEURL + HOSPITAL_ALL + "/" + id, GetToken())
}

export const HospitalUpdate = async (data) => {
    return await axios.put(BASEURL + HOSPITAL_UPDATE + "/" + data._id, data, GetToken())
}

export const HospitalDelete = async (id) => {
    return await axios.delete(BASEURL + HOSPITAL_DELETE + "/" + id, GetToken())
}
