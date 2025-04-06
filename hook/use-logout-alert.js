import Swal from "sweetalert2";
import useHandleLogoutSubmit from "./use-logout-submit";

const useLogoutAlert = (handleClose) => {
    const logout = useHandleLogoutSubmit();

    const checkLogout = () => {
        handleClose("");
        Swal.fire({
            title: "تسجيل الخروج!",
            text: "هل تريد تسجيل الخروج!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "تسجيل الخروج",
            cancelButtonText: "إلغاء",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await logout();
            }
        });
    };

    return checkLogout;
};

export default useLogoutAlert;
