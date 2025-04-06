import Grid from '@mui/material/Grid2';
import cls from "./parent.module.scss";
import Link from "next/link";

const ParentInfo = ({ canAddData }) => {
    return (
        <Grid item="true" size={{ xs: 12, md: 4 }}>
            <div className={cls.options}>
                <p>
                    عدد الإضافات: <span>{canAddData.data.feature_usage}</span>
                </p>
                <p>
                    الإضافات المتبقية: <span>{canAddData.data.feature_remaining}</span>
                </p>
                <div className={cls.btns}>
                    {canAddData.data.feature_remaining >= 1 && (
                        <Link href="/add-student">
                            <button className={cls.add}>إضافة طالب</button>
                        </Link>
                    )}
                    <button>تغيير الخطة</button>
                </div>
            </div>
        </Grid>
    )
}

export default ParentInfo
