import axios from "axios";
import { BASEURL, CUSTOMERLOGIN } from "../endpoints";

export const CustomerLogin = async (data) => {
    return await axios.post(BASEURL + CUSTOMERLOGIN, data);
};

export const setData = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("_id", data.data?._id || data.data?.id);
    localStorage.setItem("email", data.data?.email);
    localStorage.setItem("name", data.data?.name);
    localStorage.setItem("userType", data.data?.userType || data.data?.role);
    localStorage.setItem("IsLogin", "true");
    window.dispatchEvent(new Event("disasterguard-auth-change"));
};

export const getIsLogin = () => {
    const isLogin = localStorage.getItem("IsLogin");
    const token = localStorage.getItem("token");
    return Boolean(isLogin === "true" && token);
};

export const getemail = () => {
    return localStorage.getItem("email") || "";
};

export const getName = () => {
    return localStorage.getItem("name") || "";
};

export const getUserType = () => {
    return localStorage.getItem("userType") || "citizen";
};

export const isAdmin = () => {
    return getUserType() === "admin";
};

export const getId = () => {
    return localStorage.getItem("_id") || "";
};

export const clear = () => {
    ["token", "_id", "email", "name", "userType", "IsLogin"].forEach((key) => localStorage.removeItem(key));
    window.dispatchEvent(new Event("disasterguard-auth-change"));
};
