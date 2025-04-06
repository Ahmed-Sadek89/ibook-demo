"use client";

import Cookies from "universal-cookie";
import { makeNotification } from "../Utils/make-notification";
import { logout } from "../api/auth";

const useHandleLogoutSubmit = () => {
    const cookie = new Cookies();
    const handleLogout = async () => {
        try {
            const res = await logout();
            if (!res) {
                makeNotification("error", "خطأ في المحاولة");
            }
        } catch (error) {
            makeNotification("error", "خطأ في المحاولة");
        } finally {
            cookie.remove("ibook-auth", { path: "/" });
            cookie.remove("ibook-user", { path: "/" });
            cookie.remove("ibook-parent-option", { path: "/" });
            cookie.remove("ibook-role", { path: "/" });
            makeNotification("success", "تم تسحيل الخروج بنجاح");
            window.location.href = "/login";
        }
    };

    return handleLogout;
};

export default useHandleLogoutSubmit;
