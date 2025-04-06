import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import cls from "./navbar.module.scss";
import Cookies from "universal-cookie";
import useLogoutAlert from "../../hook/use-logout-alert";
import { Icon } from "@iconify/react";

const NavbarMenu = ({ anchorEl, open, handleClose }) => {
    const cookie = new Cookies();
    const user = cookie.get('ibook-user');
    const checkLogout = useLogoutAlert(handleClose);

    return (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose("")}
            MenuListProps={{
                "aria-labelledby": "basic-button",
            }}
        >
            <MenuItem>
                <div className={cls.userInfo}>
                    <img src="/imgs/default.jpg" alt="user_avatar" />
                    <div className={cls.details}>
                        <h5>{user?.name}</h5>
                        <p>{user?.level?.title} - {user?.semester?.title}</p>
                    </div>
                </div>
            </MenuItem>
            {user && user.type !== "student" && (
                <MenuItem onClick={() => handleClose("/parent")}>
                    <Icon icon="oui:line-chart" width="20px" height="20px" color="#00a0d7" /> لوحة التحكم
                </MenuItem>
            )}
            <MenuItem onClick={() => handleClose("/home")}>
                <Icon icon="mdi:user" width="20px" height="20px" color="#00a0d7" /> الصفحة الرئيسية
            </MenuItem>
            {user && user.type !== "parent" && (
                <MenuItem onClick={() => handleClose("/reports")}>
                    <Icon icon="tabler:books" width="24px" height="24px" color="#00a0d7" /> تقارير الكتب
                </MenuItem>
            )}
            {user && user.type !== "parent" && (
                <MenuItem onClick={() => handleClose("/quizzes-reports")}>
                    <Icon icon="fa-solid:feather" width="20px" height="20px" color="#00a0d7" /> تقارير الإختبارات
                </MenuItem>
            )}
            <MenuItem onClick={checkLogout}>
                <Icon icon="ic:baseline-logout" width="20px" height="20px" color="#00a0d7" /> تسجيل
                خروج
            </MenuItem>
        </Menu>
    )
}

export default NavbarMenu
