import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = ({ children }) => {
    return (
        <div>
            {children}
            < ToastContainer
                position={"top-right"}
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Flip}
                style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                }
                }
            />
        </div>
    )
}

export default MainLayout
