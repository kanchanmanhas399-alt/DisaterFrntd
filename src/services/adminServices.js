import axios from "axios";
import { 
    BASEURL, 
    GetToken, 
    ADMINALERT, 
    ADMINRESOURCE, 
    ADMINASSESSMENT, 
    ADMINNOTIFICATION, 
    ADMINCATEGORY, 
    ADMINDISASTERCATEGORY, 
    ALLALERT,
    ALLCUSTOMER,
    UPDATECUSTOMER,
    USER_DELETE,
    SAFETY_ALL,
    ADMIN_SAFETY,
    NOTIFICATIONS_MY,
    NOTIFICATION_READ,
    NOTIFICATION_READ_ALL,
    RESOURCE_ALL,
    RESOURCE_REQUEST_ADD,
    USER_MY_RESOURCE_REQUESTS,
    ADMIN_RESOURCE_REQUEST
} from "../endpoints";

// --- Alert Admin & Public ---
export const AlertAdminGetAll = async (params = {}) => {
    return await axios.get(BASEURL + ADMINALERT, { ...GetToken(), params });
};

export const AlertAdminAdd = async (data) => {
    return await axios.post(BASEURL + ADMINALERT, data, GetToken());
};

export const AlertAdminSingle = async (id) => {
    return await axios.get(BASEURL + ADMINALERT + "/" + id, GetToken());
};

export const AlertAdminUpdate = async (data) => {
    return await axios.put(BASEURL + ADMINALERT + "/" + data._id, data, GetToken());
};

export const AlertAdminRemove = async (id) => {
    return await axios.delete(BASEURL + ADMINALERT + "/" + id, GetToken());
};

export const AlertAll = async (params = {}) => {
    return await axios.get(BASEURL + ALLALERT, { ...GetToken(), params });
};

// --- Resource Admin & Public ---
export const ResourceAdminGetAll = async (params = {}) => {
    return await axios.get(BASEURL + ADMINRESOURCE, { ...GetToken(), params });
};

export const ResourceAdminSingle = async (id) => {
    return await axios.get(BASEURL + ADMINRESOURCE + "/" + id, GetToken());
};

export const ResourceAdminAdd = async (data) => {
    return await axios.post(BASEURL + ADMINRESOURCE, data, GetToken());
};

export const ResourceAdminUpdate = async (data) => {
    return await axios.put(BASEURL + ADMINRESOURCE + "/" + data._id, data, GetToken());
};

export const ResourceAdminRemove = async (id) => {
    return await axios.delete(BASEURL + ADMINRESOURCE + "/" + id, GetToken());
};

export const ResourceAll = async (params = {}) => {
    return await axios.get(BASEURL + RESOURCE_ALL, { ...GetToken(), params });
};

// --- Resource Requests ---
export const ResourceRequestAdd = async (data) => {
    return await axios.post(BASEURL + RESOURCE_REQUEST_ADD, data, GetToken());
};

export const UserMyResourceRequests = async () => {
    return await axios.get(BASEURL + USER_MY_RESOURCE_REQUESTS, GetToken());
};

export const AdminResourceRequestGetAll = async (params = {}) => {
    return await axios.get(BASEURL + ADMIN_RESOURCE_REQUEST, { ...GetToken(), params });
};

export const AdminResourceRequestUpdateStatus = async (id, data) => {
    return await axios.put(BASEURL + ADMIN_RESOURCE_REQUEST + "/" + id, data, GetToken());
};

export const AdminResourceRequestDelete = async (id) => {
    return await axios.delete(BASEURL + ADMIN_RESOURCE_REQUEST + "/" + id, GetToken());
};

// --- Assessment Admin ---
export const AssessmentAdminGetAll = async () => {
    return await axios.get(BASEURL + ADMINASSESSMENT, GetToken());
};

// --- Notification Admin & User ---
export const NotificationAdminGetAll = async () => {
    return await axios.get(BASEURL + ADMINNOTIFICATION, GetToken());
};

