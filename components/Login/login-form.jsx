import cls from './login.module.scss'
import useHandleLoginSubmit from '../../hook/use-handle-login-submit';
import { useRouter } from 'next/navigation';
import { Icon } from "@iconify/react";

const LoginForm = ({ type, handleIsLoading }) => {
    const router = useRouter()
    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');
        if (!email || !password) return

        await useHandleLoginSubmit(type, router, { email, password }, handleIsLoading)
    }

    return (
        <form id="loginForm" className={cls.area} onSubmit={handleLogin}>
            <h3> {type === "students" ? "تسجيل دخول الطلاب" : "تسجيل دخول أولياء الأمور"} </h3>
            <div className={`${cls.field} `}>
                <input type="text" placeholder="البريد الإلكتروني" name='email' />
                <Icon icon="solar:user-outline" width="20" height="20"  />
            </div>
            <div className={`${cls.field} `}>
                <input type="password" placeholder="كلمة المرور" name='password' />
                <Icon icon="fluent:key-20-regular" width="20" height="20"  />
            </div>
            <button type='submit'>
                adsasdدخول <Icon icon="material-symbols-light:login-outline" width="40" height="40" />
            </button>
        </form>
    )
}

export default LoginForm
