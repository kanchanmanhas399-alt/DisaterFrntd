import axios from "axios";
import { BASEURL, GetToken, ADDREPORT, ALLREPORT, UPDATEREPORT, DELETEREPORT, ALLCATEGORY } from "../endpoints";

export const ReportAdd = async (data) => {
    return await axios.post(BASEURL + ADDREPORT, data, GetToken());
};

export const ReportAll = async (data = {}) => {
    return await axios.post(BASEURL + ALLREPORT, data, GetToken());
};

export const ReportUpdate = async (data) => {
    return await axios.put(BASEURL + UPDATEREPORT + "/" + data._id, data, GetToken());
};

export const ReportDelete = async (id) => {
    return await axios.delete(BASEURL + DELETEREPORT + "/" + id, GetToken());
};

export const DisasterCategoryAll = async () => {
    return await axios.get(BASEURL + ALLCATEGORY, GetToken());
};
