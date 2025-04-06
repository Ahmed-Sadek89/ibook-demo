"use client"
import { useState } from "react";
import cls from './login.module.scss'
import Loader from '../Loader/Loader';
import Image from "next/image";
import LoginForm from "./login-form";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const handleIsLoading = (state) => setLoading(state)
    const [loginType, setLoginType] = useState("students");
    const loginOptions = [
        { id: "students", label: "طالب" },
        { id: "parents", label: "ولي الأمر" },
    ];
    return (
        <div className={cls.login}>
            {loading && <Loader />}
            <Image src="/imgs/logo.png" alt="logo" width={300} height={120} />
            <div className={cls.tabs}>
                {loginOptions.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                            setLoginType(option.id)
                            document.getElementById('loginForm').reset()
                        }}
                        className={`${cls.button} ${loginType === option.id ? cls.active : ""}`}
                        aria-label={`${option.label} Login`}
                    >
                        <span className={`${cls.icon} ${loginType === option.id ? cls.activeIcon : ""}`} />
                        {option.label}
                    </button>
                ))}
            </div>
            <LoginForm type={loginType} handleIsLoading={handleIsLoading} />
            <div className={cls.footer}>
                <Image src="/imgs/footer_logo.png" alt="footer image" width={100} height={100}/>
            </div>
        </div>
    )
}

export default Login
