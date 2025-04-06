import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import cls from "./studentDetails.module.scss";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams } from "next/navigation";

const StudentTabs = ({ currentStep, step, changeTab }) => {
    const tabs = [
        {
            title: "تفاصيل الطالب",
            icon: <Icon icon="duo-icons:user" width="25px" height="25px" />,
        },
        {
            title: "تقارير الكتب",
            icon: <Icon icon="icomoon-free:books" width="25px" height="25px" />,
        },
        {
            title: "تقارير الإختبارات",
            icon: <Icon icon="fa-solid:feather" width="25px" height="25px" />,
        },
    ];
    const {id} = useParams()
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item="true" size={{ xs: 12, md: 3 }}>
                    <div className={cls.tabs}>
                        {tabs.map((tab, idx) => (
                            <Link
                                key={idx}
                                href={`/student/${id}`}
                                onClick={() => changeTab(idx)}
                                className={currentStep === idx ? cls.active : ""}
                            >
                                {tab.icon} {tab.title}
                            </Link>
                        ))}
                    </div>
                </Grid>
                <Grid item="true" size={{ xs: 12, md: 9 }}>
                    <div className={cls.tabView}>{step}</div>
                </Grid>
            </Grid>
        </Container>
    )
}

export default StudentTabs
