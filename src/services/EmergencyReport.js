import axios from "axios";
import { 
    BASEURL, 
    GetToken, 
    EMERGENCYADD, 
    REPORTALL, 
    UPDATEREPORT, 
    DELETEREPORT,
    USER_DASHBOARD,
    USER_MY_REPORTS,
    USER_SOS,
    ADMIN_DASHBOARD_STATS,
    UPLOAD_FILE
} from "../endpoints";

export const EmergencyAdd = async (data) => {
    return await axios.post(BASEURL + EMERGENCYADD, data, GetToken());
};

export const SubmitSOS = async (data) => {
    return await axios.post(BASEURL + USER_SOS, data, GetToken());
};

export const ReportAll = async (params = {}) => {
    return await axios.get(BASEURL + REPORTALL, { ...GetToken(), params });
};

export const ReportSingle = async (id) => {
    return await axios.get(BASEURL + "api/emergency-report/" + id, GetToken());
};

export const AdminReportSingle = async (id) => {
    return await axios.get(BASEURL + "admin/emergency-report/" + id, GetToken());
};

export const ReportUpdate = async (data) => {
    return await axios.put(BASEURL + UPDATEREPORT + "/" + data._id, data, GetToken());
};

export const ReportDelete = async (id) => {
    return await axios.delete(BASEURL + DELETEREPORT + "/" + id, GetToken());
};

export const GetMyReports = async (params = {}) => {
    return await axios.get(BASEURL + USER_MY_REPORTS, { ...GetToken(), params });
};

export const GetUserDashboard = async () => {
    return await axios.get(BASEURL + USER_DASHBOARD, GetToken());
};

export const GetAdminDashboardStats = async () => {
    return await axios.get(BASEURL + ADMIN_DASHBOARD_STATS, GetToken());
};

export const UploadImage = async (formData) => {
    const headers = GetToken().headers;
    return await axios.post(BASEURL + UPLOAD_FILE, formData, {
        headers: {
            ...headers,
            "Content-Type": "multipart/form-data"
        }
    });
};
