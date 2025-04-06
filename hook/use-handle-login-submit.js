"use client"
import { login } from "../api/login";
import { makeNotification } from "../Utils/make-notification";
import { setCookie } from "../Utils/set-cookie";

const useHandleLoginSubmit = async (type, router, body, handleIsLoading) => {
    handleIsLoading(true)
    const handleLogin = await login(type, body)
        .then((res) => {
            if (res) {
                const authType = type === "parents" ? "parent" : "student"
                setCookie("ibook-auth", res.data.access_token);
                setCookie("ibook-role", authType)
                setCookie("ibook-user", { ...res.data[authType], type: authType });
                makeNotification("success", "تم تسحيل الدخول بنجاح");
                router.push(authType === "parent" ? "/parent" : "/home")
            } else {
                if (!res || res.data) {
                    makeNotification("error", "خطأ في البريد الإلكتروني أو كلمة المرور")
                }
            }
        })
        .catch(() => {
            makeNotification("error", "خطأ في البريد الإلكتروني أو كلمة المرور")
        })
        .finally(() => {
            handleIsLoading(false)
        })

    return handleLogin
}

export default useHandleLoginSubmit