export const NotificationMy = async () => {
    return await axios.get(BASEURL + NOTIFICATIONS_MY, GetToken());
};

export const NotificationMarkRead = async (id) => {
    return await axios.patch(BASEURL + NOTIFICATION_READ + "/" + id, {}, GetToken());
};

export const NotificationMarkAllRead = async () => {
    return await axios.patch(BASEURL + NOTIFICATION_READ_ALL, {}, GetToken());
};

// --- Safety Guidelines Admin & Public ---
export const SafetyAll = async () => {
    return await axios.get(BASEURL + SAFETY_ALL, GetToken());
};

export const SafetySingle = async (disasterType) => {
    return await axios.get(BASEURL + SAFETY_ALL + "/" + disasterType, GetToken());
};

export const SafetyAdminGetAll = async () => {
    return await axios.get(BASEURL + ADMIN_SAFETY, GetToken());
};

export const SafetyAdminSingle = async (id) => {
    return await axios.get(BASEURL + ADMIN_SAFETY + "/" + id, GetToken());
};

export const SafetyAdminAdd = async (data) => {
    return await axios.post(BASEURL + ADMIN_SAFETY, data, GetToken());
};

export const SafetyAdminUpdate = async (data) => {
    return await axios.put(BASEURL + ADMIN_SAFETY + "/" + data._id, data, GetToken());
};

export const SafetyAdminRemove = async (id) => {
    return await axios.delete(BASEURL + ADMIN_SAFETY + "/" + id, GetToken());
};

// --- Category Admin ---
export const CategoryAdminGetAll = async () => {
    return await axios.get(BASEURL + ADMINCATEGORY, GetToken());
};

export const CategoryAdminAdd = async (data) => {
    return await axios.post(BASEURL + ADMINCATEGORY, data, GetToken());
};

export const DisasterCategoryAdminGetAll = async () => {
    return await axios.get(BASEURL + ADMINDISASTERCATEGORY, GetToken());
};

export const DisasterCategoryAdminAdd = async (data) => {
    return await axios.post(BASEURL + ADMINDISASTERCATEGORY, data, GetToken());
};

export const AddDisasterCategoryService = async (data) => {
    return await axios.post(BASEURL + ADMINDISASTERCATEGORY, data, GetToken());
};

export const DisasterCategoryAdminUpdate = async (data) => {
    return await axios.put(BASEURL + ADMINDISASTERCATEGORY + "/" + data._id, data, GetToken());
};

export const DisasterCategoryAdminRemove = async (id) => {
    return await axios.delete(BASEURL + ADMINDISASTERCATEGORY + "/" + id, GetToken());
};

export const DisasterCategoryAdminSoftDelete = async (id) => {
    return await axios.patch(BASEURL + ADMINDISASTERCATEGORY + "/soft-delete/" + id, {}, GetToken());
};

// --- Customer / User Admin ---
export const CustomerAll = async () => {
    return await axios.get(BASEURL + ALLCUSTOMER, GetToken());
};

export const CustomerDelete = async (id) => {
    return await axios.delete(BASEURL + USER_DELETE + "/" + id, GetToken());
};

export const CustomerUpdate = async (data) => {
    return await axios.put(BASEURL + UPDATECUSTOMER + "/" + data._id, data, GetToken());
};

// --- Disaster email notification recipients ---
export const RecipientAll = async () => axios.get(BASEURL + "admin/disaster-email-recipients", GetToken());
export const RecipientAdd = async (data) => axios.post(BASEURL + "admin/disaster-email-recipients", data, GetToken());
export const RecipientUpdate = async (id, data) => axios.put(BASEURL + "admin/disaster-email-recipients/" + id, data, GetToken());
export const RecipientDelete = async (id) => axios.delete(BASEURL + "admin/disaster-email-recipients/" + id, GetToken());
