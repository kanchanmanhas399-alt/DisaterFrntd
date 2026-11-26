export const BASEURL = "https://disasterbcknd.onrender.com/";

export const GetToken = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
};

// Auth & Users
export const USER_REGISTER = "api/register";
export const ADDCUSTOMER = USER_REGISTER;
export const USER_LOGIN = "api/login";
export const CUSTOMERLOGIN = USER_LOGIN;
export const USER_UPDATE = "admin/user/update";
export const USER_DELETE = "admin/user/delete";
export const UPDATECUSTOMER = USER_UPDATE;
export const USER_SINGLE = "admin/user/single";
export const SINGLECUSTOMER = USER_SINGLE;
export const USER_ALL = "admin/user/all";
export const ALLCUSTOMER = USER_ALL;
export const USER_CHANGE_PASSWORD = "api/change-password";
export const CHANGEPASSWORD = USER_CHANGE_PASSWORD;

// User Dashboard & Tracking
export const USER_DASHBOARD = "api/user/dashboard";
export const USER_MY_REPORTS = "api/user/my-reports";
export const USER_SOS = "api/sos";

// Emergency Reports
export const EMERGENCY_REPORT_ADD = "api/emergency-report";
export const EMERGENCYADD = EMERGENCY_REPORT_ADD;
export const ADDREPORT = "api/emergency-report";
export const EMERGENCY_REPORT_ALL = "admin/emergency-reportAll";
export const REPORTALL = EMERGENCY_REPORT_ALL;
export const ALLREPORT = "admin/emergency-reportAll";
export const UPDATEREPORT = "admin/emergency-report";
export const DELETEREPORT = "admin/emergency-report";

// Alerts
export const ALERT_ADD = "api/alert";
export const ALERT_ALL = "api/alert";
export const ALLALERT = ALERT_ALL;
export const ADMIN_ALERT = "admin/alert";
export const ADMINALERT = ADMIN_ALERT;

// Resources
export const RESOURCE_ALL = "api/resource";
export const ADMIN_RESOURCE = "admin/resource";
export const ADMINRESOURCE = ADMIN_RESOURCE;
export const RESOURCE_REQUEST_ADD = "api/resource-request";
export const USER_MY_RESOURCE_REQUESTS = "api/user/my-resource-requests";
export const ADMIN_RESOURCE_REQUEST = "admin/resource-request";

// Assessment
export const ADMIN_ASSESSMENT = "admin/assessment";
export const ADMINASSESSMENT = ADMIN_ASSESSMENT;

// Notifications
export const ADMIN_NOTIFICATION = "admin/notification";
export const ADMINNOTIFICATION = ADMIN_NOTIFICATION;
export const NOTIFICATIONS_MY = "api/notification/my";
export const NOTIFICATION_READ = "api/notification/read";
export const NOTIFICATION_READ_ALL = "api/notification/read-all";

// Safety Guidelines
export const SAFETY_ALL = "api/safety";
export const ADMIN_SAFETY = "admin/safety";

// Admin Dashboard Stats
export const ADMIN_DASHBOARD_STATS = "admin/dashboard-stats";

// Categories
export const CATEGORY_ADD = "admin/category";
export const CATEGORYADD = CATEGORY_ADD;
export const CATEGORY_ALL = "api/categoryall";
export const CATEGORYALL = CATEGORY_ALL;
export const ADMIN_CATEGORY = "admin/category";
export const ADMINCATEGORY = ADMIN_CATEGORY;
export const DISASTER_CATEGORY_ADD = "api/disaster-category";
export const DISASTER_CATEGORY_ALL = "api/disaster-category";
export const ALLCATEGORY = DISASTER_CATEGORY_ALL;
export const ADMIN_DISASTER_CATEGORY = "admin/disaster-category";
export const ADMINDISASTERCATEGORY = ADMIN_DISASTER_CATEGORY;

// Shelters, Hospitals, Rescue Centers, Disasters
export const DISASTER_ADD = "admin/disaster";
export const DISASTER_ALL = "admin/disaster";
export const DISASTER_UPDATE = "admin/disaster";
export const DISASTER_DELETE = "admin/disaster";

export const HOSPITAL_ADD = "admin/hospital";
export const HOSPITAL_ALL = "admin/hospital";
export const HOSPITAL_UPDATE = "admin/hospital";
export const HOSPITAL_DELETE = "admin/hospital";

export const RESCUE_CENTER_ADD = "admin/rescue-center";
export const RESCUE_CENTER_ALL = "admin/rescue-center";
export const RESCUE_CENTER_UPDATE = "admin/rescue-center";
export const RESCUE_CENTER_DELETE = "admin/rescue-center";

export const SHELTER_ADD = "admin/shelter";
export const SHELTER_ALL = "admin/shelter";
export const SHELTER_UPDATE = "admin/shelter";
export const SHELTER_DELETE = "admin/shelter";

// Upload
export const UPLOAD_FILE = "api/upload";
