import cls from "./home.module.scss";
import Navbar from "../Navbar/Navbar";
import ServicesList from "./ServicesList";
import LevelsList from "./LevelsList";

const Home = ({ services, levels }) => {
    return (
        <div className={cls.home}>
            <Navbar />
            <h3>الخدمات المتكاملة</h3>
            <ServicesList services={services?.slice(0, 2) || []} />
            <h3>الصفوف الدراسية</h3>
            <LevelsList levels={levels || []} />
        </div>
    )
}

export default Home