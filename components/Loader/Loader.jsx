import cls from "./loader.module.scss";
import { FadeLoader } from "react-spinners";
const Loader = () => {
  return (
    <div className={cls.lds_spinner}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <img src="/imgs/loading.png" alt="loadingImage" />
        <FadeLoader color="#00a0d7" />
      </div>

    </div>
  );
};

export default Loader;
